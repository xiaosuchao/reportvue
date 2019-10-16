<template>
  <div class="app-container">
    <el-row style="padding:10px;">
      <el-col :span="4">
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
      </el-col>
      <el-col :span="20">
        <el-tabs v-if="showActiveFlag" v-model="activeTab" style="margin-bottom:20px;" @tab-click="changeTab">
          <el-tab-pane v-for="item in artabs" :label="item.label" :name="item.name" :key="item.name">
            <template v-if="item.code ==='devicegateindexProbe'">
              <deviceSenor :orgnode = "orgNode" :enum="item.enum" :isactive="activeTab===item.name" :deviceauthority="authorcodes"/>
            </template>
            <template v-else-if="item.code ==='devicegateindexAP'">
              <ap :orgnode = "orgNode" :enum="item.enum" :isactive="activeTab===item.name" :deviceauthority="authorcodes"/>
            </template>
            <template v-else-if="item.code ==='devicegateindexPAD'">
              <pad :orgnode = "orgNode" :enum="item.enum" :isactive="activeTab===item.name" :deviceauthority="authorcodes"/>
            </template>
            <template v-else-if="item.code ==='devicegateindexPC'">
              <pc :orgnode = "orgNode" :enum="item.enum" :isactive="activeTab===item.name" :deviceauthority="authorcodes"/>
            </template>
            <template v-else-if="item.code ==='devicegateindexCamera'">
              <camera :orgnode = "orgNode" :enum="item.enum" :isactive="activeTab===item.name" :deviceauthority="authorcodes"/>
            </template>
            <template v-else-if="item.code ==='devicegateindexPark'">
              <barriergate :orgnode = "orgNode" :enum="item.enum" :isactive="activeTab===item.name" :deviceauthority="authorcodes"/>
            </template>
            <template v-else-if="item.code ==='devicegateindexscreen'">
              <screen :orgnode = "orgNode" :enum="item.enum" :isactive="activeTab===item.name" :deviceauthority="authorcodes"/>
            </template>
            <template v-else-if="item.code ==='devicegateindex360'">
              <threesixzero :orgnode = "orgNode" :isactive="activeTab===item.name" :deviceauthority="authorcodes"/>
            </template>
            <template v-else-if="item.code ==='devicegateindexOthers'">
              <others :orgnode = "orgNode" :enum="item.enum" :isactive="activeTab===item.name" :deviceauthority="authorcodes"/>
            </template>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss">
.u_tree{
  padding-right: 20px;
  font-size: 16px;
  .el-tree-node__label{ font-size: 15px; }
}
.u_tree.el-tree--highlight-current {
  .el-tree-node.is-current>.el-tree-node__content{
    .el-tree-node__label{border: 1px sold transparent}
  }
}

// 搜索表单模块下拉选项框和输入框宽度一致样式
.filter-container .el-input__inner{ padding-right: 30px;}

// 弹出的dialog内容两列展示
.form2col{
  overflow: hidden;
  .el-form-item{ width: 49%; float: left}
}

.dialogform .el-date-editor.el-input,.dialogform .el-date-editor.el-input__inner{width: 100%;}
.dialogform .datetofmitem .el-form-item__label{ text-align: center;}
</style>

<script>
import { getSubNodes } from '@/api/org'
import { mapGetters } from 'vuex'
import { authorization } from '@/api/device'
import deviceSenor from './senor'
import pad from './pad'
import pc from './pc'
import camera from './camera'
import ap from './ap'
import barriergate from './barriergate'
import threesixzero from './threesixzero'
import others from './others'
import screen from './screen'
import store from '@/store'

// let jsonDeviceStatus = {}, jsonDeviceType = {}

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

const aralltabs = [
  { code: 'devicegateindexProbe', enum: 5, name: 'first', label: '探针' },
  { code: 'devicegateindexAP', enum: 6, name: 'second', label: 'AP' },
  { code: 'devicegateindexPAD', enum: 7, name: 'third', label: 'PAD' },
  { code: 'devicegateindexPC', enum: 2, name: 'fourth', label: '千人千面小主机' },
  { code: 'devicegateindexCamera', enum: 1, name: 'fifth', label: '摄像头' },
  { code: 'devicegateindexPark', enum: 8, name: 'seventh', label: '道闸' },
  { code: 'devicegateindex360', name: 'nineth', label: '360' },
  { code: 'devicegateindexscreen', name: 'eighth', label: '投屏' },
  { code: 'devicegateindexOthers', enum: 4, name: 'sixth', label: '其他' }
]

