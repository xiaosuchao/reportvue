import Mock from 'mockjs'

const subList = []
const count = 3

for (let i = 0; i < count; i++) {
  subList.push(Mock.mock({
    id: '@increment',
    name: '@first',
    code: '@increment'

  }))
}

export default {

  getSubArea: config => {
    return {
      code: 0,
      data: subList
    }
  },

  logout: () => 'success'
}
