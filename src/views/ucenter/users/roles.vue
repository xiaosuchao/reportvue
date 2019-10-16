<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
    </div>
    <el-table
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row>
      <el-table-column
        label="序号"
        type="index"
        width="50"
        fixed
        align="center">
        <template slot-scope="scope">
          <span>{{ scope.$index +(tableData.pageNum - 1) * tableData.pageSize+1 }}</span>
        </template>
      </el-table-column>
      <template v-for="item in colTable">
        <el-table-column :fixed="item.fixed" :key="item.id" :prop="item.prop" :label="item.label" :min-width="item.width" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row[item.prop] | showstr(item.prop) }}</span>
          </template>
        </el-table-column>
      </template>
      <el-table-column align="center" prop="created_at" label="操作" width="300">
        <template slot-scope="scope">
          <template v-if="1 || scope.row['userPid'] && admin_id!==scope.row['userId']">
            <el-button v-if="$store.state.user.userId===scope.row.userId" type="primary" size="small" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button v-if="$store.state.user.userId===scope.row.userId" type="danger" size="small" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
            <el-button type="success" size="small" icon="el-icon-check" @click="handleGrant(scope.row)">授权</el-button>
          </template>
          <template v-else>
            <span>禁止操作</span>
          </template>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.pageNum"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
    <el-dialog :visible.sync="$store.state.user.gateList" :title="'账号授权'">
      <el-tabs v-model="defaultGrantTab" type="card" @tab-click="grantTabClick">
        <el-tab-pane label="业务授权" name="tabGrandBusi">
          <treerolebusi :userid="tempdata.userId" :roleid="tempdata.roleId? tempdata.roleId.toString():''"/>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>

    <el-dialog :visible.sync="isShowDialog" :title="dialogText[dialogStatus]">
      <el-form ref="dataForm" :rules="rules" :model="tempdata" class="dialogform" label-width="90px">
        <input v-model="tempdata.roleId" type="hidden">
        <el-form-item label="角色名称">
          <el-input v-model="tempdata.roleName" placeholder=""/>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="tempdata.status" placeholder="请选择">
            <el-option v-for="opt in optsStatus" :key="opt.key" :value="opt.key" :label="opt.label"/>
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="tempdata.remark" type="textarea" maxlength="200" placeholder=""/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确定</el-button>
        <el-button @click="isShowDialog = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { roleList, roleAdd, roleUpdate, roleDel } from '@/api/role'
import { mapGetters } from 'vuex'
import treerolebusi from './treerolebusi'
import Pagination from '@/components/Pagination'
const statusMap = {
  0: '正常',
  1: '停用'
}
export default {
  filters: {
    showstr(v, prop) {
      if (prop === 'status') { return statusMap[v] }
      return v
    }
  },
  components: {
    'treerolebusi': treerolebusi,
    'Pagination': Pagination
  },
  data() {
    return {
      colTable: [
        { prop: 'roleName', label: '角色名称', fixed: false, width: '' },
        { prop: 'status', label: '状态', fixed: false, width: '' },
        { prop: 'remark', label: '备注', fixed: false, width: '' }
      ],
      tableData: {
        list: [],
        pages: '',
        pageNum: '',
        pageSize: '',
        currentPage: 1
      },
      listQuery: {
        pageNum: 1,
        limit: 10,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      total: 0,
      list: [],
      listid: '',
      formdata: {},
      dialogText: {
        update: '编辑角色',
        create: '添加角色'
      },
      tempdata: {
        roleId: '',
        roleName: '',
        remark: '',
        status: 0
      },
      dialogStatus: '',
      listLoading: true,
      isShowDialog: false,
      rules: {
        roleName: [{ required: true, message: '请填写角色名称', trigger: 'blur' }]
      },
      optsStatus: [],
      proporg: {
        label: 'organizationName',
        value: 'organizationId',
        children: 'children'
      },
      showGrantDialog: false,
      defaultGrantTab: 'tabGrandBusi'
    }
  },
  computed: {
    ...mapGetters([
      'orgtree',
      'admin_id',
      'userId'
    ])
  },
  created() {
    this.getList()
    for (const v in statusMap) {
      this.optsStatus.push({ key: parseInt(v), label: statusMap[v] })
    }
  },
  methods: {
    getList() {
      this.listLoading = true
      roleList(this.listQuery).then(res => {
        this.listLoading = false
        this.list = res.data.list || []
        this.tableData.pages = res.data.pages
        this.tableData.pageNum = res.data.pageNum
        this.tableData.pageSize = res.data.pageSize
        this.total = res.data.total
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          roleAdd(this.tempdata).then(res => {
            this.list.unshift(res.data)
            this.isShowDialog = false
            this.$notify({ title: '成功', message: '创建成功', type: 'success', duration: 2000 })
          })
        }
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          roleUpdate(this.tempdata).then(res => {
            this.isShowDialog = false
            this.$notify({ title: '成功', message: '编辑成功', type: 'success', duration: 2000 })
            this.list = this.list.map(v => { return v.roleId === this.tempdata.roleId ? this.tempdata : v })
          })
        }
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
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.isShowDialog = true
    },
    handleGrant(row) {
      this.tempdata = row
      this.$store.commit('GATELIST_TREEGRENTBUSI', true)
    },
    handleDelete(row) {
      this.$confirm('确定要删除吗？', '提示', { type: 'warning', confirmButtonText: '确定', cancelButtonText: '取消' }).then(
        () => {
          roleDel({ roleId: row.roleId }).then((res) => {
            this.$notify({ title: '成功', message: '操作成功', type: 'success', duration: 2000 })
            this.list = this.list.filter((v, i) => {
              return v.roleId !== row.roleId
            })
          })
        }
      )
    },
    loadOrgTree() {

    },
    grantTabClick(tab, event) {

    },
    resetTemp() {
      this.tempdata = {
        roleId: '',
        roleName: '',
        remark: '',
        status: 0
      }
    }
  }
}
</script>
