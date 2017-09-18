# Picostyle

[![361 gzip][gzip-badge]][bundlesize]

[gzip-badge]: https://img.shields.io/badge/minified%20&%20gzipped-361%20B-brightgreen.svg
[bundlesize]: https://github.com/siddharthkp/bundlesize

<div align="center">
  <a href="https://github.com/morishitter/picostyle">
    <img width="360px" src="http://morishitter.github.io/picostyle.svg">
  </a>
</div>
<br>

Picostyle is a 0.3 KB CSS-in-JS library for use with [Hyperapp](https://github.com/hyperapp/hyperapp) & [Picodom](https://github.com/picodom/picodom).

[Try it Online](https://codepen.io/morishitter/pen/qXaPYQ?editors=0010)

## Features

- **🚀 The smallest CSS-in-JS library**: Only 0.3 KB (minified & gzipped).
- **👏 Zero dependencies**: And under 60 LOC.
- **💅 Styled components**: Gives you a styled component like [styled-components](https://www.styled-components.com/) that y'all love.
- **❤️ For Hyperapp & Picodom**: The 1 KB frontend library family.

## Installation

<pre>
$ npm install <a href="https://www.npmjs.com/package/picostyle">picostyle</a>
</pre>

## Usage

Picostyle works well with Media Queries (`@media`), Pseudo-element and Pseudo-classes (`:hover`).

### With Hyperapp

[Get the Code](https://github.com/morishitter/picostyle/tree/master/examples/hyperapp)

```js
import { h, app } from "hyperapp"
import picostyle from "picostyle"

const ps = picostyle(h)

app({
  state: {
    text: "Picostyle"
  },
  view: (state) => {
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
        <Text>Hello, {state.text}</Text>
      </Wrapper>
    )
  }
})
```

### With Picodom

[Get the Code](https://github.com/morishitter/picostyle/tree/master/examples/picodom)

```js
import picodom from "picodom"
import picostyle from "picostyle"

const ps = picostyle(picodom.h)

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
```
