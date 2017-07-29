var h = require("picodom").h

var x = 0
var insert = n => n
var cache = {}

if (typeof window !== "undefined") {
  var sheet = document.head.appendChild(document.createElement("style")).sheet
  insert = r => sheet.insertRule(r, sheet.cssRules.length)
}

var setpx = v => typeof v === "number" ? `${v}px` : v
var propertize = s => s.replace(/[A-Z]|^ms/g, "-$&").toLowerCase()

var rulize = (cn, p, v, m) => {
  var r = `.${cn}{ ${propertize(p)}: ${setpx(v)} }`
  return m ? `${m}{${r}}` : r
}

function scan (o, c = "", m) {
  return Object.keys(o).map(p => {
    var v = o[p]
    if (v === null) return ""

    if (typeof v === "object") {
      var nm = /^@/.test(p) ? p : null
      var nc = nm ? c : c + p
      return scan(v, nc, nm)
    }

    var key = p + v + m
    if (cache[key]) return cache[key]

    var cn = "p" + (x++).toString(36)
    insert(rulize(cn + c, p, v, m))
    cache[key] = cn

    return cn
  }).join(" ")
}

module.exports = tag => (...args) => (_, cs) => h(tag, { class: args.map(arg => scan(arg)).join(" ") }, cs)
