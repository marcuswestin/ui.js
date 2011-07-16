var style = require('./style'),
  extend = require('std/extend'),
  getDocumentOf = require('./getDocumentOf'),
  waitForImage = require('./waitForImage'),
  getElementOf = require('./getElementOf')

module.exports = function clipImage(img, clipWidth, clipHeight) {
  img = getElementOf(img)
  var doc = getDocumentOf(img)
  var clipper = doc.createElement('div')
  style(clipper, { width:0, height:0, overflow:'hidden' })
  doc.body.appendChild(clipper)
  clipper.appendChild(img)
  waitForImage(img, function() {
    var width = img.offsetWidth,
      height = img.offsetHeight,
      newSize

    if (width <= clipWidth && height <= clipHeight) {
      newSize = { width:width, height:height }
    } else if (width < height) {
      newSize = { width:clipWidth, height:Math.round(height * (clipWidth / width)) }
    } else {
      newSize = { width:Math.round(width * (clipHeight / height)), height:clipHeight }
    }

    style(img, {
      width:newSize.width, marginLeft:Math.floor(clipWidth/2 - newSize.width/2),
      height:newSize.height, marginTop:Math.floor(clipHeight/2 - newSize.height/2) })
    
    style(clipper, { width:clipWidth, height:clipHeight })
  })
  return clipper
}
