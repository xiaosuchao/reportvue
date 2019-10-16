<template>
  <div>
    <div class="carStore">
      <p>
        <span @click="showTree"><input v-model="tempdata.fUnit" style="height:40px;width:200px;border-radius:4px;border:1px solid #dcdfe6;padding-left:10px;color:#606266" type="text" placeholder="请选择店铺"></span>
      </p>
    </div>
    <div class="searchBox">
      <el-date-picker
        :picker-options="pickerOptions"
        v-model="searchDate"
        type="daterange"
        value-format="yyyy-MM-dd"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change="chageDate"/>
      <div class="searchInp">
        <el-input v-model="listQuery.fName" placeholder="请输入预约客户姓名" style="width:100%"/>
        <img src="../../../assets/images/search.png" alt @click="search">
      </div>
      <el-button type="primary" @click="addinfo">添加预约车辆</el-button>

    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
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
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.pageNum"
      :limit.sync="listQuery.limit"
      @pagination="bookingCustomerSelectPages"
    />
    <elTree :isshowtreedialog="treedialog" @chloc="selectloc" />
    <el-dialog :visible.sync="editShowDialog" :title="dialogText[dialogStatus]">
      <el-form ref="tempdata" :model="tempdata" :rules="dialogRules" label-width="85px">
        <el-form-item label="姓" prop="fName">
          <el-input v-model="tempdata.fName" placeholder="姓"/>
        </el-form-item>
        <el-form-item label="性别" style="width:77%" prop="fGender">
          <el-select v-model="tempdata.fGender" placeholder="请选择">
            <el-option
              v-for="item in genderData"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="车牌号" prop="fPlatenum">
          <el-input v-model="tempdata.fPlatenum" placeholder="车牌号"/>
        </el-form-item>
        <el-form-item label="手机号" prop="fPhone">
          <el-input v-model="tempdata.fPhone" placeholder="手机号"/>
        </el-form-item>
        <el-form-item label="预约日期">
          <el-date-picker
            v-model="tempdata.fBookdate"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期"/>
        </el-form-item>
        <el-form-item label="预约时间">
          <el-time-picker
            v-model="tempdata.fBooktime"
            :picker-options="{
              selectableRange: '01:00:00 - 23:59:59'
            }"
            value-format="HH:mm:ss"
            arrow-control
            placeholder="任意时间点"/>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="tempdata.fRemarks" type="textarea" maxlength="200" placeholder="备注"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogStatus==='add'?createData('tempdata'):updateData('tempdata')">确定</el-button>
        <el-button @click="editShowDialog = false">取消</el-button>
      </div>

  </el-dialog></div>
