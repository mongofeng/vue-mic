import { setPublicPath } from 'systemjs-webpack-interop'

const appName = process.env.VUE_APP_NAME || ''

setPublicPath(appName, 2)