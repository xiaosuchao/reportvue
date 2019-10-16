<template>
  <div >
    <!-- 搜索表单 -->
    <div class="filter-container">
      <el-form :inline="true" :model="listQuery" class="demo-form-inline" label-width="85px">
        <el-row>
          <el-form-item label="设备名称">
            <el-input v-model="listQuery.deviceName" placeholder="按设备名称关键字查询"/>
          </el-form-item>
          <el-form-item label="设备型号">
            <el-input v-model="listQuery.deviceModel" placeholder="按设备型号查询"/>
          </el-form-item>
          <el-form-item label="设备序列号">
            <el-input v-model="listQuery.deviceSerial" placeholder="按设备序列号查询"/>
          </el-form-item>
          <el-form-item >
            <el-button type="primary" @click="search" >查询</el-button>
            <el-button @click="searReset">重置</el-button>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="厂商">
            <el-select v-model="listQuery.manufacturer" placeholder="请选择" >
              <el-option v-for="item in optsmanufacturer" :key="item.value" :value="item.value" :label="item.label"/>
            </el-select>
          </el-form-item>
        </el-row>
      </el-form>
      <div class="btnsupertable">
        <el-button v-if="deviceauthority.includes('devicegateindexCameraRefresh')" type="primary" @click="freshStation">刷新</el-button>
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
              <template v-if="item.prop==='channelPicUrl'">
                <img :src="scope.row[item.prop]" style="width:80px;" alt="">
              </template>
              <template v-else-if="item.prop==='channelStatus'">
                <el-tooltip effect="dark" placement="top" >
                  <div slot="content">{{ jsonChannelStatus[scope.row[item.prop]] }}</div>
                  <img :src="scope.row[item.prop]| showstr(item.prop)" style="width:15px;" alt >
                </el-tooltip>
                <!-- <el-popover trigger="hover" placement="top">
                  <p style="text-align:center">{{ jsonChannelStatus[scope.row[item.prop]] }}</p>
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
        <el-table-column align="center" prop="created_at" label="操作" width="100">
          <template slot-scope="scope">
            <template>
              <el-button type="primary" size="small" icon="el-icon-edit" @click="viewDetails(scope.row)">详情</el-button>
              <!-- <el-button type="primary" size="small" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button> -->
            </template>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="$nextTick(()=>{getList()})" />
    </div>

    <!-- camera查看详情 -->
    <el-dialog :visible.sync="isShowDetailDialog" title="详情">
      <el-form ref="dataForm" :model="tempdata" class="dialogform form2col" label-width="90px">
        <el-form-item label="设备名称" prop="deviceName">
          <el-input v-model="tempdata.deviceName" />
        </el-form-item>
        <el-form-item label="设备型号" prop="deviceModel">
          <el-input v-model="tempdata.deviceModel" />
        </el-form-item>
        <el-form-item label="设备序列号" prop="deviceSerial">
          <el-input v-model="tempdata.deviceSerial" />
        </el-form-item>
        <el-form-item label="通道名" prop="channelName">
          <el-input v-model="tempdata.channelName" type="text" auto-complete="off"/>
        </el-form-item>
        <el-form-item label="状态" prop="channelStatus">
          <el-select v-model="tempdata.channelStatus" placeholder="请选择">
            <el-option
              v-for="item in optsChannelStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="厂商" prop="manufacturer">
          <el-select v-model="tempdata.manufacturer" placeholder="请选择">
            <el-option
              v-for="item in optsmanufacturer"
              :key="item.value*1"
              :label="item.label"
              :value="item.value*1"
            />
          </el-select>

        </el-form-item>
        <el-form-item label="当前图片" prop="channelPicUrl" style="width:98%">
          <a :href="tempdata.channelPicUrl" target="_blank">
            <img :src="tempdata.channelPicUrl" style="max-width:100%;">
          </a>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer ali-cen">
        <el-button @click="isShowDetailDialog=fasle">关闭</el-button>
      </div>
    </el-dialog>

    <!-- 添加了选项卡的查看详情 -->
    <!-- <el-dialog :visible.sync="isShowDetailDialog" title="详情">
      <el-tabs type="border-card">
        <el-tab-pane label="设备信息">
          <el-form ref="dataForm" :model="tempdata" class="dialogform form2col" label-width="90px">
            <el-form-item label="设备名称" prop="deviceName">
              <el-input v-model="tempdata.deviceName"  />
            </el-form-item>
            <el-form-item label="设备型号" prop="deviceModel">
              <el-input v-model="tempdata.deviceModel"  />
            </el-form-item>
            <el-form-item label="设备序列号" prop="deviceSerial">
              <el-input v-model="tempdata.deviceSerial"  />
            </el-form-item>
            <el-form-item label="通道名" prop="channelName">
              <el-input v-model="tempdata.channelName"   type="text" auto-complete="off"/>
            </el-form-item>
            <el-form-item label="状态" prop="channelStatus">
              <el-input v-model="tempdata.channelStatus" type="text" disabled="true" auto-complete="off"/>
              {{ jsonChannelStatus[tempdata.channelStatus] }}
            </el-form-item>
            <el-form-item label="厂商" prop="manufacturer">
              {{ jsonManufacturer[tempdata.manufacturer] }}
            </el-form-item>
            <el-form-item label="所属功能区" prop="manufacturer">
              <el-select v-model="tempdata.manufacturer" placeholder="请选择"/>
            </el-form-item>
            <el-form-item label="当前图片" prop="channelPicUrl" style="width:98%">
              <a :href="tempdata.channelPicUrl" target="_blank">
                <img :src="tempdata.channelPicUrl" style="max-width:100%;">
              </a>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="安装信息">占位符</el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer ali-cen">
        <el-button @click="isShowDetailDialog=fasle">关闭</el-button>
      </div>
    </el-dialog> -->

    <!-- camera编辑对话框 -->
    <!-- <el-dialog :visible.sync="isShowDialog" title="编辑">
      <el-form ref="dataForm" :model="tempdata" class="dialogform form2col" label-width="90px">
        <el-form-item label="设备名称" prop="deviceName">
          <el-input v-model="tempdata.deviceName"/>
        </el-form-item>
        <el-form-item label="设备型号" prop="deviceModel">
          <el-input v-model="tempdata.deviceModel"/>
        </el-form-item>
        <el-form-item label="设备序列号" prop="deviceSerial">
          <el-input v-model="tempdata.deviceSerial"/>
        </el-form-item>
        <el-form-item label="通道名" prop="channelName">
          <el-input v-model="tempdata.channelName" type="text" auto-complete="off"/>
        </el-form-item>
        <el-form-item label="状态" prop="channelStatus">
          <el-input v-model="tempdata.channelStatus" type="text" disabled="true" auto-complete="off"/>
          {{ jsonChannelStatus[tempdata.channelStatus] }}
        </el-form-item>
        <el-form-item label="厂商" prop="manufacturer">
          <el-input v-model="tempdata.manufacturer" type="text" auto-complete="off"/>
        </el-form-item>
        <el-form-item label="当前图片" prop="channelPicUrl" style="width:98%">
          <a :href="tempdata.channelPicUrl" target="_blank">
            <img :src="tempdata.channelPicUrl" style="max-width:100%;">
          </a>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer ali-cen">
        <el-button type="primary" @click="updateData">提交</el-button>
        <el-button @click="isShowDetailDialog=fasle">关闭</el-button>
      </div>
    </el-dialog> -->

    <!-- 添加了选项卡的添加和编辑 -->
    <!-- <el-dialog :visible.sync="isShowDialog" title="编辑">
      <el-tabs type="border-card">
        <el-tab-pane label="设备信息">
          <el-form ref="dataForm" :model="tempdata" class="dialogform form2col" label-width="90px">
            <el-form-item label="设备名称" prop="deviceName">
              <el-input v-model="tempdata.deviceName"/>
            </el-form-item>
            <el-form-item label="设备型号" prop="deviceModel">
              <el-input v-model="tempdata.deviceModel"/>
            </el-form-item>
            <el-form-item label="设备序列号" prop="deviceSerial">
              <el-input v-model="tempdata.deviceSerial"/>
            </el-form-item>
            <el-form-item label="通道名" prop="channelName">
              <el-input v-model="tempdata.channelName" type="text" auto-complete="off"/>
            </el-form-item>
            <el-form-item label="状态" prop="channelStatus">
              {{ jsonChannelStatus[tempdata.channelStatus] }}
            </el-form-item>
            <el-form-item label="厂商" prop="manufacturer">
              <el-input v-model="tempdata.manufacturer" type="text" auto-complete="off"/>
            </el-form-item>
            <el-form-item label="所属功能区" prop="manufacturer">
              <el-select v-model="tempdata.manufacturer" placeholder="请选择"/>
            </el-form-item>
            <el-form-item label="当前图片" prop="channelPicUrl" style="width:98%">
              <a :href="tempdata.channelPicUrl" target="_blank">
                <img :src="tempdata.channelPicUrl" style="max-width:100%;">
              </a>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="安装信息">
          <div class="uploadimg">
            <h3>camera照片编辑</h3>
            <div class="cameraimg">
              <el-upload
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                action="https://jsonplaceholder.typicode.com/posts/"
                class="avatar-uploader">
                <img v-if="imageUrl" :src="imageUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"/>
              </el-upload>
              <span>图片1</span>
            </div>
          </div>

        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer ali-cen">
        <el-button type="primary" @click="updateData">提交</el-button>
        <el-button @click="isShowDetailDialog=fasle">关闭</el-button>
      </div>
    </el-dialog> -->

  </div>
