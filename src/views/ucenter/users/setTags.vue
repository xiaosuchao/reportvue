<template>
  <div>
    <el-form>
      <el-form-item>
        <div class="tagBox">
          <p>已选择标签:</p>
          <p style="border:1px solid #accdef">
            <el-tag
              v-for="(tag,idx) in userTagData"
              :key="idx"
              :disable-transitions="false"
              style="margin-left:5px"
              closable
              @close="handleClose(tag)"
            >{{ tag.fLabelName }}</el-tag>
          </p>
        </div>
      </el-form-item>
      <el-form-item style="margin-left:76px;width:70%;">
        <div style="width:100%;">
          <el-tag
            v-for="tag in tagsShowdel"
            :key="tag.fId"
            :type="tag.type"
            :disable-transitions="false"
            closable
            style="margin-top:0;margin-left:5px"
            @close="del(tag)"
          >
            <span @click="changeTag(tag)">{{ tag.fLabelName }}</span>
          </el-tag>
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
        </div>
      </el-form-item>
      <el-form-item style="margin-left:76px;">
        <div style="width:100%;">
          <el-tag v-for="tag in showTags" :key="tag.fId" :type="tag.type">
            <span @click="changeTag(tag)">{{ tag.fLabelName }}</span>
          </el-tag>
        </div>
      </el-form-item>
    </el-form>
    <div class="footer">
      <el-button type="primary" @click="tagTrue">确定</el-button>
      <el-button type="info" @click="resetTag()">重置</el-button>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { addlabel, dellabel, updateLabeluser } from '@/api/tag'
export default {
  props: {
    tags: {
      type: Array,
      required: true
    },
    userTags: {
      type: Array,
      required: true
    },
    fUint: {
      type: String,
      required: true
    },
    fAid: {
      type: String,
      required: true
    },
    userId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      userToken: this.$store.state.user.token,
      flabelnames: this.flabelname,
      fLabelId: '',
      inputVisible: false,
      inputValue: '',
      userTagData: this.userTags,
      tagData: '',
      tagsShowdel: '',
      showTags: '',
      labelCodes: []
    }
  },
  computed: {
    ...mapGetters(['userRealName'])
  },
  watch: {
    userTags: {
      immediate: true,
      deep: true,
      handler: function(val, oldVal) {
        this.userTagData = val
        this.initTags()
      }
    },
    tags: {
      immediate: true,
      deep: true,
      handler: function(val, oldVal) {
        this.initData()
        this.initTags()
      }
    }
  },
  created() { },
  methods: {
    initData() {
      this.showTags = this.tags.filter(v => {
        return v.isUpdate === 2
      })
      this.tagsShowdel = this.tags.filter(v => {
        return v.isUpdate === 1
      })
    },
    initTags() {
      let artags = [...this.showTags]
      let ardel = [...this.tagsShowdel]
      const arId = this.userTagData.map(v => { return v.fId })
      artags = artags.map(v => { v.type = arId.includes(v.fId) ? '' : 'info'; return v })
      ardel = ardel.map(v => { v.type = arId.includes(v.fId) ? '' : 'info'; return v })
      this.showTags = artags
      this.tagsShowdel = ardel
    },
    changeTag(tag) {
      if (this.userTagData.indexOf(tag) > -1) {
        this.userTagData.splice(this.userTagData.indexOf(tag), 1)
        tag.type = 'info'
      } else {
        this.userTagData.filter((v, i) => {
          if (v.fId === tag.fId) {
            this.userTagData.splice(this.userTagData.indexOf(v), 1)
          }
          return false
        })
        tag.type = ''
        this.userTagData.push(tag)
      }
    },
    handleClose(tag) {
      this.userTagData.splice(this.userTagData.indexOf(tag), 1)
    },
    del(tag) {
      this.$confirm('此操作将删除该标签, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        dellabel({ Authorization: this.userToken, fId: tag.fId }).then(res => {
          this.tagsShowdel.splice(this.tagsShowdel.indexOf(tag), 1)
          this.$message({
            title: '成功',
            message: res.msg,
            type: 'success',
            duration: 2000
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
      console.log(tag)
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
        var data = {
          Authorization: this.userToken,
          labelName: inputValue,
          fUnit: this.fUint,
          fAid: this.fAid,
          founder: this.userRealName
        }
        console.log(data)
        addlabel(data).then(res => {
          res.data.type = 'info'
          this.tagsShowdel.unshift(res.data)
        })
        this.inputVisible = false
      } else {
        this.inputVisible = false
      }
      this.inputValue = ''
    },
    tagTrue() {
      this.labelCodes = this.userTagData.map(v => {
        return v.fId
      })
      var data = {
        labelCodes: this.labelCodes,
        Authorization: this.userToken,
        userId: this.userId,
        fAid: this.fAid
      }
      updateLabeluser(data).then(res => {
        this.$emit('closeTags', { flag: false })
        this.$store.commit('GATELIST_TAGSHOW', false)
        this.$message({
          title: '成功',
          message: res.msg,
          type: 'success',
          duration: 2000
        })
      })
    },
    resetTag() {
      this.userTagData = []
      this.showTags = this.showTags.map(v => { v.type = 'info'; return v })
      this.tagsShowdel = this.tagsShowdel.map(v => { v.type = 'info'; return v })
    }
  }
}
</script>
<style lang="scss">
.el-tag + .el-tag {
  margin-left: 10px !important;
}
.el-tag {
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
.footer {
  margin-top: 30px;
}
.tagBox {
  display: flex;
  height: auto;
  line-height: 40px;
  margin-left: 10px;
  border-radius: 4px;
  p:nth-child(2) {
    height: auto;
    width: 90%;
    margin-left: 5px;
  }
}
</style>
