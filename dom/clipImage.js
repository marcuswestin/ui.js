var style = require('./style'),
  extend = require('std/extend'),
  getDocumentOf = require('./getDocumentOf'),
  waitForImage = require('./waitForImage')

module.exports = function clipImage(src, clipWidth, clipHeight, win) {
  win = win || window
  var doc = win.document,
    clipper = doc.createElement('div'),
    img = doc.createElement('img')
  img.style.visibility = 'hidden'
  img.src = src
  style(clipper, { width:clipWidth, height:clipHeight, overflow:'hidden' })
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
      height:newSize.height, marginTop:Math.floor(clipHeight/2 - newSize.height/2),
      visibility:'visible' })
  })
  return clipper
}
