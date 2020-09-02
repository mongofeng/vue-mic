# 基于lerna和single-spa,sysyem.js搭建vue的微前端框架


## 为什么要用微前端
目前随着前端的不断发展，企业工程项目体积越来越大，页面越来越多，项目变得十分臃肿，维护起来也十分困难，有时我们仅仅更改项目简单样式，都需要整个项目重新打包上线，给开发人员造成了不小的麻烦，也非常浪费时间。老项目为了融入到新项目也需要不断进行重构，造成的人力成本也非常的高。

微前端架构具备以下几个核心价值：
- 技术栈无关 主框架不限制接入应用的技术栈，子应用具备完全自主权
- 独立开发、独立部署 子应用仓库独立，前后端可独立开发，部署完成后主框架自动完成同步更新
- 独立运行时 每个子应用之间状态隔离，运行时状态不共享


## single-spa实现原理
首先对微前端路由进行注册，使用single-spa充当微前端加载器，并作为项目单一入口来接受所有页面URL的访问，根据页面URL与微前端的匹配关系，选择加载对应的微前端模块，再由该微前端模块进行路由响应URL，即微前端模块中路由找到相应的组件，渲染页面内容。


## sysyem.js的作用及好处
`system.js`的作用就是动态按需加载模块。假如我们子项目都使用了`vue`,`vuex`,`vue-router`，每个项目都打包一次，就会很浪费。`system.js`可以配合`webpack`的`externals`属性，将这些模块配置成外链，然后实现按需加载,当然了，你也可以直接用script标签将这些公共的js全部引入，借助`system.js`这个插件，我们只需要将子项目的app.js暴露给它即可。


## 什么是Lerna
当前端项目变得越来越大的时候，我们通常会将公共代码拆分出来，成为一个个独立的`npm`包进行维护。但是这样一来，各种包之间的依赖管理就十分让人头疼。为了解决这种问题，我们可以将不同的`npm`包项目都放在同一个项目来管理。这样的项目开发策略也称作`monorepo`。`Lerna`就是这样一个你更好地进行这项工作的工具。`Lerna`是一个使用`git`和`npm`来处理多包依赖管理的工具,利用它能够自动帮助我们管理各种模块包之间的版本依赖关系。目前，已经有很多公共库都使用Lerna作为它们的模块依赖管理工具了，如：`babel`, `create-react-app`, `react-router`, `jest`等。
1. 解决包之间的依赖关系。
2. 通过git仓库检测改动，自动同步。
3. 根据相关的git提交的commit，生成`CHANGELOG`。

你还需要全局安装 Lerna：

```shell
npm install -g lerna
```

## 基于vue微前端项目搭建

### 1.项目初始化

```shell
mkdir lerna-project & cd lerna-project`

lerna init
```
执行成功后，目录下将会生成这样的目录结构。
```
├── README.md
├── lerna.json  # Lerna 配置文件
├── package.json
├── packages    # 应用包目录
```
### 2.Set up yarn的workspaces模式
默认是npm, 而且每个子package都有自己的`node_modules`，通过这样设置后，只有顶层有一个`node_modules`

```json
{
  "packages": [
    "packages/*"
  ],
  "useWorkspaces": true,
  "npmClient": "yarn",
  "version": "0.0.0"
}
```
同时`package.json` 设置 `private` 为 true，防止根目录被发布到 `npm`：


```json
{
 "private": true,
 "workspaces": [
    "packages/*"
 ]
}

```
配置根目录下的 `lerna.json` 使用 yarn 客户端并使用 `workspaces`
```shell
yarn config set workspaces-experimental true
```





### 3.注册子应用
#### 第一步:使用vue-cli创建子应用

```shell
# 进入packages目录
cd packages

# 创建应用
vue create app1

// 项目目录结构
├── public
├── src
│   ├── main.js
│   ├── assets
│   ├── components
│   └── App.vue
├── vue.config.js
├── package.json
├── README.md
└── yarn.lock
```

#### 第二步：使用vue-cli-plugin-single-spa插件快速生成spa项目
```shell
# 会自动修改main.js加入singleSpaVue，和生成set-public-path.js
vue add single-spa
```

生成的main.js文件
```js
const vueLifecycles = singleSpaVue({
  Vue,
  appOptions: {
    // el: '#app', // 没有挂载点默认挂载到body下
    render: (h) => h(App),
    router,
    store: window.rootStore,
  },
});

export const bootstrap = [
  vueLifecycles.bootstrap
];
export const mount = vueLifecycles.mount;
export const unmount = vueLifecycles.unmount;

