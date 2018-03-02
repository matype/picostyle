/** @jsx */

import {h, patch} from "ultradom"
import picostyle from "picostyle"

const ps = picostyle(h)

function view(state) {
  const keyColor = "#f07";

  const Text = ps("h1")({
    fontSize: "64px",
    cursor: "pointer",
    color: "#fff",
    padding: "0.4em",
    transition: "all .2s ease-in-out",
    ":hover": {
      transform: "scale(1.3)",
    },
    "@media (max-width: 450px)": {
      fontSize: "32px",
    },
  })

  const Wrapper = ps("div")({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100vw",
    height: "100vh",
    backgroundColor: keyColor,
  })

  return (
    <Wrapper>
      <Text>{state.trim() === "" ? ":)" : state}</Text>
    </Wrapper>
  )
}

document.body.appendChild(patch(view("Hello, Picostyle")))
