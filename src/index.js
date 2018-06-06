var _id = 0
var sheet = document.head.appendChild(document.createElement("style")).sheet

function hyphenate(str) {
  return str.replace(/[A-Z]/g, "-$&").toLowerCase()
}

function insert(rule) {
  sheet.insertRule(rule, sheet.cssRules.length)
}
function createStyle(obj) {
  var id = "p" + _id++
  parse(obj, "." + id)
    .reverse()
    .forEach(insert)
  return id
}
function wrap(stringToWrap, wrapper) {
  return wrapper + "{" + stringToWrap + "}"
}

function parse(obj, classname, isInsideObj) {
  var arr = [""]
  isInsideObj = isInsideObj || 0
  for (var prop in obj) {
    var value = obj[prop]
    prop = hyphenate(prop)
    // Same as typeof value === 'object', but smaller
    if (!value.sub) {
      if (/^(:| >)/.test(prop)) {
        prop = classname + prop
      }
      var newString = wrap(
        parse(value, classname, 1 && !/^@/.test(prop)).join(""),
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
      return function(attributes, children) {
        attributes = attributes || {}
        children = attributes.children || children
        var nodeDecls = typeof decls == 'function' ? decls(attributes) : decls
        var key = JSON.stringify(nodeDecls)
        cache[key] || (cache[key] = createStyle(nodeDecls))
        attributes.class = [attributes.class, cache[key]]
          .filter(Boolean)
          .join(" ")
        return h(nodeName, attributes, children)
      }
    }
  }
}
export function keyframes(obj) {
  var id = "p" + _id++
  insert(wrap(parse(obj, id, 1), "@keyframes " + id))
  return id
}