```


#### 第三步：设置环境变量.env

```shell
# 应用名称
VUE_APP_NAME=app1
# 应用根路径，默认值为: '/'，如果要发布到子目录，此值必须指定
VUE_APP_BASE_URL=/
# 端口，子项目开发最好设置固定端口， 避免频繁修改配置文件，设置一个固定的特殊端口，尽量避免端口冲突。
port=8081
```

#### 第四步： 设置vue.config.js修改webpack配置

```js
const isProduction = process.env.NODE_ENV === 'production'
const appName = process.env.VUE_APP_NAME
const port = process.env.port
const baseUrl = process.env.VUE_APP_BASE_URL
module.exports = {
  // 防止开发环境下的加载问题
  publicPath: isProduction ? `${baseUrl}${appName}/` : `http://localhost:${port}/`,

    // css在所有环境下，都不单独打包为文件。这样是为了保证最小引入（只引入js）
    css: {
        extract: false
    },

  productionSourceMap: false,

  outputDir: path.resolve(dirname, `../../dist/${appName}`), // 统一打包到根目录下的dist下
  chainWebpack: config => {
    config.devServer.set('inline', false)
    config.devServer.set('hot', true)
    config.externals(['vue', 'vue-router'])

    // 保证打包出来的是一个js文件，供主应用进行加载
    config.output.library(appName).libraryTarget('umd')

    config.externals(['vue', 'vue-router', 'vuex'])  // 一定要引否则说没有注册

    if (process.env.NODE_ENV !== 'production') {
      // 打包目标文件加上 hash 字符串，禁止浏览器缓存
      config.output.filename('js/index.[hash:8].js')
    }
  },
}

```

### 4.新建主项目

#### 第一步：添加主项目package

```shell
# 进入packages目录
cd packages
# 创建一个packge目录, 进入root-html-file目录
mkdir root-html-file && cd root-html-file
# 初始化一个package
npm init -y
```
#### 第二步：新建主项目index.html
> 主应用主要是扮演路由分发，资源加载的作用的角色
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Vue-Microfrontends</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="importmap-type" content="systemjs-importmap">
    <!-- 配置文件注意写成绝对路径：/开头，否则访问子项目的时候重定向的index.html，相对目录会出错 -->
   <script type="systemjs-importmap" src="importmap.json"></script>
    <link rel="preload" href="https://cdnjs.cloudflare.com/ajax/libs/single-spa/4.3.7/system/single-spa.min.js" as="script" crossorigin="anonymous" />
    <link rel="preload" href="https://cdn.jsdelivr.net/npm/vue@2.6.10/dist/vue.js" as="script" crossorigin="anonymous" />
    <!-- systemjs的包 -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/systemjs/6.1.1/system.min.js"></script>
    <!-- 用于解析子包的解析 -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/systemjs/6.1.1/extras/amd.min.js"></script>
    <!-- 解析包的default -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/systemjs/6.1.1/extras/use-default.min.js"></script>
    <!-- systemjs的包 -->
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```
#### 第三步：编辑importMapjson文件,配置对应子应用的文件
```json
{
  "imports": {
    "navbar": "http://localhost:8888/js/app.js",
    "app1": "http://localhost:8081/js/app.js",
    "app2": "http://localhost:8082/js/app.js",
    "single-spa": "https://cdnjs.cloudflare.com/ajax/libs/single-spa/4.3.7/system/single-spa.min.js",
    "vue": "https://cdn.jsdelivr.net/npm/vue@2.6.10/dist/vue.js",
    "vue-router": "https://cdn.jsdelivr.net/npm/vue-router@3.0.7/dist/vue-router.min.js",
    "vuex": "https://cdn.jsdelivr.net/npm/vuex@3.1.2/dist/vuex.min.js"
  }
}
```
> 到时systemjs可以直接去import，具体作用参考[systemjs](https://github.com/systemjs/systemjs)

#### 第四步：注册app应用
```js
// 注册子应用
singleSpa.registerApplication(
  'app1', // systemjs-webpack-interop, 去匹配子应用的名称
  () => System.import('app1'), // 资源路径
  location => location.hash.startsWith('/app1') // 资源激活的
)

singleSpa.registerApplication(
  'app2', // systemjs-webpack-interop, 去匹配子应用的名称
  () => System.import('app2'), // 资源路径
  location => location.hash.startsWith('#/app2') // 资源激活的
)
singleSpa.registerApplication(
  'app2', // systemjs-webpack-interop, 去匹配子应用的名称
  () => System.import('app2'), // 资源路径
  location => location.hash.startsWith('#/app2') // 资源激活的
)
// 开始singleSpa
singleSpa.start();
```





#### 第五步：项目开发

项目的基本目录结构如下：

```
.
├── README.md
├── lerna.json  # Lerna 配置文件
├── node_modules
├── package.json
├── packages    # 应用包目录
│   ├── app1    # 应用1
│   ├── app2    # 应用2
│   ├── navbar   # 主应用
│   └── root-html-file  # 入口
└── yarn.lock
```

如上图所示，所有的应用都存放在 `packages` 目录中。其中 `root-html-file` 为入口项目，`navbar` 为常驻的主应用，这两者在开发过程中必须启动相应的服务。其他为待开发的子应用。


## 项目的优化
### 抽取子应用资源配置
在主应用中抽取所有的子应用到一个通用的`app.config.json`文件配置
```json
{
  "apps": [
    {
      "name": "navbar", // 应用名称
      "main": "http://localhost:8888/js/app.js", // 应用的入口
      "path": "/", // 是否为常驻应用
      "base": true, // 是否使用history模式
      "hash": true // 是否使用hash模式
    },
    {
      "name": "app1",
      "main": "http://localhost:8081/js/app.js",
      "path": "/app1",
      "base": false,
      "hash": true
    },
    {
      "name": "app2",
      "main": "http://localhost:8082/js/app.js",
      "path": "/app2",
      "base": false,
      "hash": true
    }
  ]
}
```

主应用的入口文件中注册子应用
```js
try {
    // 读取应用配置并注册应用
    const config = await System.import(`/app.config.json`)
    const { apps } = config.default
    apps && apps.forEach((app: AppConfig) => {
      const { commonsChunks: chunks } = app
      registerApp(singleSpa, app)
    })
    singleSpa.start()
  } catch (e) {
    throw new Error('应用配置加载失败')
  }

/**
 * 注册应用
 * */
function registerApp (spa, app) {
  const activityFunc = app.hash ? hashPrefix(app) : pathPrefix(app)
  spa.registerApplication(
    app.name,
    () => System.import(app.main),
    app.base ? (() => true) : activityFunc,
    {
      store
    }
  )
}


/**
 * hash匹配模式
 * @param app 应用配置
 */
 function hashPrefix (app) {
  return function (location) {
    if (!app.path) return true

    if (Array.isArray(app.path)) {
      if (app.path.some(path => location.hash.startsWith(`#${path}`))) {
        return true
      }
    } else if (location.hash.startsWith(`#${app.path}`)) {
      return true
    }

    return false
  }
}

