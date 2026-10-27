from pathlib import Path
from pypdf import PdfReader, PdfWriter
import json
import re
import hashlib
import subprocess

ROOT=Path(__file__).resolve().parent
OUTPUT=ROOT/'output/pdf'
OUTPUT.mkdir(parents=True,exist_ok=True)
TARGET=ROOT/'source-native.pdf'
writer=PdfWriter()
for n in (1,2):
    reader=PdfReader(ROOT/f'tmp/pdfs/native-{n}.pdf')
    assert len(reader.pages)==1, (n,len(reader.pages))
    page=reader.pages[0]
    assert abs(float(page.mediabox.width)-595.275590551)<1 and abs(float(page.mediabox.height)-841.88976378)<1,page.mediabox
    writer.add_page(page)
writer.add_metadata({'/Title':'SwarrowChat パンフレット','/Author':'株式会社Vecta','/Subject':'自治体ホームページのAI窓口 SwarrowChat','/Creator':'SwarrowChat brochure - native text and vector layout'})
with TARGET.open('wb') as f:
    writer.write(f)
reader=PdfReader(TARGET)
assert len(reader.pages)==2
texts=[subprocess.check_output(['pdftotext','-f',str(n),'-l',str(n),'-layout',str(TARGET),'-'],text=True) for n in (1,2)]
flat=[re.sub(r'\s+','',s) for s in texts]
for phrase in ['既存の情報をまとめて活用','回答品質を継続的に改善','テキスト＆音声','多言語','佐藤泰格氏','総合政策部デジタル統括課副課長']:
    assert phrase in flat[0],phrase
for phrase in ['ホームページにコード1行で設置','初期設定は弊社が対応','既存チャットボットからも切り替え','無料評価から導入まで','対象確認','初期設定','無料評価','ご契約・公開','月額5万円','初期費用10万円','※1人口10万人以下の自治体向けの料金です','※2音声会話オプションは別途料金です','sales@vecta.co.jp']:
    assert phrase in flat[1],phrase
for phrase in ['掲載相談用','デザイン案','総務省','アドバイザー']:
    assert not any(phrase in s for s in flat),phrase
links=[]
for page in reader.pages:
    for annotation in page.get('/Annots',[]):
        obj=annotation.get_object()
        if '/A' in obj and '/URI' in obj['/A']:
            rect=[float(v) for v in obj['/Rect']]
            assert min(rect)>=-1 and rect[2]<=596.3 and rect[3]<=842.9,rect
            links.append(str(obj['/A']['/URI']))
assert links.count('https://swarrow.com/chat')==2,links
assert links.count('https://swarrow.com/chat#contact')==2,links
assert links.count('mailto:sales@vecta.co.jp')==1,links
manifest={'pdf':str(TARGET),'pages':2,'page_size':'A4 portrait','bytes':TARGET.stat().st_size,'sha256':hashlib.sha256(TARGET.read_bytes()).hexdigest(),'method':'Native browser PDF text and vector objects; no whole-page image embedding','extracted_text_characters':[len(t) for t in texts],'links':links,'font_family':'Hiragino Sans W4/W6/W8','source_images':'Original photograph and UI image bytes preserved; see asset-manifest.json'}
(ROOT/'native-pdf-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
(ROOT/'extracted-text.txt').write_text('\n\n'.join(texts))
print(json.dumps(manifest,ensure_ascii=False))
