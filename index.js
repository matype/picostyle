var h = require("picodom").h

var uid = 0
var insert = n => n
var cache = {}

if (typeof window !== 'undefined') {
  var sheet = document.head.appendChild(document.createElement('style')).sheet
  insert = rule => sheet.insertRule(rule, sheet.cssRules.length)
}

function setpx (value) {
  return typeof value === 'number' ? `${value}px` : value
}

function hyphenate (str) {
  return ('' + str).replace(/[A-Z]|^ms/g, '-$&').toLowerCase()
}

function createRule (className, property, value, media) {
  var rule = `.${className}{ ${hyphenate(property)}: ${setpx(value)} }`
  return media ? `${media}{${rule}}` : rule
}

function parse (obj, child = '', media) {
  if (!obj) {
    return ''
  }

  return Object.keys(obj).map(property => {
    var value = obj[property]
    if (value === null) {
      return ''
    }

    if (typeof value === 'object') {
      var m2 = /^@/.test(property) ? property : null
      var c2 = m2 ? child : child + property
      return parse(value, c2, m2)
    }

    var cacheKey = property + value + media
    if (cache[cacheKey]) {
      return cache[cacheKey]
    }

    var className = 'p' + (uid++).toString(36)
    var rule = createRule(className + child, property, value, media)
    insert(rule)
    cache[cacheKey] = className

    return className
  }).join(' ')
}

function picostyle (tag) {
  return function (...args) {
    return function (prop, children) {
      return h(tag, { class: args.map(s => parse(s)).join(' ') }, children)
    }
  }
}

module.exports = picostyle
