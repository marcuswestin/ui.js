var Class = require('std/Class'),
	Component = require('ui/dom/Component'),
	round = require('std/math/round'),
	slice = require('std/slice')

module.exports = Class(Component, function() {

	this._class = 'KeyPad'
	
	this.init = function() {
		this._input = []
	}
	
	this.clear = function() {
		this._input = []
		if (this._el) { this._renderValue() }
		return this
	}
	
	this.getInput = function() {
		return slice(this._input)
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
			if ((i + 1) % 3 == 0) { className += ' right' }
			if (this._keys[i] === '') { className += ' empty' }
			this._keysEl.append(new Button(className, key, bind(this, this._onKeyPress, key)))
		})
		
		this._renderValue()
	}
	
	this._onKeyPress = function(key) {
		if (this._shouldAcceptInput(key)) { this._input.push(key) }
		this._renderValue()
	}

	this._renderValue = function() {
		this._valueEl.getElement().innerHTML = this._getFormattedValue()
		this._valueEl.toggleClass('empty', !this._input.length)
	}
	
	/* Overwrite these for custom behavior
	 *************************************/
	this._shouldAcceptInput = function(digit) { return true }
	this._getFormattedValue = function() { return this._input.join('') }

	this._keys = [
		1, 2, 3,
		4, 5, 6,
		7, 8, 9,
		'',0,'']
})