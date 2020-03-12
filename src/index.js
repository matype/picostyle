var _id = 0
var sheet = document.head.appendChild(document.createElement("style")).sheet

function hyphenate(str) {
  return str.replace(/[A-Z]/g, "-$&").toLowerCase()
}

function createStyle(rules, cssType, p) {
  var id = p + _id++
  var name = cssType + id
  rules.forEach(function(rule) {
    if (/^@/.test(rule)) {
      var start = rule.indexOf("{") + 1
      rule = rule.slice(0, start) + name + rule.slice(start)
    } else {
      rule = name + rule
    }
    sheet.insertRule(rule, sheet.cssRules.length)
  })
  return id
}

function wrap(stringToWrap, wrapper) {
  return wrapper + "{" + stringToWrap + "}"
}

function serialize(obj, isInsideObj) {
  var arr = [""]
  isInsideObj = isInsideObj || 0
  for (var prop in obj) {
    var value = obj[prop]
    prop = hyphenate(prop)
    // Same as typeof value === 'object', but smaller
    if (!value.sub && !Array.isArray(value)) {
      // replace & in "&:hover", "p>&"
      prop = prop.replace(/&/g, "")
      arr.push(wrap(serialize(value, 1 && !/^@/.test(prop)).join(""), prop))
    } else {
      value = Array.isArray(value) ? value : [value]
      value.forEach(function(value) {
        return (arr[0] += prop + ":" + value + ";")
      })
    }
  }
  if (!isInsideObj) {
    arr[0] = wrap(arr[0], "")
  }
  return arr
}

export default function(h, options) {
  var cache = {}
  options = options || {}
  cache.prefix = options.prefix || "p"
  return options.returnObject ? { style: style, css: css } : style
  function style(nodeName) {
    return function(decls) {
      return function(props) {
        props = props || {}
        var nodeDecls = typeof decls == "function" ? decls(props) : decls
        props.class = [css(nodeDecls, cache.prefix), props.class]
          .filter(Boolean)
          .join(" ")
        return h(nodeName, props, props.children || [])
      }
    }
  }
  function css(decls, prefix) {
    var rules = serialize(decls)
    var p = prefix || cache.prefix
    var key = p + rules.join("")
    return cache[key] || (cache[key] = createStyle(rules, ".", p))
  }
}

export function keyframes(obj) {
  var rule = wrap(serialize(obj, 1).join(""), "")
  return createStyle([rule], "@keyframes ", "p")
}
