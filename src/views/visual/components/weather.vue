<template>
  <div v-if="defData && defData.series && defData.series.length" class="weather">
    <div class="edit">
      <span v-if="noticeData&&noticeData.noticeContent">
        1
      </span>
      <img src="@/assets/images/edit.png" @click="editDialog()">
    </div>
    <ul>
      <li>
        {{ (defData && defData.series && defData.series.length)? defData.series[0]['data'][0].temDate:'' }} {{ (defData && defData.series && defData.series.length)? defData.series[0]['data'][0].weekday:'' }}
      </li>
      <li>
        <img :src="(defData&&defData.series && defData.series.length)? defData.series[0]['data'][0].img:''">
        <p v-if="defData.series[0]['data'][0].minTem">{{ (defData&&defData.series && defData.series.length)? defData.series[0]['data'][0].minTem:'' }}℃ - {{ (defData&&defData.series && defData.series.length)? defData.series[0]['data'][0].maxTem:'' }}℃</p>
      </li>
      <li>
        {{ (defData&&defData.series && defData.series.length)? defData.series[0]['data'][0].wind:'' }}&nbsp;&nbsp;{{ (defData&&defData.series && defData.series.length)? defData.series[0]['data'][0].stateDetail:'' }}
      </li>
    </ul>
    <el-dialog
      :visible.sync="edit"
      title="备注">
      <el-input v-model="noticeTxt" type="textarea"/>
      <span slot="footer" class="dialog-footer">
        <el-button @click="edit = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { addOrUpdate, getNotice } from '@/api/dataEdit.js'
export default {
  props: {
    defData: {
      type: Object,
      required: true
    },
    noticeOrg: {
      type: String,
      required: true
    },
    beginDate: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      edit: false,
      noticeData: '',
      noticeId: '',
      noticeTxt: '',
      token: this.$store.state.user.token
    }
  },
  watch: {
    noticeOrg: {
      deep: true,
      handler: function(val, oldVal) {
        console.log('组织', val)
        this.getNotice()
      }
    },
    beginDate: {
      deep: true,
      handler: function(val, oldVal) {
        console.log('日期', val)
        this.getNotice()
      }
    }
  },
  created() {
    // console.log('天气', this.defData.series[0]['data'][0].temDate)
    // console.log('addressCode', this.noticeOrg)
  },
  methods: {
    editDialog() {
      getNotice({ beginDate: this.beginDate.replace(/-/g, '/'), noticeOrg: this.noticeOrg, token: this.token }).then(res => {
        if (res.code === 0) {
          this.edit = true
          this.noticeId = res.data.noticeId
          this.noticeData = res.data
          this.noticeTxt = res && res.data && res.data.noticeContent
        }
      })
    },
    getNotice() {
      getNotice({ beginDate: this.beginDate.replace(/-/g, '/'), noticeOrg: this.noticeOrg, token: this.token }).then(res => {
        if (res.code === 0) {
          this.noticeData = res.data
          this.noticeId = res.data.noticeId
          console.log(this.noticeId)
        }
      })
    },
    addOrUpdate() {
      addOrUpdate({ noticDate: this.beginDate.replace(/-/g, '/'), noticeOrg: this.noticeOrg, noticeContent: this.noticeTxt, id: this.noticeId }).then(res => {
        if (res.code === 0) {
          this.$message({
            message: res.msg,
            type: 'success'
          })
          this.edit = false
        }
      })
    }
  }
}
</script>
<style lang="scss">
.weather{
margin-top:10px;
min-height:100px;
position:relative;
.edit{
  position:absolute;
  right:10px;
  img{
  display:block;
  width:25px;
  height:25px;
  }
  span{
    position: absolute;
    top:-10px;
    display:block;
    width:15px;
    height:15px;
    background: red;
    color:#fff;
    border-radius:50%;
    font-size:12px;
    text-align:center;
    align-items:center;
  }
}
ul{
width:500px;
margin:0 auto;
li{
  text-align: center;
}
li:nth-child(1){
  color:#44b6ae !important;
}
li:nth-child(2){
  img{
    margin-top:10px;
    margin-bottom:-40px;
  }
  p{
    font-family: Arial;
    font-size: 50px;
    font-weight: 700;
    color: #006797;
    line-height: 58px;
    vertical-align: top;
    text-align: center;
    }
}
li:nth-child(3){
  font-family: Arial;
  font-size:13px;
  vertical-align: top;
  text-align: center;
  color: #333333;
}
}
}
</style>
