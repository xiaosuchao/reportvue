<template>
  <div class="tryBox">
    <div class="carStore">
      <p>
        <span @click="showTree"><input v-model = "carStoreName" style="height:40px;width:200px;border-radius:4px;border:1px solid #dcdfe6;padding-left:10px;color:#606266" type="text" placeholder="请选择店铺"></span>
        <!-- <span v-show="orgtree.length<=0" style="border:1px solid #ccc;height:20px;line-height:20px;margin-top:15px;">暂无数据</span> -->

      </p>
    </div>
    <div class="filterBox">
      <div v-if="DotryCar" class="filterIns">
        <el-input v-model="formIn.plateNumber" placeholder="请输入车牌号/VIN" style="width:100%"/>
        <img src="../../../assets/images/search.png" alt @click="searchTryCar()">
      </div>
      <el-button v-if="DotryCar" type="primary" class="addCar" @click="dialogVisibleBtn">添加试驾车辆</el-button>
      <el-button type="primary" @click="showInfos">查看入场/离场记录</el-button>
    </div>
    <elTree :isshowtreedialog="treedialog" @chloc="selectloc" />
    <el-dialog :visible.sync="tryDrive" title="申请试驾车辆" width="40%">
      <el-form ref="tryDriveInfo" :model="tryDriveInfo" :rules="dialogRules" label-width="100px">

        <el-form-item label="车牌号/VIN" prop="fPlatenum">
          <el-input v-model="tryDriveInfo.fPlatenum" type="text" disabled style="width:97%" placeholder="请输入车牌号"/>
        </el-form-item>
        <el-form-item label="客户姓名" prop="name">
          <el-input v-model="tryDriveInfo.name" type="text" style="width:97%" maxlength="7" placeholder="请输入客户姓名 "/>
        </el-form-item>
        <el-form-item label="客户手机号" prop="phone">
          <el-input v-model="tryDriveInfo.phone" style="width:97%" placeholder="请输入客户手机号"/>
        </el-form-item>
        <el-form-item label="客户性别" style="width:77%">
          <el-select v-model="tryDriveInfo.gender" placeholder="请选择">
            <el-option
              v-for="item in genderData"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="里程表信息">
          <el-input v-model="tryDriveInfo.fInMileage" style="width:69%;" placeholder/>&nbsp;km
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="tryDriveInfo.note" type="textarea" style="width:97%;" placeholder="请输入..."/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="tdrcurrSure('tryDriveInfo')">确 定</el-button>
        <el-button @click="tryDrive = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="dialogVisible" title="添加试驾车辆" width="40%">
      <el-form ref="addInCar" :model="addInCar" :rules="dialogRules" label-width="100px">
        <el-form-item label="车牌号/VIN" prop="fPlatenum">
          <el-input v-model="addInCar.fPlatenum" type="text" style="width:97%" maxlength="17" placeholder="请输入车牌号"/>
        </el-form-item>
        <el-form-item label="车系">
          <el-input v-model="addInCar.fModel" type="text" style="width:97%" maxlength="10" placeholder="请输入车的车系 "/>
        </el-form-item>
        <el-form-item label="车型">
          <el-input v-model="addInCar.fType" type="text" style="width:97%" maxlength="10" placeholder="请输入车的车型"/>
        </el-form-item>
        <el-form-item label="颜色">
          <el-input v-model="addInCar.fColor" type="text" style="width:97%" maxlength="10" placeholder="请输入车的颜色"/>
        </el-form-item>
        <el-form-item label="上传图片">
          <el-upload
            :show-file-list="false"
            :headers="upHeader"
            :on-success="handleAvatarSuccess"
            :before-upload="(file)=>{return beforeImgUpload(file,'organizationLoginLogo')}"
            :action="apibase+'/uploader/img'"
            class="avatar-uploader">
            <img v-if="upImgTag" :src="upImgTag" style="display:block;width:45px;heigth:45px">
            <i v-else class="el-icon-plus avatar-uploader-icon"/>
          </el-upload>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="addInCar.fRemarks"
            type="textarea"
            style="width:97%"
            maxlength="200"
            placeholder="请输入..."/>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addSure('addInCar')">确 定</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>

    <el-table :data="trycarData.list" border style="width: 100%;margin-top:10px">
      <template v-for="item in dataList">
        <el-table-column :fixed="item.fixed" :key="item.id" :prop="item.prop" :label="item.label" :min-width="item.width" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row[item.prop] | dataList(item.prop) }}</span>
          </template>
        </el-table-column>
      </template>
      <el-table-column label="操作" min-width="220" align="center">
        <template slot-scope="scope" >
          <div class="btns">
            <el-button v-if="DotryCar" type="primary" size="small" @click="setCurrent(scope.row)">编辑</el-button>
            <el-button v-if="DotryCar" type="danger" size="small" @click="del(scope.row)">删除</el-button>
            <el-button v-if="tryCarAU&&scope.row.presenceStatus == 1 &&scope.row.businessButton == 1" type="primary" size="small" @click="startworks(scope.row)">申请</el-button>
            <el-button v-if="scope.row.aouthShowRevoke == 1" type="info" size="small" @click="startworkN(scope.row)">撤销审核</el-button>
            <el-button v-if="tryCar&&scope.row.presenceStatus == 3 && scope.row.businessButton != 2" type="primary" size="small" @click="audits(scope.row)">审核</el-button>
            <el-button v-if="tryCar&&scope.row.presenceStatus == 3 && scope.row.businessButton != 2" type="primary" size="small" @click="reject(scope.row)">驳回</el-button>
            <el-button v-if="scope.row.showRevoke==1" type="info" size="small" @click="undo(scope.row)">撤销申请</el-button>
            <el-button v-if="tryCarAU&&tryCar&& scope.row.businessButton == 1" type="primary" size="small" @click="apply(scope.row)">申请记录</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.pageNum"
      :limit.sync="listQuery.limit"
      @pagination="innercarLists"
    />
    <el-dialog :visible.sync="rejectShow">
      <el-form label-width="80px">
        <el-form-item label="驳回原因">
          <el-input v-model="rejectData" type="textarea" maxlength="200"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="setReject()">确 定</el-button>
        <el-button @click="rejectShow = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="applyShow" title="申请记录" width="80%">
      <el-date-picker
        v-model="applyDate"
        type="daterange"
        style="width:80%"
        value-format="yyyy-MM-dd"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change="applyChange"/>
      <el-table
        :data="applyData"
        style="margin-top:10px;"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row>
        <template v-for="item in colTable">
          <el-table-column :fixed="item.fixed" :key="item.id" :prop="item.prop" :label="item.label" :min-width="item.width" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row[item.prop] | filterList(item.prop) }}</span>
            </template>
          </el-table-column>
        </template>
      </el-table>
      <pagination
        v-show="applyQuery.total>0"
        :total="applyQuery.total"
        :page.sync="applyQuery.pageNum"
        :limit.sync="applyQuery.limit"
        @pagination="apply"
      />
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="applyShow = false">确 定</el-button>
        <el-button @click="applyShow = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="setCurrentDialog" title="编辑试驾车辆" width="40%">
      <el-form ref="setCurrentData" :model="setCurrentData" :rules="dialogRules" label-width="100px">

        <el-form-item label="车牌号/VIN" prop="fPlatenum">
          <el-input v-model="setCurrentData.fPlatenum" type="text" maxlength="17" style="width:97%" placeholder="请输入车牌号"/>
        </el-form-item>
        <el-form-item label="创建人">
          <el-input v-model="setCurrentData.fFounder" disabled type="text" style="width:97%" maxlength="10" placeholder="请输入创建人的名字 "/>
        </el-form-item>
        <el-form-item label="车系">
          <el-input
            v-model="setCurrentData.fModel"
            type="text"
            style="width:97%"
            maxlength="4"
            placeholder="请输入车的车系"/>
        </el-form-item>
        <el-form-item label="车型">
          <el-input
            v-model="setCurrentData.fType"
            type="text"
            style="width:97%"
            maxlength="200"
            placeholder="请输入车的车型"/>
        </el-form-item>
        <el-form-item label="颜色">
          <el-input v-model="setCurrentData.fColor" type="text" style="width:97%" maxlength="4" placeholder="请输入车的颜色"/>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="setCurrentData.note"
            type="textarea"
            style="width:97%"
            maxlength="200"
            placeholder="请输入..."/>
        </el-form-item>
        <!-- <el-form-item
          label="时间">
          <el-date-picker
            v-model="setCurrentData.dueDate"
            type="date"
            placeholder="选择日期"
          />
        </el-form-item> -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="setSure('setCurrentData')">确 定</el-button>
        <el-button @click="setCurrentDialog = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="audioFlag" title="审核" width="50%">
      <el-form ref="auditsData" :model="auditsData" :rules="dialogRules" label-width="110px">
        <el-form-item label="客户姓名" prop="name">
          <el-input v-model="auditsData.name" type="text" style="width:97%" maxlength="10" placeholder="请输入客户的姓名"/>
        </el-form-item>
        <el-form-item label="客户手机号" prop="phone">
          <el-input v-model="auditsData.phone" type="text" style="width:97%" maxlength="11" placeholder="请输入客户的手机号"/>
        </el-form-item>
        <el-form-item label="客户性别">
          <el-select v-model="auditsData.gender" placeholder="请选择" @change="changeAudis">
            <el-option
              v-for="item in genderData"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="车牌号/VIN">
          <el-input v-model="auditsData.fPlatenum" disabled type="text" style="width:97%" maxlength="7" placeholder="请输入客户的车牌号"/>
        </el-form-item>
        <el-form-item label="申请人">
          <el-input v-model="auditsData.fWorker" disabled type="text" style="width:97%" maxlength="10" placeholder="请输入申请人的手机号"/>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="auditsData.note" type="textarea" style="width:97%" maxlength="200" placeholder="请输入..."/>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="setAudit('auditsData')">确 定</el-button>
        <el-button @click="audioFlag = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="showInfo"
      title="入场/离场记录"
      width="80%"
    >
      <el-row>
        <el-col :span="12"/>
        <el-col :span="12" style="display:flex;">
          <el-date-picker
            :picker-options="pickerOptions"
            v-model="recordDate"
            style="style:width:80%"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"/>
          <el-input v-model="recordQuery.carNumber" style="width:60%;margin-left:10px;" placeholder="请输入车牌号"/>
          <el-button type="primary" style="margin-left:10px;" @click="searchRecar">查询</el-button>
        </el-col>
      </el-row>
      <el-table
        :data="recordList"
        element-loading-text="Loading"
        style="margin-top:10px"
        border
        fit
        highlight-current-row>
        <template v-for="item in colTables">
          <el-table-column :fixed="item.fixed" :key="item.id" :prop="item.prop" :label="item.label" :min-width="item.width" align="center">
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
      <pagination v-show="recordQuery.total>0" :total="recordQuery.total" :page.sync="recordQuery.pageNum" :limit.sync="recordQuery.limit" @pagination="entryrecords" />

      <el-form ref="setCurrentData" :model="setCurrentData" :rules="dialogRules" label-width="95px"/>
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
import { getToken } from '@/utils/auth'
import { mapGetters } from 'vuex'
import Cookies from 'js-cookie'
// import store from '@/store'
import {
  queryone,
  update,
  addinner,
  deleteIns,
  tdrcurrent,
  querystar,
  testQuery,
  fplatenum,
  startwork,
  delstartwork,
  InaouthRevoke,
  authorization,
  reject,
  testEntryrecord,
  operation
} from '@/api/car'
export default {
  components: { Pagination, elTree },
  filters: {
    showstr(v, prop) {
      if (prop === 'fPresenceStatus') { return v === '2' ? '离场' : '在场' }
      if (prop === 'showAouthRevoke') { return v === '1' ? '已删除' : '未删除' }
      return v
    },
    filterList(v, prop) {
      if (prop === 'fType') {
        return v === 1 ? '申请' : v === 2 ? '撤销申请' : v === 3 ? '审核' : v === 4 ? '撤销审核' : '主管驳回'
      }
      return v
    },
    dataList(v, prop) {
      if (prop === 'presenceStatus') {
        return v === 1 ? '在场' : v === 2 ? '离场' : v === 3 ? '待审核' : v === 4 ? '审核通过，待离场' : '强制出场'
      }
      return v
    }
  },
  data() {
    var fInMileage = (rule, value, callback) => {
      var reg = /^[1-9]+[0-9]*]*$/
      if (value !== '') {
        if (!reg.test(value)) {
          callback(new Error('请输入正确的数字格式'))
        } else {
          callback()
        }
      }
    }
    var phone = (rule, value, callback) => {
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
        name: [{ required: true, message: '请输入客户姓名', trigger: 'blur' }],
        drivername: [{ required: true, message: '请输入客户姓名', trigger: 'blur' }],
        phone: [
          { validator: phone, trigger: 'blur' }
        ],
        fPlatenum: [
          { min: 7, max: 17, message: '车牌最少为7位，VIN为17位', trigger: 'blur' },
          { required: true, message: '请输入车牌号', trigger: 'blur' }
          // { pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/, message: '请输入正确的车牌号/VIN格式' }
        ],
        fInMileage: [
          { validator: fInMileage, trigger: 'blur' }
        ]
      },
      treedialog: false,
      name: '试乘试驾管理',
      trycarData: {
        list: [],
        pageNum: '',
        pagesize: '',
        pages: ''
      },
      listQuery: {
        pageNum: 1,
        limit: 10,
        sort: '+id'
      },
      applyDate: '',
      applyData: [],
      applyQuery: {
        pageNum: 1,
        limit: 10,
        sort: '+id',
        total: '',
        fAid: '',
        carNumber: '',
        checkTimeBefore: '',
        checkoutTimeAfter: ''
      },
      formIn: {
        plateNumber: ''
      },
      apibase: process.env.BASE_API,
      upHeader: { Authorization: getToken() },
      upImgTag: '',
      Datealue: '',
      carStoreid: '',
      carStoreName: '',
      userToken: this.$store.state.user.token,
      setCurrentDialog: false,
      addInCar: {
        fPlatenum: '',
        fOwner: '',
        fRemarks: '',
        fColor: '',
        fModel: '',
        inCars: [
          {
            value: '1',
            label: '公司内部车辆'
          },
          {
            value: '2',
            label: '试驾车'
          }
        ]
      },
      dialogVisible: false,
      setCurrentData: {
        fPlatenum: '',
        dueDate: '',
        fFounder: '',
        tryStatus: '',
        fId: '',
        note: ''
      },
      editStatusData: '',
      tryDriveBtns: false,
      tryDriveInfo: {
        name: '',
        phone: '',
        fPlatenum: '',
        gender: '',
        note: '',
        fId: ''
      },
      auditsData: {
        fPlatenum: '',
        name: '',
        phone: '',
        gender: '',
        fId: '',
        genderVal: '',
        note: ''
      },
      tryDriveCars: [], // 试乘试驾车辆信息\
      tryDrive: false,
      genderData: [
        {
          id: '2',
          label: '男'
        },
        {
          id: '3',
          label: '女'
        }
      ], // 试乘试驾 Dialog
      defaultProps: {
        children: 'children',
        label: 'organizationName',
        isLeaf: 'leaf'
      },
      audioFlag: false,
      applyFlag: true,
      auditFlag: true,
      options: [
        {
          code: 'operationparktryCarUpdate',
          value: '操作试驾车',
          type: 'selbtn'
        }, {
          code: 'operationTestDriverStartWork',
          value: '试驾试乘开工单',
          type: 'selbtn'
        }, {
          code: 'operationparktryDrive',
          value: '试乘试驾审核',
          type: 'selbtn'
        }
      ],
      tryCar: false,
      tryCarAU: false,
      btnFlagData: [],
      DotryCar: false,
      total: 0,
      rejectShow: false,
      applyShow: false,
      rejectData: '',
      innerCarId: '',
      rejectCurrentId: '',
      recordDate: '',
      dataList: [
        { prop: 'fUnit', label: '店铺', fixed: true, width: '120' },
        { prop: 'fPlatenum', label: '车牌号/vin', fixed: true, width: '120' },
        { prop: 'presenceStatus', label: '车辆状态', fixed: true, width: '120' },
        { prop: 'fFounder', label: '创建人', fixed: true, width: '120' },
        { prop: 'fModel', label: '车系', fixed: true, width: '120' },
        { prop: 'fType', label: '车型', fixed: true, width: '120' },
        { prop: 'fColor', label: '颜色', fixed: true, width: '120' },
        { prop: 'startDate', label: '创建时间', fixed: true, width: '120' },
        { prop: 'fRemarks', label: '备注', fixed: true, width: '120' }

      ],
      colTables: [
        { prop: 'fPlatenum', label: '车牌号', fixed: true, width: '' },
        // { prop: 'showAouthRevoke', label: '删除标记', fixed: true, width: '' },
        { prop: 'fName', label: '试驾人', fixed: true, width: '' },
        { prop: 'fWorker', label: '申请人', fixed: true, width: '' },
        { prop: 'fFouder', label: '审核人', fixed: true, width: '' },
        { prop: 'fType', label: '车型', fixed: true, width: '' },
        { prop: 'fOutDate', label: '离场时间', fixed: true, width: '120' },
        { prop: 'fInDate', label: '入场时间', fixed: true, width: '120' },
        { prop: 'inCarImgs', label: '图片', fixed: true, width: '' }
        // { prop: 'fPresenceStatus', label: '车辆在场状态', fixed: true, width: '' },
        // { prop: 'fCarLiftingRodInImgUrl', label: '图片', fixed: true, width: '' }
      ],

      colTable: [
        { prop: 'fDateShow', label: '操作时间', fixed: true, width: '' },
        { prop: 'fOperator', label: '操作人', fixed: true, width: '' },
        { prop: 'fPlatenum', label: '车牌号', fixed: true, width: '' },
        { prop: 'fTestdrivers', label: '试驾人', fixed: true, width: '' },
        { prop: 'fType', label: '操作类型', fixed: true, width: '' },
        { prop: 'fRemarks', label: '操作备注', fixed: true, width: '' }

      ],
      recordList: [],
      recordQuery: {
        pageNum: 1,
        limit: 10,
        sort: '+id',
        fAid: '',
        status: 4,
        carNumber: '',
        checkTimeBefore: '',
        checkoutTimeAfter: '',
        total: 0
      },
      showInfo: false
    }
  },
  computed: {
    ...mapGetters([
      'selectOrgTree',
      'organizationId',
      'organizationName'
    ])
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
        this.carStoreid = obj.organizationAddressCode
        this.recordQuery.fAid = obj.organizationAddressCode
        this.applyQuery.fAid = obj.organizationAddressCode
        this.carStoreName = obj.organizationName
        localStorage.setItem('carStoreid', obj.organizationAddressCode)
        localStorage.setItem('carStoreName', obj.organizationName)
        this.treedialog = false
        Cookies.remove('loadfirstStore', 1)
        this.innercarLists()
      }
    },
    dialogVisibleBtn() {
      this.dialogVisible = true
      this.add()
    },
    authorizations() {
      this.options.forEach(val => {
        this.btnFlagData.push(val.code)
      })
      var arr = this.btnFlagData.join(',')
      authorization({ code: arr }).then(res => {
        if (res.code === 0) {
          const rescodes = res.data
          console.log('权限', res.data)
          const arcodes = this.options.filter(v => {
            return rescodes.indexOf(v.code) > -1
          })
          console.log(arcodes)
          this.optsBtn = arcodes.filter(v => { return v.type === 'selbtn' })
          console.log(this.optsBtn)
          this.optsBtn.forEach(item => {
            // 试驾车辆权限
            console.log(item.code)
            if (item.code === 'operationparktryCarUpdate') {
              this.DotryCar = true
            }

            if (item.code === 'operationTestDriverStartWork') {
              this.tryCarAU = true
            }
            if (item.code === 'operationparktryDrive') {
              this.tryCar = true
            }
          })
        }
      })
    },
    showTree() {
      this.treedialog = true
    },
    storeTree() {
      if (localStorage.getItem('carStoreName')) {
        this.carStoreName = localStorage.getItem('carStoreName')
        this.carStoreid = localStorage.getItem('carStoreid')
        this.recordQuery.fAid = localStorage.getItem('carStoreid')
        this.applyQuery.fAid = localStorage.getItem('carStoreid')
      } else {
        if (this.selectOrgTree) {
          this.carStoreName = this.getFirstOrganizationName(this.selectOrgTree)
          this.carStoreid = this.getFirstOrganizationId(this.selectOrgTree)
          this.recordQuery.fAid = this.getFirstOrganizationId(this.selectOrgTree)
          this.applyQuery.fAid = this.getFirstOrganizationId(this.selectOrgTree)
          localStorage.setItem('carStoreid', this.carStoreid)
          localStorage.setItem('carStoreName', this.carStoreName)
        }
      }
      this.innercarLists()
    },
    getFirstOrganizationName(orgtree) {
      if (orgtree) {
        return (orgtree[0].children && orgtree[0].children.length) ? this.getFirstOrganizationName(orgtree[0].children) : orgtree[0].organizationName
      }
    },
    getFirstOrganizationId(orgtree) {
      if (orgtree) {
        return (orgtree[0].children && orgtree[0].children.length) ? this.getFirstOrganizationId(orgtree[0].children) : orgtree[0].organizationAddressCode
      }
    },
    handleCurrentChange(val) {
      testQuery({ pageNum: val, token: this.useruserToken, fPlatenum: this.formIn.plateNumber }).then(res => {
        if (res.code === 0) {
          this.trycarData.list = res.data.list
          this.trycarData.pages = res.data.pages
          this.trycarData.pageNum = res.data.pageNum
          this.trycarData.pageSize = res.data.pageSize
          this.total = res.data.total
        }
      })
    },
    // 渲染列表
    innercarLists() {
      testQuery({ token: this.userToken, fAid: this.carStoreid, pageNum: this.listQuery.pageNum, limit: this.listQuery.limit }).then(res => {
        if (res.code === 0) {
          this.trycarData.list = res.data.list
          this.total = res.data.total
          this.trycarData.list = res.data.list
          this.trycarData.pages = res.data.pages
          this.trycarData.pageNum = res.data.pageNum
          this.trycarData.pageSize = res.data.pageSize
          this.total = res.data.total
        }
      })
    },
    // 查询
    searchTryCar() {
      testQuery({
        fPlatenum: this.formIn.plateNumber,
        token: this.userToken,
        fAid: this.carStoreid
      }).then(res => {
        this.trycarData.list = res.data.list
        this.trycarData.pages = res.data.pages
        this.trycarData.pageNum = res.data.pageNum
        this.trycarData.pageSize = res.data.pageSize
      })
    },
    // 编辑
    setCurrent(row) {
      queryone({ fid: row.fId, token: this.userToken }).then(res => {
        if (res.code === 0) {
          this.setCurrentDialog = true
          this.setCurrentData.fPlatenum = res.data.fPlatenum
          this.setCurrentData.fFounder = res.data.fFounder
          this.setCurrentData.fColor = res.data.fColor
          this.setCurrentData.fType = res.data.ftype
          this.setCurrentData.fModel = res.data.fModel
          this.setCurrentData.note = res.data.fRemarks
          this.setCurrentData.fId = res.data.fId
          this.setCurrentData.dueDate = res.data.dueDate
          this.setCurrentData.dueDate === res.data.dueDate
        }
      })
    },
    beforeImgUpload(file, tag) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'application/x-jpg' || file.type === 'application/x-png' || file.type === 'image/png'
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
    setSure(setCurrentData) {
      this.$refs[setCurrentData].validate((valid) => {
        if (valid) {
          var date = new Date(this.setCurrentData.dueDate)
          this.setCurrentData.dueDates =
        date.getFullYear() +
        '-' +
        this.checkTime(date.getMonth() + 1) +
        '-' +
        this.checkTime(date.getDate())

          var data = {
            fPlatenum: this.setCurrentData.fPlatenum,
            delayed: this.setCurrentData.dueDates,
            fFounder: this.setCurrentData.fFounder,
            fId: this.setCurrentData.fId,
            fColor: this.setCurrentData.fColor,
            fType: this.setCurrentData.fType,
            fModel: this.setCurrentData.fModel,
            fRemarks: this.setCurrentData.note,
            token: this.userToken,
            fAid: this.recordQuery.fAid
          }
          update(data).then(res => {
            if (res.code === 0) {
              this.setCurrentDialog = false
              this.innercarLists()
            }
          })
        } else {
          return false
        }
      })
    },
    // 添加车辆
    addSure(addInCar) {
      this.$refs[addInCar].validate((valid) => {
        if (valid) {
          this.dialogVisible = false
          var addData = {
            fPlatenum: this.addInCar.fPlatenum,
            fRemarks: this.addInCar.fRemarks,
            fColor: this.addInCar.fColor,
            fType: this.addInCar.fType,
            fModel: this.addInCar.fModel,
            fInternalVehicle: 2,
            token: this.userToken,
            fAid: this.carStoreid,
            fInnercarImage: this.upImgTag
          }
          addinner(addData).then(res => {
            if (res.code === 0) {
              if (res.data === 2) {
                this.$message({
                  type: 'error',
                  message: res.msg
                })
              } else {
                this.innercarLists()
              }
            }
          })
        } else {
          return false
        }
      })
    },
    // 删除试乘试驾车辆
    del(id) {
      this.$confirm('是否要删除这条信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          deleteIns({ token: this.userToken, fId: id.fId }).then(res => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.innercarLists()
            }
          })
        })
        .catch(() => {})
    },
    changeAudis(val) {
      this.auditsData.genderVal = val
    },
    reject(row) {
      this.rejectShow = true
      this.rejectCurrentId = row.currentId
      this.innerCarId = row.fId
    },
    setReject() {
      reject({ token: this.userToken, currentId: this.rejectCurrentId, innerCarId: this.innerCarId, rejectRemarks: this.rejectData }).then(res => {
        if (res.code === 0) {
          this.$message({
            message: res.msg,
            type: 'success'
          })
          this.rejectShow = false
          this.innercarLists()
        }
      })
    },
    // 审核
    audits(row) {
      this.audioFlag = true
      this.auditsData.fId = row.fId
      this.auditsData.currentId = row.currentId
      querystar({ currentId: row.currentId }).then(res => {
        console.log(res)
        this.auditsData.name = res.data.fStartWorkName
        this.auditsData.phone = res.data.fStartWorkPhone
        this.auditsData.fWorker = res.data.fWorker
        this.auditsData.fPlatenum = res.data.fPlatenum
        if (res.data.fStartWorkGender === 2) {
          this.auditsData.gender = '男'
        }
        if (res.data.fStartWorkGender === 3) {
          this.auditsData.gender = '女'
        }
      })
    },
    // 确定审核
    setAudit(auditsData) {
      this.$refs[auditsData].validate((valid) => {
        if (valid) {
          if (this.auditsData.gender === '女') {
            this.auditsData.genderVal === 3
          }
          if (this.auditsData.gender === '男') {
            this.auditsData.genderVal === 2
          }
          var data = {
            fId: this.auditsData.currentId,
            token: this.userToken,
            fName: this.auditsData.name,
            fGender: this.auditsData.genderVal,
            fPhone: this.auditsData.phone,
            fPlatenum: this.auditsData.fPlatenum,
            fAid: this.carStoreid,
            fAuthorizationRemarks: this.auditsData.note,
            carId: this.auditsData.fId
          }
          tdrcurrent(data).then(res => {
            this.audioFlag = false
            this.$message({
              message: res.msg,
              type: 'success'
            })
            this.innercarLists()
          })
        } else {
          return false
        }
      })
    },
    // 撤销
    undo(row) {
      this.$confirm('此操作是撤销申请, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        delstartwork({ fId: row.fId, currentId: row.currentId }).then(res => {
          if (res.code === 0) {
            this.$message({
              message: res.msg,
              type: 'success'
            })
            this.innercarLists()
          }
        })
      })
    },
    apply(row) {
      this.resetData()
      this.applyQuery.carNumber = row.fPlatenum
      operation(this.applyQuery).then(res => {
        this.applyData = res.data.list
        this.applyQuery.total = res.data.total
        this.applyShow = true
      }).catch(e => {})
    },
    applyChange() {
      this.applyQuery = Object.assign({}, this.applyQuery, {
        checkTimeBefore: this.applyDate[0],
        checkoutTimeAfter: this.applyDate[1]
      })
      operation(this.applyQuery).then(res => {
        this.applyData = res.data.list
        this.applyQuery.total = res.data.total
        this.applyShow = true
      }).catch(e => {})
    },
    // 申请功能
    startworks(row) {
      this.tryDrive = true
      this.tryDriveInfo.fId = row.fId
      fplatenum({ fId: row.fId }).then(res => {
        this.tryDriveInfo.fPlatenum = res.data
      })
    },
    startworkN(row) {
      this.$confirm('此操作撤销审核, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        InaouthRevoke({ currentId: row.currentId, carId: row.fId }).then(res => {
          this.innercarLists()
        })
      })
    },
    // 申请试驾 --开工单
    tdrcurrSure(tryDriveInfo) {
      this.$refs[tryDriveInfo].validate((valid) => {
        if (valid) {
          startwork({
            token: this.userToken,
            fStartWorkName: this.tryDriveInfo.name,
            fStartWorkPhone: this.tryDriveInfo.phone,
            fInMileage: this.tryDriveInfo.fInMileage,
            fPlatenum: this.tryDriveInfo.fPlatenum,
            fAid: this.carStoreid,
            fStartWorkGender: this.tryDriveInfo.gender,
            fStartWorkRemarks: this.tryDriveInfo.note,
            carId: this.tryDriveInfo.fId
          }).then(res => {
            if (res.code === 0) {
              this.$message({
                message: res.msg,
                type: 'success'
              })
              this.tryDrive = false
              this.innercarLists()
            }
            if (res.code === 6) {
              this.$message({
                message: res.msg,
                type: 'success'
              })
              this.tryDrive = false
            }
            if (res.code === 3) {
              this.$message({
                message: res.msg,
                type: 'success'
              })
              this.tryDrive = false
            }
          })
        } else {
          return false
        }
      })
    },
    entryrecords() {
      testEntryrecord(this.recordQuery).then(res => {
        this.recordList = res.data.list
        this.recordQuery.total = res.data.total
        this.recordList.filter(item => {
        /* eslint-disable */ if (item.showRevoke == 1) {
            item.fPlatenum = item.fPlatenum + '（已删除）'
          }else{
            item.fPlatenum =item.fPlatenum
          }
        })
      })
    },
    searchRecar() {
      this.recordQuery.checkTimeBefore=this.recordDate&&this.recordDate[0]
      this.recordQuery.checkoutTimeAfter=this.recordDate&&this.recordDate[1]      
      const formdata = Object.assign({}, this.recordQuery)
      testEntryrecord(formdata).then(res => {
        this.recordList = res.data.list
        this.recordQuery.total = res.data.total
      })
    },
    resetData(){
      this.applyDate=''
    },
    add(){
      this.addInCar={
        fPlatenum: '',
        fRemarks: '',
        fColor: '',
        fType: '',
        fModel: '',
        upImgTag: ''
      }
    },
    resetTemp() {
      this.tempdata = {
        aouthShowRevoke: '',
        currentId: '',
        fBrand: '',
        fColor: '',
        fFounder: '',
        fId: '',
        fInnercarImage: '',
        fModel: '',
        fPlatenum: '',
        fRemarks: '',
        fType: '',
        fUnit: '',
        presenceStatus: '',
        showRevoke: ''
      }
    }
  }
}
</script>
<style rel="stylesheet/scss" lang='scss' scoped>
.u_tree{
  height:30px!important;
  font-size: 16px;
  z-index:999;
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
.tryBox {
  width: 100%;
   .filterBox{
     display:flex;
     float:right;
     margin-top:70px;
     margin-bottom:10px;
     margin-right:-187px;
  //  float:right;
  //  width:325px;
  //  margin-bottom:10px;
  //  margin-right:-352px;
  //  margin-top:70px;
  //  display:flex;
 .filterIns{
   width:200px;
   position:relative;
  img{
    display:block;
    width:25px;
    height:25px;
    position:absolute;
    top:8px;
    right:5px;
  }

 }}
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
  .btns{
    .el-button{
      margin-top:5px
    }
  }

  .addCar {
    margin-left: 10px;
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
  .edit{
      outline:none;
      border:none;
      border-radius:2px;
      background:#00ADEF;
      color:#fff;
  }
  .del{
      outline:none;
      border:none;
      border-radius:2px;
      border:1px solid #fbc4c4;
      background:#fef0f0;
      color:#f56c;
  }
  .revoke{
      outline:none;
      border:none;
      border-radius:2px;
      border:1px solid #d3d4d6;
      background:#f4f4f5;
      color:#909399;
  }
}
</style>

