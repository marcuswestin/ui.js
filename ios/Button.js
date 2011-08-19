var Component = require('../dom/Component'),
	Rect = require('std/math/Rect')

module.exports = Class(Component, function() {

	this._class = 'Button'
	
	this.init = function(label, click) {
		Component.prototype.init.apply(this)
		this._label = label
		this._clickHandler = click
	}

	this.renderContent = function() {
		this.append(
			this._button = BUTTON({
				click:this._clickHandler,
				touchstart:bind(this, this._onTouchStart),
				touchend:bind(this, this._onTouchEnd),
				touchcancel:bind(this, this._onTouchCancel),
				touchmove:bind(this, this._onTouchMove)
			}, this._label)
			// DIV({ style:{position:'absolute', top:0, left:'3.5%', width:'94%', 'borderRadius':8 } })
			// http://admindaily.com/glossy-buttons-without-images-using-only-css3.html
		)
	}
	
	this._onTouchStart = function(e) {
		// TODO Don't listen to move, end or cancel until this happend
		if (e.touches.length > 1) { return }
		e.cancel()
		var offset = this.getOffset()
		this._touchRect = new Rect(offset.left, offset.top, offset.width, offset.height).pad(10)
		this._button.addClass('active')
	}
	
	this._onTouchMove = function(e) {
		if (!this._touchRect) { return }
		var touch = e.touches[0]
		if (this._touchRect.containsPoint({ x:touch.pageX, y:touch.pageY })) { this._button.addClass('active') }
		else { this._button.removeClass('active') }
	}
	
	this._onTouchEnd = function(e) { this._endTouch(e) }
	this._onTouchCancel = function(e) { this._endTouch(e) }
	this._endTouch = function(e) {
		if (!this._touchRect) { return }
		e.cancel()
		delete this._touchRect
		var shouldClick = this._button.hasClass('active')
		this._button.removeClass('active')
		if (shouldClick) { this._clickHandler() }
		// TODO deregister touch events
	}
})