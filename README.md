# Picostyle

[![405 gzip][gzip-badge]][bundlesize]
[![Build Status][travis-badge]][travis]

[gzip-badge]: https://img.shields.io/badge/minified%20&%20gzipped-371%20B-brightgreen.svg
[bundlesize]: https://github.com/siddharthkp/bundlesize
[travis-badge]: https://travis-ci.org/picostyle/picostyle.svg
[travis]: https://travis-ci.org/picostyle/picostyle

Picostyle is a 0.4 KB CSS-in-JS library for use with frameworks that expose an `h` function.

[Try it Online](https://codepen.io/lukejacksonn/pen/xXRGpv?editors=0010)

- **🚀 The smallest CSS-in-JS library**: Only 0.4 KB (minified & gzipped).
- **👏 Zero dependencies**: And under 70 LOC.
- **💅 Styled components**: Gives you a styled component like [styled-components](https://www.styled-components.com/) that y'all love.

Currently tested with:

- [Hyperapp](https://github.com/hyperapp/hyperapp)
- [Picodom](https://github.com/picodom/picodom)

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

You can now use the styled components to build your app.

```js
const App = h("main", {}, [
  Wrapper({}, Text("Scoping CSS is hard")),
  Wrapper({}, Text("Not with styled components!")),
])
```

Picostyle transforms any provided JSON styles into plain CSS styles and injects them into a style tag in the head of the document; all under unique style identifiers (USI). Each styled component is given a USI as a class name.

Because the output is a stylesheet and not inline styles. You can use all valid CSS in your JSON styles. For example:

- Media Queries (`@media (orientation: portrait)`)
- Pseudo-element and Pseudo-classes (`::before`, `:hover`, `:last-child`).
- Nested child styles (`> h1`, `> *+*`)


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

### Picodom Example

[Get the Code](https://github.com/morishitter/picostyle/tree/master/examples/picodom)

```js
import picodom from "picodom"
import picostyle from "picostyle"

const style = picostyle(picodom.h)
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

return (
  <Wrapper>
    <Text>{state.trim() === "" ? ":)" : state}</Text>
  </Wrapper>
)
```
