import Mock from 'mockjs'

const subList = []
const count = 3

for (let i = 0; i < count; i++) {
  subList.push(Mock.mock({
    id: '@increment',
    label: '@first'

  }))
}

export default {

  getSubNodes: config => {
    return {
      code: 0,
      data: subList
    }
  },

  createArea: config => {
    return {
      code: 0,
      data: {
        id: 1
      }
    }
  },
  updateArea: config => {
    return {
      'code': 0,
      'data': {
        'city': '市辖区',
        'code': '1101013233',
        'ctime': 1553600048446,
        'district': '东城区',
        'fullName': '北京市市辖区东城区成的',
        'grade': 4,
        'id': 719702,
        'mtime': 1553600048446,
        'name': '成的',
        'parentCode': '110101',
        'province': '北京市'
      },
      'msg': '操作成功啦',
      'title': '成功',
      'type': 'SUCCESS'
    }
  },

  logout: () => 'success'
}
