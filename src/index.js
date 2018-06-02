var _id = 0
var sheet = document.head.appendChild(document.createElement("style")).sheet

function hyphenate(str) {
  return str.replace(/[A-Z]/g, "-$&").toLowerCase()
}

function insert(rule) {
  sheet.insertRule(rule, 0)
}
function createId() {
  return "p" + _id++
}
function createStyle(obj) {
  var id = createId()
  parse(obj, "." + id)
    .reverse()
    .forEach(insert)
  return id
}
function wrap(stringToWrap, wrapper) {
  return (wrapper && wrapper + "{" + stringToWrap + "}") || stringToWrap
}

function parse(obj, classname, isInsideObj) {
  var arr = [""]
  isInsideObj = isInsideObj || 0
  for (var prop in obj) {
    var value = obj[prop]
    prop = hyphenate(prop)
    if (typeof value == "object") {
      if (/^(:| >)/.test(prop)) {
        prop = classname + prop
      }
      var newString = wrap(
        parse(value, classname, isInsideObj && !/^@/.test(prop))
          .toString()
          .replace(",", " "),
        prop
      )
      if (!isInsideObj) {
        arr.push(newString)
      } else {
        arr[0] = arr[0] + newString
      }
    } else {
      arr[0] += prop + ":" + value + ";"
    }
  }
  if (!isInsideObj) {
    arr[0] = wrap(arr[0], classname)
  }
  return arr
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
export function keyframes(obj) {
  var id = createId()
  insert(wrap(parse(obj, id, 1), "@keyframes " + id))
  return id
}
