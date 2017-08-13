var _id = 0
var cache = {}
var sheet = document.head.appendChild(document.createElement("style")).sheet

function hyphenate (str) {
  return str.replace(/[A-Z]/g, "-$&").toLowerCase()
}

function insert (rule) {
  sheet.insertRule(rule, sheet.cssRules.length)
}

function createRule (className, property, value, media) {
  var rule = "." + className + "{" + hyphenate(property) + ":" + value + "}"
  return media ? media + "{" + rule + "}" : rule
}

function parse (decls, child, media) {
  child = child || ""

  var properties = []
  for (var property in decls) {
    properties.push(property)
  }

  return properties.map(function (property) {
    var value = decls[property]
    if (typeof value === "object") {
      var nextMedia = /^@/.test(property) ? property : null
      var nextChild = nextMedia ? child : child + property
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
}

export default function (h) {
  return function (tag) {
    return function (decls) {
      return function (_, children) {
        return h(tag, { class: parse(decls) }, children)
      }
    }
  }
}
