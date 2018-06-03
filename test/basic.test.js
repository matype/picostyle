import { h } from "hyperapp"
import picostyle from "../src"

// import create and attach a dom to global namespace
import { JSDOM } from "jsdom"

const dom = new JSDOM()
global.document = dom.window.document

// picostyle helper function
const style = (nodeName, decls) => picostyle(h)(nodeName)(decls)

function cssRulesAsText(stylesheet) {
  return stylesheet.cssRules.map(rule => rule.cssText).join()
}

function removeRules(stylesheet) {
  while (stylesheet.cssRules.length) {
    stylesheet.deleteRule(0)
  }
}

function expectClassNameAndCssText(obj, className, cssAsText) {
  expect(obj.attributes).toHaveProperty("class", className)
  expect(cssRulesAsText(document.styleSheets[0])).toEqual(cssAsText)
}

afterEach(() => {
  removeRules(document.styleSheets[0])
  document.body.innerHTML = ""
})

test("empty style object", () => {
  const Test = style("div")
  expectClassNameAndCssText(Test(), "p0", ".p0 {}")
})

test("basic style object", () => {
  const Test = style("div", {
    color: "red"
  })
  expectClassNameAndCssText(Test(), "p1", ".p1 {color: red;}")
})

test("1 level descendant combinator", () => {
  const Test = style("table", {
    color: "red",
    tr: {
      color: "white"
    }
  })
  expectClassNameAndCssText(
    Test(),
    "p2",
    ".p2 {color: red;},.p2 tr {color: white;}"
  )
})

test("2 level descendant combinator", () => {
  const Test = style("table", {
    color: "red",
    tr: {
      color: "white",
      td: {
        color: "blue"
      }
    }
  })
  expectClassNameAndCssText(
    Test(),
    "p3",
    ".p3 {color: red;},.p3 tr {color: white;},.p3 tr td {color: blue;}"
  )
})

test("class selector", () => {
  const Test = style("div", {
    ".active": {
      color: "white"
    }
  })
  expectClassNameAndCssText(Test(), "p4", ".p4 {},.p4.active {color: white;}")
})

test("universal selector (asterisk)", () => {
  const Test = style("div", {
    "*": {
      color: "white"
    }
  })
  expectClassNameAndCssText(Test(), "p5", ".p5 {},.p5* {color: white;}")
})

test("pseudo-element", () => {
  const Test = style("div", {
    "::before": {
      content: "attr(data-value) '%'"
    }
  })
  expectClassNameAndCssText(
    Test(),
    "p6",
    ".p6 {},.p6::before {content: attr(data-value) '%';}"
  )
})

test("pseudo-class", () => {
  const Test = style("div", {
    ":hover": {
      color: "white"
    }
  })
  expectClassNameAndCssText(Test(), "p7", ".p7 {},.p7:hover {color: white;}")
})

test("pseudo-class", () => {
  const Test = style("div", {
    "@media screen and (min-width: 480px)": {
      width: "auto"
    }
  })
  expectClassNameAndCssText(
    Test(),
    "p8",
    ".p8 {},@media screen and (min-width: 480px) {.p8 {width: auto;}}"
  )
})

test("class name bundling", () => {
  const Div = style("div", {
    color: "white"
  })
  const Test = style(Div, {
    backgroundColor: "red"
  })

  expectClassNameAndCssText(
    Test(),
    "p9 pa",
    ".pa {color: white;},.p9 {background-color: red;}"
  )
})

test("decl as function", () => {
  const Test = style("div", attributes => {
    return { color: attributes.color }
  })
  expectClassNameAndCssText(
    Test({ color: "tomato" }),
    "pb",
    ".pb {color: tomato;}"
  )
})

test("extend component", () => {
  const Div = (attributes, children) => h("div", attributes, children)
  const Test = style(Div, {
    backgroundColor: "red"
  })
  expectClassNameAndCssText(Test({}), "pc", ".pc {background-color: red;}")
})
