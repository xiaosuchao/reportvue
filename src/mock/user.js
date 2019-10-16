import Mock from 'mockjs'

const List = []
const count = 6

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    username: '@first',
    truename: '@first',
    orgname: '@title(1)',
    phone: '@integer(13123456789,13987654321)',
    addr: '@title(1, 3)',
    'ismain|1': ['是', '否'],
    status: '1',
    mark: ''

  }))
}

export default {
  getList: config => {
    return {
      code: 0,
      data: List
    }
  },
  addRowUser: config => {
    return {
      code: 0,
      data: {
        id: 1
      }
    }
  },
  updateRowUser: config => {
    return {
      code: 0,
      data: {

      }
    }
  },
  delRowUser: config => {
    return {
      code: 0,
      data: {

      }
    }
  },

  logout: () => 'success'
}
