import axios from 'axios'
import { Message, MessageBox, Loading } from 'element-ui'
import store from '../store'
import { getToken } from '@/utils/auth'
import qs from 'qs'

// 创建axios实例

const service = axios.create({
  baseURL: process.env.BASE_API, // api 的 base_url
  timeout: 60000 // 请求超时时间
})
let loadingRequest = {}
// request拦截器
service.interceptors.request.use(
  config => {
    const nobg = 0 || (config.params ? config.params.nobg : 0) || (config.data ? config.data.nobg : 0)
    loadingRequest = Loading.service({ background: nobg ? 'rgba(0, 0, 0, 0)' : 'rgba(255, 255, 255, 0.2)' })

    if (store.getters.token) {
      config.headers['token'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
      config.headers['Authorization'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    config.headers['RequestId'] = Math.floor((Math.random() * 9 + 1) * 10000000)

    if (config.data && Object.prototype.toString.call(config.data) === '[object FormData]') {
      return config
    }

    if (config.method === 'post') {
      config.headers['content-type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
      if (process.env.BASE_API !== '') {
        config.data = qs.stringify(config.data)
      }
    }

    return config
  },
  error => {
    loadingRequest.close()
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  response => {
    loadingRequest.close()
    /**
     * code为非20000是抛错 可结合自己业务进行修改
     */
    const res = response.data
    if (res.code !== 0) {
      let msgtxt = res.msg
      if (res.code === 500) {
        msgtxt = '网络错误，请稍后重试'
      }

      if (res.code !== 5) {
        Message({
          message: msgtxt,
          type: 'error',
          duration: 2 * 1000
        })
      }

      // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
      if (res.code === 401 || res.code === 403 || res.code === 50012 || res.code === 50014) {
        MessageBox.confirm(
          '您的登录状态已过期，请重新登录',
          '确定',
          {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          store.dispatch('FedLogOut').then(() => {
            location.reload() // 为了重新实例化vue-router对象 避免bug
          })
        })
      }
      return Promise.reject(res)
    } else {
      return response.data
    }
  },
  error => {
    let msgtxt = error.msg || error.message || '网络异常，请稍后重试'
    if (error.toString().indexOf('timeout') > -1 || error.message.indexOf('timeout') > -1) {
      msgtxt = '网络异常，请稍后重试'
    }
    console.log('msgtxt:', msgtxt)
    Message({
      message: msgtxt,
      type: 'error',
      duration: 2 * 1000
    })
    loadingRequest.close()
    return Promise.reject(error)
  }
)

export default service
