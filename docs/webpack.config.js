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
                'es2015',
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
    path: path.join(APP_ROOT, '/dist'),
    publicPath: '/',
  },
};
