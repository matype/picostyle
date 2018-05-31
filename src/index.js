var _id = 0
var sheet = document.head.appendChild(document.createElement("style")).sheet
var serialize = JSON.stringify.bind(null)

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
        prop + "{" + parse(value, classname, 1, /^@/.test(prop)) + "}"
      if (!isInsideObj) {
        insert(newString)
      } else {
        string = string + newString
      }
    } else {
      string +=
        (shouldWrapInner ? classname + "{" : "") +
        prop +
        ":" +
        value +
        ";" +
        (shouldWrapInner ? "}" : "")
    }
  }
  if (!isInsideObj) {
    string = classname + "{" + string + "}"
    insert(string)
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
        var key = serialize(attributes)
        cache[key] ||
          (cache[key] =
            (isDeclsFunction && createStyle(decls(attributes))) ||
            createStyle(decls))
        var node = h(nodeName, attributes, children)
        node.attributes.class = [attributes.class, cache[key]]
          .filter(Boolean)
          .join(" ")
        return node
      }
    }
  }
}
export function keyframes(obj, id) {
  id = id || createId()
  insert(parse({ ["@keyframes " + id]: obj }, "", 1))
  return id
}