export default {
  components: {
    deviceSenor,
    pad, pc, camera, ap, barriergate, others, screen, threesixzero
  },
  data() {
    return {
      name: 'ucenterorgindex',
      activeTab: 'first',
      defaultProps: {
        children: 'children',
        label: 'organizationName',
        isLeaf: 'leaf'
      },
      expnodeId: [],
      orgNode: {},
      authorcodes: ['devicegateindexAP', 'devicegateindexProbe'],
      artabs: [],
      showActiveFlag: true
    }
  },
  computed: {
    ...mapGetters([
      'selectOrgTree'
    ])
  },
  watch: {
    artabs: {
      handler(newv, oldv) {
        if (newv && newv.length) { this.activeTab = newv[0]['name'] }
      }
    }
  },
  created() {
    this.getMenuCodes()
  },
  mounted() {
    if (localStorage.carStoreid) {
      const orgAddrCode = localStorage.carStoreid
      let sharenode = findNodeByAddrCode(this.selectOrgTree, orgAddrCode)
      console.log('sharenode', sharenode, ',orgAddrcode:', orgAddrCode, typeof (orgAddrCode))
      if (sharenode && sharenode.length) {
        sharenode = sharenode[0]
        this.expnodeId = [sharenode.organizationId]
        this.$refs.treeorg.setChecked(sharenode.organizationId)
        this.$refs.treeorg.setCurrentKey(sharenode.organizationId)
        this.orgNode = { code: sharenode.organizationAddressCode, name: sharenode.organizationName, dealerCode: sharenode.organizationDealerCode }
      }
    }
  },
  methods: {
    getMenuCodes() {
      authorization({ code: 'devicegateindexProbe,devicegateindexAP,devicegateindex360,devicegateindexPAD,devicegateindexPC,devicegateindexPark,devicegateindexCamera,devicegateindexOthers,devicegateindexscreen,devicegateindexProbeDelete,devicegateindexProbeCreate,devicegateindexProbeUpdate,devicegateindexAPRefresh,devicegateindexPCCreate,devicegateindexPCUpdate,devicegateindexPCDelete,devicegateindexPCConfigParam,devicegateindexPADCreate,devicegateindexPADUpdate,devicegateindexPADDelete,devicegateindexPADConfigParam,devicegateindexCameraRefresh,devicegateindexOthersCreate,devicegateindexProbeImport,devicegateindexProbeExport,devicegateindexProbeExportAll' })
        .then(res => {
          this.authorcodes = res.data
          this.artabs = aralltabs.filter(v => { return this.authorcodes.includes(v.code) })
        })
    },
    handleNodeClick(data, node) {
      console.log(data)
      const _tree = this.$refs.treeorg
      if (!node.checked || this.showActiveFlag === false) {
        if (data.organizationDataAnalysis === 1) {
          if (_tree.getCheckedNodes() && _tree.getCheckedNodes().length) {
            _tree.setChecked(_tree.getCheckedNodes()[0], false)
          }
          this.showActiveFlag = true
          node.checked = true
          this.orgNode = { code: node.data.organizationAddressCode, name: node.data.organizationName, dealerCode: node.data.organizationDealerCode }
          localStorage.setItem('carStoreid', data.organizationAddressCode)
          localStorage.setItem('carStoreName', data.organizationName)
          store.dispatch('setChartLoc', data)
        } else {
          this.showActiveFlag = false
          this.$message.error('请选择店铺')
        }
      }
    },
    handleCheckChange(data, checked, indeterminate) {
      // console.log(data, checked, indeterminate)
    },
    loadNode(node, resolve) {
      if (node.level === 0) {
        return resolve([{
          id: 11,
          label: '悠尼客',
          leaf: 0
        }])
      }
      getSubNodes({ organizationCodePid: node.id }).then(res => {
        return resolve(res.data)
      })
      return resolve([])
    },
    changeTab() {

    }

  }
}
</script>

