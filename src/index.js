var _id = 0
var sheet = document.head.appendChild(document.createElement("style")).sheet
var serialize = JSON.stringify.bind(null)

function hyphenate(str) {
  return str.replace(/[A-Z]/g, "-$&").toLowerCase()
}

function last(group) {
  var groupRx = new RegExp("^\\." + group + ".*")
  var rules = Array.from(sheet.cssRules).reverse()
  var index = rules.findIndex(rule => groupRx.test(rule.selectorText))

  return (index >= 0) ? rules.length - index : rules.length
}

function insert(rule, group) {
  sheet.insertRule(rule, last(group))
}

function createRule(className, decls, media) {
  var newDecls = []
  for (var property in decls) {
    typeof decls[property] !== "object" &&
      newDecls.push(hyphenate(property) + ":" + decls[property] + ";")
  }
  var rule = "." + className + "{" + newDecls.join("") + "}"
  return media ? media + "{" + rule + "}" : rule
}

function concat(str1, str2) {
  return str1 + (/^\w/.test(str2) ? " " : "") + str2
}

function parse(decls, className, group, child, media) {
  child = child || ""

  insert(createRule(concat(className, child), decls, media), group)

  for (var property in decls) {
    var value = decls[property]
    if (typeof value === "object") {
      var nextMedia = /^@/.test(property) ? property : null
      var nextChild = nextMedia ? child : concat(child, property)
      parse(value, className, group, nextChild, nextMedia, group)
    }
  }

  return className
}

function createClass(className, version) {
  return (className && version) ? className + '_' + version : className
}

function cached(cache, decls, attributes, group) {
  var nodeDecls = typeof decls === 'function' ? decls(attributes) : decls
  var key = serialize(nodeDecls)
  var className = createClass(group, Object.keys(cache).length)
  cache[key] || (cache[key] = parse(nodeDecls, className, group))
  return cache[key]
}

export default function(h) {
  return function(nodeName, className) {
    var cache = {}
    className = className || "p" + (_id++).toString(36)
    return function(decls) {
      cached(cache, decls, {}, className)
      return function(attributes, children) {
        attributes = attributes || {}
        children = attributes.children || children
        var cachedClass = cached(cache, decls, attributes, className)
        attributes.class = [attributes.class, cachedClass]
          .filter(Boolean)
          .join(" ")
        return h(nodeName, attributes, children)
      }
    }
  }
}
