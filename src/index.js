var _id = 0
var sheet = document.head.appendChild(document.createElement("style")).sheet
var serialize = JSON.stringify.bind(null)

function hyphenate(str) {
  return str.replace(/[A-Z]/g, "-$&").toLowerCase()
}

function insert(rule) {
  sheet.insertRule(rule, sheet.cssRules.length)
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

function parse(decls, className, child, media) {
  child = child || ""
  className = className || "p" + (_id++).toString(36)

  insert(createRule(concat(className, child), decls, media))

  for (var property in decls) {
    var value = decls[property]
    if (typeof value === "object") {
      var nextMedia = /^@/.test(property) ? property : null
      var nextChild = nextMedia ? child : concat(child, property)
      parse(value, className, nextChild, nextMedia)
    }
  }

  return className
}

function createClass(className, version) {
  return (className && version) ? className + '-' + version : className
}

function cached(cache, decls, attributes, className) {
  var nodeDecls = typeof decls === 'function' ? decls(attributes) : decls
  var key = serialize(nodeDecls)
  var versions = Object.keys(cache).length
  cache[key] || (cache[key] = parse(nodeDecls, createClass(className, versions)))
  return cache[key]
}

export default function(h) {
  return function(nodeName, className) {
    var cache = {}
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
