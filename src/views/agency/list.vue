<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >添加企业/单位</el-button>
    </div>
    <el-table :data="list" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column label="序号" width="50" fixed align="center">
        <template slot-scope="scope">
          <span>{{ scope.$index +(tableData.pageNum - 1) * tableData.pageSize+1 }}</span>
        </template>
      </el-table-column>
      <template v-for="item in colTable">
        <el-table-column
          :fixed="item.fixed"
          :key="item.id"
          :prop="item.prop"
          :label="item.label"
          :min-width="item.width"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row[item.prop] | showstr(item.prop) }}</span>
          </template>
        </el-table-column>
      </template>
      <el-table-column align="center" prop="created_at" label="操作" width="480">
        <template slot-scope="scope">
          <!-- 企业单位列表 标签 2019/09/02  fxl-start -->

          <el-button
            type="primary"
            size="small"
            icon="el-icon-ed
            it"
            @click="handleTag(scope.row)">标签</el-button>
          <!-- 企业单位列表 标签 2019/09/02  fxl-end -->

          <el-button
            type="primary"
            size="small"
            icon="el-icon-edit"
            @click="handleEdit(scope.row)"
          >编辑</el-button>
          <el-tooltip :content="scope.row['sysUser']? scope.row['sysUser']['userName']:'创建主账号'">
            <el-button
              class="sysUser"
              type="primary"
              size="small"
              @mouseover="changeActive(e)"
              @mouseout="removeActive(e)"
              @click="handleAdmin(scope.row)"
            >{{ scope.row["sysUser"]? scope.row["sysUser"]["userName"]:'创建主账号' }}</el-button>
          </el-tooltip>
          <el-button
            v-if="scope.row.sysUser"
            type="success"
            size="small"
            @click="handleGrant(scope.row)"
          >业务授权</el-button>
          <el-button
            type="danger"
            size="small"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.pageNum"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
    <el-dialog :visible.sync="isShowAgcAdmin" :title="'主账号'" class="diaAddorg">
      <addagcadmin
        :formdata="dataAgcAdmin"
        @createAgcAdmin="handleAgcCreateAdmin"
        @closeAgcAdmin="isShowAgcAdmin=false"
      />
    </el-dialog>

    <el-dialog :visible.sync="$store.state.user.gateList" :title="'账号授权'">
      <treegrantbusi :userid="tempdata.sysUser? tempdata.sysUser.userId.toString():''" />
    </el-dialog>

    <!-- class="diaAddorg" -->
    <el-dialog :visible.sync="isShowDialog" :title="dialogText[dialogStatus]">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="tempdata"
        class="dialogform"
        label-width="110px"
      >
        <el-form-item label="名称" prop="organizationName">
          <el-input
            v-model="tempdata.organizationName"
            placeholder="名称"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item label="地址" prop="organizationAddress">
          <el-input v-model="tempdata.organizationAddress" placeholder="地址" />
        </el-form-item>
        <el-form-item label="联系人">
          <el-input v-model="tempdata.organizationLinkman" placeholder="联系人" />
        </el-form-item>
        <el-form-item label="联系电话" prop="organizationPhone">
          <el-input v-model="tempdata.organizationPhone" placeholder="联系电话" />
        </el-form-item>
        <el-form-item label="网址">
          <el-input v-model="tempdata.organizationUrl" placeholder="网址" />
        </el-form-item>

        <el-form-item label="最大设备数量">
          <el-input v-model="tempdata.maxdevicenum" placeholder="最大可关联设备数量（默认位1000）" />
        </el-form-item>
        <el-form-item label="业务中心模板" prop="organizationTemplate">
          <el-select v-model="tempdata.organizationTemplate" placeholder="请选择">
            <el-option
              v-for="item in templateCon"
              :key="item.organizationTemplate"
              :label="item.organizationName"
              :value="item.organizationTemplate"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="单位登录LOGO">
          <!-- :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload" -->
          <el-upload
            :show-file-list="false"
            :action="apibase+'/uploader/img'"
            :headers="upHeader"
            :on-success="handleImgupSuccess"
            :before-upload="(file)=>{return beforeImgUpload(file,'organizationLoginLogo')}"
            class="avatar-uploader"
          >
            <img
              v-if="tempdata.organizationLoginLogo"
              :src="tempdata.organizationLoginLogo"
              style="display:block;width:60px;height:60px"
              class="avatar"
            >
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
        <el-form-item label="地址" prop="codeChainAddr">
          <el-cascader
            :options="arAddrs"
            :props="propsAddr"
            :change-on-select="1<2"
            v-model="codeChainAddr"
            style="width:80%"
            @change="handleAddrChange"
          />
        </el-form-item>
        <el-form-item label="单位LOGO">
          <el-upload
            :show-file-list="false"
            :headers="upHeader"
            :action="apibase+'/uploader/img'"
            :on-success="handleImgupSuccess"
            :before-upload="(file)=>{return beforeImgUpload(file,'organizationLogo')}"
            class="avatar-uploader"
          >
            <img
              v-if="tempdata.organizationLogo"
              :src="tempdata.organizationLogo"
              style="display:block;width:60px;height:60px"
              class="avatar"
            >
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="tempdata.status" placeholder="请选择">
            <el-option
              v-for="opt in optsUserStatus"
              :key="opt.key"
              :value="opt.key"
              :label="opt.label"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="汽车品牌" prop="carBrand">
          <el-select v-model="tempdata.carBrand" placeholder="请选择">
            <el-option v-for="opt in carBrandOpt" :key="opt.fBrandId" :value="opt.fBrandName" :label="opt.fBrandName" />
          </el-select>
        </el-form-item>
        <el-form-item label="品牌关键字" prop="keyword">
          <el-input v-model="tempdata.keyword" type="text" placeholder="品牌关键字（多个关键字需用英文逗号分隔）" />
        </el-form-item>
        <el-form-item label="App类型">
          <el-select v-model="tempdata.checkAppSign" placeholder="请选择">
            <el-option v-for="(opt,idx) in gatenumData" :key="idx" :value="opt.index" :label="opt.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="tempdata.remark" type="textarea" placeholder="备注" />
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确定</el-button>
        <el-button @click="isShowDialog = false">取消</el-button>
      </div>
    </el-dialog>
    <!-- 企业单位列表  2019/09/02  fxl-start -->
    <el-dialog :visible.sync="$store.state.user.tagshow" title="请选择标签" width="55%">
      <listTags :tags="tags" :f-unit="fUnit" :f-aid="fAid"/>
    </el-dialog>
  </div>
