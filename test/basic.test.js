import { h } from "picodom"
import picostyle from "../src"

// import create and attach a dom to global namespace
import { JSDOM } from "jsdom"

const dom = new JSDOM()
global.document = dom.window.document

// picostyle helper function
const style = (type, decls) => picostyle(h)(type)(decls)

function cssRulesAsText(stylesheet) {
  return stylesheet.cssRules.map(rule => rule.cssText).join()
}

function removeRules(stylesheet) {
  while (stylesheet.cssRules.length) {
    stylesheet.deleteRule(0)
  }
}

function expectClassNameAndProps(obj, className, cssAsText) {
  expect(obj.props).toHaveProperty("class", className)
  expect(cssRulesAsText(document.styleSheets[0])).toEqual(cssAsText)
}

afterEach(() => {
  removeRules(document.styleSheets[0])
  document.body.innerHTML = ""
})

test("empty style object", () => {
  const Test = style("div")
  expectClassNameAndProps(Test(), "p0", ".p0 {}")
})

test("basic style object", () => {
  const Test = style("div", {
    color: "red"
  })
  expectClassNameAndProps(Test(), "p1", ".p1 {color: red;}")
})

test("1 level descendant combinator", () => {
  const Test = style("table", {
    color: "red",
    tr: {
      color: "white"
    }
  })
  expectClassNameAndProps(
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
  expectClassNameAndProps(
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
  expectClassNameAndProps(Test(), "p4", ".p4 {},.p4.active {color: white;}")
})

test("universal selector (asterisk)", () => {
  const Test = style("div", {
    "*": {
      color: "white"
    }
  })
  expectClassNameAndProps(Test(), "p5", ".p5 {},.p5* {color: white;}")
})

test("pseudo-element", () => {
  const Test = style("div", {
    "::before": {
      content: "attr(data-value) '%'"
    }
  })
  expectClassNameAndProps(
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
  expectClassNameAndProps(Test(), "p7", ".p7 {},.p7:hover {color: white;}")
})

test("pseudo-class", () => {
  const Test = style("div", {
    "@media screen and (min-width: 480px)": {
      width: "auto"
    }
  })
  expectClassNameAndProps(
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

  // BUG: See https://github.com/picostyle/picostyle/pull/26
  expectClassNameAndProps(
    Test(),
    "p9 p9 pa",
    ".pa {background-color: red;},.p9 {color: white;}"
  )
})

test("decl as function", () => {
  const Test = style("div", props => {
    return { color: props.color }
  })
  expectClassNameAndProps(
    Test({ color: "tomato" }),
    "pb",
    ".pb {color: tomato;}"
  )
})

test("extend component", () => {
  const Div = (props, children) => h("div", props, children)
  const Test = style(Div, {
    backgroundColor: "red"
  })
  expectClassNameAndProps(Test({}), "pc", ".pc {background-color: red;}")
})