</template>
<script>
import Pagination from '@/components/Pagination'
import elTree from './components/selectTree'
import { mapGetters } from 'vuex'
import Cookies from 'js-cookie'
// import store from '@/store'
// import { parseTime } from '@/utils'
import {
  bookingCustomerCreate,
  bookingCustomerSelectPage,
  bookingCustomerDelete,
  bookingCustomerSelectOne,
  bookingCustomerUpdate
} from '@/api/car'
export default {
  components: {
    'Pagination': Pagination,
    'elTree': elTree
  },
  filters: {
    showstr(v, prop) {
      if (prop === 'fCusstatus') { return v === 2 ? '已经入场' : '等待入场' }
      if (prop === 'fPhone') {
        return v === 0 ? '无' : v
      }
      if (prop === 'fGender') {
        return v === 2 ? '先生' : '女士'
      }
      return v
    }

  },
  data() {
    var regPhone = (rule, value, callback) => {
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
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近六个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 180)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      dialogRules: {
        fName: [{ required: true, message: '请输入姓', trigger: 'blur' }],
        fPhone: [
          { max: 11, validator: regPhone, trigger: 'blur' }
        ],
        fGender: [{ required: true, message: '请选择性别', trigger: 'change' }],
        fPlatenum: [
          { min: 7, max: 8, message: '车牌最少为7位，最多为8位', trigger: 'blur' },
          { required: true, message: '请输入车牌号', trigger: 'blur' },
          { pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/, message: '请输入正确的车牌号格式' }
        ]
      },
      total: 0,
      carStoreName: '',
      listLoading: false,
      carStoreid: '',
      treedialog: false,
      value1: '',
      value2: '',
      searchDate: '',
      defaultProps: {
        children: 'children',
        label: 'organizationName',
        isLeaf: 'leaf'
      },
      dialogText: {
        add: '添加预约信息',
        edit: '编辑预约信息'
      },
      genderData: [
        {
          id: '2',
          label: '先生'
        },
        {
          id: '3',
          label: '女士'
        }
      ],
      colTable: [
        { prop: 'fUnit', label: '店铺', fixed: true, width: '' },
        { prop: 'fPlatenum', label: '车牌号', fixed: true, width: '' },
        { prop: 'fName', label: '姓', fixed: true, width: '' },
        { prop: 'fGender', label: '性别', fixed: true, width: '' },
        { prop: 'fPhone', label: '手机号', fixed: true, width: '' },
        { prop: 'fBookdate', label: '预约日期', fixed: true, width: '' },
        { prop: 'fBooktime', label: '预约时间', fixed: true, width: '' },
        { prop: 'fCusstatus', label: '入场状态', fixed: true, width: '' },
        { prop: 'fRemarks', label: '备注', fixed: true, width: '' }
      ],
      showInfo: false,
      tableData: {
        pages: '',
        pageNum: '',
        pageSize: '',
        currentPage: 1
      },
      list: [],
      listQuery: {
        pageNum: 1,
        limit: 10,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id',
        fAid: '',
        fName: '',
        startTime: '',
        stopTime: ''
      },
      tempdata: {
        fName: '',
        fPhone: '',
        fPlatenum: '',
        fBookdate: '',
        fRemarks: '',
        fBooktime: '',
        fAid: '',
        fGender: '',
        fUnit: '',
        fId: ''
      },
      dialogStatus: '',
      editShowDialog: false
    }
  },
  computed: {
    ...mapGetters([
      'selectOrgTree',
      'organizationId',
      'organizationName',
      'selectOrgTree'
    ])
  },
  created() {
    this.storeTree()
  },
  methods: {
    selectloc(obj) {
      this.treedialog = false
      if (obj) {
        localStorage.setItem('carStoreid', obj.organizationAddressCode)
        localStorage.setItem('carStoreName', obj.organizationName)
        this.listQuery.fAid = obj.organizationAddressCode
        this.tempdata.fAid = obj.organizationAddressCode
        this.tempdata.fUnit = obj.organizationName
        this.treedialog = false
        Cookies.remove('loadfirstStore', 1)
        this.bookingCustomerSelectPages()
      }
    },
    showTree() {
      this.treedialog = true
    },
    storeTree() {
      if (localStorage.getItem('carStoreName')) {
        this.tempdata.fUnit = localStorage.getItem('carStoreName')
        this.listQuery.fAid = localStorage.getItem('carStoreid')
        this.tempdata.fAid = localStorage.getItem('carStoreid')
      } else {
        if (this.selectOrgTree) {
          this.tempdata.fUnit = this.getFirstOrganizationName(this.selectOrgTree)
          this.listQuery.fAid = this.getFirstOrganizationId(this.selectOrgTree)
          this.tempdata.fAid = this.getFirstOrganizationId(this.selectOrgTree)
          localStorage.setItem('carStoreid', this.listQuery.fAid)
          localStorage.setItem('carStoreName', this.tempdata.fUnit)
        }
      }
      this.bookingCustomerSelectPages()
    },
    getFirstOrganizationName(orgtree) {
      return (orgtree[0].children && orgtree[0].children.length) ? this.getFirstOrganizationName(orgtree[0].children) : orgtree[0].organizationName
    },
    getFirstOrganizationId(orgtree) {
      return (orgtree[0].children && orgtree[0].children.length) ? this.getFirstOrganizationId(orgtree[0].children) : orgtree[0].organizationAddressCode
    },
    addinfo() {
      this.dialogStatus = 'add'
      this.editShowDialog = true
      this.$nextTick(() => {
        this.$refs['tempdata'].clearValidate()
      })
      this.resetTemp()
    },
    bookingCustomerSelectPages() {
      bookingCustomerSelectPage(this.listQuery).then(res => {
        this.list = res.data.list || []
        this.listLoading = false
        this.total = res.data.total
      })
    },
    createData(formName) {
      console.log(this.tempdata)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          bookingCustomerCreate(this.tempdata).then(res => {
            this.list.unshift(res.data)
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
            this.editShowDialog = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    del(val) {
      this.$confirm('是否要删除这条信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          bookingCustomerDelete({ id: val.fId }).then(res => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.list = this.list.filter((v, i) => {
                return v.fId !== val.fId
              })
            }
          })
        }).catch(() => {})
    },
    search() {
      bookingCustomerSelectPage(this.listQuery).then(res => {
        this.list = res.data.list || []
        this.total = res.data.total
        this.listLoading = false
        this.tableData.pages = res.data.pages
        this.tableData.pageNum = res.data.pageNum
        this.tableData.pageSize = res.data.pageSize
      })
    },
    edit(row) {
      this.dialogStatus = 'edit'
      this.tempdata.fId = row.fId
      this.editShowDialog = true
      bookingCustomerSelectOne({ id: row.fId }).then(res => {
        this.tempdata.fName = res.data.fName
        this.tempdata.fPhone = res.data.fPhone
        this.tempdata.fPlatenum = res.data.fPlatenum
        this.tempdata.fRemarks = res.data.fRemarks
        this.tempdata.fBookdate = res.data.fBookdate
        this.tempdata.fBooktime = res.data.fBooktime
        if (res.data.fGender === 2) {
          this.tempdata.fGender = '先生'
        } else {
          this.tempdata.fGender = '女士'
        }
      })
    },
    updateData(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          bookingCustomerUpdate(this.tempdata).then(res => {
            this.$message({
              type: 'success',
              message: res.msg
            })
            this.editShowDialog = false
            this.list = this.list.map(v => { return v.fId === this.tempdata.fId ? this.tempdata : v })
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    chageDate() {
      const formdata = Object.assign({}, this.listQuery, { startTime: this.searchDate[0] || '' }, { stopTime: this.searchDate[1] || '' })
      bookingCustomerSelectPage(formdata).then(res => {
        this.list = res.data.list || []
        this.total = res.data.total
        this.listLoading = false
      })
    },
    resetTemp() {
      this.tempdata.fName = ''
      this.tempdata.fPhone = ''
      this.tempdata.fPlatenum = ''
      this.tempdata.fBookdate = ''
      this.tempdata.fRemarks = ''
      this.tempdata.fBooktime = ''
      this.tempdata.fGender = ''
    }

  }
}
</script>
<style lang="scss">
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
     .searchBox{
     display:flex;
     float:right;
     margin-top:70px;
     margin-bottom:10px;
     margin-right:-187px;
     .el-button{
         margin-left:10px!important;
     }
 .searchInp{
   width:200px;
   margin-left:10px;
   position:relative;
  img{
    display:block;
    width:25px;
    height:25px;
    position:absolute;
    top:8px;
    right:5px;
  }
 }
  }
  .edit{
      outline:none;
      border:none;
      border-radius:2px;
      background:#00ADEF;
      color:#fff;
  }
  .del {
      outline:none;
      border:none;
      border-radius:2px;
      border:1px solid #fbc4c4;
      background:#fef0f0;
      color:#f56c;
  }
</style>

