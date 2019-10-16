<template>
  <div class="InCar">
    <div class="carStore">
      <p>
        <span @click="showTree">
          <input
            v-model="carStoreName"
            style="height:40px;width:200px;border-radius:4px;border:1px solid #ccc;padding-left:10px;color:#606266"
            type="text"
            placeholder="请选择店铺"
          >
        </span>
        <!-- <span v-show="orgtree.length<=0" style="border:1px solid #ccc;height:20px;line-height:20px;margin-top:15px;">暂无数据</span> -->
      </p>
    </div>
    <elTree :isshowtreedialog="treedialog" @chloc="selectloc" />
    <div class="filterBox">
      <div v-if="inCarBtn" class="filterIns">
        <el-input v-model="formIn.plateNumber" placeholder="请输入车牌号" style="width:100%" />
        <img src="../../../assets/images/search.png" alt @click="searchInCar()" >
      </div>
      <el-button v-if="inCarBtn" type="primary" class="addCar" @click="addCar">添加内部车辆</el-button>
      <el-button type="primary" @click="showInfos">查看入场/离场记录</el-button>
    </div>
    <el-table
      :data="tableData.list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <template v-for="item in colList">
        <el-table-column
          :fixed="item.fixed"
          :key="item.id"
          :prop="item.prop"
          :label="item.label"
          :min-width="item.width"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row[item.prop] | filterList(item.prop) }}</span>
          </template>
        </el-table-column>
      </template>
      <el-table-column align="center" prop="created_at" label="操作" width="260">
        <template slot-scope="scope">
          <div>
            <el-button type="primary" size="small" @click="setCurrent(scope.row)">编辑</el-button>
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
      @pagination="innercars"
    />
    <el-dialog :visible.sync="dialogVisible" title="添加内部车辆" width="40%">
      <el-form ref="addInCar" :model="addInCar" :rules="dialogRules" label-width="125px">
        <el-form-item label="车牌号" prop="fPlatenum">
          <el-input
            v-model="addInCar.fPlatenum"
            type="text"
            style="width:97%"
            minlength="7"
            maxlength="8"
            placeholder="请输入车牌号"
          />
        </el-form-item>
        <el-form-item label="所属者">
          <el-input
            v-model="addInCar.fOwner"
            type="text"
            style="width:97%"
            maxlength="10"
            placeholder="请输入所属者的名字"
          />
        </el-form-item>
        <el-form-item label="品牌">
          <el-input
            v-model="addInCar.fBrand"
            type="text"
            style="width:97%"
            maxlength="10"
            placeholder="请输入车的品牌"
          />
        </el-form-item>
        <el-form-item label="颜色">
          <el-input
            v-model="addInCar.fColor"
            type="text"
            style="width:97%"
            maxlength="10"
            placeholder="请输入车的颜色"
          />
        </el-form-item>
        <el-form-item label="车系">
          <el-input
            v-model="addInCar.fModel"
            type="text"
            style="width:97%"
            maxlength="10"
            placeholder="请输入车的车系"
          />
        </el-form-item>
        <el-form-item label="车型">
          <el-input
            v-model="addInCar.fType"
            type="text"
            style="width:97%"
            maxlength="10"
            placeholder="请输入车的类型"
          />
        </el-form-item>
        <el-form-item label="入场LED显示信息">
          <el-input
            v-model="addInCar.fInled"
            type="text"
            style="width:97%"
            maxlength="10"
            placeholder="请输入入场LED显示信息"
          />
        </el-form-item>
        <el-form-item label="离场LED显示信息">
          <el-input
            v-model="addInCar.fOutled"
            type="text"
            style="width:97%"
            maxlength="10"
            placeholder="请输入离场LED显示信息"
          />
        </el-form-item>
        <el-form-item label="上传图片">
          <el-upload
            :show-file-list="false"
            :headers="upHeader"
            :on-success="handleAvatarSuccess"
            :before-upload="(file)=>{return beforeImgUpload(file,'organizationLoginLogo')}"
            :action="apibase+'/uploader/img'"
            class="avatar-uploader"
          >
            <img v-if="upImgTag" :src="upImgTag" style="display:block;width:45px;heigth:45px" >
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
        <el-form-item label="有效时间">
          <el-date-picker
            :picker-options="pickerOptions"
            v-model="addInCar.dueDate"
            style="width:80%"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="addInCar.fRemarks"
            type="textarea"
            style="width:97%"
            maxlength="200"
            placeholder="请输入..."
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addSure('addInCar')">确 定</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="setCurrentDialog" title="编辑内部车辆" width="40%">
      <el-form
        ref="setCurrentData"
        :model="setCurrentData"
        :rules="dialogRules"
        label-width="125px"
      >
        <el-form-item label="车牌号" prop="fPlatenum">
          <el-input
            v-model="setCurrentData.fPlatenum"
            type="text"
            style="width:97%"
            minlength="7"
            maxlength="8"
            placeholder="请输入车牌号"
          />
        </el-form-item>
        <el-form-item label="所属者">
          <el-input
            v-model="setCurrentData.fOwner"
            type="text"
            style="width:97%"
            maxlength="10"
            placeholder="请输入所属者的名字"
          />
        </el-form-item>
        <el-form-item label="品牌">
          <el-input
            v-model="setCurrentData.fBrand"
            type="text"
            style="width:97%"
            maxlength="10"
            placeholder="请输入车的品牌"
          />
        </el-form-item>
        <el-form-item label="颜色">
          <el-input
            v-model="setCurrentData.fColor"
            type="text"
            style="width:97%"
            maxlength="10"
            placeholder="请输入车的颜色"
          />
        </el-form-item>
        <el-form-item label="车系">
          <el-input
            v-model="setCurrentData.fModel"
            type="text"
            style="width:97%"
            maxlength="10"
            placeholder="请输入车的车系"
          />
        </el-form-item>
        <el-form-item label="车型">
          <el-input
            v-model="setCurrentData.fType"
            type="text"
            style="width:97%"
            maxlength="10"
            placeholder="请输入车的类型"
          />
        </el-form-item>
        <el-form-item label="入场LED显示信息">
          <el-input
            v-model="setCurrentData.fInled"
            type="text"
            style="width:97%"
            maxlength="10"
            placeholder="请输入入场LED显示信息"
          />
        </el-form-item>
        <el-form-item label="离场LED显示信息">
          <el-input
            v-model="setCurrentData.fOutled"
            type="text"
            style="width:97%"
            maxlength="10"
            placeholder="请输入离场LED显示信息"
          />
        </el-form-item>
        <el-form-item label="有效时间">
          <el-date-picker
            :picker-options="pickerOptions"
            v-model="setCurrentData.dueDate"
            style="width:80%"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="setCurrentData.fRemarks"
            type="textarea"
            style="width:97%"
            maxlength="200"
            placeholder="请输入..."
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="setSure('setCurrentData')">确 定</el-button>
        <el-button @click="setCurrentDialog = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="showInfo" title="入场/离场记录" width="90%">
      <el-row>
        <el-col :span="12" />
        <el-col :span="12" style="display:flex;">
          <el-date-picker
            :picker-options="pickerRecord"
            v-model="recordDate"
            style="width:80%"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
          <el-input
            v-model="recordQuery.carNumber"
            style="width:60%;margin-left:10px;"
            placeholder="请输入车牌号"
          />
          <el-button type="primary" style="margin-left:10px;" @click="searchRecar">查询</el-button>
        </el-col>
      </el-row>
      <el-table
        :data="recordList"
        element-loading-text="Loading"
        style="margin-top:10px"
        border
        fit
        highlight-current-row
      >
        <template v-for="item in colTable">
          <el-table-column
            :fixed="item.fixed"
            :key="item.id"
            :prop="item.prop"
            :label="item.label"
            :min-width="item.width"
            align="center"
          >
            <template slot-scope="scope">
              <span v-if="item.prop==='inCarImgs'">
                <viewer :images="scope.row[item.prop]" style="display:flex;">
                  <img v-for="(src,idx) in scope.row[item.prop]" :src="src" :key="idx" style="display:block;width:40px;height:40px;margin-left:10px" alt >
                </viewer>
              </span>
              <span v-else>{{ scope.row[item.prop] | showstr(item.prop) }}</span>
            </template>
          </el-table-column>
        </template>
      </el-table>
      <pagination
        v-show="recordQuery.total>0"
        :total="recordQuery.total"
        :page.sync="recordQuery.pageNum"
        :limit.sync="recordQuery.limit"
        @pagination="entryrecords"
      />

      <el-form
        ref="setCurrentData"
        :model="setCurrentData"
        :rules="dialogRules"
        label-width="95px"
      />
      <!-- <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="setSure('setCurrentData')">确 定</el-button>
        <el-button @click="showInfo = false">取 消</el-button>
      </span> -->
    </el-dialog>
  </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import elTree from './components/selectTree'
