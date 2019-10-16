<template>
  <div >

    <!-- 搜索表单 -->
    <div class="filter-container">
      <el-form :inline="true" :model="listQuery" class="demo-form-inline" label-width="85px">
        <el-row>
          <el-form-item label="设备名称">
            <el-input v-model="listQuery.name" placeholder="按设备名称关键字查询"/>
          </el-form-item>
          <el-form-item label="设备编号">
            <el-input v-model="listQuery.deviceNo" placeholder="按设备SN查询"/>
          </el-form-item>
          <el-form-item label="锁定状态">
            <el-select v-model="listQuery.locked" placeholder="请选择">
              <el-option v-for="item in optslocked" :key="item.value" :value="item.value" :label="item.label"/>
            </el-select>
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
        <el-button v-if="deviceauthority.includes('devicegateindexPADCreate')" type="primary" @click="handleCreate" >添加</el-button>
      </div>
    </div>

    <!-- 主体表 -->
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
              <template v-if="item.prop==='online'">
                <el-tooltip effect="dark" placement="top" >
                  <div slot="content">{{ scope.row[item.prop] === 1? "在线":"离线" }}</div>
                  <img :src="scope.row[item.prop]| showstr(item.prop)" style="width:15px;" alt >
                </el-tooltip>
                <!-- <el-popover trigger="hover" placement="top">
                  <p style="text-align:center">{{ scope.row[item.prop] === 1? "在线":"离线" }}</p>
                  <div slot="reference" class="name-wrapper">
                    <img :src="scope.row[item.prop]| showstr(item.prop)" style="width:15px;" alt >
                  </div>
                </el-popover> -->
                <!-- <img :src="scope.row[item.prop] | showstr(item.prop)" style="width:15px;" alt=""> -->
              </template>
              <template v-else>
                <span>{{ scope.row[item.prop] | showstr(item.prop) }}</span>
              </template>
            </template>
          </el-table-column>
        </template>
        <el-table-column align="center" prop="created_at" label="操作" width="300">
          <template slot-scope="scope">
            <el-row class="btnrows" >
              <el-button v-if="deviceauthority.includes('devicegateindexPADUpdate')" type="primary" size="small" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button v-if="deviceauthority.includes('devicegateindexPADDelete')" type="danger" size="small" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
              <el-button v-if="deviceauthority.includes('devicegateindexPADConfigParam')" type="primary" size="small" icon="el-icon-star-off" @click="paraEdit(scope.row)">配置参数</el-button>
            </el-row>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="$nextTick(()=>{getList()})" />

    </div>

    <!-- 未加选项卡的添加和编辑对话框 -->
    <el-dialog :visible.sync="isShowDialog" :title="dialogText[dialogStatus]">
      <el-form ref="dataForm" :rules="rules" :model="tempdata" class="dialogform form2col" label-width="90px">
        <el-form-item label="设备名称" prop="name">
          <el-input v-model="padname" placeholder="设备名称" maxlength="30"/>
        </el-form-item>
        <el-form-item label="设备编号" prop="deviceNo">
          <el-input v-model="paddeviceNo" placeholder="设备编号" type="text" auto-complete="off" maxlength="40"/>
        </el-form-item>
        <el-form-item label="设备MAC" prop="deviceNum">
          <el-input v-model="compu_devmac" placeholder="设备MAC" type="text" auto-complete="off" maxlength="50" />
        </el-form-item>
        <el-form-item label="设备归属" prop="orgId">
          <el-select v-model="orgnode.name" placeholder="请选择">
            <el-option :value="orgnode.name"/>
          </el-select>
        </el-form-item>

        <el-form-item :inline="true" label="工作时间">
          <el-time-select
            v-model="tempdata.startTime"
            :picker-options="{
              start: '00:00',
              step: '00:15',
              end: '23:45'
            }"
            placeholder="选择时间"/>
        </el-form-item>
        <el-form-item label="至" class="datetofmitem">
          <el-time-select
            v-model="tempdata.endTime"
            :picker-options="{
              start: '00:00',
              step: '00:15',
              end: '23:45'
            }"
            placeholder="选择时间"/>
        </el-form-item>

        <el-form-item label="设备厂商" prop="manufacturer">
          <el-select v-model="tempdata.manufacturer" placeholder="请选择">
            <el-option v-for="item in optsManufacturer" :key="item.value" :value="item.value" :label="item.label"/>
          </el-select>
        </el-form-item>

        <el-form-item label="关联探针" prop="probeMac">
          <el-select v-model="tempdata.probeMac" placeholder="请选择">
            <el-option v-for="item in optsSenorlist" :key="item.value" :value="item.value" :label="item.label"/>
          </el-select>
        </el-form-item>

        <el-form-item label="是否锁定" style="width:98%">
          <el-switch v-model="tempdata.locked" active-color="#ff4949" inactive-color="#13ce66"/>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer ali-cen">
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">提交</el-button>
        <el-button @click="isShowDialog = false">关闭</el-button>
      </div>
    </el-dialog>

    <!-- 参数配置对话框 -->
    <el-dialog :visible.sync="paraConfigDialog" title="参数配置">
      <el-form ref="paraForm" :rules="paraRules" :model="paradata" class="dialogform form2col" label-width="100px">
        <el-form-item label="门店编码" prop="dealerId">
          <el-input v-model="paradata.dealerId" type="text" />
        </el-form-item>
        <el-form-item label="faceApi地址" prop="postfaceApi">
          <el-input v-model="paradata.postfaceApi" type="text"/>
        </el-form-item>
        <el-form-item label="mqttApi地址" prop="mqttApi">
          <el-input v-model="paradata.mqttApi" type="text"/>
        </el-form-item>
        <el-form-item label="心跳地址" prop="beatApi">
          <el-input v-model="paradata.beatApi" type="text"/>
        </el-form-item>
        <el-form-item label="isDebug" prop="isDebug">
          <el-input v-model="paradata.isDebug" type="text"/>
        </el-form-item>
        <el-form-item label="保存人脸" prop="isSaveimg">
          <el-input v-model="paradata.isSaveimg" type="text"/>
        </el-form-item>
        <el-form-item label="保存now.jpg" prop="isSaveallimg">
          <el-input v-model="paradata.isSaveallimg" type="text"/>
        </el-form-item>
        <el-form-item label="保存原始图片" prop="isSaveOrigin">
          <el-input v-model="paradata.isSaveOrigin" type="text"/>
        </el-form-item>
        <el-form-item label="旋转角度" prop="rotatedeg">
          <el-input v-model="paradata.rotatedeg" type="text"/>
        </el-form-item>
        <el-form-item label="脸的范围" prop="faceRange">
          <el-input v-model="paradata.faceRange" type="text"/>
        </el-form-item>

        <el-form-item label="工作时间" style="width:40%; float:left;">
          <el-time-select
            v-model="paradata.startworktime"
            :picker-options="{
              start: '00:00',
              step: '00:15',
              end: '23:45'
            }"
            placeholder="选择时间"/>
        </el-form-item>
        <el-form-item label="至" style="width:40%; float:left;" class="datetofmitem">
          <el-time-select
            v-model="paradata.endworktime"
            :picker-options="{
              start: '00:00',
              step: '00:15',
              end: '23:45'
            }"
            placeholder="选择时间"/>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer ali-cen">
        <el-button type="primary" @click="updateParaConfig">提交</el-button>
        <el-button @click="paraConfigDialog = false">关闭</el-button>
      </div>

    </el-dialog>

  </div>
