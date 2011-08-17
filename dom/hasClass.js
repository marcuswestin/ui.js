module.exports = function(el, className) {
	return (' ' + el.className + ' ').match(' ' + className + ' ')
}