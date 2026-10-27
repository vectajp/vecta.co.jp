from pathlib import Path
import hashlib
import io
import json
import re
import subprocess
import pymupdf as fitz
from pypdf import PdfReader, PdfWriter
from pypdf.generic import DictionaryObject, FloatObject, NameObject

ROOT=Path(__file__).resolve().parent
SOURCE=ROOT/'source-native.pdf'
TARGET=ROOT/'output/pdf/SwarrowChat_パンフレット_軽量版.pdf'
doc=fitz.open(SOURCE)
original_text=[p.get_text() for p in doc]
original_links=[p.get_links() for p in doc]
original_traces=[p.get_texttrace() for p in doc]
assert all(span['opacity']==1 and span['type']==0 for traces in original_traces for span in traces)
scale=(210/25.4*96)/1055
background_rect=fitz.Rect(0,0,1055*scale*.75,1491*scale*.75)
for n,page in enumerate(doc,1):
    # Remove PDF painting operations for images/shadows/gradients; preserve text.
    page.add_redact_annot(page.rect,fill=False,cross_out=False)
    page.apply_redactions(images=1,graphics=2,text=1)
    assert page.get_text()==original_text[n-1]
    page.insert_image(background_rect,filename=str(ROOT/f'tmp/pdfs/background-{n}.jpg'),overlay=False)
    for existing in page.get_links():
        page.delete_link(existing)
    for link in original_links[n-1]:
        assert link['kind']==fitz.LINK_URI
        page.insert_link({'kind':fitz.LINK_URI,'from':link['from'],'uri':link['uri']})
    page.clean_contents(sanitize=True)
doc.set_metadata({'title':'SwarrowChat パンフレット','author':'株式会社Vecta','subject':'自治体ホームページのAI窓口 SwarrowChat','creator':'SwarrowChat brochure - opaque artwork with native vector text'})
intermediate=io.BytesIO(doc.tobytes(garbage=4,deflate=True,clean=True))
doc.close()
# Redaction preserves unused shadow states/patterns. Keep only the opaque
# artwork and the original solid-color text resources in a fresh PDF.
reader=PdfReader(intermediate)
writer=PdfWriter()
background_checks=json.loads((ROOT/'background-render-checks.json').read_text())
for number,page in enumerate(reader.pages):
    contents=page.get_contents()
    contents.operations=[(args,op) for args,op in contents.operations
        if op not in (b'gs',b'cs',b'CS',b'scn',b'SCN')
        and not (op==b'Do' and args[0]!='/fzImg0')]
    # The widget screenshot covers part of the mock website's native text.
    # Paint that part of the same opaque background again above the text.
    # Clip only the image: Apple PDF rendering mishandles complex text clips.
    occlusions=background_checks[number]['textOcclusionRects']
    if occlusions:
        operations=contents.operations
        image_index=next(i for i,(args,op) in enumerate(operations) if op==b'Do')
        assert operations[image_index+1][1]==b'Q'
        rect=lambda values:([FloatObject(v) for v in values],b're')
        height=float(page.mediabox.height)
        overlays=[]
        for bounds in occlusions:
            unit=scale*.75
            overlays.extend([([],b'q'),rect([bounds['x']*unit,height-bounds['bottom']*unit,bounds['width']*unit,bounds['height']*unit]),([],b'W'),([],b'n')])
            overlays.extend(operations[:image_index+2])
            overlays.append(([],b'Q'))
        contents.operations=operations+overlays
    page[NameObject('/Contents')]=contents
    resources=page['/Resources']
    page[NameObject('/Resources')]=DictionaryObject({
        NameObject('/Font'):resources['/Font'],
        NameObject('/XObject'):DictionaryObject({NameObject('/fzImg0'):resources['/XObject'].raw_get('/fzImg0')})})
    page.pop('/Group',None)
    writer.add_page(page)
writer.add_metadata(reader.metadata)
for page in writer.pages:
    page.compress_content_streams()
with TARGET.open('wb') as output:
    writer.write(output)
check=fitz.open(TARGET)
assert len(check)==2
assert [p.get_text() for p in check]==original_text
for page,traces in zip(check,original_traces):
    result=page.get_texttrace()
    assert len(result)==len(traces)
    for actual,expected in zip(result,traces):
        # Type3 names include renumbered PDF object IDs after rebuilding.
        assert re.sub(r' \(\d+ \d+ R\)$','',actual['font'])==re.sub(r' \(\d+ \d+ R\)$','',expected['font'])
        for key in ('size','color','opacity','type','chars'):
            assert actual[key]==expected[key],(page.number,key)
links=[x['uri'] for p in check for x in p.get_links()]
assert links.count('https://swarrow.com/chat')==2
assert links.count('https://swarrow.com/chat#contact')==2
assert links.count('mailto:sales@vecta.co.jp')==1
objects=[check.xref_object(i) for i in range(1,check.xref_length())]
assert not any('/SMask' in obj or '/Transparency' in obj or '/OCProperties' in obj for obj in objects)
for page in check:
    assert len(page.get_images())==1
    assert page.get_images()[0][1]==0
text=subprocess.check_output(['pdftotext','-layout',str(TARGET),'-'],text=True)
flat=re.sub(r'\s+','',text)
for phrase in ['月額5万円','初期費用10万円','※1人口10万人以下の自治体向けの料金です','※2音声会話オプションは別途料金です','佐藤泰格氏']:
    assert phrase in flat,phrase
manifest={'pdf':str(TARGET),'bytes':TARGET.stat().st_size,'previous_bytes':SOURCE.stat().st_size,'reduction_percent':round((1-TARGET.stat().st_size/SOURCE.stat().st_size)*100,1),'sha256':hashlib.sha256(TARGET.read_bytes()).hexdigest(),'source_sha256':hashlib.sha256(SOURCE.read_bytes()).hexdigest(),'pages':2,'method':'Opaque ~383 dpi background artwork, original native vector text, original five URI links','text_preserved':True,'transparency_masks':0,'transparency_groups':0,'optional_content_layers':0,'links':links}
(ROOT/'pdf-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
(ROOT/'extracted-text.txt').write_text(text)
print(json.dumps(manifest,ensure_ascii=False))
