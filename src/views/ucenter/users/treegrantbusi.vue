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
      @updateRoleBusi="updateRoleBusi"
      @check-change="handleCheckChange"/>

  <el-button type="primary" @click="handleSetTree">提交</el-button></div>
</template>

<script>
import Bus from '@/utils/Bus.js'
import { getUserBusiList, setUserBusiList } from '@/api/users'
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
      propbusi: {
        label: 'menuName',
        value: 'menuCode',
        children: 'children'
      },
      grantbusi: []
    }
  },
  computed: {
    ...mapGetters([
      'busitree'
    ])
  },
  created() {
    const self = this
    Bus.$on('updateGrantbusi', function(item) {
      self.$refs.tree.setCheckedKeys(item)
    })
  },
  mounted() {
    this.getUserOwnBusiList()
  },
  methods: {
    loadNode() {

    },
    getUserOwnBusiList() {
      getUserBusiList({ userId: this.userid ? parseInt(this.userid) : 0 }).then(res => {
        const artmp = res.data.map(v => { return v.menuId })
        console.log(artmp, 'artmp')
        this.$refs.tree.setCheckedKeys(artmp)
      })
    },
    handleSetTree() {
      const arNodes = this.$refs.tree.getCheckedNodes()
      console.log(this.$refs.tree)
      const arId = arNodes.map(v => { return v.menuId })
      console.log(arId)
      const arRes = arId.filter((v, i) => {
        return arId.indexOf(arNodes[i]['menuCodePid']) === -1
      })
      setUserBusiList({ userId: parseInt(this.userid), ids: arRes.join(',') }).then(res => {
        this.$notify({ title: '成功', message: '操作成功', type: 'success', duration: 2000 })
        this.$store.commit('GATELIST_TREEGRENTBUSI', false)
        location.reload()
      })
    },
    updateRoleBusi(rolebusi) {
      console.log('rolebusi....', rolebusi)
    },
    handleCheckChange(data, checked, indeterminate) {
      // console.log(data, checked, indeterminate)
      // console.log('getCheckedNodes', this.$refs.tree.getCheckedNodes())
    }
  }
}
</script>
