const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin({
      include: /\.min\.js$/,
      parallel: true,
    })]
  },
  mode: 'production',
  entry: {
    'index': './src/index.js',
    'index.min': './src/index.js',
  },
  output: {
    path: path.resolve('dist'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /(node_modules)/,
        use: 'babel-loader',
      },
    ],
  },
  node: {
    fs: 'empty',
  },
  resolve: {
    extensions: ['.js'],
  },
  plugins: [
    new webpack.DefinePlugin({
      VERSION: JSON.stringify(require('./package.json').version),
    }),
  ],
};