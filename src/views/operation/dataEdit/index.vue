<template>
  <div class="app-container">
    <el-row style="padding:10px;">
      <el-col :span="4">
        <el-tree
          ref="treeorg"
          :data="dataEdittree"
          :props="defaultProps"
          :expand-on-click-node="false"
          :highlight-current="true"
          class="dataedittree"
          icon-class="utreeicon"
          node-key="menuId"
          @check-change="handleCheckChange"
          @node-click="handleNodeClick"/>
      </el-col>
      <!-- :default-expand-all="true" -->
      <el-col :span="18">
        <div class="filter-container" style="text-align:right">
          <el-button v-show="tempdata.menuId" class="filter-item" style="margin-left: 10px;" type="danger" icon="el-icon-delete" @click="handleDelete">删除</el-button>
          <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-create" @click="handleGroupCreate">添加图表组</el-button>
          <el-button v-show="tempdata.menuId && tempdata.menuCodePid===1" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-create" @click="handleCreate">添加图表</el-button>
        </div>
        <el-form v-show="tempdata.menuId || createAct" ref="dataForm" :rules="rules" :model="tempdata" class="dialogform" label-width="100px" width="600">

          <el-form-item label="父级项">
            <el-input v-model="tempdata.menuCodePid" :disabled="true" placeholder=""/>
          </el-form-item>
          <el-form-item label="名称">
            <el-input v-model="tempdata.menuName" placeholder="名称"/>
          </el-form-item>
          <el-form-item label="排序">
            <el-input v-model="tempdata.menuSort" placeholder="整数，小值靠前"/>
          </el-form-item>
          <el-form-item label="显示店铺层级">
            <el-input v-model="tempdata.organizationHierarchy" placeholder="整数，0代表不限制"/>
          </el-form-item>
          <el-form-item v-show="tempdata.menuCodePid===1" label="分组图标">
            <div class="iconselbox">
              <i v-for="(iconitem,ii) in arIcon" :key="'i'+ii" :class="iconitem+' '+(tempdata.menuIcon===iconitem?'on':'')" @click="tempdata = Object.assign({},tempdata,{menuIcon:iconitem})"/>
            </div>

          </el-form-item>
          <el-form-item v-show="tempdata.menuCodePid!==1" label="上传配置文件">
            <el-upload
              ref="fileup"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :before-remove="beforeRemove"
              :headers="upHeader"
              :on-success="doneupload"
              :before-upload="beforeupload"
              :on-change="changeImgUpload"
              :file-list="fileList"
              :show-file-list="1>2"
              :action="apibase+'/uploader/file'"
              class="dataconfigup"
              multiple>
              <el-button size="small" type="primary">点击上传</el-button>
              <!-- <div slot="tip" class="el-upload__tip"/> -->
            </el-upload>
            <div class="">
              <template v-if="fileList.length">
                <a class="adownconfigfile" @click="handlePreview(fileList[0])">下载配置文件</a>
                <span style="position:absolute; top:2px; margin-left:20px; color:#666;" >{{ fileList[0]['name'] }}</span>
              </template>
            </div>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="createAct?createData():updateData()">提交</el-button>
            <el-button>取消</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss">
