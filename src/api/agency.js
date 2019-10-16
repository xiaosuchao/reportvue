import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/Authorization/organization/select',
    method: 'GET',
    params
  })
}

export function getRow(params) {
  return request({
    url: '/Authorization/organization/select',
    method: 'GET',
    params
  })
}

export function addRow(data) {
  return request({
    url: '/Authorization/organization/create',
    method: 'POST',
    data
  })
}

export function addAgcAdmin(data) {
  return request({
    url: '/Authorization/sysUser/create',
    method: 'POST',
    data
  })
}

export function setAgcAdmin(params) {
  return request({
    url: '/admin/sysUser/update',
    method: 'PUT',
    params
  })
}

export function updateRow(params) {
  return request({
    url: '/Authorization/organization/update',
    method: 'PUT',
    params
  })
}

export function delRow(params) {
  return request({
    url: '/Authorization/organization/delete',
    method: 'DELETE',
    params
  })
}

export function APPklist(params) {
  return request({
    url: '/admin/sysAuthority/select',
    method: 'GET',
    params
  })
}

export function selectOne(params) {
  return request({
    url: '/admin/sysAuthority/selectOne',
    method: 'GET',
    params
  })
}

export function createAppk(data) {
  return request({
    url: '/admin/sysAuthority/create',
    method: 'POST',
    data
  })
}

export function updateAppk(data) {
  return request({
    url: '/admin/sysAuthority/update',
    method: 'PUT',
    data
  })
}

export function deleteAppk(params) {
  return request({
    url: '/admin/sysAuthority/delete',
    method: 'DELETE',
    params
  })
}

export function selectRepetition(params) {
  return request({
    url: '/admin/organization/selectRepetition',
    method: 'GET',
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
export function appversion(params) {
  return request({
    url: '/unicorn/appversion/queryall',
    method: 'GET',
    params
  })
}
export function removeversion(params) {
  return request({
    url: '/unicorn/appversion/remove',
    method: 'post',
    params
  })
}
export function addappversion(params) {
  return request({
    url: '/unicorn/appversion/addappversion',
    method: 'post',
    params
  })
}
export function queryappversion(params) {
  return request({
    url: '/unicorn/appversion/queryone',
    method: 'get',
    params
  })
}
export function updateversion(data) {
  return request({
    url: '/unicorn/appversion/update',
    method: 'post',
    data
  })
}

export function updatesign(data) {
  return request({
    url: '/unicorn/appversion/updatesign',
    method: 'post',
    data
  })
}
export function organizationGetenum(params) {
  return request({
    url: '/Authorization/organization/getenum',
    method: 'GET',
    params
  })
}
