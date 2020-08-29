import './set-public-path'
import Vue from 'vue';
import App from './App.vue';
import router from './router';
import singleSpaVue from 'single-spa-vue';
import {store} from './store'
const VUE_APP_NAME = process.env.VUE_APP_NAME

Vue.config.productionTip = false;

// 主应用注册成功后会在window下挂载singleSpaNavigate方法
// 为了独立运行，避免子项目页面为空，
// 判断如果不在微前端环境下进行独立渲染html
if (!window.singleSpaNavigate) {
  new Vue({
    render: h => h(App),
  }).$mount('#app')
}



const vueLifecycles = singleSpaVue({
  Vue,
  appOptions: {
    // el: '#wrap', // 没有挂载点默认挂载到body下
    render: (h) => h(App),
    router,
    store: window.rootStore,
  },
});

export const bootstrap = [
  () => {
    return new Promise(async (resolve, reject) => {
      // 注册当前应用的store
      console.log(window.rootStore)
      window.rootStore.registerModule(VUE_APP_NAME, store)
      resolve()
    })
  },
  vueLifecycles.bootstrap
];
export const mount = vueLifecycles.mount;
export const unmount = vueLifecycles.unmount;
