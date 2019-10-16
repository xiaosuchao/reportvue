<template>
  <div >

    <!-- 搜索表单 -->
    <div class="filter-container" >
      <el-form :inline="true" :model="listQuery" class="demo-form-inline" label-width="85px">
        <el-row>
          <el-form-item label="设备MAC">
            <el-input v-model="listQuery.mac" placeholder="按设备MAC查询"/>
          </el-form-item>
          <el-form-item label="设备ESN" >
            <el-input v-model="listQuery.esn" placeholder="按设备ESN查询"/>
          </el-form-item>
          <el-form-item label="设备名称" >
            <el-input v-model="listQuery.name" placeholder="按设备名称关键字查询"/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search" >查询</el-button>
            <el-button type="primary" @click="searReset">重置</el-button>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="厂商" >
            <el-select v-model="listQuery.manufacturer" placeholder="请选择">
              <el-option v-for="item in optsManufacturer" :key="item.value" :value="item.value" :label="item.label"/>
            </el-select>
          </el-form-item>
        </el-row>
      </el-form>
      <div class="btnsupertable">
        <el-button v-if="deviceauthority.includes('devicegateindexAPRefresh')" type="primary" @click="freshStation">刷新</el-button>
      </div>
    </div>

    <!-- 主体表格 -->
    <div class="devicetbout">
      <el-table
        :data="list"
        border
        fit
        highlight-current-row>
        <el-table-column label="序号" type="index" width="50" fixed align="center">
          <template slot-scope="scope">
            <span>{{ (listQuery.page-1) * listQuery.limit + scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <template v-for="item in colTable">
          <el-table-column :fixed="item.fixed" :key="item.displayName" :prop="item.prop" :label="item.label" :min-width="item.width" align="center">
            <template slot-scope="scope">
              <template v-if="item.prop==='status'">
                <el-tooltip effect="dark" placement="top" >
                  <div slot="content">{{ jsonStatus[scope.row[item.prop]] }}</div>
                  <img :src="scope.row[item.prop]| showstr(item.prop)" style="width:15px;" alt >
                </el-tooltip>
                <!-- <el-popover trigger="hover" placement="top">
                  <p style="text-align:center">{{ jsonStatus[scope.row[item.prop]] }}</p>
                  <div slot="reference" class="name-wrapper">
                    <img :src="scope.row[item.prop]| showstr(item.prop)" style="width:15px;" alt >
                  </div>
                </el-popover> -->
              </template>
              <template v-else>
                <span>{{ scope.row[item.prop] | showstr(item.prop) }}</span>
              </template>
            </template>
          </el-table-column>
        </template>
        <el-table-column align="center" prop="created_at" label="操作" width="100">
          <template slot-scope="scope">
            <template>
              <el-button type="primary" size="small" icon="el-icon-message" @click="viewDetails(scope.row)">详情</el-button>
              <!-- <el-button type="primary" size="small" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button> -->
            </template>
        </template></el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="$nextTick(()=>{getList()})" />
    </div>

    <!-- ap页面查看详情 -->
    <el-dialog :visible.sync="isShowDetailDialog" title="详情">
      <el-form ref="dataForm" :model="tempdata" class="dialogform form2col" label-width="90px">
        <el-form-item label="设备名称" prop="name">
          <el-input v-model="tempdata.name" />
        </el-form-item>
        <el-form-item label="设备MAC" prop="mac">
          <el-input v-model="tempdata.mac" />
        </el-form-item>
        <el-form-item label="设备ESN" prop="esn">
          <el-input v-model="tempdata.esn" />

        </el-form-item>
        <el-form-item label="设备状态" prop="status">
          <!-- <el-input v-model="tempdata.status" type="text" disabled="true" auto-complete="off"/> -->
          <el-select v-model="tempdata.status" placeholder="请选择">
            <el-option
              v-for="item in optsstatus"
              :key="item.value*1"
              :label="item.label"
              :value="item.value*1"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="设备款型" prop="devicemodel">
          <el-input v-model="tempdata.devicemodel" type="text" auto-complete="off"/>
        </el-form-item>
        <el-form-item label="设备类型" prop="devicetype">
          <el-input v-model="tempdata.devicetype" type="text" auto-complete="off"/>
        </el-form-item>
        <el-form-item label="软件版本" prop="version">
          <el-input v-model="tempdata.version" type="text" auto-complete="off"/>
        </el-form-item>
        <el-form-item label="设备制造商" prop="vendor">
          <el-input v-model="tempdata.vendor" type="text" auto-complete="off"/>
        </el-form-item>
        <el-form-item label="租户名称" prop="tenantname">
          <el-input v-model="tempdata.tenantname" type="text" auto-complete="off"/>
        </el-form-item>
        <el-form-item label="站点名称" prop="sitename">
          <el-input v-model="tempdata.sitename" type="text" auto-complete="off"/>
        </el-form-item>
        <el-form-item label="首次注册" prop="registertime">
          <el-input v-model="tempdata.registertime" type="text" auto-complete="off"/>
        </el-form-item>
        <el-form-item label="系统IP地址" prop="ip">
          <el-input v-model="tempdata.ip" type="text" auto-complete="off"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer ali-cen">
        <el-button @click="isShowDetailDialog=fasle">关闭</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<style lang="scss">
.uploadimg{
  .apimg{
    width: 178px;
    height: 178px;
    display: inline-block;
    text-align: center;
  }
  .avatar-uploader .el-upload {
    width: 178px;
    height: 178px;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    width: 178px;
    height: 178px;
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
}
</style>

<script>
import { deviceManufacturer, apList as fetchList, apFreshStation as freshStationAPI, apDetail as rowDetail, deviceUpate as updateRow } from '@/api/device'
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'
import { mapGetters } from 'vuex'

const jsonStatus = {
  0: '正常',
  1: '警告',
  2: '故障',
  3: '离线',
  4: '未注册'
}
// const jsonManufacturer = {
//   0: '新网城',
//   1: '华为'
// }
export default {
  filters: {
    showstr(v, prop) {
      if (prop === 'createTime') { return parseTime(v) }
      // if (prop === 'status') { return jsonStatus[v] }
      // if (prop === 'status') { return v === 0 ? require('@/assets/images/deviceoffline.png') : require('@/assets/images/deviceonline.png') }
      if (prop === 'status') {
        if (v === 0) {
          return require('@/assets/images/deviceonline.png')
        } else if (v === 1) {
          return require('@/assets/images/devicewarning.png')
        } else if (v === 2) {
          return require('@/assets/images/deviceoffline.png')
        } else if (v === 3) {
          return require('@/assets/images/deviceoffline.png')
        } else if (v === 4) {
          return require('@/assets/images/devicewarning.png')
        }
      // if (prop === 'manufacturer') { return jsonManufacturer[v] }
      }
      return v
    }
  },
  components: {
    Pagination
  },
  props: {
    deviceauthority: {
      type: Array,
      default: () => { return [] }
    },
    orgnode: {
      type: Object,
      default: () => { return {} }
    },
    isactive: {
      type: Boolean,
      default: false
    },
    enum: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      name: 'ucenterorgindex',
      imageUrl: '',
      colTable: [
        { prop: 'name', label: '设备名称', fixed: true, width: '' },
        { prop: 'mac', label: '设备MAC', fixed: true, width: '' },
        { prop: 'esn', label: '设备ESN', fixed: true, width: '' },
        // { prop: 'orgName', label: '设备归属', fixed: true, width: '' },
        { prop: 'status', label: '设备状态', fixed: true, width: '' },
        { prop: 'devicemodel', label: '设备款型', fixed: true, width: '' }
        // { prop: 'createtime', label: '创建时间', fixed: true, width: '' }
      ],
      jsonStatus: {},
      // jsonManufacturer: {},
      list: [],
      listQuery: {
        page: 1,
        limit: 10,
        sort: '+id'
      },
      optsManufacturer: [],
      optsstatus: [],
      total: 0,
      needfresh: false,
      dialogStatus: 'create',
      isShowDetailDialog: false,
      isShowDialog: false,
      tempdata: {
        name: '',
        deviceNo: '',
        deviceNum: '',
        orgName: '',
        startTime: '09:00',
        endTime: '21:00',
        locked: false
      }
    }
  },
  computed: {
    ...mapGetters([
      'menucodes'
    ])
  },
  watch: {
    'orgnode.code': {
      handler(newval, oldval) {
        this.listQuery.orgId = newval
        this.tempdata.orgId = newval
        this.tempdata.orgName = this.orgnode.name
        if (this.isactive && this.orgnode.code) { this.getList() } else { this.needfresh = true }
      },
      immediate: true
    },
    'isactive': {
      handler(newval, oldval) {
        if (newval && this.orgnode.code) { this.getList(); this.needfresh = false }
      }
    }
  },
  created() {
    this.getDeviceTypeList()
    this.jsonStatus = jsonStatus
    // this.jsonManufacturer = jsonManufacturer
    const arstatus = []
    for (const key in jsonStatus) {
      arstatus.push({ label: jsonStatus[key], value: key })
    }
    this.optsstatus = arstatus
  },
  methods: {
    handleCheckChange(data, checked, indeterminate) {
      // console.log(data, checked, indeterminate)
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    getList() {
      const tmpQuery = Object.assign({}, this.listQuery, { pageNum: this.listQuery.page })
      fetchList(tmpQuery).then(res => {
        this.list = res.data.list || []
        this.total = res.data.total
      })
    },
    search() {
      this.getList()
    },
    searReset() {
      this.emptyQueryParams()
      this.getList()
    },
    emptyQueryParams() {
      this.listQuery = Object.assign({}, this.listQuery, {
        name: '',
        mac: '',
        esn: '',
        manufacturer: ''
      })
    },
    freshStation() {
      this.$confirm('确定要刷新吗？', '提示', { type: 'warning', confirmButtonText: '确定', cancelButtonText: '取消' }).then(
        () => {
          freshStationAPI({ orgId: this.orgnode.code, type: 10 }).then(res => {
            this.getList()
          })
        }
      )
    },
    getDeviceTypeList() {
      deviceManufacturer({ type: this.enum }).then(res => {
        this.optsManufacturer = res.data.map(v => { return { label: v.name, value: v.id } })
      })
    },
    viewDetails(row) {
      console.log(row)
      this.resetTemp()
      rowDetail({ id: row.id }).then(res => {
        console.log(res)
        this.tempdata = Object.assign({}, res.data)
        this.isShowDetailDialog = true
      })
    },
    handleEdit(row) {
      this.tempdata = Object.assign({}, row)
      this.isShowDialog = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          const formdata = Object.assign({}, this.tempdata, { tstart: parseInt(Date.parse(new Date(this.tempdata.tstart))) / 1000 }, { tend: parseInt(Date.parse(new Date(this.tempdata.tend))) / 1000 })
          updateRow(formdata).then(res => {
            this.$notify({ title: '成功', message: '操作成功', type: 'success', duration: 2000 })
            this.isShowDialog = false
            this.list = this.list.map(v => { return v.id === this.tempdata.id ? this.tempdata : v })
          })
        }
      })
    },
    resetTemp() {
      this.tempdata = {
        name: '',
        mac: '',
        status: '',
        devicemodel: '',
        devicetype: '',
        version: '',
        manufacturer: '',
        registertime: '',
        ip: '',
        orgId: this.tempdata.orgId,
        orgName: this.tempdata.orgName
      }
    }
  }
}
</script>

