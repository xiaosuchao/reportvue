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

        <el-table
          :data="list"
        >
          <template v-for="item in colTable">
            <el-table-column :fixed="item.fixed" :key="item.displayName" :prop="item.prop" :label="item.label" :min-width="item.width" align="center">
              <template slot-scope="scope">
                <template v-if="item.prop==='floorPlanImg'">
                  <template v-if="scope.row[item.prop]">
                    <img :src="scope.row[item.prop]" >
                  </template>
                  <template v-else>
                    <el-upload
                      :show-file-list="false"
                      :headers="upHeader"
                      :on-success="(res,file,filelist)=>{return handleImgupSuccess(res,file,filelist,scope.row)}"
                      :on-change="changeImgUpload"
                      :before-upload="beforeImgUpload"
                      :action="apibase+'/uploader/img'"
                      class="avatar-uploader">
                      <i class="el-icon-plus avatar-uploader-icon"/>
                    </el-upload>
                  </template>

                </template>
                <template v-else>
                  <span>{{ scope.row[item.prop] }}</span>
                </template>
              </template>
            </el-table-column>
          </template>
          <el-table-column align="right" label="操作" min-width="30px">
            <template slot-scope="scope">
              <el-button type="danger" size="small" icon="el-icon-edit" @click="imgDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>

        </el-table>
      </el-col>
    </el-row>

  </div>
</template>

<style lang="scss">

  .imgsize{
    width: 178px;
    height: 178px;
    display: inline-block;
    text-align: center;
  }
  .avatar-uploader .el-upload {
    width: 178px;
    height: 178px;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    width: 178px;
    height: 178px;
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  img{ max-width: 100%;}

</style>

<script>
import { Loading } from 'element-ui'
import { getSubNodes } from '@/api/org'
import { mapGetters } from 'vuex'
import store from '@/store'
import { floorPlanList, floorPlanDel, floorPlaneAdd } from '@/api/plane'
import { getToken } from '@/utils/auth'

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

let loadingRequest

export default {
  filters: {
    showstr(v, prop) {
      return v
    }
  },
  components: {
  },
  data() {
    return {
      apibase: process.env.BASE_API,
      upHeader: { Authorization: getToken() },
      name: 'ucenterorgindex',
      activeTab: 'first',
      defaultProps: {
        children: 'children',
        label: 'organizationName',
        isLeaf: 'leaf'
      },
      expnodeId: [],
      orgNode: {},
      img: '',
      list: [],
      listLoading: false,
      scr: '',
      colTable: [
        { prop: 'floorName', label: '楼层', fixed: true, width: '50' },
        { prop: 'floorPlanImg', label: '平面图', fixed: true, width: '200' }
      ],
      listQuery: {
        orgAddressCode: ''
      },
      fileReallist: []

    }
  },
  computed: {
    ...mapGetters([
      'selectOrgTree'
    ])
  },
  watch: {
    'orgNode.code': {
      handler(newval, oldval) {
        console.log('hehe', newval)
        this.listQuery.orgAddressCode = newval
        console.log('haha', newval)
        this.getFloorPlanList()
      }
    }
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
    handleNodeClick(data, node) {
      const _tree = this.$refs.treeorg
      if (!node.checked && data.organizationDataAnalysis === 1) {
        if (_tree.getCheckedNodes() && _tree.getCheckedNodes().length) {
          _tree.setChecked(_tree.getCheckedNodes()[0], false)
        }
        node.checked = true
        this.orgNode = { code: node.data.organizationAddressCode, name: node.data.organizationName, dealerCode: node.data.organizationDealerCode }
        console.log('999', this.orgNode.code)
        localStorage.setItem('carStoreid', data.organizationAddressCode)
        localStorage.setItem('carStoreName', data.organizationName)
        store.dispatch('setChartLoc', data)
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
    getFloorPlanList() {
      const qazwsx = Object.assign({}, this.listQuery)
      floorPlanList(qazwsx).then(res => {
        this.list = (res.data || [])
      })
    },
    handleImgupSuccess(res, file, filelist, row) {
      const tmprow = Object.assign({}, row, { floorPlanImg: res.data.url })
      this.planeAdd(tmprow)
    },
    beforeImgUpload() {
      loadingRequest = Loading.service({ background: 'rgba(255, 255, 255, 0.2)' })
    },
    changeImgUpload() {
      if (loadingRequest) { loadingRequest.close() }
    },
    planeAdd(row) {
      floorPlaneAdd({ storeNo: this.orgNode.code, storeFloor: row.floorCode, floorPlanImg: row.floorPlanImg, id: row.id }).then(res => {
        this.getFloorPlanList()
      })
    },
    imgDelete(id) {
      this.$confirm('确定要删除吗？', '提示', { type: 'warning', confirmButtonText: '确定', cancelButtonText: '取消' }).then(
        () => {
          floorPlanDel(id).then((res) => {
            this.$notify({ title: '成功', message: '操作成功', type: 'success', duration: 2000 })
            this.getFloorPlanList()
          })
        }
      )
    }
  }
}
</script>

