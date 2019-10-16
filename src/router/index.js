import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [{
  path: '/login',
  component: () => import('@/views/login/index'),
  hidden: true
},
{
  path: '/404',
  component: () => import('@/views/404'),
  hidden: true
},
{
  path: '/',
  component: Layout,
  redirect: '/dashboard',
  name: '管理中心',
  hidden: true,
  children: [{
    path: 'dashboard',
    component: () => import('@/views/dashboard/index')
  }]
},
{
  path: '/editInfo',
  component: Layout,
  redirect: '/editInfo',
  name: '修改资料',
  hidden: true,
  children: [{
    path: '/editInfo',
    component: () => import('@/views/users/editUser')
  }]
},
{
  path: '/downloadApp',
  component: () => import('@/views/users/downloadApp'),
  hidden: true
}, {
  path: '/appTest',
  component: () => import('@/views/users/appTest'),
  hidden: true
  // redirect: '/appTest'
  // name: '修改资料',
}

]

export const masterRouterMap = [{
  path: '/agency',
  // component: Layout,
  component: () => import('@/views/gate'),
  redirect: '/agency/list',
  alwaysShow: true,
  name: 'agencyindex',
  meta: {
    title: '企业/单位管理',
    icon: 'tree',
    permisscode: 'agencyindex'
  },
  children: [{
    path: '/agency/gate',
    // component: () => import('@/views/gate'), // Parent router-view
    component: Layout,
    name: 'agencygateindex',
    alwaysShow: true,
    meta: {
      title: '企业/单位管理',
      icon: 'table',
      permisscode: 'agencygateindex'
    },
    redirect: '/agency/list',
    children: [{
      path: 'list',
      alwaysShow: true,
      component: () => import('@/views/agency/list'),
      name: 'agencylist',
      meta: {
        title: '企业/单位列表',
        icon: 'table',
        permisscode: 'agencylist'
      }
    },
    {
      path: 'appk',
      alwaysShow: true,
      component: () => import('@/views/agency/appk'),
      name: 'agencyAppk',
      meta: {
        title: '企业APPK管理',
        icon: 'table',
        permisscode: 'agencyAppk'
      }
    },
    {
      path: 'appversion',
      alwaysShow: true,
      component: () => import('@/views/agency/appversion'),
      name: 'agencyAppversion',
      meta: {
        title: 'APP版本管理',
        icon: 'table',
        permisscode: 'agencyAppversion'
      }
    }
    ]
  }]
},
{
  path: '/addrs',
  // component: Layout,
  component: () => import('@/views/gate'),
  redirect: '/addrs/list',
  alwaysShow: true,
  name: 'addrsindex',
  meta: {
    title: '位置管理',
    icon: 'guide',
    permisscode: 'addrsindex'
  },
  children: [{
    path: '/addrs/gate',
    // component: () => import('@/views/gate'), // Parent router-view
    component: Layout,
    name: 'addrsgateindex',
    alwaysShow: true,
    meta: {
      title: '位置管理',
      icon: 'table',
      permisscode: 'addrsgateindex'
    },
    redirect: '/addrs/set',
    children: [{
      path: 'set',
      alwaysShow: true,
      component: () => import('@/views/addrs/set'),
      name: 'addrsset',
      meta: {
        title: '位置编辑',
        icon: 'table',
        permisscode: 'addrsset'
      }
    }]
  }]
}
]

