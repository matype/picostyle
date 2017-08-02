import uglify from "rollup-plugin-uglify"
import buble from "rollup-plugin-buble"

export default {
  plugins: [buble(), uglify({})],
  globals: {
    picodom: "picodom"
  }
}
