import request from '@/utils/request'

export function userrecord(data) {
  return request({
    url: '/userRecord/page',
    method: 'POST',
    data
  })
}

export function facelistByfaceset(data) {
  return request({
    url: '/userRecord/getByFacesetToken',
    method: 'POST',
    data
  })
}
