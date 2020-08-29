import './set-public-path'
import Vue from 'vue';
import App from './App.vue';
import router from './router';
import singleSpaVue from 'single-spa-vue';
import {store} from './store'
const VUE_APP_NAME = process.env.VUE_APP_NAME

Vue.config.productionTip = false;

const vueLifecycles = singleSpaVue({
  Vue,
  appOptions: {
    el: '#root', // 没有挂载点默认挂载到body下
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
