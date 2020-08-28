/* scripts/reactLibraryConfig.js */
module.exports = function(config, env, options) {
  // 当值为library的时候，修改配置
  if (env === 'library') {
    const srcFile = process.env.npm_package_module || options.module;
    const libName = process.env.npm_package_name || options.name;
    config.entry = srcFile;
    // 构件库信息
    config.output = {
      path: path.resolve('./', 'build'),
      filename: libName + '.js',
      library: libName,
      libraryTarget: 'umd'
    };
    // 修改webpack optimization属性，删除代码分割逻辑
    delete config.optimization.splitChunks;
    delete config.optimization.runtimeChunk;
    // 清空plugin只保留构建CSS命名
    config.plugins = [];
    config.plugins.push(
      new MiniCssExtractPlugin({
        filename: libName + '.css'
      })
    );
    // 代码来自 react-app-rewire-create-react-library
    // 生成externals属性值，排除外部扩展，比如React
    let externals = {};
    Object.keys(process.env).forEach(key => {
      if (key.includes('npm_package_dependencies_')) {
        let pkgName = key.replace('npm_package_dependencies_', '');
        pkgName = pkgName.replace(/_/g, '-');
        // below if condition addresses scoped packages : eg: @storybook/react
        if (pkgName.startsWith('-')) {
          const scopeName = pkgName.substr(1, pkgName.indexOf('-', 1) - 1);
          const remainingPackageName = pkgName.substr(
            pkgName.indexOf('-', 1) + 1,
            pkgName.length
          );
          pkgName = `@${scopeName}/${remainingPackageName}`;
        }
        externals[pkgName] = `${pkgName}`;
      }
    });
    config.externals = externals;
  }
  return config;
};
