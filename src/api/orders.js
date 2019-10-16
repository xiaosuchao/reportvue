import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/order/lists',
    method: 'get',
    params
  })
}

export function updateRowSchdule(data) {
  return request({
    url: '/order/ticket_submit',
    method: 'post',
    data
  })
}

export function getRowSchdule(data) {
  return request({
    url: '/order/ticket_show',
    method: 'post',
    data
  })
}

export function claimOrder(data) {
  return request({
    url: '/order/claim',
    method: 'post',
    data
  })
}

export function issueOrder(data) {
  return request({
    url: '/order/issue',
    method: 'post',
    data
  })
}

export function transferOrder(data) {
  return request({
    url: '/order/transfer',
    method: 'post',
    data
  })
}

export function returnOrder(data) {
  return request({
    url: '/order/refund',
    method: 'post',
    data
  })
}

