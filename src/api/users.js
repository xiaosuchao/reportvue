import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/admin/sysUser/selectChildren',
    method: 'get',
    params
  })
}

export function getUserOrgList(params) {
  return request({
    url: '/admin/userOrganization/select',
    method: 'get',
    params
  })
}

export function setUserOrgList(data) {
  return request({
    url: '/admin/userOrganization/create',
    method: 'POST',
    data
  })
}

export function getUserBusiList(params) {
  return request({
    url: '/admin/userMenu/select',
    method: 'get',
    params
  })
}

export function setUserBusiList(data) {
  return request({
    url: '/admin/userMenu/create',
    method: 'POST',
    data
  })
}

export function addRowUser(data) {
  return request({
    url: '/admin/sysUser/create',
    method: 'POST',
    data
  })
}

export function updateRowUser(params) {
  return request({
    url: '/admin/sysUser/update',
    method: 'put',
    params
  })
}

export function delRowUser(params) {
  return request({
    url: '/admin/sysUser/delete',
    method: 'delete',
    params
  })
}

export function selectByName(params) {
  return request({
    url: '/admin/sysUser/selectByName',
    method: 'GET',
    params
  })
}

export function selectByPhone(params) {
  return request({
    url: '/admin/sysUser/selectByPhone',
    method: 'GET',
    params
  })
}

export function getqrcode(params) { // 下载页面ios二维码
  return request({
    url: '/unicorn/appversion/getqrcode',
    method: 'GET',
    params
  })
}

export function codestocodes(data) {
  return request({
    url: '/authorization/info',
    method: 'post',
    data
  })
}
