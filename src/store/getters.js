const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  sysinfo: state => state.app.sysinfo,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  username: state => state.user.u_info.userName,
  admin_id: state => state.user.u_info.userId,
  admin_nickname: state => state.user.u_info.userRealName,
  roles: state => state.user.roles,
  menucodes: state => state.permission.menucodes,
  permission_routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters,
  activeTopMenu: state => state.permission.activeTopMenu,
  topRouters: state => state.permission.topRouters,
  permission_codes: state => state.user.permission_codes,
  orgtree: state => state.user.u_info.sysOrganizations,
  selectOrgTree: state => state.user.selectOrgTree,
  // selectOrgTree: state => getStoreFromTree(state.user.u_info.sysOrganizations),
  orgid: state => state.user.u_info.organizationId,
  busitree: state => state.user.u_info.sysMenus,
  trycarflag: state => state.user.trycarflag,
  gateList: state => state.user.gateList,
  tagshow: state => state.user.tagshow,
  set_orgAddressCode: state => state.user.set_orgAddressCode,
  sideRouters: state => {
    return []
    // return state.permission.topRouters.filter(v => {
    //   return v.name && v.name === state.permission.activeTopMenu
    // })[0].children
  },
  userRealName: state => state.user.userRealName,
  userAddress: state => state.user.userAddress,
  userPhone: state => state.user.userPhone,
  loginKey: state => state.user.loginKey,
  organizationId: state => state.user.organizationId,
  organizationName: state => state.user.organizationName,
  organizationChain: state => state.user.organizationChain,
  chartDateSingle: state => state.chart.chartdatesingle,
  chartLoc: state => state.chart.chartloc,
  chartDateRange: state => state.chart.chartdaterange

}
export default getters