import { mapGetters } from 'vuex'
import { getToken } from '@/utils/auth'
import Cookies from 'js-cookie'
// import store from '@/store'
import {
  innercarList,
  addinner,
  queryone,
  update,
  deleteIns,
  authorization,
  entryrecord
} from '@/api/car'
export default {
  components: { Pagination, elTree },
  filters: {
    showstr(v, prop) {
      if (prop === 'PresenceStatus') { return v === 2 ? '离场' : '在场' }
      if (prop === 'showRevoke') { return v === 1 ? '已删除' : '未删除' }
      return v
    },
    filterList(v, prop) {
      if (prop === 'PresenceStatus') { return v === 2 ? '离场' : '在场' }
      if (prop === 'showRevoke') { return v === 2 ? '是' : '否' }
      if (prop === 'fInternalVehicle') { return v === 1 ? '内部车辆' : '试驾车' }
      return v
    }
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
    return {
      pickerRecord: {
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
      pickerOptions: {
        shortcuts: [{
          text: '一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() + 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [end, start])
          }
        }, {
          text: '一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() + 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [end, start])
          }
        }, {
          text: '三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() + 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [end, start])
          }
        }, {
          text: '六个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() + 3600 * 1000 * 24 * 180)
            picker.$emit('pick', [end, start])
          }
        }]
      },
      dialogRules: {
        name: [{ required: true, message: '请输入姓名（这个为必填项）', trigger: 'blur' }],
        drivername: [{ required: true, message: '请输入驾驶员姓名（这个为必填项）', trigger: 'blur' }],
        phone: [
          { required: true, message: '请输入手机号（这个必填项）', trigger: 'blur' },
          { pattern: /^\d{11}$/, message: '请输入正确的电话号码格式' }
        ],
        fPlatenum: [
          { min: 7, max: 8, message: '车牌最少为7位，最多为8位', trigger: 'blur' },
          { required: true, message: '请输入车牌号', trigger: 'blur' },
          { validator: fPlatenum, trigger: 'blur' }
        ]
      },
      showInfo: false,
      apibase: process.env.BASE_API,
      upHeader: { Authorization: getToken() },
      fAid: '',
      ins: '',
      setCurrentDialog: false,
      upImgTag: '',
      tableData: {
        list: [],
        pagesize: 10,
        pageNum: '',
        pages: ''
      },
      dialogVisible: false,
      addInCar: {
        fPlatenum: '',
        fOwner: '',
        dueDate: '',
        fRemarks: '',
        fColor: '',
        fModel: '',
        fBrand: '',
        fType: '',
        fInled: '',
        fOutled: ''
      },
      formIn: {
        plateNumber: '',
        fOwner: '',
        inCars: '',
        fFounder: '',
        dueDate: ''
      },
      setCurrentData: {
        fPlatenum: '',
        fOwner: '',
        inCars: '',
        fFounder: '',
        dueDate: '',
        dueDates: '',
        fType: '',
        fId: '',
        fRemarks: '',
        fInled: '',
        fOutled: ''
      },
      insSet: '',
      inSets: '',
      userToken: this.$store.state.user.token,
      carStoreData: [],
      defaultProps: {
        children: 'children',
        label: 'organizationName',
        isLeaf: 'leaf'
      },
      listQuery: {
        pageNum: 1,
        limit: 10,
        sort: '+id'
      },
      recordList: [],
      recordQuery: {
        pageNum: 1,
        limit: 10,
        sort: '+id',
        fAid: '',
        status: 3,
        carNumber: '',
        checkTimeBefore: '',
        checkoutTimeAfter: '',
        total: 0
      },
      total: 0,
      carStoreid: '',
      carStoreName: '',
      treedialog: false,
      recordDate: '',
      colTable: [
        { prop: 'fPlatenum', label: '车牌号', fixed: true, width: '' },
        { prop: 'fColor', label: '颜色', fixed: true, width: '' },
        { prop: 'fBrand', label: '品牌', fixed: true, width: '' },
        { prop: 'fModel', label: '车系', fixed: true, width: '' },
        { prop: 'fType', label: '车型', fixed: true, width: '' },
        { prop: 'fInDate', label: '入场时间', fixed: true, width: '120px' },
        { prop: 'fOutDate', label: '离场时间', fixed: true, width: '' },
        // { prop: 'fPresenceStatus', label: '车辆在场状态', fixed: true, width: 100 },
        { prop: 'inCarImgs', label: '图片', fixed: true, width: '' }
      ],
      colList: [
        { prop: 'fUnit', label: '店铺', fixed: true, width: '90' },
        { prop: 'fPlatenum', label: '车牌号', fixed: true, width: '80' },
        { prop: 'fOwner', label: '所属者', fixed: true, width: '65' },
        { prop: 'fBrand', label: '品牌', fixed: true, width: '60' },
        { prop: 'fModel', label: '车系', fixed: true, width: '60' },
        { prop: 'fColor', label: '颜色', fixed: true, width: '50' },
        { prop: 'fType', label: '车型', fixed: true, width: '80' },
        { prop: 'fInternalVehicle', label: '车辆标识', fixed: true, width: '' },
        { prop: 'PresenceStatus', label: '车辆状态', fixed: true, width: '100' },
        { prop: 'showRevoke', label: '是否在有有效期内', fixed: true, width: '140' },
        { prop: 'fFounder', label: '创建人', fixed: true, width: '' },
        { prop: 'fRemarks', label: '备注', fixed: true, width: '' },
        { prop: 'dueDate', label: '有效期', fixed: true, width: '120' }

      ],
      options: [
        {
          code: 'operationparkIncarUpdate',
          value: '操作试驾车',
          type: 'selbtn'
        }
      ],
      inCarBtn: false,
      btnFlagData: []
    }
  },
  computed: {
    ...mapGetters([
      'selectOrgTree',
      // 'organizationAddressCode',
      'organizationName'])
  },
  created() {
    this.storeTree()
    this.authorizations()
  },
  methods: {
    showInfos() {
      this.showInfo = true
      this.entryrecords()
    },
    selectloc(obj) {
      this.treedialog = false
      if (obj) {
        this.recordQuery.fAid = obj.organizationAddressCode
        this.carStoreid = obj.organizationAddressCode
        this.carStoreName = obj.organizationName
        localStorage.setItem('carStoreName', obj.organizationName)
        localStorage.setItem('carStoreid', obj.organizationAddressCode)
        this.treedialog = false
        Cookies.remove('loadfirstStore', 1)
        this.innercars()
      }
    },
    authorizations() {
      this.options.forEach(val => {
        this.btnFlagData.push(val.code)
      })
      var arr = this.btnFlagData.join(',')
      authorization({ code: arr }).then(res => {
        if (res.code === 0) {
          console.log(res)
          const rescodes = res.data
          const arcodes = this.options.filter(v => {
            return rescodes.indexOf(v.code) > -1
          })
          this.optsBtn = arcodes.filter(v => { return v.type === 'selbtn' })
          this.optsBtn.forEach(item => {
            // 试驾车辆权限
            if (item.code === 'operationparkIncarUpdate') {
              this.inCarBtn = true
            }
          })
        }
      })
    },
    showTree() {
      this.treedialog = true
    },
    getFirstOrganizationName(orgtree) {
      return (orgtree[0].children && orgtree[0].children.length) ? this.getFirstOrganizationName(orgtree[0].children) : orgtree[0].organizationName
    },
    getFirstOrganizationId(orgtree) {
      return (orgtree[0].children && orgtree[0].children.length) ? this.getFirstOrganizationId(orgtree[0].children) : orgtree[0].organizationAddressCode
    },
    storeTree() {
      if (localStorage.getItem('carStoreName')) {
        this.carStoreName = localStorage.getItem('carStoreName')
        this.carStoreid = localStorage.getItem('carStoreid')
        this.recordQuery.fAid = localStorage.getItem('carStoreid')
      } else {
        if (this.selectOrgTree) {
          this.carStoreName = this.getFirstOrganizationName(this.selectOrgTree)
          this.carStoreid = this.getFirstOrganizationId(this.selectOrgTree)
          this.recordQuery.fAid = this.getFirstOrganizationId(this.selectOrgTree)
          localStorage.setItem('carStoreid', this.carStoreid)
          localStorage.setItem('carStoreName', this.carStoreName)
        }
      }
      console.log(this.carStoreName, '店铺')
      this.innercars()
    },
    innercars() {
      innercarList({ token: this.$store.state.user.token, fInternalVehicle: 1, fAid: this.carStoreid, pageNum: this.listQuery.pageNum, limit: this.listQuery.limit }).then(res => {
        if (res.code === 0) {
          this.loading = false
          this.tableData.list = res.data.list
          this.tableData.pages = res.data.pages
          this.tableData.pageNum = res.data.pageNum
          this.tableData.pageSize = res.data.pageSize
          this.total = res.data.total
          for (var i = 0; i < this.tableData.list.length; i++) {
            if (this.tableData.list[i].fInternalVehicle === 1) {
              this.tableData.list[i].inCars = '内部车辆'
            }
            if (this.tableData.list[i].fInternalVehicle === 2) {
              this.tableData.list[i].inCars = '试驾车'
            }
            if (this.tableData.list[i].showRevoke === 1) {
              this.tableData.list[i].showRevokeStatus = '否'
            }
            if (this.tableData.list[i].showRevoke === 2) {
              this.tableData.list[i].showRevokeStatus = '是'
            }
          }
        }
      })
    },
    handleCurrentChange(current) {
      innercarList({ token: this.$store.state.user.token, pageNum: current, fPlatenum: this.formIn.plateNumber }).then(res => {
        if (res.code === 0) {
          this.tableData.list = res.data.list
          this.tableData.pages = res.data.pages
          this.tableData.pageNum = res.data.pageNum
          this.tableData.pageSize = res.data.pageSize
          for (var i = 0; i < this.tableData.list.length; i++) {
            if (this.tableData.list[i].fInternalVehicle === 1) {
              this.tableData.list[i].inCars = '内部车辆'
            }
            if (this.tableData.list[i].fInternalVehicle === 2) {
              this.tableData.list[i].inCars = '试驾车'
            }
          }
        }
      })
    },
    beforeImgUpload(file, tag) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'application/x-jpg' || file.type === 'application/x-png'
      const isLt2M = file.size / 1024 / 1024 < 2
      this.upImgTag = tag

      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    handleAvatarSuccess(res) {
      if (res.code === 0) {
        this.upImgTag = res.data.url
      } else {
        this.$message.error(res.msg)
      }
    },
    checkTime(i) {
      if (i < 10) {
        i = '0' + i
      }
      return i
    },
    addCar() {
      this.dialogVisible = true
      this.addInCar = {
        fPlatenum: '',
        fOwner: '',
        dueDate: '',
        fRemarks: '',
        fColor: '',
        fModel: '',
        fBrand: '',
        fType: '',
        fInled: '',
        fOutled: ''
      }
      this.$nextTick(() => {
        this.$refs['addInCar'].clearValidate()
      })
    },
    // 添加内部车辆
    addSure(addInCar) {
      this.$refs[addInCar].validate((valid) => {
        if (valid) {
          this.dialogVisible = false
          var date = this.addInCar.dueDate[0]
          var date1 = this.addInCar.dueDate[1]
          var addData = {
            fPlatenum: this.addInCar.fPlatenum,
            fOwner: this.addInCar.fOwner,
            fColor: this.addInCar.fColor,
            fModel: this.addInCar.fModel,
            fBrand: this.addInCar.fBrand,
            fType: this.addInCar.fType,
            token: this.userToken,
            fInternalVehicle: 1,
            fRemarks: this.addInCar.fRemarks,
            startDate: date || '',
            dueDate: date1 || '',
            fInnercarImage: this.upImgTag,
            fAid: this.carStoreid,
            fInled: this.addInCar.fInled,
            fOutled: this.addInCar.fOutled
          }

          addinner(addData).then(res => {
            if (res.code === 0 && res.data === 2) {
              this.$message({ type: 'success', message: res.msg })
              return
            } else {
              this.$message({ type: 'success', message: res.msg })
              this.innercars()
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 清空过滤车辆信息
    clearInfo() {
      this.formIn.plateNumber = ''
      this.formIn.fOwner = ''
      this.formIn.fFounder = ''
      this.formIn.dueDate = ''
    },
    // 查询
    searchInCar() {
      var dataSearch = {
        fPlatenum: this.formIn.plateNumber
      }
      innercarList(dataSearch).then(res => {
        if (res.code === 0) {
          this.tableData.list = res.data.list
          this.tableData.pages = res.data.pages
          this.tableData.pageNum = res.data.pageNum
          this.tableData.pageSize = res.data.pageSize
          for (var i = 0; i < this.tableData.list.length; i++) {
            if (this.tableData.list[i].fInternalVehicle === 1) {
              this.tableData.list[i].inCars = '公司内部车辆'
            }
            if (this.tableData.list[i].fInternalVehicle === 2) {
              this.tableData.list[i].inCars = '试驾车'
            }
          }
        }
      })
    },
    setCurrent(row) {
      queryone({ fid: row.fId, token: this.userToken }).then(res => {
        if (res.code === 0) {
          this.setCurrentDialog = true
          this.setCurrentData.fPlatenum = res.data.fPlatenum
          this.setCurrentData.fOwner = res.data.fOwner
          this.setCurrentData.fId = res.data.fId
          this.setCurrentData.dueDate = [res.data.startDate, res.data.dueDate]
          this.setCurrentData.fRemarks = res.data.fRemarks
          this.setCurrentData.fColor = res.data.fColor
          this.setCurrentData.fModel = res.data.fModel
          this.setCurrentData.fBrand = res.data.fBrand
          this.setCurrentData.fType = res.data.fType
          this.setCurrentData.fOutled = res.data.fOutled
          this.setCurrentData.fInled = res.data.fInled
        }
      })
    },
    setVal(val) {
      this.inSet = val
    },
    setSure(setCurrentData) {
      this.$refs[setCurrentData].validate((valid) => {
        if (valid) {
          var startTime = ''; var endTime = ''
          if (this.setCurrentData.dueDate) {
            var date = new Date(this.setCurrentData.dueDate[0])
            var date1 = new Date(this.setCurrentData.dueDate[1])
            startTime = date.getFullYear() + '-' + this.checkTime(date.getMonth() + 1) + '-' + this.checkTime(date.getDate())
            endTime = date1.getFullYear() + '-' + this.checkTime((date1.getMonth() + 1)) + '-' + this.checkTime(date1.getDate())
          } else {
            startTime = ''
            endTime = ''
          }
          var data = {
            fPlatenum: this.setCurrentData.fPlatenum,
            fOwner: this.setCurrentData.fOwner,
            fColor: this.setCurrentData.fColor,
            fModel: this.setCurrentData.fModel,
            fBrand: this.setCurrentData.fBrand,
            setUpStart: startTime,
            delayed: endTime,
            fType: this.setCurrentData.fType,
            fId: this.setCurrentData.fId,
            token: this.userToken,
            fRemarks: this.setCurrentData.fRemarks,
            fAid: this.recordQuery.fAid,
            fInled: this.setCurrentData.fInled,
            fOutled: this.setCurrentData.fOutled
          }
          update(data).then(res => {
            if (res.code === 0) {
              this.setCurrentDialog = false
              this.innercars()
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    del(id) {
      this.$confirm('是否要删除这条信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        deleteIns({ token: this.userToken, fId: id.fId }).then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.innercars()
          }
        })
      }).catch(() => { })
    },
    entryrecords() {
      entryrecord(this.recordQuery).then(res => {
        this.recordList = res.data.list
        this.recordQuery.total = res.data.total
        this.recordList.filter(item => {
        /* eslint-disable */ if (item.showRevoke == 1) {
            item.fPlatenum = item.fPlatenum + '（已删除）'
          } else {
            item.fPlatenum = item.fPlatenum
          }
        })
      })
    },
    searchRecar () {
      this.recordQuery.checkTimeBefore=this.recordDate&&this.recordDate[0]
      this.recordQuery.checkoutTimeAfter=this.recordDate&&this.recordDate[1]      
      const formdata = Object.assign({}, this.recordQuery)
      entryrecord(formdata).then(res => {
        this.recordList = res.data.list
        this.recordQuery.total = res.data.total
      })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.el-table__header-wrapper {
}
.u_tree {
  height: 30px !important;
  font-size: 16px;
  z-index: 999;
}
.u_tree {
  font-size: 16px;
  z-index: 99;
  .el-tree-node__label {
    font-size: 15px;
  }
}
.u_tree.el-tree--highlight-current {
  height: 20px;
  margin-top: 10px;
  .el-tree-node.is-current > .el-tree-node__content {
    .el-tree-node__label {
      border: 1px sold transparent;
    }
  }
}
.InCar {
  width: 100%;
  height: 100%;
  .filterBox {
    display: flex;
    float: right;
    margin-top: 70px;
    margin-bottom: 10px;
    margin-right: -187px;
    .filterIns {
      width: 200px;
      position: relative;
      img {
        display: block;
        width: 25px;
        height: 25px;
        position: absolute;
        top: 8px;
        right: 5px;
      }
    }
  }
  .carStore {
    width: 100%;
    p {
      float: right;
      margin-top: 5px;
      display: flex;
      span {
        display: block;
        line-height: 50px;
        margin-right: 10px;
      }
    }
  }
  .fPlatenum {
    display: flex;
    label {
      line-height: 45px;
    }
    input {
      display: block;
      height: 45px;
      width: 70%;
      border: 1px solid #dcdfe6;
      margin-left: 5px;
      border-radius: 4px;
      padding-left: 10px;
    }
  }
  .inCars {
    display: flex;
    label {
      line-height: 45px;
    }
    input {
      display: block;
      height: 45px;
      width: 58%;
      border: 1px solid #dcdfe6;
      margin-left: 5px;
      border-radius: 4px;
      padding-left: 10px;
    }
  }
  .addCar {
    margin-left: 10px;
  }
  .edit {
    outline: none;
    border: none;
    border-radius: 2px;
    background: #00adef;
    color: #fff;
  }
  .del {
    outline: none;
    border: none;
    border-radius: 2px;
    border: 1px solid #fbc4c4;
    background: #fef0f0;
    color: #f56c;
  }
}
</style>
