import request from '@/utils/request'

// 探针页面设备状态、设备类型、厂商的接口
export function devtypeList(params) {
  return request({
    url: '/device/getEnum',
    method: 'GET',
    params
  })
}

// AP、PC、PAD、摄像头四个Tab页面的厂商字段接口
export function deviceManufacturer(params) {
  return request({
    url: '/device/manufacturer/list',
    method: 'GET',
    params
  })
}

// 探针页面接口
export function deviceList(params) {
  return request({
    url: '/device/page',
    method: 'GET',
    params
  })
}

export function deviceAdd(data) {
  return request({
    url: '/device/add',
    method: 'POST',
    data
  })
}

export function deviceDelete(data) {
  return request({
    url: '/device/delete',
    method: 'post',
    data
  })
}

export function deviceUpate(data) {
  return request({
    url: '/device/update',
    method: 'POST',
    data
  })
}

export function deviceBatchDownload(data) {
  return request({
    url: '/device/batchDownload',
    method: 'post',
    data
  })
}

export function deviceBatchDelete(params) {
  return request({
    url: '/device/batchDelete',
    method: 'delete',
    params
  })
}

export function batchDownload(data) {
  return request({
    url: '/device/batchDownload',
    method: 'POST',
    data
  })
}

// APap开始
export function apList(params) {
  return request({
    url: '/device/ap/page',
    method: 'GET',
    params
  })
}

export function apFreshStation(data) {
  return request({
    url: '/device/ap/getDeviceData',
    method: 'POST',
    data
  })
}

export function apDetail(params) {
  return request({
    url: '/device/ap/getInfoById',
    method: 'GET',
    params
  })
}

// PADpad开始
export function padList(params) {
  return request({
    url: '/device/pad/page',
    method: 'GET',
    params
  })
}

export function padAdd(data) {
  return request({
    url: '/device/pad/create',
    method: 'POST',
    data
  })
}

export function padDelete(params) {
  return request({
    url: '/device/pad/delete',
    method: 'DELETE',
    params
  })
}

export function padUpdate(params) {
  return request({
    url: '/device/pad/update',
    method: 'PUT',
    params
  })
}

// PCpc开始
export function pcList(params) {
  return request({
    url: '/device/pc/page',
    method: 'GET',
    params
  })
}

export function pcAdd(data) {
  return request({
    url: '/device/pc/create',
    method: 'POST',
    data
  })
}

export function pcDelete(params) {
  return request({
    url: '/device/pc/delete',
    method: 'DELETE',
    params
  })
}

export function pcUpdate(params) {
  return request({
    url: '/device/pc/update',
    method: 'PUT',
    params
  })
}

// camera开始
export function cameraList(params) {
  return request({
    url: '/device/camera/page',
    method: 'GET',
    params
  })
}

export function cameraFreshStation(data) {
  return request({
    url: '/device/camera/getDeviceData',
    method: 'POST',
    data
  })
}

export function cameraDetail(params) {
  return request({
    url: '/device/camera/getInfoById',
    method: 'GET',
    params
  })
}

// Others开始
export function othersList(params) {
  return request({
    url: '/deviceOthers/page',
    method: 'GET',
    params
  })
}

export function othersEnum(params) {
  return request({
    url: '/deviceOthers/getEnum',
    method: 'GET',
    params
  })
}

export function othersAdd(data) {
  return request({
    url: '/deviceOthers/add',
    method: 'POST',
    data
  })
}

export function othersUpdate(data) {
  return request({
    url: '/deviceOthers/update',
    method: 'POST',
    data
  })
}

// pc和pad配置参数接口（共用）
export function pcpadParaConfig(data) {
  return request({
    url: '/device/configParam/create',
    method: 'POST',
    data
  })
}

// 道闸接口
export function barrierGateLlist(params) {
  return request({
    url: '/barrierGate/list',
    method: 'GET',
    params
  })
}

// 设备管理权限接口
export function authorization(params) {
  return request({
    url: '/authorization/info',
    method: 'post',
    params
  })
}

export function floorPlanList(params) {
  return request({
    url: '/storeFloorPlan/list',
    method: 'get',
    params
  })
}

export function floorPlanDel(params) {
  return request({
    url: '/storeFloorPlan/delete',
    method: 'post',
    params
  })
}

export function floorPlanUpload(params) {
  return request({
    url: '/storeFloorPlan/uploaderAndAdd',
    method: 'post',
    params
  })
}

export function screenList(params) {
  return request({
    url: '/screen/list',
    method: 'get',
    params
  })
}

export function screenAdd(params) {
  return request({
    url: '/screen/add',
    method: 'post',
    params
  })
}

export function screenDelete(data) {
  return request({
    url: '/screen/delete',
    method: 'post',
    data
  })
}

export function screenUpdate(data) {
  return request({
    url: '/screen/update',
    method: 'post',
    data
  })
}

export function viewLog(params) {
  return request({
    url: '/screen/log',
    method: 'get',
    params
  })
}

// 360页面
export function treesixzeroLlist(params) {
  return request({
    url: '/360/list',
    method: 'GET',
    params
  })
}

// 探针页面mac地址查重
export function deviceIsRepeat(params) {
  return request({
    url: '/device/isRepeat',
    method: 'GET',
    params
  })
}

// PC页面mac地址查重
export function devicePcIsRepeat(params) {
  return request({
    url: '/device/pc/isRepeat',
    method: 'GET',
    params
  })
}

// PAD页面mac地址查重
export function devicePadIsRepeat(params) {
  return request({
    url: '/device/pad/isRepeat',
    method: 'GET',
    params
  })
}

export function deviceNoRepeat(params) {
  return request({
    url: '/screen/device/repetition',
    method: 'GET',
    params
  })
}

// 探针在线统计信息
export function probeStaticsInfo(params) {
  return request({
    url: '/device/stat',
    method: 'GET',
    params
  })
}

// 千人千面小主机在线统计信息
export function pcStaticsInfo(params) {
  return request({
    url: '/device/pc/stat',
    method: 'GET',
    params
  })
}

