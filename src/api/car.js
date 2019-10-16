import request from '@/utils/request'

export function getCarInfo(params) {
  return request({
    url: '/unicorn/parking/querycount',
    method: 'get',
    params
  })
}
export function getCarStore(params) {
  return request({
    url: '/unicorn/parking/getCarStore',
    method: 'get',
    params
  })
}
export function incarExcel(params) {
  return request({
    url: '/unicorn/parking/incar/excel',
    method: 'get',
    params
  })
}
export function carInfoList(params) {
  return request({
    url: '/unicorn/parking/carInfoList',
    method: 'get',
    params
  })
}
export function queoneCar(params) {
  return request({
    url: '/unicorn/parking/queoneCar',
    method: 'get',
    params
  })
}
export function colorinfo(params) {
  return request({
    url: '/unicorn/parking/colorinfo',
    method: 'get',
    params
  })
}
export function brandinfo(params) {
  return request({
    url: '/unicorn/parking/brandinfo',
    method: 'get',
    params
  })
}
export function typeinfo(params) {
  return request({
    url: '/unicorn/parking/typeinfo',
    method: 'get',
    params
  })
}
export function modelinfo(params) {
  return request({
    url: '/unicorn/parking/modelinfo',
    method: 'get',
    params
  })
}
export function oneCar(params) {
  return request({
    url: '/unicorn/parking/oneCar',
    method: 'get',
    params
  })
}
export function updateone(data) {
  return request({
    url: '/unicorn/parking/updateone',
    method: 'post',
    data
  })
}
export function updatequickBrand(data) {
  return request({
    url: '/unicorn/parking/updatequick/brand',
    method: 'post',
    data
  })
}
export function manualentry(data) {
  return request({
    url: '/unicorn/parking/manualentry',
    method: 'post',
    data
  })
}
export function setstayout(data) {
  return request({
    url: '/unicorn/parking/manualappearan/all',
    method: 'POST',
    data
  })
}
export function handOut(data) {
  return request({
    url: '/unicorn/parking/manualappearan/user',
    method: 'post',
    data
  })
}
export function leaveOne(data) {
  return request({
    url: '/unicorn/parking/manualForce/one',
    method: 'post',
    data
  })
}
export function handLeave(data) {
  return request({
    url: '/unicorn/parking/manualForce/platenum',
    method: 'post',
    data
  })
}
export function aouthRevoke(params) {
  return request({
    url: '/unicorn/parking/aouthRevoke',
    method: 'post',
    params
  })
}
export function forcestartwork(data) {
  return request({
    url: '/unicorn/parking/forcestartwork',
    method: 'post',
    data
  })
}
export function financialrevoke(params) {
  return request({
    url: '/unicorn/parking/financialrevoke',
    method: 'get',
    params
  })
}
export function authocurrent(params) {
  return request({
    url: '/unicorn/parking/authocurrent',
    method: 'get',
    params
  })
}
export function innercarList(params) {
  return request({
    url: '/unicorn/innercar/queryall',
    method: 'get',
    params
  })
}
export function addinner(params) {
  return request({
    url: '/unicorn/innercar/addinner',
    method: 'post',
    params
  })
}
export function queryone(params) {
  return request({
    url: '/unicorn/innercar/queryone',
    method: 'get',
    params
  })
}
export function update(params) {
  return request({
    url: '/unicorn/innercar/update',
    method: 'post',
    params
  })
}
export function deleteIns(params) {
  return request({
    url: '/unicorn/innercar/delete',
    method: 'post',
    params
  })
}
export function testEntryrecord(params) {
  return request({
    url: '/unicorn/parking/testdriver/entryrecord',
    method: 'get',
    params
  })
}
export function testdriver(params) {
  return request({
    url: '/unicorn/parking/testdriver',
    method: 'get',
    params
  })
}
export function authorization(params) {
  return request({
    url: '/authorization/info',
    method: 'post',
    params
  })
}
export function financial(params) {
  return request({
    url: '/unicorn/parking/financial',
    method: 'get',
    params
  })
}
export function queryshopfilter(params) {
  return request({
    url: '/unicorn/parking/queryshopfilter',
    method: 'get',
    params
  })
}
export function onecurrent(params) {
  return request({
    url: '/unicorn/parking/onecurrent',
    method: 'get',
    params
  })
}
export function saleapproval(data) {
  return request({
    url: '/unicorn/parking/saleapproval',
    method: 'post',
    data
  })
}

export function setOrder(data) {
  return request({
    url: '/unicorn/parking/startwork',
    method: 'post',
    data
  })
}
export function updateStartwork(data) {
  return request({
    url: '/unicorn/parking/update/startwork',
    method: 'post',
    data
  })
}

