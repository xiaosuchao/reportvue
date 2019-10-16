<template>
  <div>
    <el-tree
      ref="treeorg"
      :data="selectOrgTree"
      :props="defaultProps"
      :expand-on-click-node="false"
      :default-expanded-keys="expnodeId"
      :highlight-current="true"
      class="u_tree"
      icon-class="utreeicon"
      node-key="organizationId"
      @check-change="handleCheckChange"
      @node-click="handleNodeClick"/>
  </div>

</template>

<script>
import { mapGetters } from 'vuex'
// import store from '@/store'
export default {
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'organizationName',
        isLeaf: 'leaf'
      }
    }
  },
  computed: {
    ...mapGetters([
      'selectOrgTree'
    ])
  }
}
</script>