/**
 * 普通路径匹配模式
 * @param app 应用配置
 */
function pathPrefix (app) {
  return function (location) {
    if (!app.path) return true

    if (Array.isArray(app.path)) {
      if (app.path.some(path => location.pathname.startsWith(path))) {
        return true
      }
    } else if (location.pathname.startsWith(app.path)) {
      return true
    }

    return false
  }
}

```

### 所有子项目公用一个使用vuex

在主项目index.html注册vuex的插件，通过window对象存储，子项目加载启动时候通过`registerModule`方式注入子应用的模块和自身的vue实例上
```js
// 主应用的js中
Vue.use(Vuex)
window.rootStore = new Vuex.Store() // 全局注册唯一的vuex, 供子应用的共享


// 子应用的main.js
export const bootstrap = [
  () => {
    return new Promise(async (resolve, reject) => {
      // 注册当前应用的store
      window.rootStore.registerModule(VUE_APP_NAME, store)
      resolve()
    })
  },
  vueLifecycles.bootstrap
];
export const mount = vueLifecycles.mount;
export const unmount = vueLifecycles.unmount;


```


### 样式隔离
我们使用postcss的一个插件：`postcss-selector-namespace`。
他会把你项目里的所有css都会添加一个类名前缀。这样就可以实现命名空间隔离。
首先，我们先安装这个插件：`npm install postcss-selector-namespace --save -d`
项目目录下新建 `postcss.config.js`，使用插件：
```js
// postcss.config.js

module.exports = {
  plugins: {
    // postcss-selector-namespace: 给所有css添加统一前缀，然后父项目添加命名空间
    'postcss-selector-namespace': {
      namespace(css) {
        // element-ui的样式不需要添加命名空间
        if (css.includes('element-variables.scss')) return '';
        return '.app1' // 返回要添加的类名
      }
    },
  }
}

