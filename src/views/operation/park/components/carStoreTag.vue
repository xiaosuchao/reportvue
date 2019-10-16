
<template>
  <div>
    <el-form>
      <el-form-item>
        <!-- <p class="tagBox">
          <el-tag
            v-for="(tag, idx) in flabelData"
            :key="idx"
            :disable-transitions="false"
            closable
            style="margin-top:5px;"
            @close="handleClose(tag)"
          >
            <span>{{ tag.fLabelName }}</span>
          </el-tag>
        </p>-->
        <div class="tagBox">
          <p>已选择标签:</p>
          <p style="border:1px solid #accdef">
            <el-tag
              v-for="(tag, idx) in chkedtags"
              :key="idx"
              :type="tag.type"
              :disable-transitions="false"
              closable
              style="margin:5px"
              @close="handleClose(tag)"
            >
              <span>{{ tag.fLabelName }}</span>
            </el-tag>
          </p>
        </div>
      </el-form-item>
    </el-form>
    <div style="margin-left:76px">
      <el-tag v-for="(tag,idx) in alltags" :key="idx" :type="tag.type" style="margin-top:5px;">
        <span @click="changeTag(tag,idx)">{{ tag.fLabelName }}</span>
      </el-tag>
    </div>

    <div class="footer">
      <el-button type="primary" @click="tagTrue">确定</el-button>
      <el-button type="info" @click="clrAllTags()">重置</el-button>
      <!-- <el-button @click="init()">test</el-button> -->
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { editlabels } from '@/api/tag'
export default {
  props: {
    tagData: {
      type: Array,
      required: true
    },
    powercode: {
      type: Number,
      required: true
    },
    flabelname: {
      type: Array,
      required: true
    },
    fAid: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      alltags: [],
      tags: [],
      inputValue: '',
      powercodes: this.powercode,
      fAids: '',
      fLabelId: [],
      flabelData: [],
      inputVisible: false
    }
  },
  computed: {
    ...mapGetters(['userRealName']),
    chkedtags() {
      return this.alltags.filter(v => { return !v.type })
    }
  },
  watch: {
    fAid: {
      handler(val, oldVal) {
        this.fAids = val
      },
      immediate: true
    },
    flabelname: {
      immediate: true,
      handler: function(val, oldVal) {
        this.init()
      }
    },
    tag: {

    }
  },
  created() {

  },
  updated() {
  },
  methods: {
    init() {
      let artags = [...this.tagData]
      const arChkedId = this.flabelname
      console.log('flabelname.', this.flabelname)
      artags = artags.map(v => { v.type = arChkedId.includes(v.fId) ? '' : 'info'; return v })
      this.alltags = artags
    },
    clrAllTags() {
      console.log('clr all tag')
      this.alltags = this.alltags.map(v => { v.type = 'info'; return v })
    },
    showInput() {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    changeTag(tag) {
      this.alltags = this.alltags.map(v => { if (v.fId === tag.fId) { v.type = v.type ? '' : 'info' } return v })
    },
    handleClose(tag) {
      this.alltags = this.alltags.map(v => { if (v.fId === tag.fId) { v.type = 'info' } return v })
    },
    tagTrue() {
      const arr = this.chkedtags.map(v => { return v.fId })
      var data = {
        labelIds: arr,
        powerCode: this.powercodes,
        founder: this.userRealName,
        fAid: this.fAids
      }
      console.log(data)
      editlabels(data).then(res => {
        this.$store.commit('GATELIST_TREEGRENTBUSI', false)
        this.$emit('checkTag', { flag: false })
      })
    },
    resetTag() {
      this.chkedtags = ''
    }
  }
}
</script>
<style lang="scss">
.el-tag + .el-tag {
  margin-left: 10px !important;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
.footer {
  margin-top: 30px;
}

.tagBox {
  display: flex;
  height: auto;
  width: 100%;
  line-height: 40px;
  margin-left: 10px;
  border-radius: 4px;
  p:nth-child(2) {
    height: auto;
    width: 85%;
    margin-left: 5px;
  }
}
</style>
