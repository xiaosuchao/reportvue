import { asyncRouterMap, constantRouterMap, masterRouterMap } from '@/router'
import { codestocodes } from '@/api/users'

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param codes
 * @param route
 */
// function hasPermission(codes, route) {
//   if (route.meta && route.meta.permisscode) {
//     return codes.some(code => code === route.meta.permisscode)
//   } else {
//     return true
//   }
// }

// /**
//  * 递归过滤异步路由表，返回符合用户角色权限的路由表
//  * @param routes asyncRouterMap
//  * @param roles
//  */
// function filterAsyncRouter(routes, codes) {
//   const res = []
//   routes.forEach(route => {
//     const tmp = { ...route }
//     if ((route.meta && codes.indexOf(route.meta.permisscode) > -1) || (tmp.children && jugeCodesToCodes(codes, getCodesFromRoute(route.children)))) {
//       if (tmp.children) {
//         tmp.children = filterAsyncRouter(tmp.children, codes)
//       }
//       res.push(tmp)
//     }
//   })

//   return res
// }

// function jugeCodesToCodes(scodes, rcodes) {
//   // console.log(scodes, rcodes)
//   return rcodes.reduce((prev, cur) => { return prev || scodes.indexOf(cur) > -1 }, false)
// }

// function getCodesFromRoute(routes, res) {
//   res = res || []
//   routes.forEach(route => {
//     const tmp = { ...route }
//     if (tmp.meta && tmp.meta.permisscode) {
//       if (tmp.children) {
//         getCodesFromRoute(tmp.children, res)
//       }
//       res.push(tmp.meta.permisscode)
//     }
//   })

//   return res
// }

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param routes asyncRouterMap
 * @param roles
 */
function filterAsyncRouter(routes, codes) {
  const res = []
  routes.forEach(route => {
    const tmp = { ...route }
    if ((route.meta && codes.includes(route.meta.permisscode))) {
      if (tmp.children) {
        tmp.children = filterAsyncRouter(tmp.children, codes)
      }
      res.push(tmp)
    }
  })

  return res
}

// 根据sysmenu组codes
function getCodesFromSysMenu(routes, res) {
  res = res || []
  routes.forEach(route => {
    const tmp = { ...route }
    if (tmp.menuCode) {
      if (tmp.children) {
        getCodesFromSysMenu(tmp.children, res)
      }
      res.push(tmp.menuCode)
    }
  })

  return res
}

// 根据路由组codes
function getCodesFromRoutes(routes, res) {
  res = res || []
  routes.forEach(route => {
    const tmp = { ...route }
    if (route.meta) {
      if (tmp.children) {
        getCodesFromRoutes(tmp.children, res)
      }
      res.push(tmp.meta.permisscode)
    }
  })
  return res
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: [],
    activeTopMenu: '',
    topRouters: [],
    menucodes: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      // state.routers = constantRouterMap.concat(routers)
      state.routers = routers
    },
    SET_TOPROUTERS: (state, routers) => {
      state.topRouters = routers
    },
    SET_TOPACTIVE: (state, v) => {
      state.activeTopMenu = v
    },
    SET_MENUCODES: (state, v) => {
      state.menucodes = v
    }

  },
  actions: {
    SET_TOPACTIVE({ commit }, data) {
      commit('SET_TOPACTIVE', data)
    },
    // GenerateRoutes({ state, commit }, data) {
    //   return new Promise(resolve => {
    //     const codes = getCodesFromSysMenu(data.sysMenus)
    //     // console.log('codes', codes)
    //     commit('SET_MENUCODES', codes)
    //     let accessedRouters = filterAsyncRouter(asyncRouterMap, codes)
    //     if (data.userManage === 1) {
    //       accessedRouters = masterRouterMap
    //     }

    //     // const topRouters = accessedRouters.filter(v => { return v.name })
    //     // const sideRouters = accessedRouters.filter(v => { return v.children && v.children.length }).map(v => { return v.children })
    //     // const sideRouters = topRouters.reduce((prev, cur) => { return cur.children.concat(prev) }, [])
    //     // if (roles.includes('admin')) {
    //     // accessedRouters = asyncRouterMap
    //     // } else {
    //     // accessedRouters = filterAsyncRouter(asyncRouterMap, roles)
    //     // }
    //     // accessedRouters = asyncRouterMap
    //     commit('SET_ROUTERS', accessedRouters)
    //     commit('SET_TOPROUTERS', accessedRouters)
    //     resolve()
    //   })
    // }
    GenerateRoutes({ state, commit }, data) {
      return new Promise(resolve => {
        const routecodes = getCodesFromRoutes(asyncRouterMap)
        let accessedRouters
        if (data.userManage === 1) {
          accessedRouters = masterRouterMap
          commit('SET_ROUTERS', accessedRouters)
          commit('SET_TOPROUTERS', accessedRouters)

          const allcodes = getCodesFromSysMenu(data.sysMenus)
          commit('SET_MENUCODES', allcodes)

          resolve()
        } else {
          codestocodes({ code: routecodes.join(',') }).then(res => {
            const arroutesown = res.data
            if (arroutesown.includes('visualindex') && !arroutesown.includes('visualnode')) { arroutesown.push('visualnode') }
            if (arroutesown.includes('addrsindex') && !arroutesown.includes('addrsset')) { arroutesown.push('addrsset') }
            if (process.env.NODE_ENV === 'development' && !arroutesown.includes('operationPlane')) { arroutesown.push('operationPlane') }

            // console.log('codes', codes)
            const allcodes = getCodesFromSysMenu(data.sysMenus)
            commit('SET_MENUCODES', allcodes)
            const accessedRouters = filterAsyncRouter(asyncRouterMap, arroutesown)

            // const topRouters = accessedRouters.filter(v => { return v.name })
            // const sideRouters = accessedRouters.filter(v => { return v.children && v.children.length }).map(v => { return v.children })
            // const sideRouters = topRouters.reduce((prev, cur) => { return cur.children.concat(prev) }, [])
            // if (roles.includes('admin')) {
            // accessedRouters = asyncRouterMap
            // } else {
            // accessedRouters = filterAsyncRouter(asyncRouterMap, roles)
            // }
            // accessedRouters = asyncRouterMap
            commit('SET_ROUTERS', accessedRouters)
            commit('SET_TOPROUTERS', accessedRouters)
            resolve()
          })
        }
      })
    }
  }
}

export default permission
