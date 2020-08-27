const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {apps} = require('./public/app.config.json')
module.exports = {
  entry: path.resolve(__dirname, './src/main.ts'),
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
  externals: {
    systemjs: 'System'
  },
  module: {
    
    rules: [
      { parser: { system: false } },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        include: path.resolve(__dirname, "./src"),
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'MyApp',
      template: path.resolve(__dirname, './public/index.html'),
      apps,
    })
  ]

}