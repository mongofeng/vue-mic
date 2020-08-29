const path = require('path')
const fs = require('fs')
const root = process.cwd()
console.log(`当前工作目录是: ${root}`);


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
  console.log('子文件夹为')
  console.log(manifests)

  return manifests
}



function readManifests(files) {
  const jsons = {}
  files.forEach(i => {
    const manifest = path.resolve(i, './manifest.json')
    if (fs.existsSync(manifest)) {
      console.log('该路径已存在');
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



const dir = readDir(root)

const jsons = readManifests(dir)


generateFile(jsons)


console.log('生成配置文件成功')


