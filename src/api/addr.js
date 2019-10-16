import request from '@/utils/request'

export function getSubArea(params) {
  return request({
    url: '/admin/sysArea/selectAll',
    method: 'GET',
    params
  })
}

export function createAddr(data) {
  return request({
    url: '/admin/sysArea/create',
    method: 'POST',
    data
  })
}

export function updateAddr(params) {
  return request({
    url: '/admin/sysArea/update',
    method: 'PUT',
    params
  })
}

export function delRowAddr(params) {
  return request({
    url: '/admin/sysArea/delete',
    method: 'DELETE',
    params
  })
}
