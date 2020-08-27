import { setPublicPath } from 'systemjs-webpack-interop'

// 为了让sing-spa知道这是app1的应用
const appName = process.env.VUE_APP_NAME || ''

setPublicPath(appName, 2)