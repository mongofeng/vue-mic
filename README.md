# 微前端框架

## 环境搭建

本开发框架依赖 [Yarn](https://www.yarnpkg.com/zh-Hans/) 和 [Lerna](https://lerna.js.org/) 进行包管理

### Yarn

如果你还没有安装过Yarn，请参照[Yarn 的安装说明](https://www.yarnpkg.com/zh-Hans/docs/install)进行安装。

Yarn安装完毕后，运行以下命令启用 Yarn Workspaces：

```
yarn config set workspaces-experimental true
```

### Lerna

你还需要全局安装 Lerna：

```
npm install -g lerna
```

### 项目初始化
```
mkdir lerna-project & cd lerna-project`
```



## 新建导航主项目
### 第一步：添加主项目package
> 默认情况下，package是放在packages目录下的

```
// 进入packages目录
cd /packages
// 创建一个packge目录
mkdir root-html-file
// 进入root-html-file目录
cd root-html-file
// 初始化一个package
npm init -y
```
### 第二步：新建index.html
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
    <!-- <script src="https://cdnjs.cloudflare.com/ajax/libs/systemjs/6.1.1/extras/named-exports.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/systemjs/6.1.1/extras/named-register.min.js"></script> -->
    
    <!-- 解析包的default -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/systemjs/6.1.1/extras/use-default.min.js"></script>
    <!-- systemjs的包 -->

    <style rel="stylesheet">
      .single-spa-wrap {
        position: absolute;
        left: 214px;
        top: 126px;
        right: 14px;
        bottom: 14px;
      }
  
      .side-bar-collapsed .single-spa-wrap {
        left: 96px;
      }
  
      .single-spa-wrap.application-mounted {
        z-index: 0;
      }
  
      .single-spa-application {
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        opacity: 0;
        transform: translateX(20px);
        overflow: auto;
        transition: opacity .3s ease-out, transform .3s ease-out;
      }
  
      .single-spa-application.application-mounting {
        position: static;
        transform: translateX(0);
        opacity: 1;
      }
 
    </style>
  </head>
  <body>
    <div id="root"></div>

  </body>
</html>
```
### 第步：systemjs-importmap
```html
<script type="systemjs-importmap">
  {
    "imports": {
      "navbar": "http://localhost:8888/js/app.js",
      "app1": "http://localhost:8081/js/app.js",
      "app2": "http://localhost:8082/js/app.js",
      "single-spa": "https://cdnjs.cloudflare.com/ajax/libs/single-spa/4.3.7/system/single-spa.min.js",
      "vue": "https://cdn.jsdelivr.net/npm/vue@2.6.10/dist/vue.js",
      "vue-router": "https://cdn.jsdelivr.net/npm/vue-router@3.0.7/dist/vue-router.min.js"
    }
  }
</script>
```
> 备注变量的地址，到时systemjs可以直接去import，不出错



### 第二步：注册app应用

```js
// 注册子应用
singleSpa.registerApplication(
  'app2', // systemjs-webpack-interop, 去匹配子应用的名称
  () => System.import('app2'), // 资源路径
  location => location.pathname.startsWith('/app2') // 资源激活的
)

// 开始singleSpa
singleSpa.start();
```


### 注册子应用

#### set-public-path设置app应用名路径
```js
import { setPublicPath } from 'systemjs-webpack-interop'

// 为了让sing-spa知道这是app1的应用
const appName = process.env.VUE_APP_NAME || ''

setPublicPath(appName, 2)
```

#### main.js的配置
```js
import './set-public-path'
import Vue from 'vue';
import App from './App.vue';
import router from './router';
import singleSpaVue from 'single-spa-vue';

Vue.config.productionTip = false;

const vueLifecycles = singleSpaVue({
  Vue,
  appOptions: {
    // 没有挂载点默认挂载到body下
    render: (h) => h(App),
    router,
  },
});

export const bootstrap = vueLifecycles.bootstrap;
export const mount = vueLifecycles.mount;
export const unmount = vueLifecycles.unmount;
```


### 激活的时候
> 会自动创建对应的html挂到body下
```html
<!-- navbar激活的时候 -->
<div id="single-spa-application:navbar"></div> 

<!-- app1激活的时候 -->
<div id="single-spa-application:app1"></div> 

<!-- app2激活的时候 -->
<div id="single-spa-application:app2"></div> 

```


## 问题
### 1.'webpack-dev-server' 不是内部或外部命令，也不是可运行的程序
package.json必须加上version否则不会有node_modules


### 2.tsconfig.json必须写include


## da



## 参考文档
- [lerna管理前端模块最佳实践](https://juejin.im/post/6844903568751722509)
- [从0实现一个single-spa的前端微服务（中）](https://juejin.im/post/6844904048043229192#heading-4)
- [Single-Spa + Vue Cli 微前端落地指南 + 视频 (项目隔离远程加载，自动引入)](https://juejin.im/post/6844904025565954055#heading-0)
- [Single-Spa微前端落地（含nginx部署）](https://juejin.im/post/6844904158349246477)
- [react + redux + webpack+typescript 环境搭建](https://juejin.im/post/6844904029772840974)