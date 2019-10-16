import request from '@/utils/request'

export function facesetList(params) {
  return request({
    url: '/faceSet/page',
    method: 'get',
    params
  })
}

export function facelistByfaceset(params) {
  return request({
    url: '/userRecord/getByFacesetToken',
    method: 'get',
    params
  })
}

export function userRecordList(params) {
  return request({
    url: '/userRecord/page',
    method: 'GET',
    params
  })
}

export function clientRecordList(params) {
  return request({
    url: '/clientRecord/page',
    method: 'GET',
    params
  })
}

export function userRecordDesc(params) {
  return request({
    url: '/userRecord/desc',
    method: 'GET',
    params
  })
}
// export function createAddr(data) {
//   return request({
//     url: '/admin/sysArea/create',
//     method: 'POST',
//     data
//   })
// }

// export function updateAddr(params) {
//   return request({
//     url: '/admin/sysArea/update',
//     method: 'PUT',
//     params
//   })
// }

// export function delRowAddr(params) {
//   return request({
//     url: '/admin/sysArea/delete',
//     method: 'DELETE',
//     params
//   })
// }
