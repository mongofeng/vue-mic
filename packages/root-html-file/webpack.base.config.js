const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
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
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'MyApp',
      filename: path.resolve(__dirname, './public/index.html'),
      apps: require('./public/app.config.json').apps
    })
  ]
  // output: {
  //   filename: '[name][hash:8].js',
  //   path: path.resolve(__dirname, '../../dist')
  // },
}