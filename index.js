var h = require("picodom").h

var uid = 0
var insert = n => n
var cache = {}

if (typeof window !== "undefined") {
  var sheet = document.head.appendChild(document.createElement("style")).sheet
  insert = rule => sheet.insertRule(rule, sheet.cssRules.length)
}

var setpx = v => typeof v === "number" ? `${v}px` : v
var propertize = s => s.replace(/[A-Z]|^ms/g, "-$&").toLowerCase()

var createRule = (cn, p, v, m) => {
  var rule = `.${cn}{ ${propertize(p)}: ${setpx(v)} }`
  return m ? `${m}{${rule}}` : rule
}

function parse (obj, child = "", m) {
  return Object.keys(obj).map(p => {
    var v = obj[p]
    if (v === null) return ""

    if (typeof v === "object") {
      var nestedMedia = /^@/.test(p) ? p : null
      var nestedClass = nestedMedia ? child : child + p
      return parse(v, nestedClass, nestedMedia)
    }

    var key = p + v + m
    if (cache[key]) return cache[key]

    var cn = "p" + (uid++).toString(36)
    insert(createRule(cn + child, p, v, m))
    cache[key] = cn

    return cn
  }).join(" ")
}

module.exports = tag => (...args) => (_, children) => h(tag, { class: args.map(arg => parse(arg)).join(" ") }, children)
