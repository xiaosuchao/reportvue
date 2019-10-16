import request from '@/utils/request'

export function visualMenu(params) {
  return request({
    url: '/admin/userMenu/selectTree',
    method: 'GET',
    params
  })
}

