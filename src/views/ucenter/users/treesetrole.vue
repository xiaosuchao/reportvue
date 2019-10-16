<template>
  <div style="min-height:500px;">
    <el-checkbox-group v-model="userRols" label-position="left">
      <el-checkbox
        v-for="(item) in list"
        :key="item.roleId"
        :label="item.roleId"
      >{{ item.roleName }}</el-checkbox>
    </el-checkbox-group>
    <div style="padding-top:25px;">
      <el-button type="primary" @click="handleSetTree">提交</el-button>
    </div>
  </div>
</template>

<script>
import Bus from '@/utils/Bus.js'
import { rolesAndMenusManageByUser, userRolesSet, userRolesList } from '@/api/role'
import { setUserBusiList } from '@/api/users'
import { mapGetters } from 'vuex'

export default {
  props: {
    userid: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      list: [],
      propbusi: {
        label: 'menuName',
        value: 'menuCode',
        children: 'children'
      },
      userRols: []
    }
  },
  computed: {
    ...mapGetters([
      'orgtree',
      'admin_id'
    ])
  },
  watch: {
    userid: {
      handler(newval, oldval) {
        this.getUserRoles()
      },
      immediate: false
    }
  },
  created() {
    this.getRoleList()
  },
  mounted() {
    this.getUserRoles()
  },
  methods: {
    loadNode() {

    },
    getRoleList() {
      rolesAndMenusManageByUser({ userId: this.admin_id, menuCodePid: 0 }).then(res => {
        this.list = res.data
      })
    },
    getUserRoles() {
      userRolesList({ userId: this.userid ? parseInt(this.userid) : 0 }).then(res => {
        this.userRols = res.data.map(v => { return v.roleId })
      })
    },
    handleSetTree() {
      // const arNodes = this.$refs.tree.getCheckedNodes()
      // const arId = arNodes.map(v => { return v.menuId })
      // const arRes = arId.filter((v, i) => {
      //   return arId.indexOf(arNodes[i]['menuCodePid']) === -1
      // })
      console.log(this.userRols)
      const arRoleMenus = this.list.filter(v => {
        return this.userRols.indexOf(v.roleId) > -1
      })
      let arMenus = arRoleMenus.reduce((prev, cur) => {
        const arCur = cur.menus.map(v => { return '-' + v.menuChain + '-' })
        if (!prev.length) { return arCur }
        if (!arCur.length) { return prev }
        prev.forEach((v, i) => {
          arCur.forEach((vv, ii) => {
            if (v.replace(vv, '') === '' || vv.replace(v, '') !== vv) {
              arCur.splice(ii, 1)
            } else if (v.replace(vv, '') !== v) {
              prev[i] = '-0-'
            }
          })
        })
        prev = prev.concat(arCur)
        prev = prev.filter(v => { return v !== '-0-' })
        return prev
      }, [])
      this.$emit('updateRoleBusi', arMenus.join(','))
      this.$store.commit('GATELIST_TREEGRENTBUSI', false)

      arMenus = arMenus.map(v => {
        return v.split('-')[v.split('-').length - 2]
      })

      userRolesSet({ userId: this.userid ? parseInt(this.userid) : 0, ids: this.userRols.join(',') }).then(res => {
        if (res === 'err') { return }
        this.$notify({ title: '成功', message: '操作成功', type: 'success', duration: 2000 })

        const roleNames = this.list.filter(v => { return this.userRols.includes(v.roleId) }).map(v => { return v.roleName })
        this.$emit('updateRoleNames', roleNames.join(','))
      })
      setUserBusiList({ userId: this.userid ? parseInt(this.userid) : 0, ids: arMenus.join(',') }).then(res => { })
      Bus.$emit('updateGrantbusi', arMenus)
    },
    handleCheckChange(data, checked, indeterminate) {
      // console.log(data, checked, indeterminate)
      // console.log('getCheckedNodes', this.$refs.tree.getCheckedNodes())
    }
  }
}
</script>
<style lang="scss" scoped>
.el-checkbox + .el-checkbox {
  margin-top: 10px;
  margin-left: 0px !important;
}
.el-checkbox {
  width:136px!important;
}
</style>
