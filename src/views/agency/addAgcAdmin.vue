<template>
  <div >

    <el-form ref="dataForm" :rules="rules" :model="tempdata" :before-close="closeDialog" class="dialogform" label-width="110px">
      <input v-model="tempdata.organizationId" type="hidden">
      <input v-model="tempdata.userId" type="hidden">
      <el-form-item label="登录名" prop="userName">
        <el-input v-model="tempdata.userName" auto-complete="new-password" placeholder="登录名" @change="nameChange"/>
        <!-- <el-input style="postion:fixed;bottom:-9999px;" type="text"/> -->
      </el-form-item>
      <el-form-item label="登录密码" prop="userPwd">
        <!-- <el-input style="postion:fixed;bottom:-9999px;" type="password"/> -->
        <el-input v-model="tempdata.userPwd" auto-complete="new-password" type="password" placeholder="不更改密码请不要输入"/>
      </el-form-item>
      <el-form-item label="密码确认" prop="rePwd">
        <el-input v-model="tempdata.rePwd" type="password" placeholder="不更改密码请不要输入" autocomplete="off"/>
      </el-form-item>
      <el-form-item label="真实姓名" prop="userRealName">
        <el-input v-model="tempdata.userRealName" placeholder="真实姓名"/>
      </el-form-item>
      <el-form-item label="联系电话" prop="userPhone">
        <el-input v-model="tempdata.userPhone" placeholder="联系电话"/>
      </el-form-item>
      <el-form-item label="联系地址">
        <el-input v-model="tempdata.userAddress" placeholder="联系地址"/>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="tempdata.remark" type="textarea" placeholder="备注"/>
      </el-form-item>

    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="tempdata.userId?updateData('tempdata'):createData('tempdata')">确定</el-button>
      <el-button @click="closeDialog">取消</el-button>
    </div>
  </div>
</template>

<style lang="scss" >
.diaAddorg{
  .el-dialog__body{ height: 65%;overflow: hidden; overflow-y: scroll;}
}
</style>

<script>
import { addAgcAdmin as addRow, setAgcAdmin as updateRow, selectByName } from '@/api/agency'
import ase from '@/utils/ase'
import { mapGetters } from 'vuex'

const userStatusMap = {
  0: '正常',
  1: '停用'
}
export default {
  filters: {
    showstr(v, prop) {
      if (prop === 'status') { return userStatusMap[v] }
      return v
    }
  },
  props: {
    'formdata': {
      type: Object,
      default() {
        return {

        }
      }
    }
  },
  data() {
    var validatePass2 = (rule, value, callback) => {
      if (this.tempdata.userPwd !== '') {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.tempdata.userPwd) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    var validatePass1 = (rule, value, callback) => {
      var reg = /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{6,30}$/
      if (value !== '') {
        if (!reg.test(this.tempdata.userPwd)) {
          callback(new Error('（密码至少为6位的字母、数字和特殊符号的组合）'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    var userPhone = (rule, value, callback) => {
      var reg = /^\d{11}$/
      if (value !== '') {
        if (!reg.test(value)) {
          callback(new Error('请输入正确的手机号格式'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return {
      tempdata: {
        userName: '',
        userPwd: '',
        userRealName: '',
        userPhone: '',
        userAddress: '',
        remark: '',
        organizationId: ''
      },
      dialogText: {
        update: '编辑账号',
        create: '添加账号'
      },
      dialogStatus: '',
      rules: {
        userRealName: [{ required: true, message: '请填写真实姓名', trigger: 'blur' }],
        userName: [{ required: true, message: '请填写用户名', trigger: 'blur' }],
        userPwd: [
          { validator: validatePass1, trigger: 'blur' }
        ],
        rePwd: [
          { validator: validatePass2, trigger: 'blur' }
        ],
        userPhone: [
          { validator: userPhone, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'loginKey'

    ])

  },
  watch: {
    formdata(curval, oldval) {
      this.tempdata = curval
    }
  },
  created() {
    this.tempdata = this.formdata
  },
  methods: {
    closeDialog(done) {
      this.resetTemp()
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      this.$emit('closeAgcAdmin')
    },
    nameChange() {
      selectByName({ name: this.tempdata.userName }).then(res => {

      })
    },
    createData(dataForm) {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.tempdata.userPwd !== '') {
            this.tempdata.userPwd = ase.encrypt(this.tempdata.userPwd, this.loginKey)
            this.tempdata.rePwd = ase.encrypt(this.tempdata.rePwd, this.loginKey)
          } else {
            delete this.tempdata.userPwd
            delete this.tempdata.rePwd
          }
          var datas = {
            userName: this.tempdata.userName,
            userPwd: this.tempdata.userPwd,
            userRealName: this.tempdata.userRealName,
            userPhone: this.tempdata.userPhone,
            userAddress: this.tempdata.userAddress,
            remark: this.tempdata.remark,
            organizationId: this.tempdata.organizationId
          }
          // console.log(tempdata)
          addRow(datas).then(res => {
            this.$emit('createAgcAdmin', res.data)
            setTimeout(() => {
              this.$notify({ title: '成功', message: '创建成功', type: 'success', duration: 2000 })
            }, 2000)
            // location.reload()
          })
        }
      })
    },
    updateData(dataForm) {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          console.log(this.tempdata)
          if (this.tempdata.userPwd !== '') {
            this.tempdata.userPwd = ase.encrypt(this.tempdata.userPwd, this.loginKey)
          } else {
            delete this.tempdata.userPwd
          }
          updateRow(this.tempdata).then(res => {
            setTimeout(() => {
              this.$notify({ title: '成功', message: '操作成功', type: 'success', duration: 2000 })
            }, 2000)
            location.reload()
            this.$emit('closeAgcAdmin')
          })
        }
      })
    },
    resetTemp() {
      this.tempdata = {
        userName: '',
        userPwd: '',
        userRealName: '',
        userPhone: '',
        userAddress: '',
        remark: '',
        organizationId: ''
      }
    }
  }
}
</script>