export const asyncRouterMap = [{
  path: '/visual',
  component: Layout,
  // component: () => import('@/views/gate'),
  redirect: '/visual/hq',
  alwaysShow: true,
  name: 'visualnode',
  meta: {
    title: '数据统计',
    icon: 'example',
    permisscode: 'visualnode'
  },
  children: [{
    path: '/visual/hq',
    // component: () => import('@/views/visual/components/char_today_cover'),
    component: () => import('@/views/visual/index'),
    // component: Layout,
    name: 'visualindex',
    alwaysShow: true,
    meta: {
      title: '数据统计',
      icon: 'table',
      permisscode: 'visualindex'
    }
    // children: [
    //   {
    //     path: 'comp',
    //     alwaysShow: true,
    //     component: () => import('@/views/visual/components/drawcharts'),
    //     name: 'visualhqwhole', // 实验路由
    //     meta: { title: '门店客流', icon: 'table', permisscode: 'visualhqwhole' }
    //   }
    // ]
  }
    // {
    //   path: '/visual/store',
    //   // component: () => import('@/views/gate'), // Parent router-view
    //   component: Layout,
    //   name: 'visualstoreindex',
    //   alwaysShow: true,
    //   meta: { title: '门店客流', icon: 'table', permisscode: 'visualstoreindex' },
    //   // redirect: '/visual/store/whole',
    //   children: [
    //     {
    //       path: 'whole',
    //       alwaysShow: true,
    //       component: () => import('@/views/visual/store/whole'),
    //       name: 'visualstorewhole',
    //       meta: { title: '概览', icon: 'table', permisscode: 'visualstorewhole' }
    //     },
    //     {
    //       path: 'flow',
    //       alwaysShow: true,
    //       component: () => import('@/views/visual/store/flow'),
    //       name: 'visualstoreflow',
    //       meta: { title: '客流分析', icon: 'table', permisscode: 'visualstoreflow' }
    //     }
    //   ]
    // }
  ]
},
{
  path: '/operation',
  component: Layout,
  // component: () => import('@/views/gate'),
  redirect: '/operation/hq',
  alwaysShow: true,
  name: 'operationindex',
  meta: {
    title: '业务运营',
    icon: 'nested',
    permisscode: 'operationindex'
  },
  children: [{
    path: '/operation/park',
    // component: Layout,
    component: () => import('@/views/gate'),
    name: 'operationparkindex',
    alwaysShow: true,
    meta: {
      title: '智能停车',
      icon: 'table',
      permisscode: 'operationparkindex'
    },
    redirect: '/operation/park/cars',
    children: [{
      path: 'cars',
      alwaysShow: true,
      component: () => import('@/views/operation/park/cars'),
      name: 'operationparkcars',
      meta: {
        title: '进场车辆管理',
        icon: 'table',
        permisscode: 'operationparkcarsVO'
      }
    },
    {
      path: 'Innercar',
      alwaysShow: true,
      component: () => import('@/views/operation/park/Innercar'),
      name: 'operationparkInnercar',
      meta: {
        title: '内部车辆管理',
        icon: 'table',
        permisscode: 'operationparkInnercarVO'
      }
    },
    {
      path: 'tryCar',
      alwaysShow: true,
      component: () => import('@/views/operation/park/tryCar'),
      name: 'operationparktryCar',
      meta: {
        title: '试驾车辆管理',
        icon: 'table',
        permisscode: 'operationparktryCarVO'
      }
    },
    {
      path: 'orderInfo',
      alwaysShow: true,
      component: () => import('@/views/operation/park/orderinfo'),
      name: 'operationparkorderInfo',
      meta: {
        title: '预约信息管理',
        icon: 'table',
        permisscode: 'operationparkorderInfoVO'
      }
    },
    {
      path: 'ledShow',
      alwaysShow: true,
      component: () => import('@/views/operation/park/ledShow'),
      name: 'operationparkledShow',
      meta: {
        title: 'LED展示管理',
        icon: 'table',
        permisscode: 'operationparkledShowVO'
      }
    },
    {
      path: 'usedCar',
      alwaysShow: true,
      component: () => import('@/views/operation/park/usedCar'),
      name: 'operationUsedCar', // 实验路由
      meta: { title: '二手车价格管理', icon: 'table', permisscode: 'operationUsedCar' }
    },
    {
      path: 'RenewalInfo',
      alwaysShow: true,
      component: () => import('@/views/operation/park/RenewalInfo'),
      name: 'operationRenewalInfo', // 实验路由
      meta: { title: '续保信息管理', icon: 'table', permisscode: 'operationRenewalInfo' }
    },
    {
      path: 'carStoreSet',
      alwaysShow: true,
      component: () => import('@/views/operation/park/carStoreSet'),
      name: 'operationparkStoreSet',
      meta: {
        title: '店铺功能设置',
        icon: 'table',
        permisscode: 'operationparkStoreSet'
      }
    }
    ]
  },
  {
    path: '/operation/dataEdit',
    alwaysShow: true,
    // component: Layout,
    component: () => import('@/views/gate'),
    redirect: '/operation/edit',
    name: 'operationchartData',
    meta: {
      title: '图表展示',
      icon: 'table',
      permisscode: 'operationchartData'
    },
    children: [{
      path: '/operation/dataedit',
      alwaysShow: true,
      component: () => import('@/views/operation/dataEdit/index'),
      name: 'operationchartEdit',
      meta: {
        title: '仪表盘编辑',
        icon: 'table',
        permisscode: 'operationchartEdit'
      }
    }]
  },
  {
    path: '/operation/face',
    // component: Layout,
    component: () => import('@/views/gate'),
    name: 'operationfaceindex',
    alwaysShow: true,
    meta: {
      title: '千人千面',
      icon: 'table',
      permisscode: 'operationfaceindex'
    },
    redirect: '/operation/face/userrecord',
    children: [{
      path: 'faceset',
      alwaysShow: true,
      component: () => import('@/views/operation/face/faceset'),
      name: 'operationfacefaceset',
      meta: {
        title: 'faceset管理',
        icon: 'table',
        permisscode: 'operationfacefaceset'
      }
    },
    {
      path: 'facesbyfaceset',
      hidden: true,
      component: () => import('@/views/operation/face/facesbyfaceset'),
      name: 'operationfacefacesbyfaceset',
      meta: {
        title: 'face列表',
        icon: 'table',
        permisscode: 'operationfacefacesbyfaceset'
      }
    },

    {
      path: 'userrecord',
      alwaysShow: true,
      component: () => import('@/views/operation/face/userrecord'),
      name: 'operationuserrecord',
      meta: {
        title: '客户到访记录',
        icon: 'table',
        permisscode: 'operationuserrecord'
      }
    },
    {
      path: 'useronerecords',
      hidden: true,
      component: () => import('@/views/operation/face/useronerecords'),
      name: 'operationuseronerecords',
      meta: {
        title: '客户到访详情',
        icon: 'table',
        permisscode: 'operationuseronerecords'
      }
    },
    {
      path: 'clientrecord',
      alwaysShow: true,
      component: () => import('@/views/operation/face/clientrecord'),
      name: 'operationfaceclientrecord',
      meta: {
        title: '客户端请求记录',
        icon: 'table',
        permisscode: 'operationfaceclientrecord'
      }
    },
    {
      path: 'clientversion',
      alwaysShow: true,
      component: () => import('@/views/operation/face/clientversion'),
      name: 'operationfaceclientversion',
      meta: {
        title: '客户端版本管理',
        icon: 'table',
        permisscode: 'operationfaceclientversion'
      }
    }
    ]
  },
  {
    path: '/operation/plane',
    alwaysShow: true,
    component: () => import('@/views/operation/plane/index'),
    name: 'operationPlane',
    meta: {
      title: '平面图管理',
      permisscode: 'operationPlane'
    }
  }
  ]
},
{
  path: '/device',
  component: Layout,
  redirect: '/device/index',
  alwaysShow: true,
  name: 'deviceindex',
  meta: {
    title: '设备管理',
    icon: 'dashboard',
    permisscode: 'deviceindex'
  },
  children: [{
    path: '/device/index',
    component: () => import('@/views/device/index'),
    name: 'deviceface',
    alwaysShow: true,
    meta: {
      title: '设备管理',
      icon: 'table',
      permisscode: 'devicegateindex'
    }
  }]
},
{
  path: '/ucenter',
  // component: Layout,
  component: () => import('@/views/gate'),
  redirect: '/ucenter/gate',
  alwaysShow: true,
  name: 'ucenterindex',
  meta: {
    title: '用户管理',
    icon: 'user',
    permisscode: 'ucenterindex'
  },
  children: [{
    path: '/ucenter/gate',
    component: Layout,
    // component: () => import('@/views/ucenter/org/index'),
    name: 'ucenterorggate',
    alwaysShow: true,
    meta: {
      title: '机构和用户',
      icon: 'table',
      permisscode: 'ucenterorggate'
    },
    redirect: '/ucenter/gate/org',
    children: [{
      path: 'org',
      alwaysShow: true,
      component: () => import('@/views/ucenter/org/index'),
      name: 'ucenterorg',
      meta: {
        title: '组织机构',
        icon: 'table',
        permisscode: 'ucenterorg'
      }
    },
    {
      path: 'users',
      alwaysShow: true,
      component: () => import('@/views/ucenter/users/index'),
      name: 'ucenterusers',
      meta: {
        title: '用户管理',
        icon: 'table',
        permisscode: 'ucenteusers'
      }
    },
    {
      path: 'roles',
      alwaysShow: true,
      component: () => import('@/views/ucenter/users/roles'),
      name: 'ucenterroles',
      meta: {
        title: '角色管理',
        icon: 'table',
        permisscode: 'ucenterroles'
      }
    }
    ]
  }]
},
{
  path: '/agency',
  // component: Layout,
  component: () => import('@/views/gate'),
  redirect: '/agency/list',
  alwaysShow: true,
  name: 'agencyindex',
  meta: {
    title: '企业/单位管理',
    icon: 'tree',
    permisscode: 'agencyindex'
  },
  children: [{
    path: '/agency/gate',
    // component: () => import('@/views/gate'), // Parent router-view
    component: Layout,
    name: 'agencygateindex',
    alwaysShow: true,
    meta: {
      title: '企业/单位管理',
      icon: 'table',
      permisscode: 'agencygateindex'
    },
    redirect: '/agency/list',
    children: [{
      path: 'list',
      alwaysShow: true,
      component: () => import('@/views/agency/list'),
      name: 'agencylist',
      meta: {
        title: '企业/单位列表',
        icon: 'table',
        permisscode: 'agencylist'
      }
    },
    {
      path: 'appk',
      alwaysShow: true,
      component: () => import('@/views/agency/appk'),
      name: 'agencyAppk',
      meta: {
        title: '企业APPK管理',
        icon: 'table',
        permisscode: 'agencyAppk'
      }
    }
    ]
  }]
},
{
  path: '/addrs',
  component: Layout,
  // redirect: '/addrs/set',
  alwaysShow: true,
  name: 'addrsindex',
  meta: {
    title: '位置管理',
    permisscode: 'addrsindex'
  },
  children: [{
    path: 'set',
    alwaysShow: true,
    component: () => import('@/views/addrs/set'),
    name: 'addrsset',
    meta: {
      title: '位置管理',
      permisscode: 'addrsset'
    }
  }]
},

{
  path: '*',
  redirect: '/404',
  hidden: true
}
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRouterMap
})
