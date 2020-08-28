/* config-overrides.js */
const fs = require('fs')
const path = require('path')

module.exports = {
  webpack: function(config, env) {
    console.log('当前环境>>', env)
    // fs.writeFileSync(`${env}.json`, JSON.stringify(config))
    // console.log('配置导出完成')
    // console.log(process.env.PORT)
    const baseUrl = '/'
    const isProduction = env === 'production'
    const appName = process.env.REACT_APP_NAME
    // 解决静态资源图片跨域的问题
    const publicPath = isProduction ? `${baseUrl}${appName}/` : `http://localhost:${process.env.PORT}/`


    const filename = isProduction ? 'js/app.[hash:8].js' : 'js/app.js'
    // const system

      // 构件库信息
      // https://single-spa.js.org/docs/faq/#create-react-app
    config.output = {
      path: path.resolve(__dirname, './build'),
      publicPath,
      filename,
      library: appName,
      libraryTarget: 'umd',
    };
    // 修改webpack optimization属性，删除代码分割逻辑
    // delete config.optimization.splitChunks;
    // delete config.optimization.runtimeChunk;
      
    config.plugins = config.plugins.filter(plugin => plugin.constructor.name !== 'HtmlWebpackPlugin')
    delete config.optimization
    console.log(config)
    return config;
  },
  devServer(configFunction) {
    return function (proxy, allowedHost) {
      const config = configFunction(proxy, allowedHost);
      config.disableHostCheck = true
      config.headers = config.headers || {}
      config.headers['Access-Control-Allow-Origin'] = '*'
      return config
    }
  }
}

// module.exports = {
//   webpack(config, env) {
//     // config.entry = './src/single-spa-entry.js';
//     config.output = {
//       ...config.output,
//       filename: 'project-name.js',
//       libraryTarget: 'system',
//     }
//     config.plugins = config.plugins.filter(plugin => plugin.constructor.name !== 'HtmlWebpackPlugin')
//     delete config.optimization
//     return config;
//   },
//   devServer(configFunction) {
//     return function (proxy, allowedHost) {
//       const config = configFunction(proxy, allowedHost);
//       config.disableHostCheck = true
//       config.headers = config.headers || {}
//       config.headers['Access-Control-Allow-Origin'] = '*'
//       return config
//     }
//   }
// }