export function saleApproval(data) {
  return request({
    url: '/unicorn/parking/saleapproval',
    method: 'post',
    data
  })
}
export function shopoutautho(params) {
  return request({
    url: '/unicorn/shopoutautho/query',
    method: 'get',
    params
  })
}
export function setShopoutautho(data) {
  return request({
    url: '/unicorn/shopoutautho/update',
    method: 'post',
    data
  })
}
export function removkeDriver(data) {
  return request({
    url: '/unicorn/parking/revoke/trialdriver',
    method: 'post',
    data
  })
}
export function testQuery(params) {
  return request({
    url: '/unicorn/testdriver/query',
    method: 'get',
    params
  })
}
export function startwork(params) {
  return request({
    url: '/unicorn/innercar/startwork',
    method: 'post',
    params
  })
}
export function reject(params) {
  return request({
    url: '/unicorn/innercar/startwork/reject',
    method: 'post',
    params
  })
}
export function fplatenum(params) {
  return request({
    url: '/unicorn/innercar/fplatenum',
    method: 'get',
    params
  })
}
export function InaouthRevoke(data) {
  return request({
    url: '/unicorn/innercar/aouthRevoke',
    method: 'post',
    data
  })
}
export function operation(params) {
  return request({
    url: '/unicorn/parking/testdriver/operation',
    method: 'get',
    params
  })
}

export function tdrcurrent(data) {
  return request({
    url: '/unicorn/innercar/tdrcurrent',
    method: 'post',
    data
  })
}
export function querystar(params) {
  return request({
    url: '/unicorn/innercar/querystar',
    method: 'get',
    params
  })
}
export function delstartwork(params) {
  return request({
    url: '/unicorn/innercar/delstartwork',
    method: 'post',
    params
  })
}
export function removkeStartwork(data) {
  return request({
    url: '/unicorn/parking/revoke/startwork',
    method: 'post',
    data
  })
}
export function trialdrivers(data) {
  return request({
    url: '/unicorn/parking/startwork/trialdriver',
    method: 'post',
    data
  })
}

export function letter(params) {
  return request({
    url: '/unicorn/parking/cardatalist/letter',
    method: 'get',
    params
  })
}

export function byletter(params) {
  return request({
    url: '/unicorn/parking/cardatalist/byletter',
    method: 'get',
    params
  })
}

export function bookingCustomerSelectPage(params) {
  return request({
    url: '/unicorn/parking/bookingCustomerSelectPage',
    method: 'GET',
    params
  })
}
export function bookingCustomerCreate(params) {
  return request({
    url: '/unicorn/parking/bookingCustomerCreate',
    method: 'POST',
    params
  })
}

export function bookingCustomerDelete(params) {
  return request({
    url: '/unicorn/parking/bookingCustomerDelete',
    method: 'DELETE',
    params
  })
}

export function bookingCustomerSelectOne(params) {
  return request({
    url: '/unicorn/parking/bookingCustomerSelectOne',
    method: 'GET',
    params
  })
}

export function bookingCustomerUpdate(params) {
  return request({
    url: '/unicorn/parking/bookingCustomerUpdate',
    method: 'PUT',
    params
  })
}
// 进出场车辆查询
export function entryrecord(params) {
  return request({
    url: '/unicorn/parking/innercar/entryrecord',
    method: 'get',
    params
  })
}
// led展示管理页面
export function orgtmplidxList(params) {
  return request({
    url: '/unicorn/parking/orgtmplidx/list',
    method: 'get',
    params
  })
}

export function orgtmplidxsynchro(params) {
  return request({
    url: '/unicorn/parking/orgtmplidx/synchro',
    method: 'post',
    params
  })
}

export function orgtmplidxAdd(params) {
  return request({
    url: '/unicorn/parking/orgtmplidx/add',
    method: 'post',
    params
  })
}

export function orgtmplidxDel(params) {
  return request({
    url: '/unicorn/parking/orgtmplidx/del',
    method: 'post',
    params
  })
}
export function orgtmplidxUpdate(params) {
  return request({
    url: '/unicorn/parking/orgtmplidx/update',
    method: 'post',
    params
  })
}

export function getOrgTree(params) {
  return request({
    url: '/admin/overall/selectOrgTree',
    method: 'get',
    params
  })
}

export function shopoutauthoReset(params) {
  return request({
    url: '/unicorn/shopoutautho/reset',
    method: 'post',
    params
  })
}

export function OssImg(params) {
  return request({
    url: '/oss/img',
    method: 'GET',
    params
  })
}

// 获取顶级组织的品牌
export function authoBrand(params) {
  return request({
    url: '/unicorn/parking/autho/brand',
    method: 'GET',
    params
  })
}

export function batchcleanOut(data) {
  return request({
    url: '/unicorn/parking/batchclean/out',
    method: 'POST',
    data
  })
}
