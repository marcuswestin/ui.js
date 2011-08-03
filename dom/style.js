var client = require('std/client'),
  each = require('std/each')

module.exports = function(element, styleProps) {
  var style = element.style
  each(styleProps, function(val, key) {
    if (typeof val == 'number') { val = val + 'px' }
    else if (key == 'float') { key = 'cssFloat' }
    else if (module.exports.prefixed[key]) { key = module.exports.prefix + key }
    if (val != null) { style[key] = val } // catches null and undefined
  })
  return element
}

module.exports.prefix = 
  client.isFirefox ? '-moz-' :
  client.isWebKit ? '-webkit-' :
  null

module.exports.prefixed = {
  // 'boxShadow':true,
  'borderRadius':true,
  'transition':true
}

module.exports.opacity = function(el, fraction) {
  if (client.isIE && client.version <= 8) {
    module.exports.opacity = function(el, fraction) {
      el.style.filter = 'alpha(opacity=' + Math.round(fraction * 100) + ')'
    }
  } else {
    module.exports.opacity = function(el, fraction) {
      el.style.opacity = fraction
      el.style.MozOpacity = fraction
      el.style.KhtmlOpacity = fraction
    }
  }
  module.exports.opacity(el, fraction)
}

module.exports.gradient = function(el, fromColor, toColor) {
  var key = 'background',
    val
  if (client.isIE && client.version <= 8) {
    key = 'filter'
    val = "progid:DXImageTransform.Microsoft.gradient(startColorstr='"+fromColor+"', endColorstr='"+toColor+"')"
  } else if (client.isFirefox) {
    val = '-moz-linear-gradient(top, '+fromColor+', '+toColor+')'
  } else if (client.isWebkit) {
    val = '-webkit-gradient(linear, left top, left bottom, from('+fromColor+'), to('+toColor+'))'
  } else {
    val = fromColor
  }
  el.style[key] = val
}
