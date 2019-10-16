import request from '@/utils/request'

export function editlabels(data) {
  return request({
    url: '/unicorn/powerlabel/edit',
    method: 'POST',
    data
  })
}

export function addlabel(data) {
  return request({
    url: '/unicorn/label/addlabel',
    method: 'POST',
    data
  })
}

export function dellabel(data) {
  return request({
    url: '/unicorn/label/dellabel',
    method: 'POST',
    data
  })
}

export function getlabels(params) {
  return request({
    url: '/unicorn/label/getlabels',
    method: 'GET',
    params
  })
}

export function getlabeluser(params) {
  return request({
    url: '/unicorn/labeluser/getlabeluser',
    method: 'GET',
    params
  })
}

export function updateLabeluser(data) {
  return request({
    url: '/unicorn/labeluser/update/labeluser',
    method: 'POST',
    data
  })
}

export function AuthorizationGetlabels(params) {
  return request({
    url: '/unicorn/label/Authorization/getlabels',
    method: 'GET',
    params
  })
}

export function AuthorizationAddlabels(params) {
  return request({
    url: '/unicorn/label/Authorization/addlabel',
    method: 'POST',
    params
  })
}

export function AuthorizationDellabels(params) {
  return request({
    url: '/unicorn/label/Authorization/dellabel',
    method: 'POST',
    params
  })
}

export function AuthorizationUpdlabel(params) {
  return request({
    url: '/unicorn/label/Authorization/updlabel',
    method: 'POST',
    params
  })
}
