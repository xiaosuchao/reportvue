import request from '@/utils/request'

export function roleList(params) {
  return request({
    url: '/admin/sysRole/select',
    method: 'get',
    params
  })
}

export function roleOne(params) {
  return request({
    url: '/admin/sysRole/selectOne',
    method: 'get',
    params
  })
}

export function roleAdd(data) {
  return request({
    url: '/admin/sysRole/create',
    method: 'POST',
    data
  })
}

export function roleUpdate(params) {
  return request({
    url: '/admin/sysRole/update',
    method: 'put',
    params
  })
}

export function roleDel(params) {
  return request({
    url: '/admin/sysRole/delete',
    method: 'delete',
    params
  })
}

export function roleGetMenu(params) {
  return request({
    url: '/admin/roleMenu/select',
    method: 'get',
    params
  })
}
export function roleGetTree(params) {
  return request({
    url: '/admin/roleMenu/selectTree',
    method: 'get',
    params
  })
}

export function roleSetMenu(data) {
  return request({
    url: '/admin/roleMenu/create',
    method: 'post',
    data
  })
}

export function rolesByOrg(params) {
  return request({
    url: '/admin/sysRole/select',
    method: 'get',
    params
  })
}

export function rolesAndMenusManageByUser(params) {
  return request({
    url: '/admin/sysRole/selectMenus',
    method: 'get',
    params
  })
}

export function userRolesSet(data) {
  return request({
    url: '/admin/userRole/create',
    method: 'post',
    data
  })
}

export function userRolesList(params) {
  return request({
    url: '/admin/userRole/select',
    method: 'get',
    params
  })
}
