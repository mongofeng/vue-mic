
import { registerApp } from './utils/index'
import 'systemjs'

async function bootstrap () {
  const [singleSpa, Vue, VueRouter, Vuex] = await Promise.all([
    System.import('single-spa'),
    System.import('vue'),
    System.import('vue-router'),
    System.import('vuex'),
  ])
  console.log(Vue)


  Vue.config.devtools = process.env.NODE_ENV === 'development'
  Vue.use(VueRouter as any)
  Vue.use(Vuex as any)

  // @ts-ignore
  Vue.prototype.$eventBus = new Vue()
  // @ts-ignore
  window.rootStore = new Vuex.Store() // 全局注册唯一的vuex, 供子应用的共享

  try {
    // 读取应用配置并注册应用
    const config = await System.import(`/app.config.json`)
    console.log(config)
    const { apps } = config.default
    apps && apps.forEach((app: AppConfig) => {
      const { commonsChunks: chunks } = app
      if (chunks && chunks.length) {
        Promise.all(chunks.map(chunk => {
          return System.import(`/${app.name}/js/${chunk}.js`) // 加载完所有的异步chunk代码
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
      const isApp = /^app-\w+$/.test(app);
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