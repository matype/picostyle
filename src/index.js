var _id = 0
var sheet = document.head.appendChild(document.createElement("style")).sheet

function hyphenate(str) {
  return str.replace(/[A-Z]/g, "-$&").toLowerCase()
}

function insert(rule) {
  sheet.insertRule(rule, 0)
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

function parse(decls, child, media, className) {
  child = child || ""
  className = className || "p" + (_id++).toString(36)

  for (var property in decls) {
    var value = decls[property]
    if (typeof value === "object") {
      var nextMedia = /^@/.test(property) ? property : null
      var nextChild = nextMedia ? child : concat(child, property)
      parse(value, nextChild, nextMedia, className)
    }
  }

  insert(createRule(concat(className, child), decls, media))
  return className
}

export default function(h) {
  return function(type) {
    return function(decls) {
      var parsed
      var isDeclsFunction = typeof decls === "function"
      !isDeclsFunction && (parsed = parse(decls))
      return function(props, children) {
        props = props || {}
        isDeclsFunction && (parsed = parse(decls(props)))
        var node = h(type, props, children)
        node.props.class = ((node.props.class || "") +
          " " +
          (props.class || "") +
          " " +
          parsed
        ).trim()
        return node
      }
    }
  }
}
