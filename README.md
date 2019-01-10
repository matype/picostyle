# Picostyle

[![445 gzip][gzip-badge]][bundlesize]
[![Build Status][travis-badge]][travis]

[gzip-badge]: https://img.shields.io/badge/minified%20&%20gzipped-445%20B-brightgreen.svg
[bundlesize]: https://github.com/siddharthkp/bundlesize
[travis-badge]: https://travis-ci.org/morishitter/picostyle.svg
[travis]: https://travis-ci.org/morishitter/picostyle

Picostyle is a 0.4 KB CSS-in-JS library for use with frameworks that expose an `h` function.

[Try it Online](https://codepen.io/morishitter/pen/aEpGYN?editors=0010)

- **🚀 The smallest CSS-in-JS library**: Only 0.4 KB (minified & gzipped).
- **👏 Zero dependencies**: And under 70 LOC.
- **💅 Styled components**: Gives you a styled component like [styled-components](https://www.styled-components.com/) that y'all love.

Currently tested with:

- [Preact](https://github.com/developit/preact)
- [Hyperapp](https://github.com/hyperapp/hyperapp)
- [Ultradom](https://github.com/jorgebucaran/ultradom)

## Installation

Install with npm or Yarn.

<pre>
npm i <a href="https://www.npmjs.com/package/picostyle">picostyle</a>
</pre>

Then with a module bundler like [Rollup](https://github.com/rollup/rollup) or [Webpack](https://github.com/webpack/webpack), use as you would anything else.

```js
import picostyle from "picostyle"
```

Otherwise, download the [latest release](https://github.com/picostyle/picostyle/releases/latest) or load directly from [unpkg](https://unpkg.com/picostyle) or [jsDelivr](https://cdn.jsdelivr.net/npm/picostyle@latest/dist/picostyle.js).
```html
<script src="https://unpkg.com/picostyle"></script>
```

Then find it in `window.picostyle`.

## Usage

Picostyle will work with any framework that exposes an `h` function. When you pass Picostyle an function `h` it returns a higher order function (HOF) that you can use exactly like the `h` you pass it.

```js
import { h } from "some-framework"
import picostyle from "picostyle"

const style = picostyle(h)
```

The HOF accepts a tag name (or an _unstyled_ component) and returns a function that accepts JSON styles.

```js
// Styled component from tag name
const Wrapper = style("div")({
  minHeight: "100vh",
  background: "#000",
})

// Styling an un-styled component
const Component = text => h("h1", {}, text)
const Text = style(Component)({
  color: "#fff",
})
```
If you want to change the style based on the props, you can do it by passing a function, instead of JSON styles.

```js
// Here we set the color of the button, based on the color prop
const Button = style("button")(props => ({
  color: props.color
}))
```

You can also use `@keyframes` animation importing `keyframes` function.

```js
import picostyle, { keyframes } from 'picostyle'

const zoom = keyframes({
  from: {
    transform: 'scale(0.5)'
  },
  to: {
    transform: 'scale(2)'
  },
})

const Container = ps('div')({
  animation: `${zoom} 300ms`,
})
```

You can now use the styled components to build your app.

```js
const App = h("main", {}, [
  Wrapper({}, Text("Scoping CSS is hard")),
  Wrapper({}, Text("Not with styled components!")),
  Wrapper({color: 'red'}, Button("I'm red!")),
])
```


Picostyle transforms any provided JSON styles into plain CSS styles and injects them into a style tag in the head of the document; all under unique style identifiers (USI). Each styled component is given a USI as a class name.

Because the output is a stylesheet and not inline styles. You can use all valid CSS in your JSON styles. For example:

- Media Queries (`@media (orientation: portrait)`)
- Pseudo-element and Pseudo-classes (`::before`, `:hover`, `:last-child`).
- Nested child styles (`> h1`, `> *+*`)

### Preact example

[Get the Code](https://github.com/morishitter/picostyle/tree/master/examples/preact)

```js
import picostyle from "picostyle"
import { h, render } from 'preact';

const ps = picostyle(h)

const keyColor = "#f07";

const Text = ps("a")({
  fontSize: "64px",
  cursor: "pointer",
  color: "#fff",
  padding: "0.4em",
  transition: "all .2s ease-in-out",
  textDecoration: "none",
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

render((
  <Wrapper>
    <Text href="https://github.com/morishitter/picostyle">Picostyle meets Preact</Text>
  </Wrapper>
), document.body);
```


### Hyperapp Example

[Get the Code](https://github.com/morishitter/picostyle/tree/master/examples/hyperapp)

```js
import { h, app } from "hyperapp"
import picostyle from "picostyle"

const style = picostyle(h)
const theme = "hotpink" // Try change the theme to white

const Wrapper = style("div")({
  display: "flex",
  width: "100%",
  height: "100vh",
  backgroundColor: theme,
  "> h1": { cursor: "pointer" }
})

const Text = style("h1")({
  fontSize: "calc(10px + 5vmin)",
  color: theme === "white" ? "black" : "white",
  margin: "auto",
  transition: "transform .2s ease-out",
  ":hover": {
    transform: "scale(1.2)",
  },
  "@media (orientation: landscape)": {
    fontWeight: "bold",
  },
})

app({
  state: {
    text: "Picostyle"
  },
  view: (state) =>
    <Wrapper>
      <Text>Hello { state.text }</Text>
    </Wrapper>
})
```


### Ultradom Example

[Get the Code](https://github.com/morishitter/picostyle/tree/master/examples/ultradom)

```js
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
```