</template>

<style lang="scss" >
.diaAddorg {
  .el-dialog__body {
    height: 65%;
    overflow: hidden;
    overflow-y: scroll;
  }
}
</style>

<script>
import { getRow } from '@/api/org'

import { getList as fetchList, addRow, updateRow, delRow, selectRepetition, organizationGetenum } from '@/api/agency'
import { authoBrand } from '@/api/car'
import { getSubArea } from '@/api/addr'
import { getToken } from '@/utils/auth'
import addagcadmin from './addAgcAdmin'
import treegrantbusi from '../ucenter/users/treegrantbusi'
import Pagination from '@/components/Pagination'
import listTags from './components/listTags'
import {
  AuthorizationGetlabels
} from '@/api/tag'
// import ase from '@/utils/ase'
const userStatusMap = {
  0: '正常',
  1: '停用'
}
function fillchildren(ar) {
  ar.length && ar.forEach((v, i) => {
    if (v.children) {
      fillchildren(v.children)
    } else {
      v.children = []
    }
  })
  return ar
}
export default {
  filters: {
    showstr(v, prop) {
      if (prop === 'status') { return userStatusMap[v] }
      return v
    }
  },
  components: {
    'addagcadmin': addagcadmin,
    'treegrantbusi': treegrantbusi,
    'Pagination': Pagination,
    'listTags': listTags
  },
  data() {
    var organizationPhone = (rule, value, callback) => {
      console.log(this.tempdata.organizationPhone)
      var reg = /^\d{11}$/
      if (this.tempdata.organizationPhone) {
        if (!reg.test(value)) {
          callback(new Error('请输入正确的手机号格式'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    const organizationName = (rule, value, callback) => {
      if (this.tempdata.organizationName) {
        selectRepetition({ organizationId: this.tempdata.organizationId, organizationName: this.tempdata.organizationName }).then(res => {
          console.log(res, 'res')
          if (res.data === false) {
            callback(new Error('名称重复'))
          } else {
            callback()
          }
        }).catch(e => {
          callback(new Error('名称重复'))
        })
      }
    }
    const organizationAddress = (rule, value, callback) => {
      if (this.tempdata.organizationAddressCode) {
        selectRepetition({ organizationId: this.tempdata.organizationId, organizationAddressCode: this.tempdata.organizationAddressCode }).then(res => {
          console.log(res, 'res')
          if (res.data === false) {
            callback(new Error('地址重复'))
          } else {
            callback()
          }
        }).catch(e => {
          callback(new Error('地址重复'))
        })
      } else {
        callback()
      }
    }
    return {
      apibase: '',
      upHeader: { Authorization: getToken() },
      upImgTag: '',
      colTable: [
        { prop: 'organizationName', label: '名称', fixed: true, width: '' },
        { prop: 'orgCompanyCode', label: '单位编码', fixed: true, width: '' },
        { prop: 'organizationAddress', label: '单位地址', fixed: true, width: '' },
        { prop: 'organizationPhone', label: '联系电话', fixed: true, width: '' },
        { prop: 'organizationUrl', label: '域名', fixed: true, width: '' },
        { prop: 'remark', label: '说明', fixed: true, width: '' },
        { prop: 'status', label: '状态', fixed: true, width: '' }
      ],
      tableData: {
        list: [],
        pages: '',
        pageNum: '',
        pageSize: '',
        currentPage: 1
      },
      listQuery: {
        pageNum: 1,
        limit: 10,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      total: 0,
      list: [],
      formdata: {},
      dialogText: {
        update: '编辑单位/企业',
        create: '添加单位/企业'
      },
      tempdata: {
        id: '',
        templagecode: '1'
      },
      optsUserStatus: [],
      dialogStatus: '',
      isShowDialog: false,
      isShowAgcAdmin: false,
      isShowGrantDialog: false,
      dataAgcAdmin: {},
      rules: {
        organizationName: [
          { required: true, message: '请填写名称', trigger: 'blur' },
          { validator: organizationName, trigger: 'blur' }
        ],
        organizationTemplate: [{ required: true, message: '选择业务中心模板', trigger: 'change' }],
        username: [{ required: true, message: '请填写用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请填写密码', trigger: 'blur' }],
        phone: [{ required: true, message: '请填写手机号', trigger: 'blur' }],
        carBrand: [{ required: true, message: '请选择汽车品牌', trigger: 'change' }],
        keyword: [{ required: true, message: '请选择品牌关键字', trigger: 'blur' }],
        // labels: [{ required: true, message: '请输入标签', trigger: 'blur' }],
        organizationPhone: [
          { validator: organizationPhone, trigger: 'blur' }
        ],
        codeChainAddr: [
          { validator: organizationAddress, trigger: 'change' }
        ],
        organizationAddress: [
          { validator: organizationAddress, trigger: 'change' }
        ]
      },
      templateCon: [
        { organizationTemplate: 'benz', organizationName: '奔驰' },
        { organizationTemplate: 'dongfeng-nissan', organizationName: '东风日产' }
      ],
      carBrandOpt: [
        '奔驰', '宝马', '奥迪', '丰田', '东风日产'
      ],
      //  企业单位列表 标签 2019/09/02  fxl-start
      tags: [],
      fAid: '',
      fUnit: '',
      arAddrs: [],
      propsAddr: {
        label: 'name',
        value: 'code',
        children: 'children'
      },
      codeChainAddr: [],
      arFstAddrs: [],
      gatenumData: []
    }
  },
  created() {
    this.apibase = process.env.BASE_API
    for (const v in userStatusMap) {
      this.optsUserStatus.push({ key: parseInt(v), label: userStatusMap[v] })
    }
    this.getList()
    this.loadSubArea(0, 1)
    this.authoBrand()
  },
  mounted() {
  },
  methods: {
    authoBrand() {
      authoBrand().then(res => {
        this.carBrandOpt = res.data
        console.log(this.carBrandOpt)
      })
    },
    getList() {
      fetchList(this.listQuery).then(res => {
        this.list = res.data.list || []
        this.tableData.pages = res.data.pages
        this.tableData.pageNum = res.data.pageNum
        this.tableData.pageSize = res.data.pageSize
        this.total = res.data.total
      })
    },
    handleImgupSuccess(res) {
      if (res.code === 0) {
        this.tempdata[this.upImgTag] = res.data.url
      } else {
        this.$message.error(res.msg)
      }
    },
    beforeImgUpload(file, tag) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'application/x-jpg' || file.type === 'application/x-png' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2
      this.upImgTag = tag
      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    createData() {
      console.log(this.tempdata)
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          addRow(this.tempdata).then(res => {
            this.tempdata.organizationId = res.data.organizationId
            this.tempdata.organizationCode = res.data.organizationCode
            this.list.unshift(res.data)
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
            this.isShowDialog = false
          })
        }
      })
    },
    updateData() {
      // console.log(this.tempdata)
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          delete this.tempdata.adreassTree
          updateRow(this.tempdata).then(res => {
            this.$notify({ title: '成功', message: '操作成功', type: 'success', duration: 2000 })
            this.isShowDialog = false
            this.getList()
            // this.list = this.list.map(v => { return v.organizationId === this.tempdata.organizationId ? this.tempdata : v })
          })
        }
      })
    },
    handleAddrChange(val) {
      let addrText = ''
      let lastcode = ''
      const objAddr = val.reduce((prev, cur) => { const objnow = prev.children.filter(v => { return v.code === cur })[0]; addrText += objnow['name']; lastcode = objnow['code']; return objnow }, { children: this.arAddrs })
      this.tempdata.organizationAddress = addrText
      this.tempdata.organizationAddressCode = lastcode
      getSubArea({ parentCode: val[val.length - 1], grade: (val.length + 1) }).then(res => {
        if (res.data.length) {
          const tempar = val.length === 6 ? res.data : res.data.map(v => { v.children = []; return v })
          objAddr.children = tempar
          this.arAddrs = [...this.arAddrs]
        }
      })
    },
    loadSubArea(parentCode, grade) {
      getSubArea({ parentCode, grade }).then(res => {
        const artemp = res.data.map(v => { v.children = []; return v })
        this.arAddrs = artemp
        if (grade === 1) {
          this.arFstAddrs = artemp
        }
      })
    },
    handleEdit(row) {
      this.dialogStatus = 'update'
      this.gatenum()
      this.resetTemp()
      this.tempdata = Object.assign({}, row)
      this.isShowDialog = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      getRow({ organizationId: row.organizationId }).then(res => {
        this.tempdata = res.data
        if (res.data.adreassTree) {
          this.arAddrs = fillchildren(res.data.adreassTree)
          this.codeChainAddr = res.data.codes
        } else {
          this.arAddrs = [...this.arFstAddrs]
          this.codeChainAddr = []
        }
      })
    },
    handleCreate() {
      this.gatenum()
      this.dialogStatus = 'create'
      this.arAddrs = [...this.arFstAddrs]
      this.isShowDialog = true
      this.resetTemp()
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    gatenum() {
      organizationGetenum().then(res => {
        this.gatenumData = res.data
        console.log(this.gatenumData, 'ewewewq')
      })
    },
    handleDelete(row) {
      this.$confirm('确定要删除吗？', '提示', { type: 'warning', cancelButtonText: '取消', confirmButtonText: '确定' }).then(
        () => {
          delRow(row).then((res) => {
            this.$notify({ title: '成功', message: '操作成功', type: 'success', duration: 2000 })

            this.list = this.list.filter((v, i) => {
              return v.organizationId !== row.organizationId
            })
          })
        }
      )
    },
    handleTag(row) {
      console.log(row)
      this.fAid = row.organizationId
      this.fUnit = row.organizationName

      AuthorizationGetlabels({ Authorization: this.userToken, shopId: row.organizationId }).then(res => {
        this.tags = res.data
        this.$store.commit('GATELIST_TAGSHOW', true)
      })
    },
    handleGrant(row) {
      this.tempdata = Object.assign({}, row)
      this.$store.commit('GATELIST_TREEGRENTBUSI', true)
    },
    handleAdmin(row) {
      this.tempdata = Object.assign({}, row)
      this.dataAgcAdmin = Object.assign({}, row.sysUser || {}, { userPwd: '', organizationId: row.organizationId })
      this.isShowAgcAdmin = true
    },
    handleAgcCreateAdmin(objAdm) {
      this.list = this.list.map(v => { return v.organizationId === this.tempdata.organizationId ? { ...v, ...{ sysUser: objAdm }} : v })
      console.log(this.list)
      this.isShowAgcAdmin = false
    },
    resetTemp() {
      this.tempdata = {
        id: '',
        status: '',
        organizationLoginLogo: '',
        organizationLogo: '',
        carBrand: '',
        keyword: '',
        organizationTemplate: 'benz',
        checkAppSign: 'benz',
        templagecode: '1'

        // labels: ''
      }
      this.codeChainAddr = []
    }
  }
}
</script>
<style lang="scss" scoped>
.sysUser {
  width: 80px;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
