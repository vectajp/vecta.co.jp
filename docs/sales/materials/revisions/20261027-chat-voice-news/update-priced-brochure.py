"""Use the current compatible brochure and retain the approved pricing sheet."""
from pathlib import Path
import hashlib
import json
from pypdf import PdfReader, PdfWriter

ROOT=Path(__file__).resolve().parent
BROCHURE=Path('/Users/naoya/.codex/artifacts/swarrowchat-brochure-concept-20261022/selected/20261027-chat-voice-news/output/pdf/SwarrowChat_パンフレット_軽量版.pdf')
PREVIOUS=ROOT.parent/'20261027-nhk-illustration/output/pdf/SwarrowChat_パンフレット_料金別紙付き_20261027_r3.pdf'
TARGET=ROOT/'output/pdf/SwarrowChat_パンフレット_料金別紙付き_20261027_r4.pdf'
TARGET.parent.mkdir(parents=True,exist_ok=True)
(ROOT/'.build').mkdir(exist_ok=True)
base=PdfReader(BROCHURE)
previous=PdfReader(PREVIOUS)
assert len(base.pages)==2 and len(previous.pages)==3
writer=PdfWriter()
writer.append(base)
writer.add_page(previous.pages[2])
writer.add_metadata({'/Title':'SwarrowChat パンフレット 料金別紙付き','/Author':'株式会社Vecta'})
with TARGET.open('wb') as f: writer.write(f)
result=PdfReader(TARGET)
assert len(result.pages)==3
assert result.pages[2].extract_text()==previous.pages[2].extract_text()
for i in range(2): assert result.pages[i].extract_text()==base.pages[i].extract_text()
assert 'てげビビ' in result.pages[0].extract_text()
manifest={'pdf':str(TARGET),'pages':3,'bytes':TARGET.stat().st_size,'sha256':hashlib.sha256(TARGET.read_bytes()).hexdigest(),'brochure':str(BROCHURE),'pricing_sheet_preserved':True}
(ROOT/'.build/priced-brochure.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(manifest,ensure_ascii=False))
