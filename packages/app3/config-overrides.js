/* config-overrides.js */
const fs = require('fs')
const path = require('path')
// https://github.com/arackaf/customize-cra
 const adjustStyleLoaders = (config) => {
  const mode = process.env.NODE_ENV === 'production' ? 'prod' : 'dev';
  const loader = mode === 'prod' ? 'css-extract-plugin' : 'style-loader';

  const loaders = config.module.rules.find(rule => Array.isArray(rule.oneOf))
    .oneOf;
  const styleLoaders = loaders.filter(({ use }) => use && use[0] && (use[0].loader || use[0]).includes(loader));
  styleLoaders.forEach(loader => {
    const {use} = loader
    use[0] = require.resolve('style-loader')
  });

  return config;
};

module.exports = {
  webpack: function (config, env) {
    console.log('当前环境>>', env)
    // fs.writeFileSync(`${env}.json`, JSON.stringify(config))
    // console.log('配置导出完成')
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

    adjustStyleLoaders(config)

    delete config.optimization
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
