declare interface AppConfig {
  name: string // 应用名称
  main: string // 应用入口文件，形如 '/common/index.3c4b55cf.js'
  store: string // 应用仓库
  path?: string | string[] // 应用路径，路由通过匹配 path 来决定加载哪个应用
  commonsChunks: string[] //
  base: boolean // 是否基座应用
  hash: boolean // 是否通过 hash 模式匹配
}