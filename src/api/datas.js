import request from '@/utils/request'

export function getSum(params) {
  return request({
    url: '/order/stat',
    method: 'get',
    params
  })
}

export function getList(params) {
  return request({
    url: '/order/lists',
    method: 'get',
    params
  })
}
