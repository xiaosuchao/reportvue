<template>
  <div>
    <el-dialog
      :visible.sync="isshowtreedialog"
      :before-close="beforeclose"
      title="选择门店"
      width="30%"
    >
      <div>
        <el-tree
          ref="treeorg"
          :data="selectOrgTree"
          :props="defaultProps"
          :default-expanded-keys="expnodeId"
          :highlight-current="true"
          :default-checked-keys="expnodeId"
          style="height:50px;min-height:50px;height:auto!important"
          class="u_tree"
          icon-class="utreeicon"
          @node-click="handleNodeClick"/>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import store from '@/store'
function findNodeByAddrCode(tree, code) {
  let arnode = []
  tree.forEach(v => {
    if (v.organizationAddressCode === code) {
      arnode.push(v)
    } else {
      if (v.children && v.children.length) {
        arnode = arnode.concat(findNodeByAddrCode(v.children, code))
      }
    }
  })
  return arnode
}
export default {
  props: {
    isshowtreedialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'organizationName',
        isLeaf: 'leaf'
      },
      expnodeId: []
    }
  },
  computed: {
    ...mapGetters([
      'userRealName',
      'organizationId',
      'organizationName',
      'chartLoc',
      'selectOrgTree'
    ])
  },
  watch: {},
  mounted() {
    if (localStorage.carStoreid) {
      const orgAddrCode = localStorage.carStoreid
      let sharenode = findNodeByAddrCode(this.selectOrgTree, orgAddrCode)
      console.log('sharenode', sharenode, ',orgAddrcode:', orgAddrCode, typeof (orgAddrCode))
      if (sharenode && sharenode.length) {
        sharenode = sharenode[0]
        this.expnodeId = [sharenode.organizationId]
        // this.$refs.treeorg.setChecked(sharenode.organizationId)
        // this.$refs.treeorg.setCurrentKey(sharenode.organizationId)
      }
    }
  },
  created() {
    if (localStorage.getItem('carStoreid')) {
      this.expnodeId = [localStorage.getItem('carStoreid')]
      console.log(this.expnodeId)
    } else {
      this.expnodeId = [this.getFirstOrganizationId(this.selectOrgTree)]
    }
  },
  methods: {

    getFirstOrganizationName(orgtree) {
      return (orgtree && orgtree[0].children && orgtree[0].children.length) ? this.getFirstOrganizationName(orgtree[0].children) : orgtree[0].organizationName
    },
    getFirstOrganizationId(orgtree) {
      return (orgtree && orgtree[0].children && orgtree[0].children.length) ? this.getFirstOrganizationId(orgtree[0].children) : orgtree[0].organizationAddressCode
    },
    handleNodeClick(data, node) {
      this.$emit('chloc', { organizationAddressCode: node.data.organizationAddressCode, organizationName: node.data.organizationName })
      store.dispatch('setChartLoc', data)
      this.expnodeId = [node.data.organizationAddressCode]
    },
    beforeclose(done) {
      this.$emit('chloc')
    }
  }
}
</script>
