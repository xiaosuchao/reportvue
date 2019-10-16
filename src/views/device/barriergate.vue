<template>
  <div class="daozhatbout">
    <el-table
      :data="list"
      :empty-text="emptytxt"
      border
      style="width: 100%">
      <el-table-column label="序号" type="index" width="50" fixed align="center">
        <template slot-scope="scope">
          <span>{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <template v-for="item in colTable">
        <el-table-column :fixed="item.fixed" :key="item.displayName" :prop="item.prop" :label="item.label" :min-width="item.width" align="center">
          <template slot-scope="scope">
            <template v-if="item.prop==='deviceStatus'">
              <!-- <span v-html="showstr(scope.row[item.prop])">{{ showstr(item.prop) }}</span> -->
              <el-tooltip effect="dark" placement="top" >
                <div slot="content">{{ scope.row[item.prop] }}</div>
                <img :src="scope.row[item.prop]| showstr(item.prop)" style="width:15px;" alt >
              </el-tooltip>
              <!-- <el-popover trigger="hover" placement="top">
                <p style="text-align:center">{{ scope.row[item.prop] }}</p>
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
    </el-table>
  </div>
</template>
<style lang="scss" >
.daozhatbout .el-table__empty-block{ font-size: 16px;}
</style>

<script>
import { barrierGateLlist as fetchList } from '@/api/device'
import { parseTime } from '@/utils'

export default {
  filters: {
    showstr(v, prop) {
      if (prop === 'outTime') { return v === 0 ? '' : parseTime(v) }
      if (prop === 'deviceStatus') { return v === '在线' ? require('@/assets/images/deviceonline.png') : require('@/assets/images/deviceoffline.png') }
      return v
    }
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
    return {
      name: 'ucenterorgindex',
      colTable: [
        { prop: 'deviceNo', label: '设备编号', fixed: true, width: '' },
        { prop: 'deviceName', label: '设备名称', fixed: true, width: '' },
        { prop: 'deviceIp', label: '设备ip', fixed: true, width: '' },
        { prop: 'inletAndOutLet', label: '进出口', fixed: true, width: '' },
        { prop: 'deviceStatus', label: '在线状态', fixed: true, width: '' },
        { prop: 'outTime', label: '离线时间', fixed: true, width: '' }
      ],
      list: [],
      listQuery: {
        dealerCode: ''
      },
      emptytxt: '暂无数据'
    }
  },
  watch: {
    'orgnode.dealerCode': {
      handler(newval, oldval) {
        console.log('dealer newval', newval)
        this.listQuery.dealerCode = newval
        console.log('delearCode=' + newval)
        if (this.isactive && this.orgnode.code) { this.getList() } else { this.needfresh = true }
      },
      immediate: true
    },
    'isactive': {
      handler(newval, oldval) {
        console.log('delearCode=' + newval)
        // if (newval && this.needfresh) { this.getList(); this.needfresh = false }
        if (newval && this.orgnode.code) { this.getList(); this.needfresh = false }
      }
    }
  },
  created() {
    this.getDeviceTypeList()
  },
  methods: {
    handleCheckChange(data, checked, indeterminate) {
    },
    getDeviceTypeList() {
    },
    getList() {
      const tmpQuery = Object.assign({}, this.listQuery)
      fetchList(tmpQuery).then(res => {
        this.emptytxt = '暂无数据'
        this.list = res.data || []
      }).catch(err => {
        this.emptytxt = err.msg
        this.list = []
      })
    }
  }
}
</script>
