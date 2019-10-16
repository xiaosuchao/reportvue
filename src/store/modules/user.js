// import { login } from '@/api/login'
import {
  login,
  getInfo,
  getOrgTree,
  selectOrgTree
} from '@/api/login'
import {
  getToken,
  setToken,
  removeToken
} from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    userId: '',
    nickname: '',
    admin_id: '',
    roles: [],
    permission_codes: [],
    u_info: '',
    selectOrgTree: [],
    gateList: false,
    tagshow: false,
    createCode: '',
    userRealName: '',
    userAddress: '',
    userPhone: '',
    loginKey: '%u963F%u8A07unic',
    organizationId: '',
    organizationName: '',
    organizationChain: '',
    set_orgAddressCode: ''
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_NICKNAME: (state, name) => {
      state.nickname = name
    },
    SET_ADMINID: (state, name) => {
      state.admin_id = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_PERMISSION: (state, v) => {
      state.permission_codes = v
    },
    SET_UINFO(state, v) {
      state.u_info = v
    },
    SET_ORGTREE(state, v) {
      state.u_info.sysOrganizations = v
    },
    SET_SELECTTREE(state, v) {
      state.selectOrgTree = v
      console.log('userStore', state.selectOrgTree)
    },
    GATELIST_TREEGRENTBUSI(state, v) {
      state.gateList = v
    },
    GATELIST_TAGSHOW(state, v) {
      state.tagshow = v
    },
    SET_CREATECODE(state, v) {
      state.createCode = v
    },
    SET_REALNAME(state, v) {
      state.userRealName = v
    },
    SET_USERADDRESS(state, v) {
      state.userAddress = v
    },
    SET_USERPHONE(state, v) {
      state.userPhone = v
    },
    SET_LOGINKEY(state, v) {
      state.loginKey = v
    },
    SET_USERID(state, v) {
      state.userId = v
    },
    SET_ORGANIZATIONID(state, v) {
      state.organizationId = v
    },
    SET_ORGANIZATIONNAME(state, v) {
      state.organizationName = v
    },
    SET_ORGANIZATIONCHAIN(state, v) {
      state.organizationChain = v
    },
    SET_ADDRESSCODE(state, v) {
      state.set_orgAddressCode = v
    }
  },

  actions: {
    // 登录
    Login({
      commit
    }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        login(username, userInfo.password, userInfo.verify_code, userInfo.ccode).then(response => {
          localStorage.removeItem('carStoreName')
          localStorage.removeItem('carStoreid')
          const data = response.data
          setToken(data.token)
          commit('SET_CREATECODE', data.code)
          commit('SET_TOKEN', data.token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    updateOrgTree({
      commit
    }) {
      getOrgTree().then(res => {
        commit('SET_ORGTREE', res.data)
      })
    },
    selectOrgTree({
      commit
    }) {
      selectOrgTree().then(res => {
        commit('SET_SELECTTREE', res.data)
      })
    },
    // 获取用户信息
    GetInfo({
      commit,
      state
    }) {
      return new Promise((resolve, reject) => {
        getInfo(state.token).then(response => {
          const data = response.data
          // console.log('get info data', data)
          // console.log('store', data.sysOrganizations)
          // const troles = data.role_id === '6' ? ['admin'] : ['staff']
          // if (data.role_id && data.role_id.length > 0) { // 验证返回的roles是否是一个非空数组
          //   commit('SET_ROLES', data.role_id === '6' ? ['admin'] : ['staff'])
          // } else {
          //   reject('getInfo: roles must be a non-null array !')
          // }
          // let aropermiss = data.supplier_menu
          let aropermiss = [{
            codes: 'index'
          }]
          aropermiss = aropermiss.map(v => {
            return v.code
          })
          if (data.sysOrganizationLogo) {
            console.log()
            commit('SET_AVATAR', data.sysOrganizationLogo)
          }
          commit('SET_USERADDRESS', data.userAddress)
          commit('SET_USERPHONE', data.userPhone)
          commit('SET_PERMISSION', aropermiss)
          commit('SET_NAME', data.userName)
          commit('SET_REALNAME', data.userRealName)
          commit('SET_AVATAR', data.sysOrganizationLogo)
          commit('SET_NICKNAME', data.nickname)
          commit('SET_ADMINID', data.id)
          commit('SET_UINFO', data)
          commit('SET_USERID', data.userId)
          commit('SET_ORGANIZATIONID', data.organizationId)
          commit('SET_ORGANIZATIONNAME', data.organizationName)
          commit('SET_ORGANIZATIONCHAIN', data.organizationChain)
          commit('SET_ADDRESSCODE', data.orgAddressCode)
          response.data.codes = aropermiss
          response.data.userManage = data.userManage
          // response.data.roles = troles
          resolve(response)
        }).catch(error => {
          reject(error)
        })

        // const data = { roles: ['admin'], name: 'admin', 'avatar': 'https://appicon.pgyer.com/image/view/app_icons/a7718a2a84c702e5c962fa01f59dfae2/120' }
        // const response = { status: 1, data: data }
        // commit('SET_ROLES', data.roles)
        // commit('SET_NAME', data.name)
        // commit('SET_AVATAR', data.avatar)
        // resolve(response)
      })
    },
    // 登出
    LogOut({
      commit,
      state
    }) {
      return new Promise((resolve, reject) => {
        // logout(state.token).then(() => {
        //   commit('SET_TOKEN', '')
        //   commit('SET_ROLES', [])
        //   removeToken()
        //   resolve()
        // }).catch(error => {
        //   reject(error)
        // })
        localStorage.removeItem('carStoreName')
        localStorage.removeItem('carStoreid')
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resolve()
      })
    },
    // 前端 登出
    FedLogOut({
      commit
    }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
