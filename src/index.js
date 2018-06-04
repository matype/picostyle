var _id = 0
var sheet = document.head.appendChild(document.createElement("style")).sheet
var serialize = JSON.stringify.bind(null)

function hyphenate(str) {
  return str.replace(/[A-Z]/g, "-$&").toLowerCase()
}

function lastOf(group) {
  var groupRx = new RegExp("^\\." + group + "([^0-9a-zA-Z\\-].*)?$")
  var rules = Array.from(sheet.cssRules).reverse()
  var index = rules.findIndex(rule => groupRx.test(rule.selectorText))
  return index >= 0 ? rules.length - index : rules.length
}

function insert(rule, group) {
  sheet.insertRule(rule, lastOf(group))
}

function isDef(val) {
  return val !== undefined && val !== null && val !== ""
}

function createRule(className, decls, media) {
  var newDecls = []
  for (var property in decls) {
    isDef(decls[property]) &&
      typeof decls[property] !== "object" &&
      newDecls.push(hyphenate(property) + ":" + decls[property] + ";")
  }
  var rule = "." + className + "{" + newDecls.join("") + "}"
  return media ? media + "{" + rule + "}" : rule
}

function concat(str1, str2) {
  return str1 + (/^\w/.test(str2) ? " " : "") + str2
}

function parse(group, className, decls, child, media) {
  child = child || ""
  insert(createRule(concat(className, child), decls, media), group)
  for (var property in decls) {
    var value = decls[property]
    if (typeof value === "object") {
      var nextMedia = /^@/.test(property) ? property : null
      var nextChild = nextMedia ? child : concat(child, property)
      parse(group, className, value, nextChild, nextMedia)
    }
  }
}

function createClass(className, version) {
  return className && version ? className + "_" + version : className
}

function cached(cache, group, decls, attributes) {
  var declsVariation = typeof decls === "function" ? decls(attributes) : decls
  var key = serialize(declsVariation)
  if (!cache[key]) {
    cache[key] = createClass(group, Object.keys(cache).length)
    parse(group, cache[key], declsVariation)
  }
  return cache[key]
}

export default function(h) {
  return function(nodeName, className) {
    var cache = {}
    var group = className || "p" + (_id++).toString(36)
    return function(decls) {
      cached(cache, group, decls, {})
      return function(attributes, children) {
        attributes = attributes || {}
        children = attributes.children || children
        var cachedClass = cached(cache, group, decls, attributes)
        attributes.class = [attributes.class, cachedClass]
          .filter(Boolean)
          .join(" ")
        return h(nodeName, attributes, children)
      }
    }
  }
}
