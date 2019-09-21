export default function (a, b) {
  return a - b
}

const asyncAddWrapper = () => import('./add')

asyncAddWrapper().then(res => {
  console.log(res.add(1, 2))
})
