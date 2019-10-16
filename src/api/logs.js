import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/Order/log_lists',
    method: 'get',
    params
  })
}
