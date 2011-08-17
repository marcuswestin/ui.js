var hasClass = require('./hasClass')

module.exports = function(el, className) {
	if (hasClass(el, className)) { return }
	el.className += ' ' + className
}
