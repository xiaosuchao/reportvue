<template>
  <div><el-container>
    <el-aside width="200px">
      <p style="float:right">修改资料</p>
    </el-aside>
    <el-main>
      <el-form ref="userData" :model="userData" :rules="rules" label-width="90px">
        <el-form-item label="真实姓名">
          <el-input v-model="userData.userRealName"/>
        </el-form-item>
        <el-form-item label="密码" prop="userPwd">
          <el-input v-model="userData.userPwd" type="password"/>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input v-model="userData.checkPass" type="password"/>
        </el-form-item>
        <el-form-item label="联系电话" prop="userPhone">
          <el-input v-model="userData.userPhone" maxlength="11"/>
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="userData.userAddress"/>
        </el-form-item>
        <el-form-item label="说明">
          <el-input v-model="userData.remark" type="textarea" style="width:85%"/>
        </el-form-item>
        <el-form-item>
          <div style="margin-left:90px">
            <el-button type="primary" @click="submitForm('userData')">提交</el-button>
            <el-button @click="resetForm">重置</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-main>
  </el-container>

  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { setAgcAdmin } from '@/api/agency'
import ase from '@/utils/ase'
export default {
  data() {
    var rePwd = (rule, value, callback) => {
      if (this.userData.userPwd !== '') {
        if (this.userData.checkPass !== this.userData.userPwd) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    var userPwd = (rule, value, callback) => {
      // alert(value)
      var reg = /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{6,30}$/
      if (this.userData.userPwd !== '') {
        if (!reg.test(this.userData.userPwd)) {
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
      if (this.userData.userPhone !== '') {
        if (!reg.test(this.userData.userPhone)) {
          callback(new Error('请输入正确的手机号格式'))
        } else {
          callback()
        }
      } else {
        callback(new Error('请输入手机号'))
      }
    }
    return {
      rules: {
        userRealName: [{ required: true, message: '请填写真实姓名', trigger: 'blur' }],
        username: [{ required: true, message: '请填写用户名', trigger: 'blur' }],
        checkPass: [{ validator: rePwd, trigger: 'blur' }],
        userPwd: [{ validator: userPwd, trigger: 'blur' }],
        userPhone: [
          { validator: userPhone, trigger: 'blur' }
          // { pattern: /^\d{11}$/, message: '请输入正确的手机号格式', trigger: 'change' }
        ]
      },
      userData: {
        userPwd: ''
      }
    }
  },
  computed: {
    ...mapGetters([
      'loginKey',
      'userRealName',
      'userAddress',
      'userPhone',
      'admin_id',
      'organizationId'
    ])

  },
  created() {
    console.log(this.loginKey)
    this.userData.userRealName = this.userRealName
    this.userData.userAddress = this.userAddress
    this.userData.userPhone = this.userPhone
    this.userData.organizationId = this.organizationId
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.userData.userPwd === '') {
            var datas = {
              userPhone: this.userData.userPhone,
              userRealName: this.userData.userRealName,
              userAddress: this.userData.userAddress,
              userId: this.admin_id,
              remark: this.userData.remark,
              organizationId: this.userData.organizationId
            }
            setAgcAdmin(datas).then(res => {
              this.$message({
                message: res.msg,
                type: 'success'
              })
            })
          } else {
            var data = {
              userPwd: ase.encrypt(this.userData.userPwd, this.loginKey),
              userPhone: this.userData.userPhone,
              userAddress: this.userData.userAddress,
              userId: this.admin_id,
              remark: this.userData.remark,
              organizationId: this.userData.organizationId
            }
            setAgcAdmin(data).then(res => {
              this.$message({
                message: res.msg,
                type: 'success'
              })
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm() {
      this.userData = {
        'userRealName': '',
        'userPhone': '',
        'userAddress': '',
        'userId': '',
        'remark': ''
      }
      this.$nextTick(() => {
        this.$refs['userData'].clearValidate()
      })
    }
  }
}
</script>
<style lang="scss">
.el-form{
    margin-top:30px;
   .el-input{
       input{
           width:85%;
       }
   }
}
</style>
