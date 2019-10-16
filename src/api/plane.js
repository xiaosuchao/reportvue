import request from '@/utils/request'

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

export function floorPlaneAdd(data) {
  return request({
    url: '/storeFloorPlan/addAndUpdate',
    method: 'post',
    data
  })
}

