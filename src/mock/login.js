
export default {
  loginByUsername: config => {
    return {
      code: 0,
      data: {
        token: '32323'
      }
    }
  },
  getUserInfo: config => {
    return {
      code: 0,
      data: {
        codes: ['index'],
        userName: 'admin'
      }
    }
  },
  createCode: config => {
    return {
      code: 0,
      data: {
        Base64: 'aaaa',
        ccode: '1234'
      }
    }
  },
  logout: () => 'success'
}
