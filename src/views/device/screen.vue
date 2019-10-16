<template>
  <div class="screentable">
    <div class="addbutton">
      <el-button type="primary" @click="handleAdd">添加</el-button>
    </div>
    <el-table
      :data="list"
      border
      style="width: 100%">
      <el-table-column label="序号" type="index" width="50" fixed align="center">
        <template slot-scope="scope">
          <span>{{ (listQuery.page-1) * listQuery.limit + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <template v-for="item in colTable">
        <el-table-column :fixed="item.fixed" :key="item.displayName" :prop="item.prop" :label="item.label" :min-width="item.width" align="center">
          <template slot-scope="scope">
            <template v-if="item.prop==='deviceStatus'">
              <el-tooltip effect="dark" placement="top" >
                <div slot="content">{{ scope.row[item.prop] === "1"? "在线":"离线" }}</div>
                <img :src="scope.row[item.prop]| showstr(item.prop)" style="width:15px;" alt >
              </el-tooltip>
              <!-- <el-popover trigger="hover" placement="top">
                <p style="text-align:center">{{ scope.row[item.prop] === "1"? "在线":"离线" }}</p>
                <div slot="reference" class="name-wrapper">
                  <img :src="scope.row[item.prop]| showstr(item.prop)" style="width:15px;" alt >
                </div>
              </el-popover> -->
              <!-- <span v-html="showstr(scope.row[item.prop])">{{ showstr(item.prop) }}</span> -->
              <!-- <img :src="scope.row[item.prop] | showstr(item.prop)" style="width:15px;" alt=""> -->
            </template>
            <template v-else>
              <span>{{ scope.row[item.prop] | showstr(item.prop) }}</span>
            </template>
          </template>
        </el-table-column>
      </template>
      <el-table-column fixed="right" align="center" prop="created_at" label="操作" width="300">
        <template slot-scope="scope">
          <el-row class="btnrows" >
            <el-button type="primary" size="small" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="danger" size="small" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
            <el-button type="primary" size="small" icon="el-icon-star-off" @click="handleViewLog(scope.row)">查看日志</el-button>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="$nextTick(()=>{getScreenList()})"
    />
    <!-- 添加和编辑对话框 -->
    <el-dialog :visible.sync="isShowDialog" :title="dialogText[dialogStatus]" >
      <el-form ref="dataForm" :rules="rules" :model="tempdata" class="dialogform form2col">
        <el-form-item label="设备名称" prop="deviceName" label-width="80px">
          <el-input v-model="tempdata.deviceName" maxlength="20" placeholder=" " />
        </el-form-item>

        <el-form-item label="设备编号" label-width="80px">
          <el-input v-model="tempdata.deviceNo" maxlength="30" placeholder=" " />
        </el-form-item>

        <el-form-item label="设备IP" prop="deviceIp" label-width="80px">
          <el-input v-model="tempdata.deviceIp" maxlength="30" placeholder=" " />
        </el-form-item>

        <el-form-item label="使用情况" prop="screenType" label-width="80px">
          <el-select v-model="tempdata.screenType" placeholder="请选择">
            <el-option
              v-for="item in optsScreenType"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="投屏码" prop="screenCode" label-width="80px">
          <el-input v-model="tempdata.screenCode" :readonly="dialogStatus!=='create'" maxlength="6" placeholder=" "/>
        </el-form-item>

        <el-form-item label="悬浮大小" prop="floatSize" label-width="80px">
          <el-input v-model="tempdata.floatSize" maxlength="10" placeholder=" " />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer ali-cen">
        <el-button type="primary" @click="dialogStatus==='create'?addData():updateData()">提交</el-button>
        <el-button @click="isShowDialog = false">取消</el-button>
      </div>

    </el-dialog>

    <!-- 查看日志对话框 -->
    <el-dialog :visible.sync="isShowDetailDialog" width="80%" title="查看日志" @close="close">
      <el-form :inline="true" :model="logListQuery" class="layoutright">
        <el-form-item label="数据类型">
          <el-select v-model="logListQuery.dataType" placeholder="请选择">
            <el-option
              v-for="item in optsDataType"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
          <el-button type="primary" @click="searReset">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table
        :data="logData"
        border>
        <el-table-column
          label="序号"
          type="index"
          align="center"
          width="80">
          <template slot-scope="scope">
            <span>{{ (logListQuery.page-1) * logListQuery.limit + scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="userName"
          label="使用人"
          align="center"
        />
        <el-table-column
          prop="orgName"
          align="center"
          label="店铺"
        />

        <el-table-column
          prop="dataType"
          align="center"
          label="数据类型"
        >
          <template slot-scope="scope">
            <span>{{ scope.row['dataType'] === 1 ? "心跳信息":"在线状态" }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="使用情况"
          prop="screenType"
          align="center"
        >
          <!-- <div>{{ logData.screenType === 1 ? "在线":"离线" }}</div> -->
          <!-- {{ screenType }} -->
          <template slot-scope="scope">
            <!-- <span>{{ scope.row['screenType'] === 1 ? "在线":"离线" }}</span> -->
            <span>{{ scope.row['screenType']|logshowstr }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="ctime"
          align="center"
          label="时间">
          <template slot-scope="scope">
            <span>{{ scope.row['ctime']|timeshift }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="100">
          <template slot-scope="scope">
            <template>
              <el-button type="primary" size="small" icon="el-icon-message" @click="viewDetails(scope)">详情</el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="logTotal>0"
        :total="logTotal"
        :page.sync="logListQuery.page"
        :limit.sync="logListQuery.limit"
        @pagination="$nextTick(()=>{getLogList()})"
      />
    </el-dialog>
    <el-dialog :visible.sync="isShowLogDetailDialog" title="详情">
      <el-form :model="treedialog" class="dialogform form2col">
        <el-form-item label="设备名称：" prop="deviceName" label-width="90px">
          {{ treedialog.deviceName }}
        </el-form-item>

        <el-form-item label="设备编号：" prop="deviceNo" label-width="90px">
          {{ treedialog.deviceNo }}
        </el-form-item>

        <el-form-item label="设备ip：" prop="deviceNo" label-width="90px">
          {{ treedialog.deviceIp }}
        </el-form-item>

        <el-form-item label="投屏码：" prop="deviceNo" label-width="90px">
          {{ treedialog.screenCode }}
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<style lang="scss">
.addbutton{
  text-align: right;
  margin-bottom: 10px;
}
// .layoutright{
//   text-align: right;
// }
</style>

<script>
import { mapGetters } from 'vuex'
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'
import { screenList, screenAdd, screenUpdate, screenDelete, viewLog, deviceNoRepeat } from '@/api/device'

export default {
  filters: {
    showstr(v, prop) {
      if (prop === 'deviceStatus') { return v === '1' ? require('@/assets/images/deviceonline.png') : require('@/assets/images/deviceoffline.png') }
      if (prop === 'screenType') { return v === 1 ? '开始投屏' : v === 2 ? '结束投屏' : '未使用' }
      return v
    },
    logshowstr: function(value) {
      return value === 1 ? '开始投屏' : value === 2 ? '结束投屏' : '未使用'
    },
    timeshift: function(value) {
      return parseTime(value)
    }
  },
  components: {
    Pagination
  },
  props: {
    orgnode: {
      type: Object,
      default: () => { return {} }
    },
    isactive: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const chkDeviceNoRepeat = (rule, value, callback) => {
      if (value === '')callback()
      else {
        deviceNoRepeat({ deviceNo: value, id: this.tempdata.id }).then(res => {
          console.log(res, 'res')
          if (res.data.type === 'ERROR') {
            callback(new Error('DeviceNo重复'))
          } else {
            callback()
          }
        })
      }
    }
    return {
      name: 'ucenterorgindex',
      colTable: [
        { prop: 'deviceName', label: '设备名称', fixed: true, width: '' },
        { prop: 'deviceNo', label: '设备编号', fixed: true, width: '' },
        { prop: 'deviceIp', label: '设备IP', fixed: true, width: '' },
        { prop: 'screenType', label: '使用情况', fixed: true, width: '' },
        { prop: 'screenCode', label: '投屏码', fixed: true, width: '' },
        { prop: 'floatSize', label: '悬浮大小', fixed: true, width: '' },
        { prop: 'deviceStatus', label: '在线状态', fixed: true, width: '' }
      ],
      list: [],
      logData: [],
      optsDataType: [{
        value: 1,
        label: '心跳信息'
      }, {
        value: 2,
        label: '在线状态'
      }],
      optsScreenType: [{
        value: 1,
        label: '使用中'
      }, {
        value: 2,
        label: '结束投屏'
      }, {
        value: 0,
        label: '未使用'
      }],
      total: 0,
      logTotal: 0,
      isShowDialog: false,
      isShowDetailDialog: false,
      isShowLogDetailDialog: false,
      treedialog: {
        deviceIp: '',
        deviceName: '',
        deviceNo: '',
        screenCode: ''
      },
      needfresh: false,
      dialogStatus: 'create',
      listQuery: {
        page: 1,
        limit: 10,
        sort: '+id'
      },
      logListQuery: {
        page: 1,
        limit: 10,
        sort: '+id',
        deviceNo: '',
        dataType: ''
      },
      tempdata: {
        orgAddressCode: '',
        deviceNo: '',
        deviceName: ''
      },
      dataJson: {

      },
      dialogText: {
        update: '编辑设备',
        create: '添加设备'
      },
      rules: {
        deviceNo: [{ validator: chkDeviceNoRepeat, trigger: 'blur' }],
        screenCode: [{ pattern: /^[1-9]\d*$/, trigger: 'blur', message: '请输入数字' }],
        deviceIp: [{ type: 'string', trigger: 'blur', pattern: /^((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}$/, message: '请输入正确的Ip地址' }]
      }
    }
  },
  computed: {
    ...mapGetters([

    ])
  },
  watch: {
    'orgnode.code': {
      handler(newval, oldval) {
        this.listQuery.orgAddressCode = newval
        this.tempdata.orgAddressCode = newval
        // this.logListQuery.orgAddressCode = newval
        if (this.isactive && this.orgnode.code) { this.getScreenList() } else { this.needfresh = true }
      },
      immediate: true
    },
    'isactive': {
      handler(newval, oldval) {
        if (newval && this.orgnode.code) { this.getScreenList(); this.needfresh = false }
      }
    }
  },
  methods: {
    // chkDeviceNoRepeat() {
    //   deviceNoRepeat({ deviceNo: this.tempdata.deviceNo, id: this.tempdata.id }).then(res => {
    //     console.log(res, 'res')
    //     if (res.code === 3) {
    //       this.$message({
    //         showClose: true,
    //         message: '设备编号重复',
    //         type: 'error'
    //       })
    //     }
    //   })
    // },
    getScreenList() {
      const screendata = Object.assign({}, this.listQuery, { pageNum: this.listQuery.page })
      console.log(screendata)
      screenList(screendata).then(res => {
        this.list = res.data.list || []
        this.total = res.data.total
      })
    },
    handleViewLog(row) {
      console.log('5631', row)
      this.logListQuery.deviceNo = row.deviceNo
      this.getLogList()
    },
    getLogList() {
      const screenlogdata = Object.assign({}, this.logListQuery, { pageNum: this.logListQuery.page })
      viewLog(screenlogdata).then(res => {
        this.logData = res.data.list || []
        this.isShowDetailDialog = true
        this.logTotal = res.data.total
      })
    },
    // getPageViewLog(row) {
    //   // const screenlogdata = Object.assign({}, this.logListQuery, { pageNum: this.logListQuery.page })
    //   this.getLogList()
    // },
    close() {
      this.emptyQueryParams()
      // this.getScreenList()
    },
    viewDetails(scope) {
      console.log('856', scope)
      viewLog({ id: scope.row.id }).then(res => {
        this.treedialog = JSON.parse(res.data.list[scope.$index].dataJson) || {}
        console.log('treedialogdata', this.treedialog)
      })
      this.isShowLogDetailDialog = true
    },
    search() {
      const searchlogdata = Object.assign({}, this.logListQuery, { pageNum: this.logListQuery.page })
      viewLog(searchlogdata).then(res => {
        this.logData = res.data.list || []
        this.logTotal = res.data.total
      })
    },
    searReset() {
      this.emptyQueryParams()
      this.search()
    },
    emptyQueryParams() {
      this.logListQuery = Object.assign({}, this.logListQuery, {
        dataType: ''
      })
    },
    handleAdd() {
      if (!this.tempdata.orgAddressCode) {
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
      this.dialogStatus = 'update'
      this.tempdata = Object.assign({}, row)
      this.isShowDialog = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    addData() {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          // const formdata = Object.assign({}, this.tempdata)
          screenAdd(this.tempdata).then(res => {
            this.list.unshift(Object.assign({}, this.tempdata))
            this.$notify({ title: '成功', message: '创建成功', type: 'success', duration: 2000 })
            this.isShowDialog = false
          })
        }
      })
    },
    updateData() {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          const formdata = Object.assign({}, this.tempdata)
          screenUpdate(formdata).then(res => {
            this.$notify({ title: '成功', message: '操作成功', type: 'success', duration: 2000 })
            this.isShowDialog = false
            this.list = this.list.map(v => { return v.id === this.tempdata.id ? this.tempdata : v })
          })
        }
      })
    },
    handleDelete(row) {
      this.$confirm('确定要删除吗？', '提示', { type: 'warning', confirmButtonText: '确定', cancelButtonText: '取消' }).then(
        () => {
          screenDelete(row).then((res) => {
            this.$notify({ title: '成功', message: '操作成功', type: 'success', duration: 2000 })
            this.list = this.list.filter((v, i) => { return v.id !== row.id })
          })
        }
      )
    },

    resetTemp() {
      this.tempdata = {
        deviceNo: '',
        deviceName: '',
        orgAddressCode: this.tempdata.orgAddressCode
      }
    }
  }
}
</script>
