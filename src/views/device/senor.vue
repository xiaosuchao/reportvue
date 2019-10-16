<template>
  <div>
    <!-- 搜索表单 -->
    <div class="filter-container">
      <el-form :inline="true" :model="listQuery" class="demo-form-inline" label-width="85px">
        <el-row>
          <el-form-item label="设备MAC">
            <el-input v-model="listQuery.mac" placeholder="按设备MAC查询" />
          </el-form-item>
          <el-form-item label="设备SN">
            <el-input v-model="listQuery.sn" placeholder="按设备SN查询" />
          </el-form-item>
          <el-form-item label="设备状态">
            <el-select v-model="listQuery.deviceStatus" placeholder="请选择">
              <el-option
                v-for="item in optsDeviceStatus"
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
        </el-row>
        <el-row>
          <el-form-item label="设备名称">
            <el-input v-model="listQuery.name" placeholder="按设备名称关键字查询" />
          </el-form-item>
          <el-form-item label="探针类型">
            <el-select v-model="listQuery.sensorType" placeholder="请选择">
              <el-option
                v-for="item in optsSensorType"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="厂商">
            <el-select v-model="listQuery.manufacturer" placeholder="请选择">
              <el-option
                v-for="item in optsManufacturer"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              />
            </el-select>
          </el-form-item>
        </el-row>
      </el-form>

    </div>
    <el-dialog :visible.sync="exportflag">
      <el-form>
        <el-form-item label="上传配置文件">
          <el-upload
            ref="fileup"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            :headers="upHeader"
            :on-success="doneupload"
            :before-upload="beforeupload"
            :on-change="changeImgUpload"
            :show-file-list="1>2"
            :action="apibase+'/device/uploader/excel?code=' + tempdata.orgId"
            class="dataconfigup"
            multiple
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
          <a style="margin-left:100px;text-decoration:underline" @click="handlePreview()">下载探针信息模板</a>
          <div class />
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 探针在线情况统计信息 -->
    <!-- <div class="probeStatics">
      <el-table
        :data="probeStatisticsData"
        style="width: 100%"
        fit
        border>
        <el-table-column
          label="探针总数"
          align="center"
          prop="deviceTitle"
          width="">
          <template slot-scope="scope">
            {{ scope.row.deviceTitle }}
          </template>
        </el-table-column>
        <el-table-column
          label="在线数目"
          align="center"
          width="">
          <template slot-scope="scope">
            {{ scope.row.deviceTitle }}
          </template>
        </el-table-column>
        <el-table-column
          label="在线率"
          align="center"
          width="">
          <template slot-scope="scope">
            {{ scope.row.deviceTitle }}
          </template>
        </el-table-column>
      </el-table>
    </div> -->

    <!-- 探针在线情况统计信息解决方案2 -->
    <div class="probeStatics">
      <el-table
        :data="probeStatisticsData"
        style="width: 100%"
        fit
        border>
        <template v-for="item in probeStaticsTable">
          <el-table-column :fixed="item.fixed" :key="item.displayName" :prop="item.prop" :label="item.label" :min-width="item.width" align="center">
            <template slot-scope="scope">
              {{ scope.row[item.prop] }}
            </template>
          </el-table-column>
        </template>
      </el-table>
    </div>

    <!-- 添加等操作按钮区域 -->
    <div class="btnsupertable">
      <!-- 导入导出功能  fxl 2018-08-16 start -->
      <el-button
        v-if="deviceauthority.includes('devicegateindexProbeExportAll')"
        type="primary"
        @click="downloadAll"
      >导出所有</el-button>
      <el-button
        v-if="deviceauthority.includes('devicegateindexProbeDelete')"
        type="primary"
        @click="downloadExcel"
      >批量导出</el-button>
      <el-button
        v-if="deviceauthority.includes('devicegateindexProbeDelete')"
        type="primary"
        @click="exportflag=true"
      >批量添加</el-button>
      <!-- 导入导出功能  fxl 2018-08-16 end -->
      <el-button
        v-if="deviceauthority.includes('devicegateindexProbeCreate')"
        type="primary"
        @click="handleCreate"
      >添加</el-button>
      <el-button
        v-if="deviceauthority.includes('devicegateindexProbeDelete')"
        type="primary"
        @click="batchDelete"
      >删除</el-button>
      <!-- <el-button type="primary" @click="batchDownload">下载</el-button> -->
    </div>

    <!-- 主体表 -->
    <div class="devicetbout">
      <el-table
        id="mytable"
        :data="list"
        border
        fit
        highlight-current-row
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column label="序号" type="index" width="50" fixed align="center">
          <template slot-scope="scope">
            <span>{{ (listQuery.page-1) * listQuery.limit + scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <template v-for="item in colTable">
          <el-table-column
            :fixed="item.fixed"
            :key="item.displayName"
            :prop="item.prop"
            :label="item.label"
            :min-width="item.width"
            align="center"
          >
            <!-- <template slot-scope="scope">
              <span>{{ scope.row[item.prop] | showstr(item.prop) }}</span>
            </template>-->
            <template slot-scope="scope">
              <template v-if="item.prop==='deviceControl'">
                <el-tooltip effect="dark" placement="top" >
                  <div slot="content">{{ scope.row[item.prop] }}</div>
                  <img :src="scope.row[item.prop]| showstr(item.prop)" style="width:15px;" alt >
                </el-tooltip>
                <!-- <el-popover trigger="hover" placement="top" width="100px">
                  <p style="text-align:center">{{ scope.row[item.prop] }}</p>
                  <div slot="reference" class="name-wrapper">
                    <img :src="scope.row[item.prop]| showstr(item.prop)" style="width:15px;" alt >
                  </div>
                </el-popover> -->
                <!-- <span v-html="showstr(scope.row[item.prop])">{{ showstr(item.prop) }}</span> -->
                <!-- <img :src="scope.row[item.prop]| showstr(item.prop)" style="width:15px;" alt > -->
              </template>
              <template v-else>
                <span>{{ scope.row[item.prop] | showstr(item.prop) }}</span>
              </template>
            </template>
          </el-table-column>
        </template>
        <el-table-column fixed="right" align="center" prop="created_at" label="操作" width="270">
          <template slot-scope="scope">
            <el-row class="btnrows">
              <el-button
                v-if="menucodes.includes('devicegateindexProbeUpdate')"
                type="primary"
                size="small"
                icon="el-icon-edit"
                @click="handleEdit(scope.row)"
              >编辑</el-button>
              <el-button
                type="info"
                size="small"
                icon="el-icon-message"
                @click="viewDetails(scope.row)"
              >详情</el-button>
              <el-button
                v-if="menucodes.includes('devicegateindexProbeDelete')"
                type="danger"
                size="small"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
              >删除</el-button>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="$nextTick(()=>{getList()})"
      />
    </div>

    <!-- 探针添加和编辑的对话框 -->
    <el-dialog :visible.sync="isShowDialog" :title="dialogText[dialogStatus]">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="tempdata"
        class="dialogform form2col"
        label-width="90px"
      >
        <input v-model="tempdata.userId" type="hidden" >
        <el-form-item label="设备名称" prop="name">
          <el-input v-model="compu_name" placeholder="设备名称" maxlength="30" />
        </el-form-item>
        <el-form-item label="设备MAC" prop="mac">
          <el-input
            id="probemac"
            v-model="compu_mac"
            placeholder="设备MAC"
            type="text"
            auto-complete="off"

          />
        </el-form-item>
        <el-form-item label="设备SN" prop="sn">
          <el-input
            v-model="compu_sn"
            placeholder="设备SN"
            type="text"
            auto-complete="off"
            maxlength="25"
          />
        </el-form-item>
        <el-form-item label="设备阈值" prop="threshold">
          <el-input v-model="tempdata.threshold" placeholder="设备阈值" />
        </el-form-item>
        <el-form-item label="关联设备" prop="relationType" class="associatepcorpad">
          <el-select v-model="tempdata.relationType" placeholder="请选择" class="associatepcorpadselect" style="width:65%; margin-right:10px">
            <el-option
              v-for="item in optsRelType"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
          <el-select v-model="tempdata.padMac" placeholder="请选择" class="associatepadselect" >
            <el-option
              v-for="item in optsRelVal"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
        </el-form-item>

        <el-form-item label="设备厂商" prop="manufacturer">
          <el-select v-model="tempdata.manufacturer" placeholder="请选择">
            <el-option
              v-for="item in optsManufacturer"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="探针类型" prop="sensorType">
          <el-select v-model="tempdata.sensorType" placeholder="请选择">
            <el-option
              v-for="item in optsSensorType"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="设备状态" prop="deviceStatus">
          <el-select v-model="tempdata.deviceStatus" placeholder="请选择">
            <el-option
              v-for="item in optsDeviceStatus"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="设备归属" prop="orgId">
          <el-select v-model="orgnode.name" placeholder="请选择">
            <el-option :value="orgnode.name" />
          </el-select>
        </el-form-item>
        <el-form-item label="设备位置" prop="location">
          <el-input
            v-model="tempdata.location"
            placeholder="设备位置"
            type="text"
            auto-complete="off"
            maxlength="20"
          />
        </el-form-item>
        <el-form-item label="设备有效期">
          <el-date-picker v-model="tempdata.tstart" type="date" placeholder="开始时间" />
        </el-form-item>
        <el-form-item label="至" class="datetofmitem">
          <el-date-picker v-model="tempdata.tend" type="date" placeholder="结束时间" />
        </el-form-item>
        <el-form-item label="备注" style="width:98%">
          <el-input
            v-model="tempdata.remark"
            :autosize="{ minRows: 6,maxRows: 10}"
            type="textarea"
            placeholder
            maxlength="150"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer ali-cen">
        <template v-if="dialogStatus!=='view'">
          <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">提交</el-button>
        </template>
        <el-button @click="isShowDialog = false">关闭</el-button>
      </div>
    </el-dialog>

    <!-- 具有选项卡的探针添加和编辑的对话框 -->
    <!-- <el-dialog :visible.sync="isShowDialog" :title="dialogText[dialogStatus]">
      <el-tabs type="border-card" class="tabdisplay">
        <el-tab-pane label="设备信息" class="tabpanedisplay">
          <el-form
            ref="dataForm"
            :rules="rules"
            :model="tempdata"
            class="dialogform form2col"
            label-width="90px"
          >
            <input v-model="tempdata.userId" type="hidden" >
            <el-form-item label="设备名称" prop="name">
              <el-input v-model="compu_name" placeholder="设备名称" maxlength="30" />
            </el-form-item>
            <el-form-item label="设备MAC" prop="mac">
              <el-input
                id="probemac"
                v-model="compu_mac"
                placeholder="设备MAC"
                type="text"
                auto-complete="off"
                @change="setmac()"
              />
            </el-form-item>
            <el-form-item label="设备SN" prop="sn">
              <el-input
                v-model="compu_sn"
                placeholder="设备SN"
                type="text"
                auto-complete="off"
                maxlength="25"
              />
            </el-form-item>
            <el-form-item label="设备阈值" prop="threshold">
              <el-input v-model="tempdata.threshold" placeholder="设备阈值" />
            </el-form-item>
            <el-form-item label="关联设备" prop="relationType" class="associatepcorpad">
              <el-select v-model="tempdata.relationType" placeholder="请选择" class="associatepcorpadselect" style="width:65%; margin-right:10px">
                <el-option
                  v-for="item in optsRelType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"/>
              </el-select>
              <el-select v-model="tempdata.padMac" placeholder="请选择" class="associatepadselect" >
                <el-option
                  v-for="item in optsRelVal"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"/>
              </el-select>
            </el-form-item>

            <el-form-item label="设备厂商" prop="manufacturer">
              <el-select v-model="tempdata.manufacturer" placeholder="请选择">
                <el-option
                  v-for="item in optsManufacturer"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="探针类型" prop="sensorType">
              <el-select v-model="tempdata.sensorType" placeholder="请选择">
                <el-option
                  v-for="item in optsSensorType"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="设备状态" prop="deviceStatus">
              <el-select v-model="tempdata.deviceStatus" placeholder="请选择">
                <el-option
                  v-for="item in optsDeviceStatus"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="设备归属" prop="orgId">
              <el-select v-model="orgnode.name" placeholder="请选择">
                <el-option :value="orgnode.name" />
              </el-select>
            </el-form-item>
            <el-form-item label="设备位置" prop="location">
              <el-input
                v-model="tempdata.location"
                placeholder="设备位置"
                type="text"
                auto-complete="off"
                maxlength="20"
              />
            </el-form-item>
            <el-form-item label="设备有效期">
              <el-date-picker v-model="tempdata.tstart" type="date" placeholder="开始时间" />
            </el-form-item>
            <el-form-item label="至" class="datetofmitem">
              <el-date-picker v-model="tempdata.tend" type="date" placeholder="结束时间" />
            </el-form-item>
            <el-form-item label="备注" style="width:98%">
              <el-input
                v-model="tempdata.remark"
                :autosize="{ minRows: 6,maxRows: 10}"
                type="textarea"
                placeholder
                maxlength="150"
              />
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer ali-cen">
            <template v-if="dialogStatus!=='view'">
              <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">提交</el-button>
            </template>
            <el-button @click="isShowDialog = false">关闭</el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane label="安装信息" class="tabpanedisplay">
          <div class="uploadimg">
            <h3>添加照片</h3>
            <div class="macimg">
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
            <div class="macimg">
              <el-upload
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                action="https://jsonplaceholder.typicode.com/posts/"
                class="avatar-uploader">
                <img v-if="imageUrl" :src="imageUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"/>
              </el-upload>
              <span>图片2</span>
            </div>
            <div class="macimg">
              <el-upload
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                action="https://jsonplaceholder.typicode.com/posts/"
                class="avatar-uploader">
                <img v-if="imageUrl" :src="imageUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"/>
              </el-upload>
              <span>图片3</span>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer ali-cen">
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">提交</el-button>
        <el-button @click="isShowDialog = false">关闭</el-button>
      </div>
    </el-dialog> -->
  </div>
</template>

<style lang="scss">
.probeStatics {
  padding-bottom: 20px;
  // padding-left: 5%;
  // padding-right: 5%;
}
.btnsupertable {
  padding-bottom: 10px;
  text-align: right;
}
.el-form-item {
  .el-select {
    width: 100%;
  }
}
.el-input__inner {
  padding: 0 30px 0 10px;
}
.btnrows {
  .el-button + .el-button {
    margin-left: 0;
    margin-top: 3px;
  }
}
.ali-cen {
  text-align: center;
}

.associatepcorpad{
  .el-form-item__content{ display:flex;}
}
.uploadimg {
  .macimg {
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
    border-color: #409eff;
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
import { deviceList as fetchList, padList, deviceIsRepeat, pcList, devtypeList, deviceBatchDelete, deviceAdd as addRow, deviceDelete as delRow, deviceUpate as updateRow, probeStaticsInfo } from '@/api/device'
import { parseTime } from '@/utils'
import { Loading } from 'element-ui'
import Pagination from '@/components/Pagination'
import { mapGetters } from 'vuex'
import axios from 'axios'
import { getToken } from '@/utils/auth'
import { Message } from 'element-ui'
const jsonDeviceStatus = {
  1: '库存设备',
  2: '已安装设备',
  3: '待修设备',
  4: '报废设备'
}
const jsonManufacturer = {
  1: 'GL-iNet',
  2: '爱快'
}
const jsonSensorType = {
  1: '客流探针',
  2: '车型探针'
}

let loadingRequest

export default {
  filters: {
    showstr(v, prop) {
      if (prop === 'tstart' || prop === 'tend') { return parseTime(v) }
      if (prop === 'deviceStatus') { return jsonDeviceStatus[v] }
      if (prop === 'sensorType') { return jsonSensorType[v] }
      if (prop === 'manufacturer') { return jsonManufacturer[v] }
      if (prop === 'deviceControl') { return v === '在线' ? require('@/assets/images/deviceonline.png') : require('@/assets/images/deviceoffline.png') }
      // if (prop === 'name') { return (v.substring(0, 11)) === 'E4:95:6E:43' ? 'GL-iNet' : '爱快' }
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
    const chkMacRepeat = (rule, value, callback) => {
      deviceIsRepeat({ mac: value, id: this.tempdata.id }).then(res => {
        console.log(res, 'res')
        if (res.data.result === false) {
          callback(new Error('mac重复'))
        } else {
          callback()
        }
      })
    }
    return {
      optsRelType: [{
        value: '-1',
        label: '请选择'
      }, {
        value: 'pc',
        label: '千人千面小主机'
      }, {
        value: 'pad',
        label: 'PAD'
      }],
      name: 'ucenterorgindex',
      imageUrl: '',
      probeStatisticsData: [],
      probeStaticsTable: [
        { prop: 'deviceTitle', label: '设备总数', fixed: false, width: '' },
        { prop: 'online', label: '在线数', fixed: false, width: '' },
        { prop: 'offline', label: '离线数', fixed: false, width: '' },
        { prop: 'stock', label: '库存数', fixed: false, width: '' },
        { prop: 'install', label: '已安装数', fixed: false, width: '' },
        { prop: 'repair', label: '待修数', fixed: false, width: '' },
        { prop: 'scrap', label: '报废数', fixed: false, width: '' }
      ],
      colTable: [
        { prop: 'name', label: '设备名称', fixed: false, width: '' },
        { prop: 'mac', label: '设备MAC', fixed: false, width: '' },
        { prop: 'sn', label: '设备SN', fixed: false, width: '' },
        { prop: 'threshold', label: '设备阈值', fixed: false, width: '' },
        { prop: 'deviceStatus', label: '设备状态', fixed: false, width: '' },
        { prop: 'sensorType', label: '探针类型', fixed: false, width: '' },
        // { prop: 'manufacturer', label: '厂商', fixed: false, width: '' },
        // { prop: 'orgName', label: '设备组织', fixed: false, width: '' },
        { prop: 'location', label: '设备位置', fixed: false, width: '' },
        // { prop: 'relatetype', label: '关联车型', fixed: false, width: '' },
        { prop: 'deviceControl', label: '在线状态', fixed: false, width: '' }
      ],
      list: [],
      chkedrows: [],
      listQuery: {
        page: 1,
        limit: 10,
        sort: '+id'
      },
      optsPclist: [],
      optsDeviceStatus: [],
      optsSensorType: [],
      optsManufacturer: [],
      userToken: this.$store.state.user.token,
      // optsOrgCode: [],
      optsDeviceNo: [],
      total: 0,
      needfresh: false,
      dialogStatus: 'create',
      isShowDialog: false,
      isShowDetailDialog: false,
      optsPadlist: [],
      exportflag: false,
      tempdata: {
        name: '',
        mac: '',
        sn: '',
        threshold: '',
        manufacturer: '',
        location: '',
        relationType: '-1',
        sensorType: '',
        deviceStatus: '',
        padMac: '',
        tstart: new Date(),
        tend: new Date()
      },
      dialogText: {
        update: '编辑设备',
        create: '添加设备',
        view: '查看详情'
      },
      upHeader: { Authorization: getToken() },
      apibase: process.env.BASE_API,
      rules: {
        name: [{ required: true, message: '必填信息', trigger: 'blur' }],
        sn: [{ required: true, message: '必填信息', trigger: 'blur' }],
        mac: [{ required: true, message: '必填信息', trigger: 'blur' },
          { validator: chkMacRepeat, trigger: 'blur' },
          { pattern: /^([a-f0-9]{2}:){5}[a-f0-9]{2}$/, message: '请输入正确的Mac地址' }],
        threshold: [{ required: true, message: '必填信息', trigger: 'blur' }, { pattern: /^\-\d*(\.\d*)?$/, message: '请输入正确的设备阈值' }]
      }
    }
  },
  computed: {
    ...mapGetters([
      'menucodes',
      'selectOrgTree'
    ]),
    optsRelVal() {
      console.log('optsRelVal', this.tempdata.relationType)
      if (this.tempdata.relationType === 'pad') {
        return this.optsPadlist
      } else if (this.tempdata.relationType === 'pc') {
        return this.optsPclist
      } else if (this.tempdata.relationType === '-1') {
        return [{
          value: '-1',
          label: '请选择'
        }]
      }
    },
    compu_name: {
      get: function() {
        return this.tempdata.name
      },
      set: function(val) {
        if (/^([a-f0-9A-F]{2}:){5}[a-f0-9A-F]{2}$/.test(val)) {
          this.tempdata.name = val.toLowerCase()
        } else {
          this.tempdata.name = val
        }
      }
    },
    compu_mac: {
      get: function() {
        return this.tempdata.mac
      },
      set: function(val) {
        console.log('compu maccccccccccccccc')
        if (/^([a-f0-9A-F]{2}:){5}[a-f0-9A-F]{2}$/.test(val)) {
          this.tempdata.mac = val.toLowerCase()
        } else {
          this.tempdata.mac = val
        }
      }
    },
    compu_sn: {
      get: function() {
        return this.tempdata.sn
      },
      set: function(val) {
        if (/^([a-f0-9A-F]{2}:){5}[a-f0-9A-F]{2}$/.test(val)) {
          this.tempdata.sn = val.toLowerCase()
        } else {
          this.tempdata.sn = val
        }
      }
    }
  },
  watch: {
    'orgnode.code': {
      handler(newval, oldval) {
        this.listQuery.orgId = newval
        this.tempdata.orgId = newval
        this.tempdata.orgName = this.orgnode.name
        if (this.isactive && this.orgnode.code) { this.getList(); this.getPadList(); this.getPcList(); this.getProbeStaticsInfo() } else { this.needfresh = true }
      },

      immediate: true
    },
    'isactive': {
      handler(newval, oldval) {
        // if (newval && this.needfresh) { this.getList(); this.getPadList(); this.needfresh = false }
        if (newval && this.orgnode.code) { this.getList(); this.getPadList(); this.getPcList(); this.getProbeStaticsInfo(); this.needfresh = false }
      }
    },
    'tempdata.relationType': {
      handler(newval, oldval) {
        console.log('relationType Change', newval, oldval)
        if (oldval === 'pad' || oldval === 'pc') { this.tempdata.padMac = '' }
        // if (oldval === '-1') { this.tempdata.padMac = '-1' }
      }
    },
    'isShowDialog': {
      handler(newval, oldval) {
        if (!newval) { this.resetTemp() }
      }
    }
  },
  created() {
    // for (const v in jsonDeviceStatus) {
    //   this.optsDeviceStatus.push({ value: parseInt(v), label: jsonDeviceStatus[v] })
    // }
    // for (const v in jsonSensorType) {
    //   this.optsSensorType.push({ value: parseInt(v), label: jsonSensorType[v] })
    // }
    // for (const v in jsonManufacturer) {
    //   this.optsmanufacturer.push({ value: parseInt(v), label: jsonManufacturer[v] })
    // }
    this.getDeviceTypeList()
  },
  methods: {
    // async setmac() {
    //   const { data: { result }} = await deviceIsRepeat({ mac: this.tempdata.mac, id: this.tempdata.id })
    //   console.log('sss', result)
    //   if (result === false) {
    //     this.$message({
    //       showClose: true,
    //       message: 'mac重复',
    //       type: 'error'
    //     })
    //   }
    //   return result
    // },
    // setmac() {
    //   deviceIsRepeat({ mac: this.tempdata.mac, id: this.tempdata.id }).then(res => {
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
    doneupload(res, file, flist) {
      loadingRequest.close()
      let mac = ''
      if (res.code === 0) {
        this.getList()
        this.$message({
          showClose: true,
          message: res.msg,
          type: 'success'
        })
      }
      if (res.code === 7) {
        this.$message({
          showClose: true,
          message: res.msg,
          type: 'error'
        })
      }
      if (res.code === 8) {
        this.$message({
          showClose: true,
          message: res.msg,
          type: 'error'
        })
      }
      if (res.code === 9) {
        this.$message({
          showClose: true,
          message: res.msg,
          type: 'error'
        })
      }
      if (res.code === 6) {
        mac = res.data.map(v => {
          return v.mac
        })
        this.$confirm(mac, res.msg, {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })
      }
      // // flist.splice(0, flist.length - 1)
      // this.fileList = [{ name: res.data.url, url: res.data.url }]
      // this.tempdata.configFileUrl = res.data.url
    },
    handleRemove(file, fileList) {
      // this.fileList = []
      // this.tempdata.configFileUrl = ''
    },
    handlePreview(file) {
      window.open(process.env.BASE_API + '/device/download/templateExcel')
    },
    beforeupload(file) {
      console.log('file.type', file.type)
      if (file.type.indexOf('excel') < 0) {
        this.$message.error('文件格式错误!')
        return false
      } else {
        loadingRequest = Loading.service({ background: 'rgba(255, 255, 255, 0.2)' })
      }
    },
    changeImgUpload() {
      // if (loadingRequest) { loadingRequest.close() }
    },
    beforeRemove(file, fileList) {
      // return this.$confirm(`确定移除 ${file.name}？`)
    },
    downloadAll() {
      var topId = ''
      this.selectOrgTree.filter(v => {
        topId = v.organizationAddressCode
      })
      axios(
        {
          url: process.env.BASE_API + '/device/download/excel?code=' + topId,
          headers: { Authorization: getToken() },
          method: 'get',
          responseType: 'blob'
        }
      ).then((res) => {
        if (res.status === 200) {
          const fileName = (res.headers['content-disposition'] && res.headers['content-disposition'].indexOf('filename=') > -1)
            ? decodeURIComponent(res.headers['content-disposition'].split('filename=')[1])
            : '导出信息.xlsx'
          const blob = new Blob([res.data])
          if ('download' in document.createElement('a')) { // 非IE下载
            console.log('非IE')
            const elink = document.createElement('a')
            elink.download = fileName
            elink.style.display = 'none'
            elink.href = URL.createObjectURL(blob)
            document.body.appendChild(elink)
            elink.click()
            URL.revokeObjectURL(elink.href) // 释放URL 对象
            document.body.removeChild(elink)
          } else { // IE10+下载
            navigator.msSaveBlob(blob, fileName)
          }
        } else {
          Message({
            message: '导出失败',
            type: 'error',
            duration: 2 * 1000
          })
        }
      })
    },
    downloadExcel() {
      axios(
        {
          url: process.env.BASE_API + '/device/download/excel?code=' + this.tempdata.orgId,
          headers: { Authorization: getToken() },
          method: 'get',
          responseType: 'blob'
        }
      ).then((res) => {
        if (res.status === 200) {
          const fileName = (res.headers['content-disposition'] && res.headers['content-disposition'].indexOf('filename=') > -1)
            ? decodeURIComponent(res.headers['content-disposition'].split('filename=')[1])
            : '导出信息.xlsx'
          const blob = new Blob([res.data])
          if ('download' in document.createElement('a')) { // 非IE下载
            console.log('非IE')
            const elink = document.createElement('a')
            elink.download = fileName
            elink.style.display = 'none'
            elink.href = URL.createObjectURL(blob)
            document.body.appendChild(elink)
            elink.click()
            URL.revokeObjectURL(elink.href) // 释放URL 对象
            document.body.removeChild(elink)
          } else { // IE10+下载
            navigator.msSaveBlob(blob, fileName)
          }
        } else {
          Message({
            message: '导出失败',
            type: 'error',
            duration: 2 * 1000
          })
        }
      })
      // window.open(process.env.BASE_API + '/device/download/excel?code=' + this.tempdata.orgId)
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    handleCheckChange(data, checked, indeterminate) {
      // console.log(data, checked, indeterminate)
    },
    handleSelectionChange(val) {
      this.chkedrows = val
    },
    getList() {
      const tmpQuery = Object.assign({}, this.listQuery, { pageNum: this.listQuery.page })
      fetchList(tmpQuery).then(res => {
        this.list = (res.data.list || []).map(v => {
          v.tstart = new Date(parseInt(v.tstart) * 1000)
          v.tend = new Date(parseInt(v.tend) * 1000)
          return v
        })
        this.total = res.data.total
      })
    },
    // 方案1
    getProbeStaticsInfo() {
      probeStaticsInfo({ addressCode: this.orgnode.code }).then(res => {
        this.probeStatisticsData = [res.data]
        console.log('555', [res.data])
        console.log('666', this.probeStatisticsData)
      })
    },
    // 方案2
    // getProbeStaticsInfo() {
    //   probeStaticsInfo({ addreassCode: this.orgnode.code }).then(res => {
    //     // this.probeStatisticsData. = res.data || {}
    //   })
    // },

    getPadList() {
      padList({ orgId: this.orgnode.code, limit: 500 }).then(res => {
        this.optsPadlist = (res.data.list || []).map(v => { return { label: v.deviceNum, value: v.deviceNum.toString() } })
      })
    },
    getPcList() {
      pcList({ orgId: this.orgnode.code, limit: 500 }).then(res => {
        this.optsPclist = (res.data.list || []).map(v => { return { label: v.deviceNum, value: v.deviceNum.toString() } })
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
        sn: '',
        mac: '',
        deviceStatus: '',
        sensorType: '',
        manufacturer: ''

      })
    },
    resetTemp() {
      this.tempdata = {
        name: '',
        mac: '',
        sn: '',
        threshold: '',
        sensorType: '',
        location: '',
        relationType: '-1',
        padMac: '',
        manufacturer: '',
        orgId: this.tempdata.orgId,
        orgName: this.orgnode.name,
        deviceStatus: '',
        tstart: new Date(),
        tend: new Date()
      }
    },
    getDeviceTypeList() {
      devtypeList({ type: this.enum }).then(res => {
        this.optsDeviceStatus = res.data.deviceStatus.map(v => { return { label: v.value, value: v.index.toString() } })
        this.optsSensorType = res.data.deviceType.map(v => { return { label: v.value, value: v.index.toString() } })
        this.optsManufacturer = res.data.factory.map(v => { return { label: v.value, value: v.index.toString() } })
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
      this.dialogStatus = 'update'
      this.tempdata = Object.assign({}, row)
      // if (!jsonManufacturer[this.tempdata.manufacturer]) this.tempdata.manufacturer = ''
      // if (!jsonSensorType[this.tempdata.sensorType]) this.tempdata.sensorType = ''
      // if (this.tempdata.relationType === '-1') this.tempdata.padMac = '-1'
      if (this.tempdata.manufacturer === 0) this.tempdata.manufacturer = ''
      if (this.tempdata.sensorType === '0') this.tempdata.sensorType = ''
      this.isShowDialog = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    viewDetails(row) {
      this.dialogStatus = 'view'
      this.tempdata = Object.assign({}, row)
      // if (!jsonManufacturer[this.tempdata.manufacturer]) this.tempdata.manufacturer = ''
      // if (!jsonSensorType[this.tempdata.sensorType]) this.tempdata.sensorType = ''
      if (this.tempdata.manufacturer === 0) this.tempdata.manufacturer = ''
      if (this.tempdata.sensorType === '0') this.tempdata.sensorType = ''
      this.isShowDialog = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          const formdata = Object.assign({}, this.tempdata, { tstart: parseInt(Date.parse(new Date(this.tempdata.tstart))) / 1000 }, { tend: parseInt(Date.parse(new Date(this.tempdata.tend))) / 1000 })
          addRow(formdata).then(res => {
            if (this.tempdata.relationType === '-1') this.tempdata.padMac = '-1'
            this.list.unshift(Object.assign({}, this.tempdata, { id: res.data.id }))
            this.$notify({ title: '成功', message: '创建成功', type: 'success', duration: 2000 })
            this.isShowDialog = false
            // this.list = this.list.map(v => { return v.id === this.tempdata.id ? this.tempdata : v })
          })
        }
      })
    },
    updateData() {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          if (this.tempdata.relationType === '-1') this.tempdata.padMac = '-1'
          const formdata = Object.assign({}, this.tempdata, { tstart: parseInt(Date.parse(new Date(this.tempdata.tstart))) / 1000 }, { tend: parseInt(Date.parse(new Date(this.tempdata.tend))) / 1000 })
          updateRow(formdata).then(res => {
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
          delRow(row).then((res) => {
            this.$notify({ title: '成功', message: '操作成功', type: 'success', duration: 2000 })
            this.list = this.list.filter((v, i) => { return v.id !== row.id })
          })
        }
      )
    },
    batchDelete() {
      if (this.chkedrows.length) {
        this.$confirm('确定要删除吗？', '提示', { type: 'warning', confirmButtonText: '确定', cancelButtonText: '取消' }).then(
          () => {
            deviceBatchDelete({ ids: this.chkedrows.map((v) => { return v.id }).join(',') }).then(res => {
              this.list = this.list.filter(v => { return !this.chkedrows.includes(v) })
            })
          }
        )
      }
    }
    // 以下代码批量下载接口有问题，稍后恢复（20190612）
    // batchDownload() {
    //   if (this.chkedrows.length) {
    //     this.$confirm('要下载选中的记录吗', '提示', { type: 'warning', confirmButtonText: '确定', cancelButtonText: '取消' }).then(
    //       () => {
    //         deviceBatchDownload({ ids: this.chkedrows.map((v) => { return v.id }).join(',') }).then(res => {
    //           this.list = this.list.filter(v => { return !this.chkedrows.includes(v) })
    //         })
    //       }
    //     )
    //   }
    // },
  }
}
</script>

