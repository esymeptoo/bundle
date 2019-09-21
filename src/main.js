// (async () => {
//   const asyncAddWrapper = () => import('./add')
//
//   const { default: add } = await asyncAddWrapper()
//   console.log(add(1, 0))
// })()

(async () => {
  require.ensure([], function () {
    console.log(require('./add.js').default(1, 2))
  }, 'add')
})()