</template>

<style lang="scss">
.uploadimg{
  .padimg{
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
import { padList as fetchList, devicePadIsRepeat, deviceList as senorList, deviceManufacturer, padAdd as addRow, padDelete as delRow, padUpdate as updateRow, pcpadParaConfig as updatePara } from '@/api/device'
import Pagination from '@/components/Pagination'
import { mapGetters } from 'vuex'

const jsonLockStatus = {
  0: '正常',
  1: '锁定'
}
// const jsonOnlineStatus = {
//   0: '离线',
//   1: '在线'
// }
export default {
  filters: {
    showstr(v, prop) {
      if (prop === 'locked') { return jsonLockStatus[v] }
      // if (prop === 'online') { return jsonOnlineStatus[v] }
      if (prop === 'online') { return v === 1 ? require('@/assets/images/deviceonline.png') : require('@/assets/images/deviceoffline.png') }
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
    const chkPadMacRepeat = (rule, value, callback) => {
      devicePadIsRepeat({ mac: value, id: this.tempdata.id }).then(res => {
        console.log(res, 'res')
        if (res.data.result === false) {
          callback(new Error('mac重复'))
        } else {
          callback()
        }
      })
    }
    return {
      name: 'ucenterorgindex',
      imageUrl: '',
      colTable: [
        { prop: 'name', label: '设备名称', fixed: true, width: '' },
        { prop: 'deviceNo', label: '设备编号', fixed: true, width: '' },
        // { prop: 'orgName', label: '所属门店', fixed: true, width: '' },
        { prop: 'locked', label: '锁定', fixed: true, width: '' },

        // { prop: 'relatetype', label: '关联车型', fixed: true, width: '' },
        { prop: 'startTime', label: '开始时间', fixed: true, width: '' },
        { prop: 'endTime', label: '结束时间', fixed: true, width: '' },
        { prop: 'online', label: '在线状态', fixed: true, width: '' }
      ],
      list: [],
      listQuery: {
        page: 1,
        limit: 10,
        sort: '+id'
      },
      optsDeviceStatus: [],
      optsSensorType: [],
      optsManufacturer: [],
      optslocked: [],
      // optsOrgCode: [],
      optsProbeMac: [],
      // jsonOnlineStatus: {},
      total: 0,
      needfresh: false,
      optsSenorlist: [],
      dialogStatus: 'create',
      isShowDialog: false,
      paraConfigDialog: false,
      tempdata: {
        name: '',
        deviceNo: '',
        deviceNum: '',
        probeMac: '',
        startTime: '09:00',
        endTime: '21:00',
        locked: false
      },
      paradata: {
        dealerId: '',
        postfaceApi: '',
        mqttApi: '',
        beatApi: '',
        isDebug: '',
        isSaveimg: '',
        isSaveallimg: '',
        isSaveOrigin: '',
        rotatedeg: '',
        faceRange: '',
        startworktime: '',
        endworktime: ''
      },
      dialogText: {
        update: '编辑设备',
        create: '添加设备'
      },
      rules: {
        name: [{ required: true, message: '必填信息', trigger: 'blur' }],
        deviceNo: [{ required: true, message: '必填信息', trigger: 'blur' }],
        deviceNum: [{ required: true, message: '必填信息', trigger: 'blur' },
          { validator: chkPadMacRepeat, trigger: 'blur' },
          { pattern: /^([a-f0-9]{2}:){5}[a-f0-9]{2}$/, message: '请输入正确的Mac地址' }]
      },
      paraRules: {
      }
    }
  },
  computed: {
    ...mapGetters([
      'menucodes'
    ]),
    padname: {
      get: function() {
        return this.tempdata.name
      },
      set: function(val) {
        if (/^([A-Fa-f0-9]{2}:){5}[A-Fa-f0-9]{2}$/.test(val)) {
          this.tempdata.name = val.toLowerCase()
        } else {
          this.tempdata.name = val
        }
      }
    },
    paddeviceNo: {
      get: function() {
        return this.tempdata.deviceNo
      },
      set: function(val) {
        if (/^([A-Fa-f0-9]{2}:){5}[A-Fa-f0-9]{2}$/.test(val)) {
          this.tempdata.deviceNo = val.toLowerCase()
        } else {
          this.tempdata.deviceNo = val
        }
      }
    },
    compu_devmac: {
      get: function() {
        console.log(this.tempdata.deviceNum)
        return this.tempdata.deviceNum
      },
      set: function(val) {
        if (/^([A-Fa-f0-9]{2}:){5}[A-Fa-f0-9]{2}$/.test(val)) {
          this.tempdata.deviceNum = val.toLowerCase()
        } else {
          this.tempdata.deviceNum = val
        }
      }
    }
  },
  watch: {
    'orgnode.code': {
      handler(newval, oldval) {
        console.log(newval)
        console.log(this.listQuery)
        this.listQuery.orgId = newval
        this.tempdata.orgId = newval
        this.tempdata.orgName = this.orgnode.name
        if (this.isactive && this.orgnode.code) {
          this.getList()
          this.getSenorList()
        } else { this.needfresh = true }
      },
      immediate: true
    },
    'isactive': {
      handler(newval, oldval) {
        // if (newval && this.needfresh) { this.getList(); this.getSenorList(); this.needfresh = false }
        if (newval && this.orgnode.code) { this.getList(); this.getSenorList(); this.needfresh = false }
      }
    }
  },
  created() {
    for (const v in jsonLockStatus) {
      this.optslocked.push({ value: parseInt(v), label: jsonLockStatus[v] })
    }
    this.getDeviceTypeList()
  },
  methods: {
    // checkMac() {
    //   devicePadIsRepeat({ mac: this.tempdata.deviceNum, id: this.tempdata.id }).then(res => {
    //     console.log(res, 'res')
    //     if (res.data.result === false) {
    //       this.$message({
    //         showClose: true,
    //         message: 'mac重复',
    //         type: 'error'
    //       })
    //     }
    //   })
    // },
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
    getSenorList() {
      senorList({ orgId: this.orgnode.code, limit: 500 }).then(res => {
        this.optsSenorlist = (res.data.list || []).map(v => { return { label: v.mac, value: v.mac } })
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
        deviceNo: '',
        manufacturer: '',
        probeMac: '',
        locked: ''
      })
    },
    getDeviceTypeList() {
      deviceManufacturer({ type: this.enum }).then(res => {
        this.optsManufacturer = res.data.map(v => { return { label: v.name, value: v.id } })
      })
    },
    handleCreate() {
      if (!this.tempdata.orgId) {
        this.$notify({ title: '错误', message: '需选择店铺，再添加设备', type: 'error', duration: 2000 })
        return false
      }
      this.resetTemp()
      this.dialogStatus = 'create'
      this.isShowDialog = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleEdit(row) {
      // console.log(row)
      this.dialogStatus = 'update'
      this.tempdata = Object.assign({}, row)
      if (this.tempdata.manufacturer === 0) this.tempdata.manufacturer = ''
      this.tempdata.locked = this.tempdata.locked === 1
      this.isShowDialog = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          const formdata = Object.assign({}, this.tempdata, { locked: this.tempdata.locked ? 1 : 0 })
          delete formdata.createTime
          addRow(formdata).then(res => {
            this.list.unshift(res.data)
            this.$notify({ title: '成功', message: '创建成功', type: 'success', duration: 2000 })
            this.isShowDialog = false
          })
        }
      })
    },
    paraEdit(row) {
      this.resetPara()
      this.paradata = row.configurationParameter ? JSON.parse(row.configurationParameter) : this.paradata
      this.paradata.id = row.id
      this.paraConfigDialog = true
      this.$nextTick(() => {
        this.$refs['paraForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          const formdata = Object.assign({}, this.tempdata, { locked: this.tempdata.locked ? 1 : 0 })
          delete formdata.createTime
          console.log(this.tempdata)
          updateRow(formdata).then(res => {
            this.$notify({ title: '成功', message: '操作成功', type: 'success', duration: 2000 })
            this.isShowDialog = false
            this.list = this.list.map(v => { return v.id === this.tempdata.id ? formdata : v })
          })
        }
      })
    },
    updateParaConfig() {
      this.$refs.paraForm.validate((valid) => {
        if (valid) {
          const configdata = Object.assign({}, this.paradata)
          configdata.type = 'pad'
          updatePara(configdata).then(res => {
            this.$notify({ title: '成功', message: '操作成功', type: 'success', duration: 2000 })
            this.paraConfigDialog = false
            this.list = this.list.map(v => {
              if (v.id === this.paradata.id) { v.configurationParameter = JSON.stringify(this.paradata) }
              return v
            })
          })
        }
      })
    },
    handleDelete(row) {
      this.$confirm('确定要删除吗？', '提示', { type: 'warning', confirmButtonText: '确定', cancelButtonText: '取消' }).then(
        () => {
          delRow(row).then((res) => {
            this.$notify({ title: '成功', message: '操作成功', type: 'success', duration: 2000 })
            this.list = this.list.filter((v, i) => { return v.id !== row.id })
          })
        }
      )
    },
    resetTemp() {
      this.tempdata = {
        name: '',
        deviceNo: '',
        deviceNum: '',
        startTime: '09:00',
        endTime: '21:00',
        locked: false,
        orgId: this.tempdata.orgId,
        orgName: this.orgnode.name
      }
    },
    resetPara() {
      this.paradata = {
        dealerId: '',
        postfaceApi: '',
        mqttApi: '',
        beatApi: '',
        isDebug: '',
        isSaveimg: '',
        isSaveallimg: '',
        isSaveOrigin: '',
        rotatedeg: '',
        faceRange: '',
        startworktime: '',
        endworktime: ''
      }
    }
  }
}
</script>
