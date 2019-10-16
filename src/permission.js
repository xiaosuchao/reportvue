import router from './router'
import store from './store'
import {
  Message
} from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import {
  getToken
} from '@/utils/auth'
import Cookies from 'js-cookie'

NProgress.configure({
  showSpinner: false
})

const whiteList = ['/login', '/downloadApp', '/appTest']
// const whiteList = ['/login', 'dashboard']

function getFirstSubRouteName(arRoute) {
  return (arRoute[0].children && arRoute[0].children.length) ? getFirstSubRouteName(arRoute[0].children) : arRoute[0].name
}

router.beforeEach((to, from, next) => {
  NProgress.start()
  if (getToken()) {
    if (to.path === '/login') {
      next({
        path: '/'
      })
      NProgress.done()
    } else {
      if (store.getters.permission_codes.length === 0) {
        store.dispatch('GetInfo').then(res => {
          store.dispatch('GenerateRoutes', res.data).then(() => {
            router.addRoutes(store.getters.addRouters)
            // console.log(store.getters.addRouters)
            if (Cookies.get('loadfirstRoute') && Cookies.get('loadfirstRoute') === '1' && store.getters.addRouters && store.getters.addRouters.length) {
              next({
                name: getFirstSubRouteName(store.getters.addRouters),
                replace: true
              })
              Cookies.set('loadfirstRoute', '')
            } else {
              next({
                ...to,
                replace: true
              })
            }
          })
          if (res.data.userManage !== 1) {
            store.dispatch('selectOrgTree')
          }
        }).catch((err) => {
          store.dispatch('FedLogOut').then(() => {
            Message.error(err || 'Verification failed, please login again')
            next({
              path: '/'
            })
          })
        })
        if (window.localStorage.chartloc) { store.dispatch('setChartLoc', JSON.parse(window.localStorage.chartloc)) }
      } else {
        next()
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
