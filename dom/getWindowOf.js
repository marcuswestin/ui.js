module.exports = function getWindowOf(element) {
  return (element.ownerDocument || element).defaultView
}