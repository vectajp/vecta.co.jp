"""Make shared cell borders explicit for consistent PowerPoint/Impress rendering."""
from copy import deepcopy
from pathlib import Path
import sys
import xml.etree.ElementTree as ET
from zipfile import ZipFile, ZIP_DEFLATED

path=Path(sys.argv[1])
tmp=path.with_suffix('.normalized.pptx')
A='{http://schemas.openxmlformats.org/drawingml/2006/main}'
P='{http://schemas.openxmlformats.org/presentationml/2006/main}'
R='{http://schemas.openxmlformats.org/officeDocument/2006/relationships}'
ET.register_namespace('a',A[1:-1]);ET.register_namespace('p',P[1:-1]);ET.register_namespace('r',R[1:-1])
with ZipFile(path) as source, ZipFile(tmp,'w',ZIP_DEFLATED) as target:
    for entry in source.infolist():
        body=source.read(entry.filename)
        if entry.filename.startswith('ppt/slides/slide') and entry.filename.endswith('.xml'):
            root=ET.fromstring(body)
            changed=False
            for cell in root.findall('.//'+A+'tcPr'):
                edges={name:cell.find(A+name) for name in ('lnL','lnR','lnT','lnB')}
                example=next((x for x in edges.values() if x is not None),None)
                if example is None:
                    continue
                for item in list(edges.values()):
                    if item is not None:
                        cell.remove(item)
                for index,name in enumerate(('lnL','lnR','lnT','lnB')):
                    item=deepcopy(edges[name] if edges[name] is not None else example)
                    item.tag=A+name
                    cell.insert(index,item)
                changed=True
            if changed:
                body=ET.tostring(root,encoding='utf-8',xml_declaration=True)
        target.writestr(entry,body)
tmp.replace(path)
