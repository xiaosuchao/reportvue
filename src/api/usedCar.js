import request from '@/utils/request'
export function usedcarQuery(data) {
  return request({
    url: '/unicorn/usedcar/query',
    method: 'post',
    data
  })
}

export function usedcaradd(data) {
  return request({
    url: '/unicorn/usedcar/add',
    method: 'post',
    data
  })
}

export function usedcardel(data) {
  return request({
    url: '/unicorn/usedcar/del',
    method: 'post',
    data
  })
}

export function usedcarupdate(data) {
  return request({
    url: '/unicorn/usedcar/update',
    method: 'post',
    data
  })
}
