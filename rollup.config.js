import uglify from "rollup-plugin-uglify"

export default {
  entry: "src/index.js",
  dest: "dist/picostyle.js",
  format: "umd",
  moduleName: 'picostyle',
  plugins: [
    uglify()
  ],
  sourceMap: true,
}
