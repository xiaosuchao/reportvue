<template>
  <div>
    <div class="filter-container">
      <el-form :inline="true" :model="listQuery" class="demo-form-inline" label-width="60px">
        <el-row>
          <el-form-item label="车牌号">
            <el-input v-model="listQuery.carNumber" placeholder="车牌号" maxlength="8"/>
          </el-form-item>
          <el-form-item label="需续保" class="price">
            <el-select v-model="listQuery.renewalInsurance" placeholder="请选择">
              <el-option v-for="opt in renewalInsuranceData" :key="opt.key" :value="opt.key" :label="opt.label" />
            </el-select>
          </el-form-item>
          <el-form-item label="有效期">
            <el-date-picker
              v-model="listQuery.time"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"/></el-form-item>
          <el-form-item>
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
            <span>{{ scope.row[item.prop] | showstr(item.prop) }}</span>
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
      @pagination="dataList"
    />
    <el-dialog :visible.sync="editShowDialog" :title="dialogText[dialogStatus]">
      <el-form
        ref="tempdata"
        :model="tempdata"
        :rules="rules"
        label-width="170px">
        <el-form-item label="车牌号" prop="carNumber">
          <el-input v-model="tempdata.carNumber" placeholder="请输入车牌号" maxlength="8"/>
        </el-form-item>
        <el-form-item label="需续保" prop="renewalInsurance">
          <el-select v-model="tempdata.renewalInsurance" placeholder="请选择">
            <el-option v-for="opt in renewalInsuranceData" :key="opt.key" :value="opt.key" :label="opt.label" />
          </el-select>
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
        <el-form-item label="续保日期">
          <el-date-picker
            v-model="tempdata.insuranceDateStr"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择日期"
          />
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
import {
  carInsuranceSelect,
  carInsuranceCreate,
  carInsuranceDelete,
  carInsuranceUpdate,
  carInsurancerepetition
} from '@/api/carInsurance'
import { mapGetters } from 'vuex'
import Pagination from '@/components/Pagination'
const statusMap = {
  0: '否',
  1: '是'
}
import {
  getlabels
} from '@/api/tag'
export default {
  components: {
    'Pagination': Pagination
  },
  filters: {
    showstr(v, prop) {
      if (prop === 'renewalInsurance') { return v === 0 ? '否' : '是' }
      return v
    }

  },
  data() {
    var fPlatenum = (rule, value, callback) => {
      var reg = /([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1})/
      if (!reg.test(value.toUpperCase())) {
        callback(new Error('请输入正确的车牌号格式'))
      } else {
        carInsurancerepetition({ carNumber: this.tempdata.carNumber, userId: this.admin_id }).then(res => {
          if (res.data === false) {
            callback(new Error('车牌号重复'))
          }
        }).catch(e => {
          callback(new Error('车牌号重复'))
        })
      }
    }
    return {
      rules: {
        carNumber: [
          { min: 7, max: 8, message: '车牌最少为7位，最多为8位', trigger: 'blur' },
          { required: true, message: '请输入车牌号', trigger: 'blur' },
          { validator: fPlatenum, trigger: 'blur' }
        ],
        renewalInsurance: [{ required: true, message: '请选择是否需要投保', trigger: 'change' }]
      },
      tempdata: {
        carNumber: '',
        renewalInsurance: '',
        receptionUser: '0'
      },
      userToken: this.$store.state.user.token,
      listQuery: {
        pageNum: 1,
        limit: 10,
        importance: undefined,
        renewalInsurance: '',
        title: undefined,
        type: undefined,
        sort: '+id',
        time: '',
        userId: this.admin_id,
        beginValidityTime: '',
        endValidityTime: ''
      },
      total: 0,
      listLoading: false,
      dialogText: {
        add: '添加',
        edit: '编辑'
      },
      carInsData: {
        list: [],
        pages: '',
        pageNum: '',
        pageSize: '',
        currentPage: 1,
        userId: this.admin_id
      },
      dialogStatus: '',
      editShowDialog: false,
      renewalInsuranceData: [],
      colTable: [
        { prop: 'carNumber', label: '车牌号', fixed: true, width: '' },
        { prop: 'renewalInsurance', label: '需续保', fixed: true, width: '' },
        { prop: 'insuranceDateStr', label: '续保日期（上次）', fixed: true, width: '' },
        { prop: 'labelsStr', label: '接收者（app消息提醒）', fixed: true, width: '' },
        { prop: 'validity', label: '有效期', fixed: true, width: '' }

      ],
      userTags: []
    }
  },
  computed: {
    ...mapGetters([
      'admin_id',
      'set_orgAddressCode',
      'organizationChain'
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
    this.dataList()
    this.getlabels()
    for (const v in statusMap) {
      this.renewalInsuranceData.push({ key: parseInt(v), label: statusMap[v] })
    }
  },
  methods: {
    // // 车牌号查重
    // repetition() {
    //   carInsurancerepetition({ carNumber: this.tempdata.carNumber, userId: this.admin_id }).then(res => {})
    // },
    getlabels() {
      getlabels({ Authorization: this.userToken, fAid: this.set_orgAddressCode, chain: this.organizationChain }).then(res => {
        this.userTags = res.data
        this.userTags.filter(v => {
          v.type = 'info'
        })
      })
    },
    dataList() {
      this.listQuery.userId = this.admin_id
      carInsuranceSelect(this.listQuery).then(res => {
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
    addInfo() {
      this.dialogStatus = 'add'
      this.editShowDialog = true
      this.$nextTick(() => {
        this.$refs['tempdata'].clearValidate()
      })
      this.resetData()
      this.tempdata.time = [new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate(), new Date().getFullYear() + '-' + (new Date().getMonth() + 4) + '-' + new Date().getDate()]
    },
    createData(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.tempdata.beginValidityTime = this.tempdata.time && parseInt(Date.parse(new Date(this.tempdata.time[0]))) / 1000
          this.tempdata.endValidityTime = this.tempdata.time && parseInt(Date.parse(new Date(this.tempdata.time[1]))) / 1000
          this.tempdata.insuranceDate = this.tempdata.insuranceDateStr && parseInt(Date.parse(new Date(this.tempdata.insuranceDateStr))) / 1000
          delete this.tempdata.time
          const tags = this.userTags.filter(v => { return v.type === '' })
          const userlabel = tags && tags.map(v => { return v.fId })
          console.log(this.tempdata)
          this.tempdata.receptionUser = userlabel ? userlabel.join(',') : 0
          carInsuranceCreate(this.tempdata).then(res => {
            if (res.code === 0) {
              this.$message({
                message: res.msg,
                type: 'success'
              })
              this.dataList()
              this.editShowDialog = false
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    updateData(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.tempdata.beginValidityTime = this.tempdata.time && parseInt(Date.parse(new Date(this.tempdata.time[0]))) / 1000
          this.tempdata.endValidityTime = this.tempdata.time && parseInt(Date.parse(new Date(this.tempdata.time[1]))) / 1000
          this.tempdata.insuranceDate = this.tempdata.insuranceDateStr && parseInt(Date.parse(new Date(this.tempdata.insuranceDateStr))) / 1000
          const tags = this.userTags.filter(v => { return v.type === '' })
          this.tempdata.labels = tags.map(v => { return v.fId })
          // console.log(this.tempdata.receptionUser)
          if (this.tempdata.receptionUser === 1) {
            this.tempdata.receptionUser = this.tempdata.labels.join(',')
          } else {
            this.tempdata.receptionUser === 0
          }
          console.log(this.tempdata.receptionUser)
          delete this.tempdata.labels
          delete this.tempdata.time
          delete this.tempdata.labelDOS
          carInsuranceUpdate(this.tempdata).then(res => {
            if (res.code === 0) {
              this.$message({
                message: res.msg,
                type: 'success'
              })
              this.dataList()
              this.editShowDialog = false
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    search() {
      this.listQuery.beginValidityTime = this.listQuery.time && parseInt(Date.parse(new Date(this.listQuery.time[0]))) / 1000
      this.listQuery.endValidityTime = this.listQuery.time && parseInt(Date.parse(new Date(this.listQuery.time[1]))) / 1000
      carInsuranceSelect(this.listQuery).then(res => {
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
    searReset() {
      this.listQuery.renewalInsurance = ''
      this.listQuery.time = ''
      this.listQuery.carNumber = ''

      //   pageNum: 1,
      //   carNumber: '',
      //   limit: 10,
      //   renewalInsurance: '',
      //   sort: '+id',
      //   time: '',
      //   userId: this.admin_id
      // })
      // this.emptyQueryParams()
      // this.dataList()
    },
    edit(row) {
      this.dialogStatus = 'edit'
      this.editShowDialog = true
      this.$nextTick(() => {
        this.$refs['tempdata'].clearValidate()
      })
      this.resetData()
      this.tempdata = Object.assign({}, row, {
        time: [row.validity.split('至')[0], row.validity.split('至')[1]],
        receptionUser: row.receptionUser === '0' ? 0 : 1

      })
      this.userTags = [...this.userTags]
      const arId = row.labelDOS.map(v => { return v.fId })
      this.userTags = this.userTags.map(v => { v.type = arId.includes(v.fId) ? '' : 'info'; return v })
    },
    del(row) {
      this.$confirm('是否要删除这条信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          carInsuranceDelete({ id: row.id }).then(res => {
            this.$message({
              message: res.msg,
              type: 'success'
            })
            this.dataList()
          })
        }).catch(() => {})
    },
    emptyQueryParams() {
      this.listQuery = Object.assign({}, this.listQuery, {
        pageNum: 1,
        carNumber: '',
        limit: 10,
        renewalInsurance: '',
        sort: '+id',
        time: '',
        userId: this.admin_id
      })
    },
    resetData() {
      this.tempdata = {
        carNumber: '',
        renewalInsurance: 1,
        receptionUser: 0,
        insuranceDateStr: '',
        time: '',
        userId: this.admin_id
      }
      this.userTags = this.userTags.map(v => { v.type = 'info'; return v })
    }

  }
}
</script>
<style lang="scss" scoped>
  .carStore {
    width: 100%;
    p{
      float:right;
      margin-top:5px;
      display:flex;
      span{
        display:block;
        line-height:50px;
        margin-right:10px;
      }
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
.filter-container{
  margin-top:20px;
}
</style>
