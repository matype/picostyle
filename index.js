var h = require("picodom").h
var x = 0
var i = _ => _
var ca = {}
var pr = s => s.replace(/[A-Z]|^ms/g, "-$&").toLowerCase()
var ru = (cn, p, v, m) => {
  var r = `.${cn}{${pr(p)}: ${typeof v === "number" ? `${v}px` : v}}`
  return m ? `${m}{${r}}` : r
}
var sc = (d, c = "", m) =>
  Object.keys(d).map(p => {
    var v = d[p]
    if (typeof v === "object") {
      var nm = /^@/.test(p) ? p : null
      var nc = nm ? c : c + p
      return sc(v, nc, nm)
    }
    var k = p + v + m
    if (ca[k]) return ca[k]
    var cn = "p" + (x++).toString(36)
    i(ru(cn + c, p, v, m))
    ca[k] = cn
    return cn
  }).join(" ")

if (window) {
  var sh = document.head.appendChild(document.createElement("style")).sheet
  i = r => sh.insertRule(r, sh.cssRules.length)
}

module.exports = t => (...ds) => (_, cs) => h(t, { class: ds.map(d => sc(d)) }, cs)
