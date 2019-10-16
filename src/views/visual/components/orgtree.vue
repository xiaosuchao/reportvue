<template>
  <div>
    <el-dialog
      :visible.sync="isshowtreedialog"
      :before-close="beforeclose"
      style="min-height:400px;min-width:400px"
      title="选择门店"
      width="30%"
      @open="dialogOpen"
    >
      <div >
        <el-tree
          ref="treeorg"
          :data="treereal"
          :props="defaultProps"
          :default-expanded-keys="expnodeId"
          :highlight-current="true"
          :default-checked-keys="expnodeId"
          :current-node-key="expnodeId[0]"
          node-key="organizationId"
          class="u_tree"
          icon-class="utreeicon"
          @node-click="handleNodeClick"/>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { selectOrgTree } from '@/api/login'

// function getFirstNodeByDepth(tree, depth) {
//   let ar = []
//   tree.forEach((v, i) => {
//     ar.push(Object.assign({}, v, { children: [] }))
//     if (v.children && v.children.length) {
//       ar = ar.concat(getFirstNodeByDepth(v.children))
//     }
//   })
//   return ar
// }

function expodeTree(tree, markdp) {
  let ar = []
  const dp = markdp || 1
  tree.forEach((v, i) => {
    ar.push(Object.assign({}, v, { children: [], dp }))
    if (v.children && v.children.length) {
      ar = ar.concat(expodeTree(v.children, dp + 1))
    }
  })
  return ar
}

function getFistNodeByDepth(tree, dp) {
  if (tree) {
    const exptree = expodeTree(tree)
    if (exptree) {
      if (exptree.some(v => { v.dp === dp })) {
        return exptree.filter(v => v.dp === dp)[0]
      } else {
        return getFistDeepestNode(tree)
      }
    }
  }
}

function getFistDeepestNode(tree) {
  return (tree.length && tree[0].children && tree[0].children.length) ? getFistDeepestNode(tree[0].children) : tree[0]
}

export default {
  props: {
    isshowtreedialog: {
      type: Boolean,
      default: false
    },
    orgtreedepth: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      treereal: this.selectOrgTree,
      defaultProps: {
        children: 'children',
        label: 'organizationName',
        isLeaf: 'leaf'
      },
      expnodeId: [],
      curkey: ''
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
  watch: {
    orgtreedepth: {
      handler(newval, oldval) {
        console.log('depth changed ===========================', newval, oldval)
        if (newval === 0) {
          let finalnode
          console.log('dpth===0')
          this.treereal = this.selectOrgTree
          if (this.chartLoc) {
            console.log('this.chartLoc', this.chartLoc)
            finalnode = this.chartLoc
          } else {
            console.log('getFistDeepestNode(this.treereal)', getFistDeepestNode(this.treereal))
            finalnode = getFistDeepestNode(this.treereal)
          }
          if (finalnode) {
            this.$emit('chloc', finalnode)
            this.expnodeId = [finalnode.organizationId]
            this.curkey = finalnode.organizationId
            if (finalnode.organizationDataAnalysis) {
              localStorage.setItem('carStoreid', finalnode.organizationAddressCode)
              localStorage.setItem('carStoreName', finalnode.organizationName)
            }
          }
        } else {
          selectOrgTree({ grade: newval }).then(res => {
            let finalnode
            console.log('dpth===', newval, oldval)
            this.treereal = res.data
            const exptree = expodeTree(this.treereal)
            if (this.chartLoc) {
              console.log('this.chartLoc', this.chartLoc)
              console.log('exptree', exptree)
              if (exptree.some(v => { return (v.organizationChain.indexOf(this.chartLoc['organizationChain']) > -1 || this.chartLoc['organizationChain'].indexOf(v.organizationChain) > -1) && v.dp === newval })) {
                console.log('exptree has this.chartLoc')
                finalnode = exptree.filter(v => { return (v.organizationChain.indexOf(this.chartLoc['organizationChain']) > -1 || this.chartLoc['organizationChain'].indexOf(v.organizationChain) > -1) && v.dp === newval })[0]
              } else {
                console.log('no cantain this.chartLoc getFistDeepestNode(this.treereal)', getFistDeepestNode(this.treereal))
                finalnode = getFistNodeByDepth(this.treereal, newval)
              }
            } else {
              console.log('no choloc ,getFistNodeByDepth(this.treereal, newval)', getFistNodeByDepth(this.treereal, newval))
              finalnode = getFistNodeByDepth(this.treereal, newval)
            }
            if (finalnode) {
              this.$emit('chloc', finalnode)
              this.expnodeId = [finalnode.organizationId]
              this.curkey = finalnode.organizationId
              if (finalnode.organizationDataAnalysis) {
                localStorage.setItem('carStoreid', finalnode.organizationAddressCode)
                localStorage.setItem('carStoreName', finalnode.organizationName)
              }
              console.log('reffffffffffffffffff', this.$refs)
            }
          })
        }
      },
      immediate: true
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    dialogOpen() {
      this.$nextTick(() => {
        this.$refs && this.$refs.treeorg && this.$refs.treeorg.setCurrentKey(this.expnodeId[0])
      })
    },
    handleNodeClick(data, node) {
      if (data.organizationDataAnalysis) {
        localStorage.setItem('carStoreid', data.organizationAddressCode)
        localStorage.setItem('carStoreName', data.organizationName)
      }
      this.expnodeId = [data.organizationId]
      this.$emit('chloc', data)
    },
    beforeclose(done) {
      this.$emit('chloc')
    }
  }
}
</script>
