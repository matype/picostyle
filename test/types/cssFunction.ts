import { h } from "ultradom"
import picostyle, { PicoObject } from "../.."

const { css } = picostyle(h, { returnObject: true }) as PicoObject

const buttonStyle = css({
  color: "red"
})

const App = h(
  "main",
  null,
  h("button", { class: buttonStyle }, "Scoping CSS is hard")
)
