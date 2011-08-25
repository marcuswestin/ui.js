var Class = require('std/Class'),
	Component = require('ui/dom/Component'),
	round = require('std/math/round'),
	slice = require('std/slice')

module.exports = Class(Component, function() {

	this._class = 'KeyPad'
	
	this.init = function() {
		this._digits = []
		this._keys = [
			1, 2, 3,
			4, 5, 6,
			7, 8, 9,
			'.',0,'<']
	}
	
	this.renderContent = function() {
		this.append(
			DIV('output', this._valueEl = DIV('value')),
			this._keysEl = DIV('keys')
		)
		
		each(this._keys, this, function(key, i) {
			var className = 'key'
			if (i % 3 == 0) { className += ' left' }
			if (i < 3) { className += ' top' }
			if ((i - 1) % 3 == 0) { className += ' center' }
			this._keysEl.append(new Button(className, key, bind(this, this._onKeyPress, key)))
		})
		
		this._renderValue()
	}
	
	this._onKeyPress = function(key) {
		if (key == 0 && !this._digits.length) { /* do nothing */ }
		else if (typeof key == 'number') { this._digits.push(key) }
		else if (key == '<') { this._digits.pop() }
		this._renderValue()
	}
	
	this._renderValue = function() {
		var digitsCopy = slice(this._digits)
		if (digitsCopy.length == 0) { digitsCopy = [0,0,0] }
		if (digitsCopy.length == 1) { digitsCopy = [0,0,digitsCopy[0]] }
		if (digitsCopy.length == 2) { digitsCopy = [0,digitsCopy[0],digitsCopy[1]] }
		digitsCopy.splice(digitsCopy.length - 2, 0, '.')

		if (digitsCopy.length < 4) { digitsCopy.unshift(0) }
		if (digitsCopy.length < 4) { digitsCopy.unshift(0) }
		this._valueEl.getElement().innerHTML = '$' + digitsCopy.join('')
	}
	
})