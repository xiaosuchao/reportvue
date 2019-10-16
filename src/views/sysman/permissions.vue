<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
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
            <span>{{ scope.row[item.prop] | showstr(item.prop) }}</span>
          </template>
        </el-table-column>
      </template>
      <el-table-column align="center" prop="created_at" label="操作" width="220">
        <template slot-scope="scope">
          <el-button type="primary" size="small" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="isShowDialog" :title="dialogText[dialogStatus]">
      <el-form ref="dialogform" :model="formdata" class=" dialogform" label-width="80px">
        <el-form-item label="用户名">
          <el-input placeholder="用户名"/>
        </el-form-item>
        <el-form-item label="密码">
          <el-input placeholder="密码"/>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input placeholder="姓名"/>
        </el-form-item>
        <el-form-item label="工号">
          <el-input placeholder="工号"/>
        </el-form-item>

        <el-form-item label="状态">
          <el-input placeholder="状态"/>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShowDialog = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getList as fetchList } from '@/api/orders'

const userStatusMap = {
  '0': '停用',
  '1': '正常'
}
export default {
  filters: {
    showstr(v, prop) {
      if (prop === 'contacts') {
        return v ? v.length : 0
      } else if (prop === 'is_back') {
        return v === '1' ? '往返' : '单程'
      } else if (prop === 'addtime') {
        return v
      } else if (prop === 'status') { return userStatusMap[v] }
      return v
    }
  },
  data() {
    return {
      colTable: [
        { prop: 'id', label: 'ID', fixed: true, width: '65px' },
        { prop: 'username', label: '用户名', fixed: true, width: '' },
        { prop: 'truename', label: '姓名', fixed: true, width: '' },
        { prop: 'staffno', label: '工号', fixed: true, width: '' },
        { prop: 'status', label: '状态', fixed: true, width: '' }
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
      isShowDialog: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data
        this.listLoading = false
      })
    },
    createData() {

    },
    updateData() {

    },
    handleEdit(row) {
      this.dialogStatus = 'update'
      this.isShowDialog = true
    },
    handleCreate() {
      this.dialogStatus = 'create'
      this.isShowDialog = true
    }
  }
}
</script>
