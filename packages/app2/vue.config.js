// // Temporary until we can use https://github.com/webpack/webpack-dev-server/pull/2143
// const path = require('path')
// const isProduction = process.env.NODE_ENV === 'production'
// const baseUrl = process.env.VUE_APP_BASE_URL
// const appName = process.env.VUE_APP_NAME
// module.exports = {
//   publicPath: isProduction ? `${baseUrl}${appName}/` : `http://localhost:${process.env.port}/`,


//   outputDir: path.resolve(__dirname, `../../dist/${appName}`),

//   devServer: {
//     port: process.env.port,
//     headers: {
//       'Access-Control-Allow-Origin': '*',
//     },
//   },




//   chainWebpack: config => {
//     config.devServer.set('inline', false)
//     config.devServer.set('hot', true)
//     // Vue CLI 4 output filename is js/[chunkName].js, different from Vue CLI 3
//     // More Detail: https://github.com/vuejs/vue-cli/blob/master/packages/%40vue/cli-service/lib/config/app.js#L29
//     if (process.env.NODE_ENV !== 'production') {
//       config.output.filename(`js/[name].js`)
//     }
//     config.externals(['vue', 'vue-router'])

//     config.output.library(appName).libraryTarget('umd')
//   },
//   // filenameHashing: false
// }
const generateConfig = require('../../build/generate-config')

module.exports = generateConfig(process, __dirname)