```
然后父项目添加命名空间

```js
// 切换子系统的时候给body加上对应子系统的 class namespace
window.addEventListener('single-spa:app-change', () => {
  const app = singleSpa.getMountedApps().pop();
  const isApp = /^app-\w+$/.test(app);
  if (app) document.body.className = app;
});
```






### 生产部署利用manifest自动加载生成子应用的app.config.json路径和importMapjson
`stats-webpack-plugin`可以在你每次打包结束后，都生成一个`manifest.json` 文件，里面存放着本次打包的 `public_path` `bundle` `list` `chunk` `list` 文件大小依赖等等信息。可以根据这个信息来生成子应用的`app.config.json`路径和`importMapjson`.

```shell
npm install stats-webpack-plugin --save -d
```

在`vue.config.js`中使用：

```js
{
    configureWebpack: {
        plugins: [
            new StatsPlugin('manifest.json', {
                chunkModules: false,
                entrypoints: true,
                source: false,
                chunks: false,
                modules: false,
                assets: false,
                children: false,
                exclude: [/node_modules/]
            }),
        ]
    }
}

```

打包完成最后通过脚本`generate-app.js`生成对应,子应用的json路径和importMapjson
```js
const path = require('path')
const fs = require('fs')
const root = process.cwd()
console.log(`当前工作目录是: ${root}`);
const dir = readDir(root)
const jsons = readManifests(dir)
generateFile(jsons)

console.log('生成配置文件成功')


function readDir(root) {
  const manifests = []
  const files = fs.readdirSync(root)
  console.log(files)
  files.forEach(i => {
    const filePath = path.resolve(root, '.', i)
    const stat = fs.statSync(filePath);
    const is_direc = stat.isDirectory();

    if (is_direc) {
      manifests.push(filePath)
    }

  })
  return manifests
}


function readManifests(files) {
  const jsons = {}
  files.forEach(i => {
    const manifest = path.resolve(i, './manifest.json')
    if (fs.existsSync(manifest)) {
      const { publicPath, entrypoints: { app: { assets } } } = require(manifest)
      const name = publicPath.slice(1, -1)
      jsons[name] = `${publicPath}${assets}`
    }
  })

  return jsons

}



function generateFile(jsons) {
  const { apps } = require('./app.config.json')
  const { imports } = require('./importmap.json')
  Object.keys(jsons).forEach(key => {
    imports[key] = jsons[key]
  })
  apps.forEach(i => {
    const { name } = i

    if (jsons[name]) {
      i.main = jsons[name]
    }
  })

  fs.writeFileSync('./importmap.json', JSON.stringify(
    {
      imports
    }
  ))

  fs.writeFileSync('./app.config.json', JSON.stringify(
    {
      apps
    }
  ))

}


```
## 应用打包
在根目录执行`build`命令, `packages`里面的所有`build`命令都会执行,这会在根目录生成 dist 目录下, 
```shell
lerna run build
```
最终生成的目录结构如下
```
.
├── dist
│   ├── app1/
│   ├── app2/
    ├── navbar/
│   ├── app.config.json
│   ├── importmap.json
│   ├── main.js
│   ├── generate-app.js
│   └── index.html
```
最后，执行以下命令生成 `generate-app.js`,重新生成带hash资源路径的`importmap.json`和`app.config.json`文件：

```shell
cd dist && node generate-app.js
```
文章中的完整demo文件地址

## lerna启动项目
```shell

# 清除所有的包
lerna clean

# npm i 下载依赖包或者生成本地软连接
lerna bootstrap

# npm i axios 所有包都添加axios
lerna add axios 

# cd app1 & npm i axios
lerna add axios --scope=app1

```



## 参考文档
- [lerna管理前端模块最佳实践](https://juejin.im/post/6844903568751722509)
- [lerna 和 yarn 实现 monorepo](https://juejin.im/post/6855129007185362952#heading-14)
- [从0实现一个single-spa的前端微服务（中）](https://juejin.im/post/6844904048043229192#heading-4)
- [Single-Spa + Vue Cli 微前端落地指南 + 视频 (项目隔离远程加载，自动引入)](https://juejin.im/post/6844904025565954055#heading-0)
- [Single-Spa微前端落地（含nginx部署）](https://juejin.im/post/6844904158349246477)
- [可能是你见过最完善的微前端解决方案](https://zhuanlan.zhihu.com/p/78362028)
- [coexisting-vue-microfrontends](https://github.com/joeldenning/coexisting-vue-microfrontends)