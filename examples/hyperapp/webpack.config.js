const path = require('path');
const webpack = require('webpack');
const APP_ROOT = __dirname;

module.exports = {
  context: APP_ROOT,
  devServer: {
    contentBase: './',
  },
  entry: {
    app: './app.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                ["env", {
                  "targets": {
                    "browsers": [
                      "ie >= 11",
                      "last 2 Edge versions",
                      "last 2 Firefox versions",
                      "last 2 Chrome versions",
                      "last 2 Safari versions",
                      "last 2 Opera versions",
                      "last 2 iOS versions",
                      "last 2 ChromeAndroid versions"
                    ],
                  },
                }]
              ],
              plugins: [
                ['transform-react-jsx', {
                  pragma: 'h'
                }]
              ],
            },
          },
        ],
      }
    ],
  },
  output: {
    filename: '[name].js',
    path: path.join(APP_ROOT, 'dist'),
    publicPath: '/dist/',
  },
};
