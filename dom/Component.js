var Class = require('std/Class')
	, Publisher = require('std/Publisher')
	, create = require('./create')
	, style = require('./style')
	, getOffset = require('./getOffset')
	, on = require('./on')
	, off = require('./off')

module.exports = Class(Publisher, function() {

	this._tag = 'div'
	this._class = null

	this.init = function() {
		Publisher.prototype.init.apply(this)
	}

	this.render = function(component) {
		this._render(component)
		return this
	}

	this._render = function(component) {
		var doc = this._getDocumentOf(component)
		if (this._doc == doc) { return this._el }
		if (this._el) { this.unrender() }

		this._doc = doc
		this._el = doc.createElement(this._tag)
		if (this._class) { this._el.className = this._class }
		this.renderContent()
		return this._el
	}

	this.getElement = function() { return this._el }
	this.getDocument = function() { return this._doc }

	this.create = function(tag, properties) { return create(tag, properties, this._doc) }

	this.append = function(element) { return this._el.appendChild(element) }
	this.appendTo = function(node) {
		this._getElementOf(node).appendChild(this._render(node))
		return this
	}
  
  this.on = function(eventName, handler) { return on(this._el, eventName, handler) }
  this.off = function(eventName, handler) { return off(this._el, eventName, handler) }
  
	this.style = function(styles) { style(this._el, styles); return this }
	this.opacity = function(opacity) { style.opacity(this._el, opacity); return this }

	this.getOffset = function() { return getOffset(this._el) }

	this._getDocumentOf = function(component) {
		if (component.getDocument) { return component.getDocument() }
		else if (component.ownerDocument) { return component.ownerDocument }
		else { return component }
	}

	this._getElementOf = function(component) {
		if (component.getElement) { return component.getElement() }
		else { return component }
	}
})