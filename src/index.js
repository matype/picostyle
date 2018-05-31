var _id = 0
var sheet = document.head.appendChild(document.createElement("style")).sheet

function hyphenate(str) {
  return str.replace(/[A-Z]/g, "-$&").toLowerCase()
}

function insert(rule) {
  sheet.insertRule(rule, 0)
}
function createId(obj) {
  return "p" + _id++
}
function createStyle(obj, id) {
  id = id || createId()
  parse(obj, "." + id)
  return id
}
function wrap(stringToWrap, wrapper) {
  return wrapper && wrapper + '{' + stringToWrap + '}' || stringToWrap
}
function parse(obj, classname, isInsideObj, shouldWrapInner) {
  var string = ""
  isInsideObj = isInsideObj || 0
  for (var prop in obj) {
    var value = obj[prop]
    prop = hyphenate(prop)
    if (typeof value == "object") {
      if (/^(:|>)/.test(prop)) {
        prop = classname + prop
      }
      var newString =
        wrap(parse(value, classname, 1, /^@/.test(prop)),prop)
      if (!isInsideObj) {
        insert(newString)
      } else {
        string = string + newString
      }
    } else {
      string += wrap(prop +
      ":" +
      value +
      ";", shouldWrapInner ? classname : null)
    }
  }
  if (!isInsideObj) {
    insert(wrap(string, classname))
  }
  return string
}
export default function(h) {
  return function(nodeName) {
    var cache = {}
    return function(decls) {
      var isDeclsFunction = typeof decls === "function"

      return function(attributes, children) {
        attributes = attributes || {}
        children = attributes.children || children
        var key = JSON.stringify(attributes)

        var node = h(nodeName, attributes, children)
        node.attributes.class = [
          attributes.class,
          cache[key] ||
            (cache[key] = createStyle(
              isDeclsFunction ? decls(attributes) : decls
            ))
        ]
          .filter(Boolean)
          .join(" ")
        return node
      }
    }
  }
}
export function keyframes(obj, id) {
  id = id || createId()
  insert(wrap(parse(obj, "", 1), '@keyframes ' + id ))
  return id
}
