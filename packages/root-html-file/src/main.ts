// import { PluginFunction } from 'vue'
import { registerApp } from './utils/register'
import 'systemjs'

async function bootstrap () {
  const [singleSpa, Vue, VueRouter] = await Promise.all([
    System.import('single-spa'),
    System.import('vue'),
    System.import('vue-router'),
    // System.import('vuex'),
    // System.import('element-ui'),
    // System.import('axios')
  ])
  console.log(Vue)


  Vue.config.devtools = process.env.NODE_ENV === 'development'
  Vue.use(VueRouter as any)
  // Vue.use(Vuex as PluginFunction<any>)
  // Vue.use(ElementUI as PluginFunction<any>)
  // @ts-ignore
  Vue.prototype.$eventBus = new Vue()

  try {
    // 读取应用配置并注册应用
    const config = await System.import(`/app.config.json`)
    console.log(config)
    const { apps } = config.default
    apps && apps.forEach((app: AppConfig) => {
      const { commonsChunks: chunks } = app
      if (chunks && chunks.length) {
        Promise.all(chunks.map(chunk => {
          return System.import(`/${app.name}/js/${chunk}.js`)
        })).then(() => {
          registerApp(singleSpa, app)
        })
      } else {
        registerApp(singleSpa, app)
      }
    })

    // 切换子系统的时候给body加上对应子系统的 class namespace
    window.addEventListener('single-spa:app-change', () => {
      const app = singleSpa.getMountedApps().pop();
      // const isApp = /^app-\w+$/.test(app);
      if (app) document.body.className = app;
    });

    singleSpa.start()
  } catch (e) {
    throw new Error('应用配置加载失败')
  }
}

bootstrap().then(r => {
  console.log('系统已成功启动:D')
})