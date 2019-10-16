import request from '@/utils/request'

export function uploaderFile(params) {
  return request({
    url: '/uploader/file',
    method: 'post',
    params
  })
}

export function editCreate(data) {
  return request({
    url: '/admin/sysMenu/create',
    method: 'POST',
    data
  })
}

export function editDel(params) {
  return request({
    url: '/admin/sysMenu/delete',
    method: 'DELETE',
    params
  })
}

export function editUpdate(params) {
  return request({
    url: '/admin/sysMenu/update',
    method: 'PUT',
    params
  })
}

export function DownloadFile(params) {
  return request({
    url: '/uploader/download',
    method: 'GET',
    params
  })
}

// 数据统计->天气的备注信息
export function addOrUpdate(data) {
  return request({
    url: '/notice/addOrUpdate',
    method: 'POST',
    data
  })
}

export function getNotice(params) {
  return request({
    url: '/notice/get',
    method: 'GET',
    params
  })
}
