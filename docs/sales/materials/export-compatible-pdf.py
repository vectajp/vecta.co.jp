"""Reuse the common brochure's opaque artwork/native text PDF export."""

import argparse
import io
import json
from pathlib import Path

import pymupdf as fitz
from pypdf import PdfReader, PdfWriter
from pypdf.generic import DictionaryObject, NameObject


def export(source, backgrounds, target):
    doc = fitz.open(source)
    text = [page.get_text() for page in doc]
    traces = [page.get_texttrace() for page in doc]
    links = [page.get_links() for page in doc]
    assert all(span['opacity'] == 1 and span['type'] == 0 for page in traces for span in page), 'Only opaque visible text is supported'
    for number, page in enumerate(doc, 1):
        assert abs(page.rect.width - 595.276) < 1 and abs(page.rect.height - 841.89) < 1, 'Only the A4 brochure layout is supported'
        artwork = backgrounds / f'background-{number}.jpg'
        bitmap = fitz.Pixmap(artwork)
        assert not bitmap.alpha and bitmap.width * 1491 == bitmap.height * 1055, 'Artwork must match the opaque 1055x1491 layout'
        page.add_redact_annot(page.rect, fill=False, cross_out=False)
        page.apply_redactions(images=1, graphics=2, text=1)
        assert page.get_text() == text[number - 1], 'Removing artwork changed text'
        # Match the browser's A4 scale; the PDF media box is rounded by Chrome.
        unit = (210 / 25.4 * 72) / 1055
        page.insert_image(fitz.Rect(0, 0, 1055 * unit, 1491 * unit), filename=str(artwork), overlay=False)
        for link in page.get_links():
            page.delete_link(link)
        for link in links[number - 1]:
            assert link['kind'] == fitz.LINK_URI
            page.insert_link({'kind': fitz.LINK_URI, 'from': link['from'], 'uri': link['uri']})
        page.clean_contents(sanitize=True)

    reader = PdfReader(io.BytesIO(doc.tobytes(garbage=4, deflate=True, clean=True)))
    writer = PdfWriter()
    for page in reader.pages:
        contents = page.get_contents()
        contents.operations = [(args, op) for args, op in contents.operations
            if op not in (b'gs', b'cs', b'CS', b'scn', b'SCN')
            and not (op == b'Do' and args[0] != '/fzImg0')]
        page[NameObject('/Contents')] = contents
        resources = page['/Resources']
        page[NameObject('/Resources')] = DictionaryObject({
            NameObject('/Font'): resources['/Font'],
            NameObject('/XObject'): DictionaryObject({NameObject('/fzImg0'): resources['/XObject'].raw_get('/fzImg0')}),
        })
        page.pop('/Group', None)
        writer.add_page(page)
    if reader.metadata:
        writer.add_metadata(reader.metadata)
    for page in writer.pages:
        page.compress_content_streams()
    target.parent.mkdir(parents=True, exist_ok=True)
    temporary = target.with_suffix('.tmp.pdf')
    try:
        writer.write(temporary)
        with fitz.open(temporary) as result:
            assert len(result) == len(doc)
            assert [page.get_text() for page in result] == text
            for page, expected_traces, expected_links in zip(result, traces, links):
                actual_traces = page.get_texttrace()
                assert len(actual_traces) == len(expected_traces)
                for actual, expected in zip(actual_traces, expected_traces):
                    for key in ('size', 'color', 'opacity', 'type', 'chars'):
                        assert actual[key] == expected[key], (page.number, key)
                assert [(link['uri'], tuple(link['from'])) for link in page.get_links()] == [(link['uri'], tuple(link['from'])) for link in expected_links]
                images = page.get_images()
                assert len(images) == 1 and images[0][1] == 0, 'Artwork must be one opaque image'
            objects = [result.xref_object(i) for i in range(1, result.xref_length())]
            assert not any(token in obj for obj in objects for token in ('/SMask', '/Transparency', '/OCProperties'))
        temporary.replace(target)
    finally:
        temporary.unlink(missing_ok=True)
        doc.close()
    print(json.dumps({'file': str(target), 'pages': len(text), 'textAndLinkGeometryPreserved': True, 'transparencyMasks': 0, 'transparencyGroups': 0}))


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('source', type=Path)
    parser.add_argument('backgrounds', type=Path)
    parser.add_argument('target', type=Path)
    args = parser.parse_args()
    export(args.source, args.backgrounds, args.target)
