const path = require('path')
const baseWebpackConfig = require('./webpack.base.config')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const { merge } = require('webpack-merge')


module.exports = merge(baseWebpackConfig, {
  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ['./*.js', './*.html', './*.json'],
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: path.resolve(__dirname, './public') },
      ],
    }),
  ],
  output: {
    filename: '[name][hash:8].js',
    path: path.resolve(__dirname, '../../dist')
  },
})