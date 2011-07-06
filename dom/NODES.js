var Class = require('std/Class')
  , each = require('std/each')
  , slice = require('std/slice')
  , isArguments = require('std/isArguments')
  , style = require('./style')
  , Component = require('./Component')
  , isArray = require('std/isArray')

var NODES = module.exports

NODES.NODE = Class(Component, function() {

  this.init = function(args) {
    // No need to call Component.init - Nodes are not expected to publish
    this._args = args
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
      each(arg, function(val, key) {
        if (key == 'style') { style(node, val) }
        else { node[key] = val }
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

NODES.DIV = Class(NODES.NODE, function() { this._tag = 'div' })
NODES.SPAN = Class(NODES.NODE, function() { this._tag = 'span' })
NODES.IMG = Class(NODES.NODE, function() { this._tag = 'img' })
NODES.A = Class(NODES.NODE, function() { this._tag = 'a' })
NODES.P = Class(NODES.NODE, function() { this._tag = 'p' })
NODES.H1 = Class(NODES.NODE, function() { this._tag = 'h1' })
NODES.H2 = Class(NODES.NODE, function() { this._tag = 'h2' })
NODES.H3 = Class(NODES.NODE, function() { this._tag = 'h3' })
NODES.H4 = Class(NODES.NODE, function() { this._tag = 'h4' })

NODES.exposeGlobals = function() {
  TEXT = function() { return new NODES.TEXT(arguments) }
  FRAGMENT = function() { return new NODES.FRAGMENT(arguments) }
  DIV = function() { return new NODES.DIV(arguments) }
  SPAN = function() { return new NODES.SPAN(arguments) }
  IMG = function() { return new NODES.IMG(arguments) }
  A = function() { return new NODES.A(arguments) }
  P = function() { return new NODES.P(arguments) }
  H1 = function() { return new NODES.H1(arguments) }
  H2 = function() { return new NODES.H2(arguments) }
  H3 = function() { return new NODES.H3(arguments) }
  H4 = function() { return new NODES.H4(arguments) }
}
