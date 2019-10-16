import Mock from 'mockjs'
import loginAPI from './login'
import articleAPI from './article'
import userAPI from './user'
import parkCarAPI from './car.js'
import orgAPI from './org.js'
import orgAddr from './addr.js'
import agencyAPI from './addr.js'

// 修复在使用 MockJS 情况下，设置 withCredentials = true，且未被拦截的跨域请求丢失 Cookies 的问题
// https://github.com/nuysoft/Mock/issues/300
Mock.XHR.prototype.proxy_send = Mock.XHR.prototype.send
Mock.XHR.prototype.send = function() {
  if (this.custom.xhr) {
    this.custom.xhr.withCredentials = this.withCredentials || false
  }
  this.proxy_send(...arguments)
}

// Mock.setup({
//   timeout: '350-600'
// })

// 登录相关
Mock.mock(/\/login/, 'post', loginAPI.loginByUsername)
Mock.mock(/\/user\/info/, 'post', loginAPI.getUserInfo)
Mock.mock(/\/createCode/, 'get', loginAPI.createCode)

// 用户相关
Mock.mock(/\/User\/index/, 'get', userAPI.getList)
Mock.mock(/\/User\/add/, 'post', userAPI.addRowUser)
Mock.mock(/\/User\/edit/, 'post', userAPI.updateRowUser)
Mock.mock(/\/User\/delete/, 'post', userAPI.delRowUser)

// 文章相关
Mock.mock(/\/article\/list/, 'get', articleAPI.getList)
Mock.mock(/\/article\/detail/, 'get', articleAPI.getArticle)
Mock.mock(/\/article\/pv/, 'get', articleAPI.getPv)
Mock.mock(/\/article\/create/, 'post', articleAPI.createArticle)
Mock.mock(/\/article\/update/, 'post', articleAPI.updateArticle)

// 智能停车相关
Mock.mock(/\/unicorn\/parking\/getCarStore/, 'get', parkCarAPI.getCarStore)
Mock.mock(/\/unicorn\/parking\/querycount/, 'get', parkCarAPI.getCarInfo)
Mock.mock(/\/unicorn\/parking\/getCarImages/, 'get', parkCarAPI.getCarImages)
Mock.mock(/\/unicorn\/parking\/carInfoList/, 'get', parkCarAPI.carInfoList)
Mock.mock(/\/unicorn\/parking\/colorinfo/, 'get', parkCarAPI.colorinfo)
Mock.mock(/\/unicorn\/parking\/brandinfo/, 'get', parkCarAPI.brandinfo)
Mock.mock(/\/unicorn\/parking\/modelinfo/, 'get', parkCarAPI.modelinfo)
Mock.mock(/\/unicorn\/parking\/queoneCar/, 'get', parkCarAPI.queoneCar)
Mock.mock(/\/unicorn\/parking\/queoneCar/, 'get', parkCarAPI.queoneCar)
// 智能停车场 --- 内部停车场相关
Mock.mock(/\/unicorn\/innercar\/queryall/, 'get', parkCarAPI.innercarList)

Mock.mock(/\/admin\/userOrganization\/getSubNodes/, 'get', orgAPI.getSubNodes)
Mock.mock(/\/admin\/userOrganization\/selectAll/, 'get', orgAPI.getList)
Mock.mock(/\/admin\/userOrganization\/create/, 'post', orgAPI.addRow)
Mock.mock(/\/admin\/userOrganization\/delete/, 'delete', orgAPI.delRow)
Mock.mock(/\/admin\/userOrganization\/select/, 'get', orgAPI.getRow)
Mock.mock(/\/admin\/userOrganization\/update/, 'put', orgAPI.updateRow)

Mock.mock(/\/admin\/sysArea\/selectAll/, 'get', orgAddr.getSubArea)
Mock.mock(/\/admin\/sysArea\/create/, 'post', orgAddr.createArea)
Mock.mock(/\/admin\/sysArea\/update/, 'put', orgAddr.updateArea)
Mock.mock(/\/admin\/sysArea\/delete/, 'delete', orgAddr.deleteArea)

Mock.mock(/\/Authorization\/organization\/select/, 'get', agencyAPI.getList)

export default Mock
