<template>
  <div class="app-container">

    <div class="filter-container">
      <el-input v-model="listQuery.title" placeholder="详情，如订单编号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-select v-model="listQuery.type" placeholder="类型" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in logTypeOpitons" :key="item.key" :label="item.display_name" :value="item.key"/>
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row>
      <template v-for="item in colTable">
        <el-table-column :fixed="item.fixed" :key="item.id" :prop="item.prop" :label="item.label" :min-width="item.width" align="center">
          <template slot-scope="scope">
            <span v-if="item.prop==='nickname' && scope.row['user']">{{ scope.row['user']['nickname'] }}</span>
            <span v-else>{{ scope.row[item.prop] | showstr(item.prop) }}</span>
          </template>
        </el-table-column>
      </template>

    </el-table>

  </div>
</template>

<script>
import { getList as fetchList } from '@/api/logs'
import { parseTime } from '@/utils/index'
const logTypeOpitons = [
  { key: '1', display_name: '认领' },
  { key: '2', display_name: '出行程' },
  { key: '3', display_name: '出票' },
  { key: '4', display_name: '处理改签' },
  { key: '5', display_name: '处理退票' }
]
// const logTypeMap = logTypeOpitons.reduce((acc, cur) => {
//   acc[cur.key] = cur.display_name
//   return acc
// }, {})
export default {
  filters: {
    showstr(v, prop) {
      if (prop === 'addtime') {
        return parseTime(v)
      }
      return v
    }
  },
  data() {
    return {
      colTable: [
        { prop: 'id', label: 'ID', fixed: true, width: '65px' },
        { prop: 'type_desc', label: '操作', fixed: true, width: '' },
        { prop: 'order_id', label: '订单号', fixed: true, width: '' },
        { prop: 'message', label: '详情', fixed: true, width: '' },
        { prop: 'nickname', label: '操作人', fixed: true, width: '' },
        { prop: 'addtime', label: '时间', fixed: true, width: '' }
      ],
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      total: 0,
      list: [],
      formdata: {},
      dialogText: {
        update: '编辑账号',
        create: '添加账号'
      },
      dialogStatus: '',
      listLoading: true,
      isShowDialog: false,
      logTypeOpitons
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        console.log(response)
        this.list = response.data

        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    }
  }
}
</script>
