<template>
  <div style="min-height:500px;">
    <el-tree
      ref="tree"
      :props="proporg"
      :load="loadNode"
      :data="orgtree"
      node-key="organizationId"
      show-checkbox
      @check-change="handleCheckChange"/>

    <el-button type="primary" @click="handleSetTree">提交</el-button>
  </div>
</template>

<script>
import { getUserOrgList, setUserOrgList } from '@/api/users'
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
      proporg: {
        label: 'organizationName',
        value: 'organizationId',
        children: 'children'
      },
      strictlyFlag: true // true 为关联 false为不关联
    }
  },
  computed: {
    ...mapGetters([
      'orgtree'
    ])
  },
  created() {

  },
  mounted() {
    this.getUserOwnOrgList()
  },
  methods: {
    loadNode() {

    },

    getUserOwnOrgList() {
      getUserOrgList({ userId: this.userid ? parseInt(this.userid) : 0 }).then(res => {
        const artmp = res.data.map(v => { return v.organizationId })
        this.$refs.tree.setCheckedKeys(artmp)
      })
    },
    handleSetTree() {
      const arNodes = this.$refs.tree.getCheckedNodes()
      const arId = arNodes.map(v => { return v.organizationId })
      const arRes = arId.filter((v, i) => {
        return arId.indexOf(arNodes[i]['organizationCodePid']) === -1
      })
      console.log(arRes)
      setUserOrgList({ userId: parseInt(this.userid), ids: arRes.join(',') }).then(res => {
        this.$store.commit('GATELIST_TREEGRENTBUSI', false)
        setInterval(function() {
          location.reload()
        }, 1000)
        this.$notify({ title: '成功', message: '操作成功', type: 'success', duration: 2000 })
      })
    },
    handleCheckChange(data, checked, indeterminate) {
      // console.log(data, checked, indeterminate)
      // console.log('getCheckedNodes', this.$refs.tree.getCheckedNodes())
    }
  }
}
</script>
