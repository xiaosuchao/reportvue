import request from '@/utils/request'

export function carInsuranceSelect(params) {
  return request({
    url: '/unicorn/parking/carInsuranceSelect',
    method: 'get',
    params
  })
}
export function carInsuranceCreate(data) {
  return request({
    url: 'unicorn/parking/carInsuranceCreate',
    method: 'post',
    data
  })
}

export function carInsuranceDelete(params) {
  return request({
    url: '/unicorn/parking/carInsuranceDelete',
    method: 'DELETE',
    params
  })
}

export function carInsuranceUpdate(params) {
  return request({
    url: '/unicorn/parking/carInsuranceUpdate',
    method: 'PUT',
    params
  })
}

export function carInsurancerepetition(params) {
  return request({
    url: '/unicorn/parking/carInsurance/repetition',
    method: 'GET',
    params
  })
}

