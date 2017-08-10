let _id = 0
let cache = {}

const hyphenate = str => str.replace(/[A-Z]|^ms/g, "-$&").toLowerCase()
const setpx = value => typeof value === "number" ? `${value}px` : value
const sheet = document.head.appendChild(document.createElement("style")).sheet
const insert = rule => sheet.insertRule(rule, sheet.cssRules.length)

const createRule = (className, property, value, media) => {
  const rule = `.${className}{${hyphenate(property)}: ${setpx(value)}}`
  return media ? `${media}{${rule}}` : rule
}

const parse = (decl, child = "", media) => {
  let properties = []

  for (let property in decl) {
    properties.push(property)
  }

  return properties.map(property => {
    const value = decl[property]
    if (typeof value === "object") {
      const nextMedia = /^@/.test(property) ? property : null
      const nextChild = nextMedia ? child : child + property
      return parse(value, nextChild, nextMedia)
    }

    const key = property + value + media
    if (cache[key]) {
      return cache[key]
    }

    const className = "p" + (_id++).toString(36)
    insert(createRule(className + child, property, value, media))
    cache[key] = className

    return className
  }).join(" ")
}

export default h => tag => (...decls) => (_, children) => h(tag, { class: parse(decls[0]) }, children)
