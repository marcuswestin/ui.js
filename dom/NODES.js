var Class = require('std/Class')
  , each = require('std/each')
  , slice = require('std/slice')
  , isArguments = require('std/isArguments')
  , style = require('./style')
  , Component = require('./Component')
  , isArray = require('std/isArray'),
	arrayToObject = require('std/arrayToObject'),
	curry = require('std/curry')

var NODES = module.exports

NODES.NODE = Class(Component, function() {

  this.init = function(args) {
    // No need to call Component.init - Nodes are not expected to publish
    this._args = args
  }

  this.attributeHandlers = {
    click: curry(this.on, 'click'),
    mousedown: curry(this.on, 'mousedown'),
    mouseup: curry(this.on, 'mouseup'),
    mouseover: curry(this.on, 'mouseover'),
    mouseout: curry(this.on, 'mouseout'),
    keypress: curry(this.on, 'keypress'),
    keydown: curry(this.on, 'keydown'),
    keyup: curry(this.on, 'keyup'),
    blur: curry(this.on, 'blur'),
    style: this.style
  }

  this.renderContent = function() {
    var args = this._args
    if (typeof args[0] == 'string') {
      this._el.className = args[0]
      this._processArgs(args, 1)
    } else {
      this._processArgs(args, 0)
    }
  }

  this._processArgs = function(args, index) {
    while (index < args.length) {
      this._processArg(args[index++])
    }
  }

  this._processArg = function(arg) {
    if (!arg) { return }
    var node = this._el
      , doc = this._doc
    if (typeof arg._render == 'function') {
      node.appendChild(arg._render(doc))
    } else if (typeof arg == 'string') {
      node.appendChild(doc.createTextNode(arg))
    } else if (arg.nodeType && arg.nodeType == 1) { // http://stackoverflow.com/questions/120262/whats-the-best-way-to-detect-if-a-given-javascript-object-is-a-dom-element
      node.appendChild(arg)
    } else if (isArray(arg)) {
      this._processArgs(arg, 0)
    } else {
      each(arg, this, function(val, key) {
        if (this.attributeHandlers[key]) {
          this.attributeHandlers[key].call(this, val)
        } else {
          node[key] = val
        }
      })
    }
  }

  this.append = function() {
    if (this._el) {
      this._processArgs(arguments, 0)
    } else {
      if (isArguments(this._args)) { this._args = slice(this._args) } // We delay the call to slice, since it may not be neccesary
      this._args = this._args.concat(slice(arguments))
    }
    return this
  }
})

NODES.TEXT = Class(NODES.NODE, function() {
  this._render = function(doc) {
    var args = this._args
      , text = args.length > 1 ? slice(args).join(' ') : args[0]
    return doc.createTextNode(text)
  }
})

NODES.FRAGMENT = Class(NODES.NODE, function() {
  this.render = function(doc) {
    this._el = doc.createDocumentFragment()
    this._processArgs(this._args, 0)
    return this._el
  }
})

NODES.attributeHandlers = NODES.NODE.prototype.attributeHandlers

NODES.createGenerator = function(tag) {
  var ClassDefinition = Class(NODES.NODE, function() { this._tag = tag })
  return function() { return new ClassDefinition(arguments) }
}

NODES.exposeGlobals = function() {
  TEXT = function() { return new NODES.TEXT(arguments) }
  FRAGMENT = function() { return new NODES.FRAGMENT(arguments) }
  DIV = NODES.createGenerator('div')
  SPAN = NODES.createGenerator('span')
  IMG = NODES.createGenerator('img')
  A = NODES.createGenerator('a')
  P = NODES.createGenerator('p')
  H1 = NODES.createGenerator('h1')
  H2 = NODES.createGenerator('h2')
  H3 = NODES.createGenerator('h3')
  H4 = NODES.createGenerator('h4')
  IFRAME = NODES.createGenerator('iframe')
  BUTTON = NODES.createGenerator('button')
  INPUT = NODES.createGenerator('input', { type:'text' })
  PASSWORD = NODES.createGenerator('input', { type:'password' })
  TEXTAREA = NODES.createGenerator('textarea')
}