.u_tree{
  font-size: 16px;
  .el-tree-node__label{ font-size: 15px; }
}
.u_tree.el-tree--highlight-current {
  .el-tree-node.is-current>.el-tree-node__content{
    .el-tree-node__label{border: 1px sold transparent}
  }
}
.dataedittree{
  font-size: 16px; line-height: 36px;
  .el-tree-node__content{ height: 36px;;}
}
.iconselbox{font-size: 22px; padding-left: 20px;
  i{ margin-right: 20px; cursor: pointer;}
  .on{ color: rgb(64, 158, 255)}
}
.dataconfigup .el-upload{ border: none;}
.adownconfigfile{ color: #00ADEF;}
.adownconfigfile:hover{ color: #00ADEF;}
</style>

<script>
import { Loading } from 'element-ui'
import { editCreate, editDel, editUpdate } from '@/api/dataEdit'
import { visualMenu } from '@/api/visual'
import { mapGetters } from 'vuex'
import { getToken } from '@/utils/auth'

const orgAnalysMap = {
  0: '需要分析',
  1: '不需要分析'
}

let loadingRequest

export default {
  data() {
    return {
      name: 'ucenterorgindex',
      defaultProps: {
        children: 'children',
        label: 'menuName'
      },
      fileList: [],
      fileReallist: [],
      dataEdittree: [],
      createAct: false,
      tempdata: {},
      apibase: process.env.BASE_API,
      upHeader: { Authorization: getToken() },
      optsOrgAnalys: [],
      arAddrs: [],
      arIcon: ['el-icon-date', 'el-icon-goods', 'el-icon-setting', 'el-icon-location-outline'],
      codeChainAddr: [],
      propsAddr: {
        label: 'name',
        value: 'code',
        children: 'children'
      },
      rules: {
        name: [{ required: true, message: '请填写用户名', trigger: 'blur' }]
      }

    }
  },
  computed: {
    ...mapGetters([
      'orgtree'
    ])
  },
  created() {
    for (const v in orgAnalysMap) {
      this.optsOrgAnalys.push({ key: parseInt(v), label: orgAnalysMap[v] })
    }
    this.loadDataTree()
  },
  methods: {
    // download() {
    //   DownloadFile({filePath:"D:/bmw/unicorn_server_project/unicorn_admin/src/main/resources/static/configjs7be67b05-d61d-4cc9-bdf5-b5720ddc87bd.js"}).then(res=>{
    //   })
    // },
    handleNodeClick(data, node) {
      const _tree = this.$refs.treeorg
      if (!node.checked || this.createAct) {
        if (_tree.getCheckedNodes().length) {
          _tree.setChecked(_tree.getCheckedNodes()[0], false)
        }
        node.checked = true

        this.createAct = false
        this.tempdata = Object.assign({}, data)
        this.fileList = (new Array(1)).fill({ name: data.configFileUrl, url: data.configFileUrl })
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

      console.log(node)
      //   getSubNodes({ organizationCodePid: node.id }).then(res => {
      //     console.log(res)
      //     return resolve(res.data)
      //   })
      return resolve([])
    },
    loadDataTree() {
      visualMenu().then(res => {
        this.dataEdittree = res.data
      })
    },
    createData() {
      editCreate(this.tempdata).then(res => {
        if (this.tempdata.menuCodePid !== 1) {
          this.$refs.treeorg.append(res.data, this.tempdata.menuCodePid)
        } else {
          this.$refs.treeorg.append(res.data)
        }
        const tmppid = this.tempdata.menuCodePid
        this.resetTemp()
        this.tempdata.menuCodePid = tmppid
        this.$notify({ title: '成功', message: '操作成功', type: 'success', duration: 2000 })
      })
    },
    updateData() {
      const submdata = Object.assign({}, { ...this.tempdata }, { children: 1111 })
      console.log(this.tempdata)
      editUpdate(submdata).then(res => {
        this.$refs.treeorg.getNode(this.tempdata.menuId).data = Object.assign({}, this.tempdata)
        console.log(this.tempdata)
        this.$notify({ title: '成功', message: '操作成功', type: 'success', duration: 2000 })
      })
    },
    handleDelete() {
      if (!this.tempdata.menuId) {
        this.$notify({ title: '错误', message: '请先选择删除项', type: 'error', duration: 2000 })
        return
      }
      this.$confirm('确定要删除吗？', '提示', { type: 'warning', confirmButtonText: '确定', cancelButtonText: '取消' }).then(res => {
        editDel({ menuId: this.tempdata.menuId }).then(res => {
          this.$refs.treeorg.remove(this.tempdata)
          this.$notify({ title: '成功', message: '操作成功', type: 'success', duration: 2000 })
        })
      })
    },

    handleGroupCreate() {
      this.resetTemp()
      this.tempdata.menuCodePid = 1
      this.createAct = true
    },
    handleCreate() {
      if (!this.tempdata.menuId) {
        this.$notify({ title: '错误', message: '请先选择图表组', type: 'error', duration: 2000 })
        return
      }
      const tmpId = this.tempdata.menuId
      this.createAct = true
      this.resetTemp()
      this.tempdata.menuCodePid = tmpId
    },
    handleAddrChange(val) {
      console.log(val)

    //   let addrText = ''
    //   let lastcode = ''
    //   const objAddr = val.reduce((prev, cur) => { const objnow = prev.children.filter(v => { return v.code === cur })[0]; addrText += objnow['name']; lastcode = objnow['code']; return objnow }, { children: this.arAddrs })
    //   this.tempdata.organizationAddress = addrText
    //   this.tempdata.organizationAddressCode = lastcode
    //   getSubArea({ parentCode: val[val.length - 1], grade: (val.length + 1) }).then(res => {
    //     if (res.data.length) {
    //       const tempar = val.length === 6 ? res.data : res.data.map(v => { v.children = []; return v })
    //       objAddr.children = tempar
    //     }
    //   })
    },
    // loadSubArea(parentCode, grade) {
    //   getSubArea({ parentCode, grade }).then(res => {
    //     const artemp = res.data.map(v => { v.children = []; return v })
    //     this.arAddrs = artemp
    //   })
    // },
    resetTemp() {
      this.tempdata = {
        menuCodePid: '',
        menuName: '',
        menuSort: 0,
        organizationHierarchy: '',
        menuIcon: '',
        conf: ''

      }
    },
    doneupload(res, file, flist) {
      // flist.splice(0, flist.length - 1)
      this.fileList = [{ name: res.data.url, url: res.data.url }]
      this.tempdata.configFileUrl = res.data.url
    },

    handleRemove(file, fileList) {
      this.fileList = []
      this.tempdata.configFileUrl = ''
    },
    handlePreview(file) {
      window.open(process.env.BASE_API + '/uploader/downloadfile?filePath=' + file.url)
    },
    beforeupload(file) {
      if (file.type.indexOf('javascript') < 0) {
        this.$message.error('请上传js文件')
        return false
      } else {
        loadingRequest = Loading.service({ background: 'rgba(255, 255, 255, 0.2)' })
      }
    },
    changeImgUpload() {
      if (loadingRequest) { loadingRequest.close() }
    },
    beforeRemove(file, fileList) {
      // return this.$confirm(`确定移除 ${file.name}？`)
    }
  }
}
</script>

