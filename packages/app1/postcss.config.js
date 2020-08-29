const plugins = require('../../build/postcss.plugin')
module.exports = {
  plugins: {
    autoprefixer: {},
    ...plugins
  }
}
