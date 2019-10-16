<template>
  <div class="app-container">
    <el-form ref="pwdform" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="用户名">
        <div>{{ form.username }}</div>
      </el-form-item>
      <el-form-item label="原密码">
        <el-input v-model="form.password" type="password"/>
      </el-form-item>
      <el-form-item label="新密码">
        <el-input v-model="form.new_password" type="password"/>
      </el-form-item>
      <el-form-item label="重复新密码">
        <el-input v-model="form.new_pwdconfirm" type="password"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import store from '@/store/index'
import { updatepwd } from '@/api/updatepwd'

export default {
  data() {
    return {
      form: {
        username: '',
        password: '',
        new_password: '',
        new_pwdconfirm: ''
      },
      rules: {
        password: [{ required: true, message: '请填写密码', trigger: 'blur' }],
        new_password: [{ required: true, message: '请填写新密码', trigger: 'blur' }],
        new_pwdconfirm: [{ required: true, message: '请确认新密码', trigger: 'blur' }]
      }
    }
  },
  computed: {
    username() {
      return store.getters.name
    }
  },
  created() {
    this.form.username = this.username
  },
  methods: {
    onSubmit() {
      this.$refs['pwdform'].validate((valid) => {
        console.log(valid)
        if (valid) {
          updatepwd(this.form).then(res => {
            if (res.status === 1) {
              this.$notify({
                title: '成功',
                message: '操作成功',
                type: 'success',
                duration: 2000
              })
            }
          })
        }
      })
    },
    onCancel() {

    }
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
</style>

