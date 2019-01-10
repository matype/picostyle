import { uglify } from "rollup-plugin-uglify"

export default {
  input: "src/index.js",
  output: {
    file: "dist/picostyle.js",
    format: "umd",
    name: 'picostyle',
    sourceMap: true,
    exports: 'named',
  },
  plugins: [
    uglify()
  ],
}