</template>

<style lang="scss">
.uploadimg{
  .cameraimg{
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
import { deviceManufacturer, cameraList as fetchList, cameraFreshStation as freshStationAPI, cameraDetail as rowDetail, deviceUpate as updateRow } from '@/api/device'
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'
import { mapGetters } from 'vuex'

const jsonChannelStatus = {
  0: '离线',
  1: '在线'
}

export default {
  filters: {
    showstr(v, prop) {
      if (prop === 'createTime') { return parseTime(v) }
      if (prop === 'channelStatus') { return v === '1' ? require('@/assets/images/deviceonline.png') : require('@/assets/images/deviceoffline.png') }
      if (prop === 'channelPicUrl') { return "<img src='" + v + "'>" }
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
      src: '',
      colTable: [
        { prop: 'deviceName', label: '设备名称', fixed: true, width: '' },
        { prop: 'deviceModel', label: '设备型号', fixed: true, width: '' },
        { prop: 'deviceSerial', label: '设备序列号', fixed: true, width: '' },
        { prop: 'channelName', label: '通道名', fixed: true, width: '' },
        { prop: 'channelStatus', label: '在线状态', fixed: true, width: '' },
        { prop: 'channelPicUrl', label: '图片', fixed: true, width: '' }
      ],
      list: [],
      listQuery: {
        page: 1,
        limit: 10,
        sort: '+id'
      },
      optsmanufacturer: [],
      optsChannelStatus: [],
      jsonChannelStatus: {},
      jsonManufacturer: {},
      total: 0,
      needfresh: false,
      dialogStatus: 'create',
      isShowDialog: false,
      isShowDetailDialog: false,
      tempdata: {
        deviceName: '',
        deviceModel: '',
        deviceSerial: '',
        manufacturer: ''
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
        // if (newval && this.needfresh) { this.getList(); this.needfresh = false }
        if (newval) { this.getList(); this.needfresh = false }
      }
    }
  },
  created() {
    this.getDeviceTypeList()
    this.jsonChannelStatus = jsonChannelStatus

    const cemerastatus = []
    for (const key in jsonChannelStatus) {
      cemerastatus.push({ label: jsonChannelStatus[key], value: key.toString() })
    }
    this.optsChannelStatus = cemerastatus
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
        deviceName: '',
        deviceModel: '',
        deviceSerial: '',
        manufacturer: ''
      })
    },
    resetTemp() {
      this.tempdata = {
        deviceName: '',
        deviceModel: '',
        deviceSerial: '',
        orgId: this.tempdata.orgId,
        orgName: this.tempdata.orgName

      }
    },
    freshStation() {
      this.$confirm('确定要刷新吗？', '提示', { type: 'warning', confirmButtonText: '确定', cancelButtonText: '取消' }).then(
        () => {
          freshStationAPI({ orgId: this.orgnode.code, type: 11 }).then(res => {
            this.getList()
          })
        }
      )
    },
    getDeviceTypeList() {
      deviceManufacturer({ type: this.enum }).then(res => {
        this.optsmanufacturer = res.data.map(v => { return { label: v.name, value: v.id } })
      })
    },

    viewDetails(row) {
      console.log(row)
      this.resetTemp()
      rowDetail({ deviceId: row.deviceId }).then(res => {
        console.log(res)
        this.tempdata = Object.assign({}, res.data)
        this.isShowDetailDialog = true
      })
    },
    // handleEdit(row) {
    //   this.tempdata = Object.assign({}, row)
    //   this.isShowDialog = true
    //   this.$nextTick(() => {
    //     this.$refs['dataForm'].clearValidate()
    //   })
    // },
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
    }
  }
}
</script>
