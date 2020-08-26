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
    render: (h) => h(App),
    router,
  },
});

export const bootstrap = vueLifecycles.bootstrap;
export const mount = vueLifecycles.mount;
export const unmount = vueLifecycles.unmount;
```



## 参考文档
- [lerna管理前端模块最佳实践](https://juejin.im/post/6844903568751722509)