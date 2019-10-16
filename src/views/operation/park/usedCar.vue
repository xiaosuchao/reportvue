<template>
  <div>
    <div class="filter-container">
      <el-form :inline="true" :model="listQuery" class="demo-form-inline" label-width="60px">
        <el-row>
          <el-form-item label="车牌号">
            <el-input v-model="listQuery.fUsedcarNumber" placeholder="车牌号" maxlength="8"/>
          </el-form-item>
          <el-form-item label="评估价" class="price">
            <el-input v-model.trim="listQuery.fUsedcarPriceStart" class="pricelabel" placeholder="最低价"/>
            ~
            <el-input v-model.trim="listQuery.fUsedcarPriceEnd" class="pricelabel" placeholder="最高价"/>
          </el-form-item>
          <el-form-item label="有效期">
            <el-date-picker
              v-model="listQuery.time"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"/>
          </el-form-item>
          <el-form-item style="margin-left：5px">
            <el-button type="primary" @click="search" >查询</el-button>
            <el-button type="primary" @click="searReset">重置</el-button>
          </el-form-item>
        </el-row>
      </el-form>
      <div class="btnsupertable">
        <el-button type="primary" @click="addInfo" >添加</el-button>
      </div>
    </div>
    <el-table
      v-loading="listLoading"
      :data="carInsData.list"
      element-loading-text="Loading"
      border
      fit
      style="margin-right:10px;margin-left:10px"
      highlight-current-row>
      <template v-for="item in colTable">
        <el-table-column :fixed="item.fixed" :key="item.id" :prop="item.prop" :label="item.label" :min-width="item.width" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row[item.prop] }}</span>
          </template>
        </el-table-column>
      </template>
      <el-table-column align="center" prop="created_at" label="操作" width="260">
        <template slot-scope="scope">
          <div>
            <el-button type="primary" size="small" @click="edit(scope.row)">编辑</el-button>
            <el-button type="danger" size="small" @click="del(scope.row)">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.pageNum"
      :limit.sync="listQuery.limit"
      @pagination="usedcarQuery"
    />
    <el-dialog :visible.sync="editShowDialog" :title="dialogText[dialogStatus]">
      <el-form
        ref="tempdata"
        :model="tempdata"
        :rules="rules"
        label-width="170px">
        <el-form-item label="车牌号" prop="fUsedcarNumber">
          <el-input v-model="tempdata.fUsedcarNumber" maxlength="8" placeholder="请输入车牌号"/>
        </el-form-item>
        <el-form-item label="评估价" required>
          <el-col :span="11">
            <el-form-item prop="fUsedcarPriceStart">
              <el-input v-model.number="tempdata.fUsedcarPriceStart" placeholder="最低价"/>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item style="text-align:center">
              ~
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item prop="fUsedcarPriceEnd">
              <el-input v-model.number="tempdata.fUsedcarPriceEnd" placeholder="最高价" />
            </el-form-item>

          </el-col>
        </el-form-item>
        <el-form-item label="接收者（app消息提醒）">
          <el-radio-group v-model="tempdata.receptionUser">
            <el-radio :label="0">自己</el-radio>
            <el-radio :label="1">标签</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="tempdata.receptionUser===1">
          <el-tag
            v-for="(tag,idx) in userTags"
            :key="idx"
            :type="tag.type"
            :disable-transitions="false"
            style="margin-left:5px"
          > <span @click="changeTag(tag)">{{ tag.fLabelName }}</span></el-tag>
        </el-form-item>
        <el-form-item label="有效期">
          <el-date-picker
            v-model="tempdata.time"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogStatus==='add'?createData('tempdata'):updateData('tempdata')">确定</el-button>
        <el-button @click="editShowDialog = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import {
  usedcarQuery,
  usedcaradd,
  usedcardel,
  usedcarupdate
} from '@/api/usedCar'
import elTree from './components/selectTree'
import { mapGetters } from 'vuex'
import {
  getlabels
} from '@/api/tag'
export default {
  components: {
    'Pagination': Pagination,
    'elTree': elTree
  },
  data() {
    var fPlatenum = (rule, value, callback) => {
      var reg = /([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1})/
      if (!reg.test(value.toUpperCase())) {
        callback(new Error('请输入正确的车牌号格式'))
      } else {
        callback()
      }
    }
    var fUsedcarPriceEnd = (rule, value, callback) => {
      if (!Number.isInteger(value)) {
        callback(new Error('请输入数字值'))
      } else {
        if (this.tempdata.fUsedcarPriceStart >= value) {
          callback(new Error('最高价应高于最低价！'))
        } else {
          callback()
        }
      }
    }
    var fUsedcarPriceStart = (rule, value, callback) => {
      if (!Number.isInteger(value)) {
        callback(new Error('请输入数字值'))
      } else {
        if (this.tempdata.fUsedcarPriceEnd <= value) {
          callback(new Error('最低价应该低于最高价！'))
        } else {
          callback()
        }
        callback()
      }
    }
    return {
      rules: {
        fUsedcarNumber: [
          { min: 7, max: 8, message: '车牌最少为7位，最多为8位', trigger: 'blur' },
          { required: true, message: '请输入车牌号', trigger: 'blur' },
          { validator: fPlatenum, trigger: 'blur' }
        ],
        fUsedcarPriceStart: [
          { required: true, message: '请输入最高评估价', trigger: 'blur' },
          { validator: fUsedcarPriceStart, trigger: 'blur' }
        ],
        fUsedcarPriceEnd: [
          { required: true, message: '请输入最低评估价', trigger: 'blur' },
          { validator: fUsedcarPriceEnd, trigger: 'blur' }

        ]

      },
      tempdata: {
        fUsedcarFouder: this.admin_id,
        time: [new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate(), new Date().getFullYear() + '-' + (new Date().getMonth() + 4) + '-' + new Date().getDate()]
      },
      listLoading: false,
      treedialog: false,
      value6: '',
      form: {
        date1: '',
        date2: ''
      },
      dialogText: {
        add: '添加',
        edit: '编辑'
      },
      dialogStatus: '',
      editShowDialog: false,
      listQuery: {
        pageNum: 1,
        limit: 10,
        fUsedcarFouder: this.admin_id,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id',
        fName: '',
        time: '',
        checkTimeBefore: '',
        checkTimeAfter: ''
      },
      carInsData: {
        list: [],
        pages: '',
        pageNum: '',
        pageSize: '',
        currentPage: 1,
        userId: this.admin_id
      },
      colTable: [
        { prop: 'fUsedcarNumber', label: '车牌号', fixed: true, width: '' },
        { prop: 'usedcarPrice', label: '评估价', fixed: true, width: '' },
        { prop: 'lablesStr', label: '接收者（app消息提醒）', fixed: true, width: '' },
        { prop: 'showDate', label: '有效期', fixed: true, width: '' }
      ],
      userTags: [],
      total: 0
    }
  },
  computed: {
    ...mapGetters([
      'admin_id',
      'organizationChain',
      'set_orgAddressCode'
    ])

  },
  watch: {
    userTags: {
      immediate: true,
      deep: true,
      handler: function(val, oldVal) {

      }
    }
  },
  created() {
    this.usedcarQuery()
  },
  methods: {
    showTrees() {
      this.treedialog = true
    },
    getlabels() {
      getlabels({ Authorization: this.userToken, fAid: this.set_orgAddressCode, chain: this.organizationChain }).then(res => {
        this.userTags = res.data
        this.userTags.filter(v => {
          v.type = 'info'
        })
      })
    },
    usedcarQuery() {
      this.listQuery.fUsedcarFouder = this.admin_id
      usedcarQuery(this.listQuery).then(res => {
        if (res.code === 0) {
          this.total = res.data.total
          this.carInsData.list = res.data.list
          this.carInsData.pages = res.data.pages
          this.carInsData.pageNum = res.data.pageNum
          this.carInsData.pageSize = res.data.pageSize
          this.total = res.data.total
        }
      })
    },
    changeTag(tag) {
      this.userTags = this.userTags.map(v => { if (v.fId === tag.fId) { v.type = v.type ? '' : 'info' } return v })
    },
    createData(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.tempdata.checkTimeBefore = this.tempdata.time && this.tempdata.time[0]
          this.tempdata.checkTimeAfter = this.tempdata.time && this.tempdata.time[1]
          this.tempdata.fUsedcarFouder = this.admin_id
          const tags = this.userTags.filter(v => { return v.type === '' })
          this.tempdata.labels = tags.map(v => { return v.fId })
          console.log(this.tempdata)
          usedcaradd(this.tempdata).then(res => {
            if (res.code === 0) {
              this.$message({
                message: res.msg,
                type: 'success'
              })
              this.usedcarQuery()
              this.editShowDialog = false
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    addInfo() {
      this.getlabels()
      this.dialogStatus = 'add'
      this.editShowDialog = true
      this.tempdata.fUsedcarNumber = ''
      this.tempdata.fUsedcarPriceStart = ''
      this.tempdata.fUsedcarPriceEnd = ''
      this.tempdata = {
        receptionUser: 0,
        time: ''
      }
      this.tempdata.time = [new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate(), new Date().getFullYear() + '-' + (new Date().getMonth() + 4) + '-' + new Date().getDate()]
      this.userTags = this.userTags.map(v => { v.type = 'info'; return v })
      this.$nextTick(() => {
        this.$refs['tempdata'].clearValidate()
      })
    },
    searReset() {
      this.emptyQueryParams()
      // this.usedcarQuery()
    },
    del(row) {
      this.$confirm('是否要删除这条信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          usedcardel({ id: row.fUsedcarId }).then(res => {
            this.$message({
              message: res.msg,
              type: 'success'
            })
            this.usedcarQuery()
          })
        }).catch(() => {})
    },
    edit(row) {
      this.getlabels()
      this.dialogStatus = 'edit'
      this.editShowDialog = true
      this.resetData()
      this.$nextTick(() => {
        this.$refs['tempdata'].clearValidate()
      })
      this.tempdata = Object.assign({}, row, {
        time: [row.startTime, row.endTime],
        fUnit: this.listQuery.fUnit
      })
      this.userTags = [...this.userTags]
      const arId = row.lables.map(v => { return v.fId })
      this.userTags = this.userTags.map(v => { v.type = arId.includes(v.fId) ? '' : 'info'; return v })
      console.log(this.userTags)
    },
    updateData(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.tempdata)
          this.tempdata.checkTimeBefore = this.tempdata.time && this.tempdata.time[0]
          this.tempdata.checkTimeAfter = this.tempdata.time && this.tempdata.time[1]
          const tags = this.userTags.filter(v => { return v.type === '' })
          this.tempdata.labels = tags.map(v => { return v.fId })
          delete this.tempdata.time
          usedcarupdate(this.tempdata).then(res => {
            this.editShowDialog = false
            this.usedcarQuery()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    emptyQueryParams() {
      this.listQuery = Object.assign({}, this.listQuery, {
        fUsedcarNumber: '',
        fUsedcarPriceStart: '',
        fUsedcarPriceEnd: '',
        time: ''
      })
    },

    search() {
      this.listQuery.checkTimeBefore = this.listQuery.time && this.listQuery.time[0]
      this.listQuery.checkTimeAfter = this.listQuery.time && this.listQuery.time[1]
      // this.listQuery.time
      usedcarQuery(this.listQuery).then(res => {
        if (res.code === 0) {
          this.total = res.data.total
          this.carInsData.list = res.data.list
          this.carInsData.pages = res.data.pages
          this.carInsData.pageNum = res.data.pageNum
          this.carInsData.pageSize = res.data.pageSize
          this.total = res.data.total
        }
      })
    },
    resetData() {
      this.userTags = this.userTags.map(v => { v.type = 'info'; return v })
      this.tempdata = {
        fUsedcarFouder: this.admin_id,
        labels: '',
        fUsedcarNumber: '',
        fUsedcarPriceStart: '',
        fUsedcarPriceEnd: '',
        receptionUser: 0

      }
    }

  }
}
</script>
<style lang="scss" scoped>
  .carStore {
    z-index:999;
      float:right;
      margin-top:5px;
      display:flex;
      span{
        display:block;
        line-height:50px;
        margin-right:10px;
    }
  }
  .price{
    display:flex!important;
  }
 .filter-container{
   margin-top:20px;
 .el-form-item{
   float:left!important;
 }
 }
 .btnsupertable {
  padding-bottom: 0px;
  text-align: right;
  margin-right:10px;
}
.pricelabel{
  width:45%;
}
</style>
