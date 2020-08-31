const path = require('path')
const fs = require('fs');
const root = process.cwd()
console.log(`当前工作目录是: ${root}`);

const callback = (resolve, reject) => (err, data) => err ? reject(err) : resolve(data)

const createPromise = (func) => (...args) => {
  return new Promise((resolve, reject) => {
    func(...args, callback(resolve, reject))
  })
}



main(root)

/**
 * 读取文件夹的路径
 * @param {*} root 
 */
async function readDir(root) {
  const manifests = []
  const files = fs.readdirSync(root)
  console.log(files)
  const statPromise = createPromise(fs.stat)
  for (let i of files) {
    const filePath = path.resolve(root, '.', i)
    const stat = await statPromise(filePath);
    const is_direc = stat.isDirectory();
    if (is_direc) {
      manifests.push(filePath)
    }
  }

  return manifests
}

/**
 * 读取json
 * @param {*} files 
 */
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


/**
 * 生成文件
 * @param {}} jsons 
 */
async function generateFile(jsons) {
  const { apps } = require('./app.config.json')
  const { imports } = require('./importmap.json')

  const writeFilePromise = createPromise(fs.writeFile)


  Object.keys(jsons).forEach(key => {
    imports[key] = jsons[key]
  })

  apps.forEach(i => {
    const { name } = i

    if (jsons[name]) {
      i.main = jsons[name]
    }
  })


  Promise.all([
    writeFilePromise('./importmap.json', JSON.stringify(
      {
        imports
      }
    )),
    writeFilePromise('./app.config.json', JSON.stringify(
      {
        apps
      }
    ))
  ])

}


async function main(root) {
  const dir = await readDir(root)
  const jsons = readManifests(dir)
  await generateFile(jsons)
  console.log('生成配置文件成功')
}






