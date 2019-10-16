<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >添加</el-button>
      <el-button
        v-if="authorition.includes('ucenteusersImport')"
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        @click="exportflag=true"
      >批量导入</el-button>
    </div>
    <el-dialog :visible.sync="exportflag">
      <el-form>
        <el-form-item label="上传配置文件">
          <el-upload
            ref="fileup"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            :headers="upHeader"
            :on-success="doneupload"
            :before-upload="beforeupload"
            :on-change="changeImgUpload"
            :show-file-list="1>2"
            :action="apibase+'/admin/user/uploader/excel'"
            class="dataconfigup"
            multiple
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
          <a style="margin-left:100px;text-decoration:underline" @click="handlePreview()">下载用户模板文件</a>
          <div class />
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-table :data="list" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column label="序号" type="index" width="50" fixed align="center">
        <template slot-scope="scope">
          <span>{{ scope.$index +(tableData.pageNum - 1) * tableData.pageSize+1 }}</span>
          <!-- <span>{{ (tableData.pageNum - 1) * tableData.pageSize + scope.$index + 1 }}</span> -->
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
      <el-table-column align="center" prop="created_at" label="操作" width="390">
        <template slot-scope="scope">
          <template v-if="scope.row['userPid'] && admin_id!==scope.row['userId']">
            <el-button
              type="primary"
              size="small"
              icon="el-icon-edit-outline"
              @click="handleTag(scope.row)"
            >标签</el-button>
            <el-button
              type="primary"
              size="small"
              icon="el-icon-edit"
              @click="handleEdit(scope.row)"
            >编辑</el-button>
            <el-button
              type="danger"
              size="small"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
            >删除</el-button>
            <el-button
              type="success"
              size="small"
              icon="el-icon-check"
              @click="handleGrant(scope.row)"
            >授权</el-button>
          </template>
          <template v-else>
            <span>禁止操作</span>
          </template>
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
    <el-dialog
      :visible.sync="$store.state.user.gateList"
      :title="'账号授权'"
      :before-close="closeTabDialog"
    >
      <el-tabs v-model="defaultGrantTab" type="card" @tab-click="grantTabClick">
        <el-tab-pane label="设置角色" name="tabSetRole">
          <treesetrole
            :userid="tempdata.userId? tempdata.userId.toString():''"
            @updateRoleNames="updateRoleNames"
          />
        </el-tab-pane>
        <el-tab-pane label="数据授权" name="tabGrantData" >
          <treegrantdata :userid="tempdata.userId? tempdata.userId.toString():''" />
        </el-tab-pane>
        <el-tab-pane label="业务授权" name="tabGrandBusi">
          <treegrantbusi :userid="tempdata.userId? tempdata.userId.toString():''" />
        </el-tab-pane>
      </el-tabs>
    </el-dialog>

    <el-dialog
      :visible.sync="isShowDialog"
      :title="dialogText[dialogStatus]"
      :before-close="closeDialog"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="tempdata"
        class="dialogform"
        label-width="90px"
      >
        <input v-model="tempdata.userId" type="hidden" >
        <el-form-item label="登录名" prop="userName">
          <el-input v-model="tempdata.userName" auto-complete="new-password" placeholder="登录名" />
        </el-form-item>
        <el-form-item label="登录密码" prop="userPwd">
          <el-input
            v-model="tempdata.userPwd"
            :placeholder="dialogStatus==='update'?'不修改密码则留空':'密码'"
            type="password"
            auto-complete="new-password"
          />
        </el-form-item>
        <el-form-item label="密码确认" prop="rePwd">
          <el-input
            v-model="tempdata.rePwd"
            :placeholder="dialogStatus==='update'?'不修改密码则留空':'确认密码'"
            type="password"
            auto-complete="off"
          />
        </el-form-item>
        <el-form-item label="真实姓名" prop="userRealName">
          <el-input v-model="tempdata.userRealName" placeholder="真实姓名" />
        </el-form-item>
        <el-form-item label="联系电话" prop="userPhone">
          <el-input v-model="tempdata.userPhone" placeholder="联系电话"/>
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="tempdata.userAddress" placeholder="地址" />
        </el-form-item>
        <el-form-item label="所属组织" prop="orgChain">
          <el-cascader
            :options="selectOrgTree"
            :props="proporg"
            v-model="tempdata.orgChain"
            change-on-select
          />
        </el-form-item>
        <el-form-item label="说明">
          <el-input v-model="tempdata.remark" type="textarea" placeholder="说明" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确定</el-button>
        <el-button @click="closeDialog()">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="$store.state.user.tagshow" title="请选择标签" width="55%">
      <tag
        :tags="tags"
        :f-uint="fUint"
        :flabelname="fLabelName"
        :f-aid="fAid"
        :user-id="userId"
        :user-tags="userTags"
        @closeTags="closeTags"
      />
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import {
  getlabels,
  getlabeluser
} from '@/api/tag'
import { selectRepetition } from '@/api/agency'

