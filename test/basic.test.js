import { h } from "hyperapp"
import picostyle from "../src"

// import create and attach a dom to global namespace
import { JSDOM } from "jsdom"

const dom = new JSDOM()
global.document = dom.window.document

// picostyle helper function
const style = (nodeName, decls) => picostyle(h)(nodeName)(decls)
const styleClass = (nodeName, className, decls) => picostyle(h)(nodeName, className)(decls)

function cssRulesAsText(stylesheet) {
  return stylesheet.cssRules
    .map(rule => rule.cssText)
    .join()
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
    "pa p9",
    ".p9 {color: white;},.pa {background-color: red;}"
  )
})

test("decl as function", () => {
  const Test = style("div", attributes => {
    return { color: attributes.color }
  })
  expectClassNameAndCssText(
    Test({ color: "tomato" }),
    "pb_1",
    ".pb {},.pb_1 {color: tomato;}"
  )
})

test("extend component", () => {
  const Div = (attributes, children) => h("div", attributes, children)
  const Test = style(Div, {
    backgroundColor: "red"
  })
  expectClassNameAndCssText(Test({}), "pc", ".pc {background-color: red;}")
})

test("custom class name", () => {
  const Test = styleClass("div", "test", { color: "white" })
  expectClassNameAndCssText(Test(), "test", ".test {color: white;}")
})

test("custom class name with variations", () => {
  const Test = styleClass("div", "test", props => ({ color: props.color || "red" }))
  expectClassNameAndCssText(Test(), "test", ".test {color: red;}")

  expectClassNameAndCssText(
    Test({ color: 'white' }),
    "test_1",
    ".test {color: red;},.test_1 {color: white;}"
  )

  expectClassNameAndCssText(
    Test({ color: 'black' }),
    "test_2",
    ".test {color: red;},.test_1 {color: white;},.test_2 {color: black;}"
  )
})

test("grouping rules by component", () => {
  const First = styleClass("div", "first", props =>({
    color: props.color || "white"
  }))
  const Second = styleClass("div", "second", {
    opacity: 0
  })

  // default style for Second is already cached
  expectClassNameAndCssText(
    First(),
    "first",
    ".first {color: white;},.second {opacity: 0;}"
  )

  // new .first_1 rule is added just after .first
  expectClassNameAndCssText(
    First({ color: "blue" }),
    "first_1",
    ".first {color: white;},.first_1 {color: blue;},.second {opacity: 0;}"
  )
})

test("potentially conflicting grouping", () => {
  const P1 = styleClass("div", "p1", props =>({
    color: props.color || "white",
    '>a' : { color: 'blue' }
  }))
  const P12 = styleClass("div", "p12", {
    opacity: 0.5
  })

  expectClassNameAndCssText(
    P1({ color: "green" }),
    "p1_1",
    ".p1 {color: white;},.p1>a {color: blue;},.p1_1 {color: green;},.p1_1>a {color: blue;},.p12 {opacity: 0.5;}"
  )

  expectClassNameAndCssText(
    P1({ color: "red" }),
    "p1_2",
    ".p1 {color: white;},.p1>a {color: blue;},.p1_1 {color: green;},.p1_1>a {color: blue;},.p1_2 {color: red;},.p1_2>a {color: blue;},.p12 {opacity: 0.5;}"
  )
})

