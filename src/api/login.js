import request from '@/utils/request'

export function login(userName, password, verify_code, ccode) {
  return request({
    url: '/login',
    method: 'post',
    data: {
      vcode: verify_code,
      userName,
      password,
      ccode
    }
  })
}

export function getVercode() {
  return request({
    url: '/createCode',
    method: 'get',
    params: { nobg: 1 }
  })
}

export function getOrgTree(params) {
  return request({
    url: '/admin/userOrganization/selectTree',
    method: 'get',
    params
  })
}

export function getOrgInfo(params) {
  return request({
    url: '/orgInfo',
    method: 'get',
    params
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'post',
    data: { token }
  })
}
export function selectOrgTree(params) {
  return request({
    url: '/admin/overall/selectOrgTree',
    method: 'GET',
    params
  })
}
export function logout() {
  return request({
    url: '/User/self',
    method: 'post'
  })
}

