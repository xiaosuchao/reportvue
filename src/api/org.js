import request from '@/utils/request'

export function getSubNodes(params) {
  return request({
    url: '/admin/organization/select',
    method: 'GET',
    params
  })
}

export function getList(params) {
  return request({
    url: '/admin/organization/selectAll',
    method: 'GET',
    params
  })
}

export function getRow(params) {
  return request({
    url: '/admin/organization/selectOne',
    method: 'GET',
    params
  })
}

export function updateRow(params) {
  return request({
    url: '/admin/organization/update',
    method: 'PUT',
    params
  })
}

export function addRow(data) {
  return request({
    url: '/admin/organization/create',
    method: 'POST',
    data
  })
}

export function delRow(params) {
  return request({
    url: '/admin/organization/delete',
    method: 'DELETE',
    params
  })
}
