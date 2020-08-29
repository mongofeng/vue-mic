/** @format */
const path = require('path')
// const argv = require('minimist')(process.argv.slice(2))
const StatsPlugin = require('stats-webpack-plugin')

module.exports = function(process, dirname) {
  const isProduction = process.env.NODE_ENV === 'production'
  const appName = process.env.VUE_APP_NAME
  const port = process.env.port
  // const basePath = argv['base-path'] || '/'

  const baseUrl = process.env.VUE_APP_BASE_URL


  return {
    publicPath: isProduction ? `${baseUrl}${appName}/` : `http://localhost:${port}/`,

    // css在所有环境下，都不单独打包为文件。这样是为了保证最小引入（只引入js）
    css: {
        extract: false
    },

    productionSourceMap: false,

    outputDir: path.resolve(dirname, `../../dist/${appName}`),

    // css: {
    //   loaderOptions: {
    //     less: {
    //       modifyVars: {
    //         'primary-color': '#FF9F08',
    //         'link-color': '#FF9F08',
    //         'body-background': '#FCFBF9',
    //       },
    //       javascriptEnabled: true,
    //     },
    //     sass: {
    //       prependData: `@import "~@root/common/styles/settings.scss";`,
    //     },
    //   },
    // },

    configureWebpack: config => {
      config.devServer = {
        port,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      }

      config.plugins.push(
        new StatsPlugin('manifest.json', {
          chunkModules: false,
          entrypoints: true,
          env: true,
          source: false,
          chunks: false,
          modules: false,
          assets: false,
          children: false,
          exclude: [/node_modules/]
      }),
      )
    },

    chainWebpack: config => {
      // 根目录别名
      // config.resolve.alias.set('@root', path.resolve(dirname, '../../'))
      // // .set('@ant-design-vue/icons/lib/dist$', path.resolve(__dirname, './src/assets/icons.ts'))

      // // 公用的第三方库不参与打包
      // config.externals([
      //   'vue',
      //   'vue-router',
      //   'vuex',
      //   'axios',
      //   'echarts',
      //   'lodash',
      //   { moment: 'moment' },
      //   { '../moment': 'moment' }, // 这句很关键，在 moment 内置语种包中通过 ../moment 来调用 moment 的方法，所以也需要将这个设置为外置引用 window.moment
      // ])

      config.output.library(appName).libraryTarget('umd')

      config.externals(['vue', 'vue-router', 'vuex'])  // 一定要引否则说没有注册

      if (isProduction) {
        // 打包目标文件加上 hash 字符串，禁止浏览器缓存
        config.output.filename('js/index.[hash:8].js')
      }
    },
  }
}