<template>
  <div>
    <el-form>
      <el-tag
        v-for="tag in dynamicTags"
        :key="tag.fId"
        :disable-transitions="false"
        closable
        @close="handleClose(tag)">
        <span @click="handleEdit(tag)">
          {{ tag.fLabelName }}
        </span>
      </el-tag>
      <el-input
        v-if="editVisible"
        ref="saveTagInput"
        v-model="editValue"
        class="input-edit-tag"
        size="small"
        maxlength="10"
        @keyup.enter.native="handleEditConfirm"
        @blur="handleEditConfirm"
      />
      <el-input
        v-if="inputVisible"
        ref="saveTagInput"
        v-model="inputValue"
        class="input-new-tag"
        size="small"
        @keyup.enter.native="handleInputConfirm"
        @blur="handleInputConfirm"
      />
      <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 添加标签</el-button>

    </el-form>
  </div>
</template>
<script>
import {
  AuthorizationAddlabels,
  AuthorizationDellabels,
  AuthorizationUpdlabel
  // AuthorizationAddlabels
} from '@/api/tag'
export default {
  props: {
    tags: {
      type: Array,
      required: true
    },
    fAid: {
      type: Number,
      required: true
    },
    fUnit: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      dynamicTags: this.tags,
      inputVisible: false,
      inputValue: '',
      editVisible: false,
      editValue: '',
      userToken: this.$store.state.user.token,
      fId: ''

    }
  },
  watch: {
    tags: {
      immediate: true,
      deep: true,
      handler: function(val, oldVal) {
        this.dynamicTags = val
      }
    }
  },
  created() {
    console.log(this.dynamicTags)
  },
  methods: {
    handleEdit(tag) {
      console.log(tag)
      this.editVisible = true
      this.editValue = tag.fLabelName
      this.fId = tag.fId
    },
    handleClose(tag) {
      this.$confirm('此操作将删除该标签, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        AuthorizationDellabels({ Authorization: this.userToken, fId: tag.fId }).then(res => {
          this.$message({
            title: '成功',
            message: res.msg,
            type: 'success',
            duration: 2000
          })
          this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    showInput() {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    handleInputConfirm() {
      const inputValue = this.inputValue
      if (inputValue) {
        const inputValue = this.inputValue
        AuthorizationAddlabels({ labelName: inputValue, fAid: this.fAid, fUnit: this.fUnit }).then(res => {
          if (res.code === 0) {
            this.dynamicTags.push(res.data)
            this.inputVisible = false
          }
        })
      } else {
        this.inputVisible = false
      }
      this.inputValue = ''
    },
    handleEditConfirm() {
      if (this.editValue) {
        AuthorizationUpdlabel({ fId: this.fId, labelName: this.editValue, fAid: this.fAid }).then(res => {
          this.dynamicTags = this.dynamicTags.map(v => { return v.fId === res.data.fId ? res.data : v })
          this.editVisible = false
        })
      } else {
        this.editVisible = false
      }
    }
  }
}
</script>
<style>
.el-tag + .el-tag {
  margin-left: 10px !important;
}
.el-tag {
  margin-top:5px !important;
  margin-left: 10px !important;
}
.button-new-tag {
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
  background: #fff !important;
}
.button-new-tag span {
  color: #000;
}
.input-new-tag {
  width: 90px;
  vertical-align: bottom;
}
.input-edit-tag{
  width: 130px;
  vertical-align: bottom;
}
.footer {
  margin-top: 30px;
}
</style>
