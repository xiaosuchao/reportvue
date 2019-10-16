<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="filterIns">
        <el-input v-model="fVersioncode" placeholder="请输入版本号" style="width:100%"/>
        <img src="@/assets/images/search.png" alt @click="search()">
      </div>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handlecreate">添加版本号</el-button>
    </div>
    <el-table
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row>
      <el-table-column
        label="序号"
        width="50"
        fixed
        align="center">
        <template slot-scope="scope">
          <span>{{ scope.$index +(tableData.pageNum - 1) * tableData.pageSize+1 }}</span>
        </template>
      </el-table-column>
      <template v-for="item in colTable">
        <el-table-column :fixed="item.fixed" :key="item.id" :prop="item.prop" :label="item.label" :min-width="item.width" align="center">
          <template slot-scope="scope">
            <el-switch
              v-if="item.prop==='upgradesign'"
              v-model= "scope.row[item.prop]"
              @change="changeFlag(scope.$index,scope.row) "/>
            <span v-else>{{ scope.row[item.prop] | showstr(item.prop) }}</span>
          </template>
        </el-table-column>
      </template>
      <el-table-column align="center" prop="created_at" label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="primary" size="small" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button type="danger" size="small" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
        </template>
    </el-table-column></el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.pageNum"
      :limit.sync="listQuery.limit"
      @pagination="version"
    />
    <el-dialog :visible.sync="isShowDialog" :title="dialogText[dialogStatus]">
      <el-form ref="tempdata" :model="tempdata" class="dialogform" label-width="100px">
        <el-form-item label="版本号">
          <el-input v-model="tempdata.fVersionshow" placeholder="版本号"/>
        </el-form-item>
        <el-form-item label="版本描述">
          <el-input v-model="tempdata.fVersionInfo" placeholder="版本号"/>
        </el-form-item>
        <el-form-item label="是否强制升级">
          <el-radio-group v-model="tempdata.fForceStatus">
            <el-radio :label="1">强制</el-radio>
            <el-radio :label="2">不强制</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="fOrgSign==='screen'" label="手机类型">
          <el-select v-model="tempdata.fType" placeholder="请选择">
            <el-option v-for="opt in screenType" :key="opt.key" :value="opt.key" :label="opt.label" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="fOrgSign!=='screen'" label="手机类型">
          <el-select v-model="tempdata.fType" placeholder="请选择">
            <el-option v-for="opt in downloadType" :key="opt.key" :value="opt.key" :label="opt.label" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="tempdata.fType===1||tempdata.fType===3" label="上传文件">
          <!-- :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload" -->
          <el-upload
            v-loading.fullscreen.lock="fullscreenLoading"
            :on-success="handleImgupSuccess"
            :before-upload="beforeImgUpload"
            :on-progress="handling"
            :headers="upHeader"
            :show-file-list="false"
            :action="apibase+'/uploader/versionfile?versionShow='+tempdata.fVersionshow+'&&type='+tempdata.fType"
            class="upload-demo"
            multiple>
            <el-button size="small" type="primary">点击上传</el-button>
        </el-upload></el-form-item>
        <el-form-item v-if="tempdata.fType===2" label="上传文件">
          <!-- :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload" -->
          <el-upload
            v-loading.fullscreen.lock="fullscreenLoading"
            :on-success="handleImgupSuccess"
            :before-upload="beforeImgUpload"
            :on-progress="handling"
            :headers="upHeader"
            :show-file-list="false"
            :action="apibase+'/uploader/versionfile?versionShow='+tempdata.fVersionshow+'&&type='+tempdata.fType"
            class="upload-demo"
            multiple>
            <el-button size="small" type="primary">点击上传</el-button>
        </el-upload></el-form-item>
        <el-form-item v-if="tempdata.fType===2" label="ios下载地址">
          <el-input v-model="tempdata.fIosDownloadUrl" placeholder="ios下载地址"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogStatus==='create'?createData('tempdata'):updateData('tempdata')">确定</el-button>
        <el-button @click="isShowDialog = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { appversion, removeversion, addappversion, updateversion, updatesign } from '@/api/agency'
