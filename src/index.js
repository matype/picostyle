var h = require("picodom").h

var _id = 0
var insert = _ => _
var cache = {}
var hyphenate = s => s.replace(/[A-Z]|^ms/g, "-$&").toLowerCase()
var setpx = value => typeof value === "number" ? `${value}px` : value

var createRule = (className, property, value, media) => {
  var rule = `.${className}{${hyphenate(property)}: ${setpx(value)}}`
  return media ? `${media}{${rule}}` : rule
}

var parse = (decl, child = "", media) =>
  Object.keys(decl).map(property => {
    var value = decl[property]
    if (typeof value === "object") {
      var nextMedia = /^@/.test(property) ? property : null
      var nextChild = nextChild ? child : child + property
      return parse(value, nextChild, nextMedia)
    }

    var key = property + value + media
    if (cache[key]) {
      return cache[key]
    }

    var className = "p" + (_id++).toString(36)
    insert(createRule(className + child, property, value, media))
    cache[key] = className

    return className
  }).join(" ")

if (window) {
  var sheet = document.head.appendChild(document.createElement("style")).sheet
  insert = rule => sheet.insertRule(rule, sheet.cssRules.length)
}

module.exports = tag => (...decls) => (_, children) => h(tag, { class: decls.map(decl => parse(decl)) }, children)