import { Loading } from 'element-ui'
import { authorization } from '@/api/device'
import { getList as fetchList, addRowUser, updateRowUser, delRowUser, selectByName,
  selectByPhone } from '@/api/users'
import { mapGetters } from 'vuex'
import { getToken } from '@/utils/auth'
import treegrantdata from './treegrantdata'
import treegrantbusi from './treegrantbusi'
import treesetrole from './treesetrole'
import ase from '@/utils/ase'
import tag from './setTags'
// import axios from 'axios'
const userStatusMap = {
  0: '正常',
  1: '停用'
}
let loadingRequest
export default {
  filters: {
    showstr(v, prop) {
      if (prop === 'status') { return userStatusMap[v] }
      if (prop === 'userManage') { return v === 2 ? '是' : '否' }
      return v
    }
  },
  components: {
    'treegrantdata': treegrantdata,
    'treegrantbusi': treegrantbusi,
    'treesetrole': treesetrole,
    'Pagination': Pagination,
    'tag': tag
  },
  data() {
    var userPwd = (rule, value, callback) => {
      // alert(value)
      var reg = /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{6,30}$/
      if (this.tempdata.userPwd === undefined) {
        callback()
      } else {
        if (!reg.test(this.tempdata.userPwd)) {
          callback(new Error('（密码至少为6位的字母、数字和特殊符号的组合）'))
        } else {
          callback()
        }
      }
    }
    var rePwd = (rule, value, callback) => {
      if (this.tempdata.userPwd !== '') {
        if (this.tempdata.rePwd !== this.tempdata.userPwd) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    var userAddress = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入地址'))
      } else {
        if (this.tempdata.organizationId) {
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
          selectRepetition({ organizationAddressCode: this.tempdata.organizationAddressCode }).then(res => {
            console.log(res, 'res')
            if (res.data === false) {
              callback(new Error('地址重复'))
            } else {
              callback()
            }
          }).catch(e => {
            callback(new Error('地址重复'))
          })
        }
      }
    }
    var userRealName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入真实姓名'))
      } else {
        callback()
      }
    }
    var orgChain = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请选择所属组织'))
      } else {
        callback()
      }
    }
    const chkUserName = (rule, value, callback) => {
      if (this.tempdata.userId) {
        selectByName({ name: this.tempdata.userName, userId: this.tempdata.userId }).then(res => {
          console.log(res, 'res')
          if (res.data === false) {
            callback(new Error('登陆名重复'))
          } else {
            callback()
          }
        }).catch(e => {
          callback(new Error('登陆名重复'))
        })
      } else {
        selectByName({ name: this.tempdata.userName }).then(res => {
          console.log(res, 'res')
          if (res.data === false) {
            callback(new Error('登陆名重复'))
          } else {
            callback()
          }
        }).catch(e => {
          callback(new Error('登陆名重复'))
        })
      }
    }
    const chkUserPhone = (rule, value, callback) => {
      if (this.tempdata.userId) {
        selectByPhone({ phone: this.tempdata.userPhone, userId: this.tempdata.userId }).then(res => {
          console.log(res, 'res')
          if (res.data === false) {
            callback(new Error('联系电话重复'))
          } else {
            callback()
          }
        }).catch(e => {
          callback(new Error('联系电话重复'))
        })
      } else {
        selectByPhone({ phone: this.tempdata.userPhone }).then(res => {
          console.log(res, 'res')
          if (res.data === false) {
            callback(new Error('联系电话重复'))
          } else {
            callback()
          }
        }).catch(e => {
          callback(new Error('联系电话重复'))
        })
      }
    }
    return {
      colTable: [
        { prop: 'userName', label: '登录名', fixed: true, width: '' },
        { prop: 'userRealName', label: '真实姓名', fixed: true, width: '' },
        { prop: 'organizationName', label: '所属组织', fixed: true, width: '' },
        { prop: 'userManage', label: '是否主账户', fixed: true, width: '' },
        { prop: 'userPhone', label: '联系电话', fixed: true, width: '' },
        { prop: 'userAddress', label: '联系地址', fixed: true, width: '' },
        { prop: 'userLabel', label: '用户标签', fixed: true, width: '' },
        { prop: 'roleNameList', label: '角色', fixed: true, width: '' }
        // { prop: 'status', label: '状态', fixed: true, width: '' }
      ],
      fUint: '',
      fAid: '',
      tags: [],
      userTags: [],
      userId: '',
      tableData: {
        list: [],
        pages: '',
        pageNum: '',
        pageSize: '',
        currentPage: 1
      },
      input: '',
      listQuery: {
        pageNum: 1,
        limit: 10,
        importance: undefined,
        title: undefined,
        type: undefined,
        fengxlTest: Math.round(Math.random()),
        sort: '+id'
      },
      total: 0,
      list: [],
      formdata: {},
      dialogText: {
        update: '编辑账号',
        create: '添加账号'
      },
      tempdata: {
        userId: '',
        userName: '',
        userPwd: '',
        rePwd: '',
        userRealName: '',
        userPhone: '',
        userAddress: '',
        remark: '',
        status: 0,
        organizationChain: [],
        orgChain: [],
        organizationId: ''
      },
      userToken: this.$store.state.user.token,
      dialogStatus: '',
      listLoading: true,
      isShowDialog: false,
      rules: {
        userName: [
          { required: true, message: '请填写用户名', trigger: 'blur' },
          { validator: chkUserName, trigger: 'blur' }
        ],
        rePwd: [{ validator: rePwd, trigger: 'blur' }],
        userPwd: [{ validator: userPwd, trigger: 'blur' }],
        userAddress: [{ validator: userAddress, trigger: 'blur' }],
        orgChain: [{ required: true, validator: orgChain, trigger: 'change' }],
        userRealName: [{ required: true, validator: userRealName, trigger: 'blur' }],
        userPhone: [
          { validator: chkUserPhone, trigger: 'blur' },
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^\d{11}$/, message: '请输入正确的电话号码格式' }]

      },
      optsStatus: [],
      proporg: {
        label: 'organizationName',
        value: 'organizationId',
        children: 'children'
      },
      showGrantDialog: false,
      defaultGrantTab: 'tabSetRole',
      fLabelName: '',
      exportflag: false,
      upHeader: { Authorization: getToken() },
      apibase: process.env.BASE_API,
      authorition: []
    }
  },
  computed: {
    ...mapGetters([
      'selectOrgTree',
      'admin_id',
      'loginKey'
    ])
  },
  created() {
    console.log(this.loginKey)
    this.getList()
    for (const v in userStatusMap) {
      this.optsStatus.push({ key: parseInt(v), label: userStatusMap[v] })
    }
    this.authorizations()
  },
  methods: {
    authorizations() {
      authorization({ code: 'ucenteusersImport' }).then(res => {
        this.authorition = res.data
      })
    },
    doneupload(res, file, flist) {
      loadingRequest.close()
      if (res.code === 0) {
        this.getList()
        this.$message({
          showClose: true,
          message: res.msg,
          type: 'success'
        })
      }
      if (res.code === 7) {
        this.$message({
          showClose: true,
          message: res.msg,
          type: 'error'
        })
      }
      if (res.code === 8) {
        this.$message({
          showClose: true,
          message: res.msg,
          type: 'error'
        })
      }
      if (res.code === 9) {
        this.$message({
          showClose: true,
          message: res.msg,
          type: 'error'
        })
      }
      if (res.code === 10) {
        this.$message({
          showClose: true,
          message: res.msg,
          type: 'error'
        })
      }
      if (res.code === 6) {
        const user = res.data.map(v => {
          return v.userName
        })
        this.$confirm(user, res.msg, {
          confirmButtonText: '确定',
          cancelButtonText: '取消'

        })
      }
    },
    handleRemove(file, fileList) {
    },
    handlePreview(file) {
      window.open(process.env.BASE_API + '/admin/user/download/templateExcel?userId=' + this.admin_id)
    },
    beforeupload(file) {
      if (file.type === '') {
        this.$message.error('文件格式有误!')
      } else if (file.type.indexOf('excel') < 0) {
        this.$message.error('请上传xls、xlsx文件!')
        return false
      } else {
        loadingRequest = Loading.service({ background: 'rgba(255, 255, 255, 0.2)' })
      }
    },
    changeImgUpload() {
      // if (loadingRequest) { loadingRequest.close() }
    },
    beforeRemove(file, fileList) {
      // return this.$confirm(`确定移除 ${file.name}？`)
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    handleCheckChange(data, checked, indeterminate) {
      // console.log(data, checked, indeterminate)
    },
    handleSelectionChange(val) {
      this.chkedrows = val
    },
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(res => {
        this.listLoading = false
        this.list = res.data.list || []
        this.tableData.pages = res.data.pages
        this.tableData.pageNum = res.data.pageNum
        this.tableData.pageSize = res.data.pageSize
        this.total = res.data.total
      })
    },
    handleCurrentChange(size) {
      fetchList({ page: size }).then(res => {
        this.listLoading = false
        this.list = res.data.list || []
        this.tableData.pages = res.data.pages
        this.tableData.pageNum = res.data.pageNum
        this.tableData.pageSize = res.data.pageSize
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.tempdata.rePwd !== '') {
            console.log(this.loginKey)
            this.tempdata.organizationId = this.tempdata.orgChain[this.tempdata.orgChain.length - 1]

            this.tempdata.rePwd = ase.encrypt(this.tempdata.rePwd, this.loginKey)
            this.tempdata.userPwd = ase.encrypt(this.tempdata.userPwd, this.loginKey)
            console.log(this.tempdata.rePwd)
            if (this.tempdata.orgChain !== '') { this.tempdata.organizationChain = this.tempdata.orgChain.join('-') }
            this.tempdata.orgChain = []
            console.log(this.tempdata)
            addRowUser(this.tempdata).then(res => {
              // this.getList()
              this.list.unshift(res.data)
              this.$notify({ title: '成功', message: '创建成功', type: 'success', duration: 2000 })
              this.closeDialog()
            })
          }
        }
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.tempdata.userPwd !== '') {
            this.tempdata.userPwd = ase.encrypt(this.tempdata.userPwd, this.loginKey)
            this.tempdata.rePwd = ase.encrypt(this.tempdata.rePwd, this.loginKey)
          } else {
            delete this.tempdata.userPwd
            delete this.tempdata.rePwd
          }
          this.tempdata.organizationId = this.tempdata.orgChain[this.tempdata.orgChain.length - 1]
          this.tempdata.organizationChain = this.tempdata.orgChain.join('-')
          console.log(this.tempdata.organizationChain)
          updateRowUser(this.tempdata).then(res => {
            this.$notify({ title: '成功', message: '编辑成功', type: 'success', duration: 2000 })
            // this.getList()
            this.list = this.list.map(v => { return v.userId === this.tempdata.userId ? this.tempdata : v })
            this.closeDialog()
          })
        }
      })
    },
    handleTag(row) {
      this.fUint = row.organizationName
      this.fAid = row.orgAddressCode
      this.userId = row.userId
      getlabels({ Authorization: this.userToken, fAid: row.orgAddressCode, chain: row.organizationChain }).then(res => {
        this.tags = res.data
        this.$store.commit('GATELIST_TAGSHOW', true)
      })
      getlabeluser({ userId: row.userId, fAid: row.orgAddressCode }).then(res => {
        this.userTags = res.data
      })
    },
    handleEdit(row) {
      this.dialogStatus = 'update'
      this.tempdata = Object.assign({}, row)
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      // this.tempdata.orgChain = []
      this.isShowDialog = true
    },
    handleCreate() {
      this.dialogStatus = 'create'
      this.isShowDialog = true
      this.tempdata.userPwd = ''
      this.tempdata.rePwd = ''
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      // this.tempdata.orgChain = []
    },
    handleGrant(row) {
      this.tempdata = row
      this.$store.commit('GATELIST_TREEGRENTBUSI', true)
    },
    handleDelete(row) {
      this.$confirm('确定要删除吗？', '提示', { type: 'warning', confirmButtonText: '确定', cancelButtonText: '取消' }).then(
        () => {
          delRowUser(row).then((res) => {
            this.$notify({ title: '成功', message: '操作成功', type: 'success', duration: 2000 })
            this.list = this.list.filter((v, i) => {
              return v.userId !== row.userId
            })
          })
        }
      )
    },
    closeDialog(done) {
      this.resetTemp()
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      this.isShowDialog = false
    },
    closeTabDialog() {
      location.reload()
      this.$store.commit('GATELIST_TREEGRENTBUSI', false)
    },
    updateRoleNames(roleNames) {
      this.tempdata.roleNameList = roleNames
      this.list = this.list.map(v => { return v.userId === this.tempdata.userId ? this.tempdata : v })
    },
    grantTabClick(tab, event) {
    },
    closeTags(val) {
      if (val) {
        this.getList()
      }
    },
    resetTemp() {
      this.tempdata = {
        organizationId: '',
        userId: '',
        userName: '',
        userPwd: '',
        rePwd: '',
        userRealName: '',
        userPhone: '',
        userAddress: '',
        remark: '',
        status: '',
        organizationChain: '',
        orgChain: [121]
      }
    }
  }
}
</script>