import { getToken } from '@/utils/auth'
import Pagination from '@/components/Pagination'
const statusMap = {
  1: '安卓',
  2: '苹果',
  3: 'window'
}
export default {
  filters: {
    showstr(v, prop) {
      if (prop === 'fType') { return statusMap[v] }
      if (prop === 'fForceStatus') { return v === 2 ? '不强制' : '强制' }
      if (prop === 'fUpgradesign') { return v === 1 ? 'true' : 'false' }
      return v
    }
  },
  components: {
    'Pagination': Pagination
  },
  props: {
    fOrgSign: {
      type: String,
      required: true
    }
  },
  data() {
    // var fVersionshow = (rule, value, callback) => {
    //   var reg = /^\d+\.\d+\.\d+$/
    //   if (!reg.test(value)) {
    //     callback(new Error('请输入正确版本号格式'))
    //   } else {
    //     callback()
    //   }
    // }
    return {
      // rules: {
      //   fVersionshow: [
      //     { validator: fVersionshow, trigger: 'blur' }
      //   ]
      // },
      value3: 'true',
      apibase: '',
      fullscreenLoading: false,
      upHeader: { Authorization: getToken() },
      name: 'test',
      listLoading: true,
      fVersioncode: '',

      isShowDialog: false,
      dialogText: {
        update: '编辑版本号',
        create: '添加版本号'
      },
      colTable: [
        { prop: 'fVersionshow', label: '展示版本号', fixed: true, width: '' },
        { prop: 'showCreateDateStr', label: '创建时间', fixed: true, width: '' },
        { prop: 'fType', label: '手机类型', fixed: true, width: '' },
        { prop: 'fVersionInfo', label: '版本描述', fixed: true, width: '' },
        { prop: 'fVersionUrl', label: '文件下载地址', fixed: true, width: '' },
        { prop: 'fIosDownloadUrl', label: 'ios下载地址', fixed: true, width: '' },
        { prop: 'upgradesign', label: '是否为最新版本', fixed: true, width: '' },
        { prop: 'fForceStatus', label: '是否需要强制升级', fixed: true, width: '' }
      ],
      list: [],
      tableData: {
        pages: '',
        pageNum: '',
        pageSize: '',
        currentPage: 1
      },
      dialogStatus: '',
      tempdata: {
        fOrgSign: this.fOrgSign
      },
      phoneType: [],
      screenType: [],
      upFileTag: '',
      changePhone: '',
      listQuery: {
        pageNum: 1,
        limit: 10,
        importance: undefined,
        title: undefined,
        fOrgSign: this.fOrgSign,
        type: undefined,
        sort: '+id'
      },
      total: 0,
      switchFlag: false
    }
  },
  watch: {
    fOrgSign: {
      immediate: true,
      deep: true,
      handler: function(val, oldVal) {
        if (val === 'screen') {
          // console.log('屏幕')
        } else {
          // this.colTable.splice(5, 0, { prop: 'fIosDownloadUrl', label: 'ios下载地址', fixed: true, width: '' },)
        }
        this.tempdata.fOrgSign = val
        this.listQuery.fOrgSign = val
        this.version()
      }
    }
  },
  created() {
    this.apibase = process.env.BASE_API
    for (const v in statusMap) {
      this.phoneType.push({ key: parseInt(v), label: statusMap[v] })
    }
    this.screenType = this.phoneType.filter(v => {
      return v.label === '安卓' || v.label === 'window'
    })
    this.downloadType = this.phoneType.filter(v => {
      return v.label === '安卓' || v.label === '苹果'
    })
    console.log('...', this.screenType)
  },
  mounted() {

  },
  methods: {
    changeFlag(index, row) {
      updatesign({ fId: row.fId }).then(res => {
        this.$notify({ title: res.msg, message: '操作成功', type: 'success', duration: 2000 })
        this.version()
      }).catch(e => {
        this.version()
      })
    },
    version() {
      appversion(this.listQuery).then(res => {
        this.listLoading = false
        this.list = res.data.list || []
        this.tableData.pages = res.data.pages
        this.tableData.pageNum = res.data.pageNum
        this.tableData.pageSize = res.data.pageSize
        this.total = res.data.total
      })
    },
    search() {
      appversion({ fVersioncode: this.fVersioncode }).then(res => {
        this.listLoading = false
        this.list = res.data.list || []
        this.tableData.pages = res.data.pages
        this.tableData.pageNum = res.data.pageNum
        this.tableData.pageSize = res.data.pageSize
        this.tableData.list.map(res => {
          if (res.fType === 1) {
            res.phoneType = '安卓'
          }
          if (res.fType === 2) {
            res.phoneType = '苹果'
          }
        })
      })
    },

    handlecreate() {
      this.dialogStatus = 'create'
      this.isShowDialog = true
      this.resetTemp()
      this.$nextTick(() => {
        this.$refs['tempdata'].clearValidate()
      })
    },
    handleEdit(row) {
      this.dialogStatus = 'update'
      this.tempdata = Object.assign({}, row)
      this.isShowDialog = true
      this.$nextTick(() => {
        this.$refs['tempdata'].clearValidate()
      })
    },
    updateData(tempdata) {
      this.$refs[tempdata].validate((valid) => {
        if (valid) {
          updateversion(this.tempdata).then(res => {
            this.isShowDialog = false
            this.$notify({ title: '成功', message: res.message, type: 'success', duration: 2000 })
            this.version()
            // this.list = this.list.map(v => { return v.fId === this.tempdata.fId ? this.tempdata : v })
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleDelete(row) {
      this.$confirm('确定要删除吗？', '提示', { type: 'warning', cancelButtonText: '取消', confirmButtonText: '确定' }).then(
        () => {
          removeversion({ fId: row.fId }).then(RES => {
            this.$notify({ title: '成功', message: '操作成功', type: 'success', duration: 2000 })
            this.list = this.list.filter((v, i) => {
              return v.fId !== row.fId
            })
          })
        }
      )
    },
    handling(e) {
      this.fullscreenLoading = true
    },
    handleImgupSuccess(res) {
      if (res.code === 0) {
        // this.tempdata.fIosDownloadUrl = res.data.url
        this.tempdata.fVersionUrl = res.data.url
        this.fullscreenLoading = false
      } else {
        this.$message.error(res.msg)
      }
    },
    beforeImgUpload(file) {
      var size = file.size / 1024
      if (size > 102400) {
        this.$message.error('上传文件大小不能超过 100MB!')
      }
      if (!file.type === 'application/vnd.android.package-archive') {
        this.$message.error('上传的文件只能是安卓.apk文件!')
      }
    },
    createData(tempdata) {
      console.log(this.tempdata)
      this.$refs[tempdata].validate((valid) => {
        if (valid) {
          if (this.tempdata.fType === 1) {
            delete this.tempdata.fIosDownloadUrl
          }
          addappversion(this.tempdata).then(res => {
            this.version()
            // this.list.unshift(res.data)
            this.isShowDialog = false
            this.$notify({ title: '成功', message: '添加成功！', type: 'success', duration: 2000 })
          })
        } else {
          console.log('error submit')
          return false
        }
      })
    },
    resetTemp() {
      this.tempdata = {
        fCreatedate: '',
        fForceStatus: '',
        fId: '',
        fStatus: '',
        fType: '',
        fVersionInfo: '',
        fVersionUrl: '',
        fVersioncode: '',
        fVersionshow: '',
        fIosDownloadUrl: window.location.origin + '/#/downloadApp?ios=1',
        showCreateDateStr: '',
        fOrgSign: this.fOrgSign
      }
    }
  }
}
</script>

<style lang="scss">
.filter-container{
  float:right;
  width:360px;
  display:flex;
.filterIns{
   width:200px;
   position:relative;
  img{
    display:block;
    width:25px;
    height:25px;
    position:absolute;
    top:8px;
    right:5px;
  }
 }
}
</style>
