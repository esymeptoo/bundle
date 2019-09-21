const http = require('http')
const url = require('url')
const qs = require('querystring')
const exec = require('child_process').exec

const middleWares = []

http.createServer(serverListener).listen(3000)

function serverListener(req, res) {
  const composedMethods = compose(...middleWares)
  composedMethods(req, res)
}

function commandAsync(...args) {
  return new Promise((resolve, reject) => {
    exec(...args, function(err, stdout) {
      if (err) { reject(err) }
      else {
        resolve(stdout)
      }
    })
  })
}

function compose(...fns) {
  if (!fns.length) return () => {}
  if (fns.length === 1) return fns[0]
  return fns.reduce((a, b) => async (...args) => b(...(await a(...args))))
}
serverListener.use = function (fn) {
  middleWares.push(fn)
}

serverListener.use(setCors)
serverListener.use(getQuery)
serverListener.use(getRouter('/build', function (req, res) {
  if (req.method === 'POST') {
    let body = ""
    //请求链接
    req.on('data', function (chunk) {
      body += chunk
    })
    req.on('end', function () {
      const { commander } = JSON.parse(body)
      commandAsync(`npm run ${commander}`, {
        encoding: 'utf-8',
        cwd: __dirname,
      })
        .then(log => {
          console.log(log + 'build complete')
          res.end('done')
        })
        .catch(err => {
          console.log(err)
        })
    })
  }
}))

function setCors(req, res) {
  res.setHeader("Access-Control-Allow-Origin","*")
  //跨域允许的header类型
  res.setHeader("Access-Control-Allow-Headers","Content-type,Content-Length,Authorization,Accept,X-Requested-Width")
  //跨域允许的请求方式
  res.setHeader("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS")
  return [req, res]
}

function getQuery(req, res) {
  const query = url.parse(req.url).query
  req.query = qs.parse(query)
  return [req, res]
}

function getRouter(router, cb) {
  return async function (req, res) {
    if (req.url.indexOf(router) > -1) await cb(req, res)
    return [req, res]
  }
}
