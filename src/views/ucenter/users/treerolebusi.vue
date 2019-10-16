<template>
  <div style="min-height:500px;">
    <el-tree
      ref="tree"
      :props="propbusi"
      :load="loadNode"
      :data="busitree"
      :default-expand-all="true"
      node-key="menuId"
      show-checkbox
      @check-change="handleCheckChange"/>

    <el-button v-if="$store.state.user.userId===userid" type="primary" @click="handleSetTree">提交</el-button>
  </div>
</template>

<script>
import { roleGetMenu, roleSetMenu } from '@/api/role'
import { mapGetters } from 'vuex'

export default {
  props: {
    roleid: {
      type: String,
      default: ''
    },
    userid: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      propbusi: {
        label: 'menuName',
        value: 'menuCode',
        children: 'children'
      }
    }
  },
  computed: {
    ...mapGetters([
      'busitree'

    ])
  },
  watch: {
    roleid: {
      handler(newva, oldval) {
        this.getRoleOwnBusiList()
      },
      immediate: false
    }
  },
  created() {
    console.log(this.$store.state.user.userId)
    console.log(this.userid)
  },
  mounted() {
    this.getRoleOwnBusiList()
  },
  methods: {
    loadNode() {

    },
    getRoleOwnBusiList() {
      roleGetMenu({ roleId: this.roleid ? parseInt(this.roleid) : 0 }).then(res => {
        const artmp = res.data.map(v => { return v.menuId })
        this.$refs.tree.setCheckedKeys(artmp)
      })
    },
    handleSetTree() {
      const arNodes = this.$refs.tree.getCheckedNodes()
      const arId = arNodes.map(v => { return v.menuId })
      const arRes = arId.filter((v, i) => {
        return arId.indexOf(arNodes[i]['menuCodePid']) === -1
      })
      console.log(arRes)
      roleSetMenu({ roleId: parseInt(this.roleid), ids: arRes.join(',') }).then(res => {
        this.$notify({ title: '成功', message: '操作成功', type: 'success', duration: 2000 })
        this.$store.commit('GATELIST_TREEGRENTBUSI', false)
        setInterval(function() {
          location.reload()
        }, 1000)
      })
    },
    handleCheckChange(data, checked, indeterminate) {
      // console.log(data, checked, indeterminate)
      // console.log('getCheckedNodes', this.$refs.tree.getCheckedNodes())
    }
  }
}
</script>
