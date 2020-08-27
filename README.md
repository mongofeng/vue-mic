## root
### 第一步：systemjs-importmap
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



## 参考文档
- [lerna管理前端模块最佳实践](https://juejin.im/post/6844903568751722509)
- [react + redux + webpack+typescript 环境搭建](https://juejin.im/post/6844904029772840974)