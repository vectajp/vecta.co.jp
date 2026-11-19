import AppKit

// Use the same PDF renderer as macOS Preview, in addition to Poppler.
guard CommandLine.arguments.count == 3,
      let document = CGPDFDocument(URL(fileURLWithPath: CommandLine.arguments[1]) as CFURL)
else { fatalError("Usage: swift render-coregraphics.swift input.pdf output-prefix") }

for number in 1...document.numberOfPages {
    let page = document.page(at: number)!
    let bounds = page.getBoxRect(.mediaBox)
    let scale = 1250 / max(bounds.width, bounds.height)
    let width = Int(ceil(bounds.width * scale))
    let height = Int(ceil(bounds.height * scale))
    let context = CGContext(data: nil, width: width, height: height,
                            bitsPerComponent: 8, bytesPerRow: width * 4,
                            space: CGColorSpaceCreateDeviceRGB(),
                            bitmapInfo: CGImageAlphaInfo.noneSkipLast.rawValue)!
    context.setFillColor(CGColor.white)
    context.fill(CGRect(x: 0, y: 0, width: width, height: height))
    context.scaleBy(x: scale, y: scale)
    context.drawPDFPage(page)
    let bitmap = NSBitmapImageRep(cgImage: context.makeImage()!)
    let data = bitmap.representation(using: .png, properties: [:])!
    try data.write(to: URL(fileURLWithPath: "\(CommandLine.arguments[2])-\(number).png"))
}
