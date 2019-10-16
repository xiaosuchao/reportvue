import request from '@/utils/request'

export function updatepwd(data) {
  return request({
    url: '/auth/change_pwd',
    method: 'POST',
    data
  })
}
