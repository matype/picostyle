import babel from "rollup-plugin-babel"
import uglify from "rollup-plugin-uglify"

export default {
  entry: "./index.js",
  dest: `./dist/picostyle.js`,
  format: "umd",
  moduleName: "picostyle",
  plugins: [
    babel({ exclude: "./node_modules/**" }),
    uglify(),
  ],
}
