<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="filterIns">
        <el-input v-model="listQuery.enterprieName" placeholder="请输入企业名称" style="width:100%"/>
        <img src="../../assets/images/search.png" alt @click="searchTryCar()">
      </div>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="addAppk">添加企业APPK</el-button>
    </div>
    <el-table
      :data="list"
      element-loading-text="Loading"
      border
      highlight-current-row>
      <el-table-column
        label="序号"
        width="50"
        fixed
        align="center">
        <template slot-scope="scope">
          <span>{{ scope.$index +(tableData.pageNum - 1) * tableData.pageSize+1 }}</span>
        <!-- <span>{{ (tableData.pageNum - 1) * tableData.pageSize + scope.$index + 1 }}</span> -->
        </template>
      </el-table-column>
      <template v-for="item in colTable">
        <el-table-column :fixed="item.fixed" :key="item.id" :prop="item.prop" :label="item.label" :min-width="item.width" align="center"/>
      </template>
      <el-table-column align="center" prop="created_at" label="操作" width="380">
        <template slot-scope="scope">
          <el-button type="primary" size="small" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button type="danger" size="small" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.pageNum"
      :limit.sync="listQuery.limit"
      @pagination="tableLists"
    />

    <el-dialog :visible.sync="isShowDialog" :title="dialogText.add">
      <el-form :model="formData" label-width="85px">
        <el-form-item label="企业名称">
          <el-input v-model="formData.enterprieName" placeholder="企业名称"/>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="formData.remark" type="textarea" maxlength="200" placeholder="备注"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addData()">确定</el-button>
        <el-button @click="isShowDialog = false">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="editShowDialog" :title="dialogText.edit">
      <el-form :model="tempdata" label-width="85px">
        <el-form-item label="自增主键ID">
          <el-input v-model="tempdata.id" disabled placeholder="自增主键ID"/>
        </el-form-item>
        <el-form-item label="企业名称">
          <el-input v-model="tempdata.enterprieName" placeholder="企业名称"/>
        </el-form-item>
        <el-form-item label="企业账号">
          <el-input v-model="tempdata.appKey" disabled placeholder="企业账号"/>
        </el-form-item>
        <el-form-item label="企业密钥">
          <el-input v-model="tempdata.appSecret" disabled placeholder="企业密钥"/>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="tempdata.remark" type="textarea" maxlength="200" placeholder="备注"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editData()">确定</el-button>
        <el-button @click="editShowDialog = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import { APPklist, selectOne, createAppk, deleteAppk, updateAppk } from '@/api/agency'
export default {
  components: {
    'Pagination': Pagination
  },
  data() {
    return {
      Appkinp: '',
      dialogText: {
        add: '添加企业appk',
        edit: '编辑企业appk'
      },
      currentPage: 1, // 初始页
      pagesize: 10, //    每页的数据
      dialogStatus: '',
      enterprieName: '',
      list: [],
      listLoading: true,
      isShowDialog: false,
      editShowDialog: false,
      formData: {
        enterprieName: '', // 企业名称
        appKey: '', // 企业账号
        appSecret: '', // 企业密钥
        id: '', // 自增主键ID
        remark: '' // 备注
      },
      tempdata: {
        appKey: '',
        appSecret: '',
        ctime: '',
        enterprieName: '',
        id: '',
        mtime: '',
        remark: ''
      },
      tableData: {
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
        sort: '+id',
        enterprieName: ''
      },
      total: 0,
      colTable: [
        { prop: 'enterprieName', label: '企业名称', fixed: true, width: '' },
        { prop: 'appKey', label: '企业账号', fixed: true, width: '' },
        { prop: 'appSecret', label: '企业密匙', fixed: true, width: '' },
        { prop: 'remark', label: '备注', fixed: true, width: '' }
      ]
    }
  },
  created() {
    this.tableLists()
  },
  methods: {
    tableLists() {
      APPklist(this.listQuery).then(res => {
        this.listLoading = false
        this.list = res.data.list || []
        this.tableData.pages = res.data.pages
        this.tableData.pageNum = res.data.pageNum
        this.tableData.pageSize = res.data.pageSize
        this.total = res.data.total
      })
    },
    searchAppK() {
      alert(this.Appkinp)
      selectOne({ id: this.Appkinp }).then(res => {
        console.log(res)
      })
    },
    addAppk() {
      this.isShowDialog = true
      this.resetTemp()
    },
    handleEdit(row) {
      this.editShowDialog = true
      this.tempdata = Object.assign({}, row)
      // this.isShowDialog = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      selectOne({ id: row.id }).then(res => {
        this.formData.enterprieName = res.data.enterprieName
        this.formData.appKey = res.data.appKey
        this.formData.remark = res.data.remark
        this.formData.appSecret = res.data.appSecret
        this.formData.id = res.data.id
      })
    },
    handleDelete(row) {
      this.$confirm('是否要删除这条信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        deleteAppk({ id: row.id }).then(res => {
          if (res.msg === '操作成功') {
            this.list = this.list.filter((v, i) => {
              return v.id !== row.id
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    addData() {
      var data = {
        enterprieName: this.formData.enterprieName
      }
      createAppk(data).then(res => {
        if (res.msg === '操作成功') {
          this.isShowDialog = false
          this.list.unshift(res.data)
        }
      })
    },
    searchTryCar() {
      APPklist(this.listQuery).then(res => {
        this.list = res.data.list
      })
    },
    editData() {
      var data = {
        enterprieName: this.formData.enterprieName,
        remark: this.formData.remark
      }
      updateAppk({ data }).then(res => {
        if (res.msg === '操作成功') {
          this.editShowDialog = false
          this.list = this.list.map(v => { return v.id === this.tempdata.id ? this.tempdata : v })
        }
      })
    },
    handleCurrentChange(size) {
      APPklist({ page: size }).then(res => {
        this.tableData.list = res.data.list || []
        this.listLoading = false
        this.tableData.list = res.data.list || []
        this.tableData.pages = res.data.pages
        this.tableData.pageNum = res.data.pageNum
        this.tableData.pageSize = res.data.pageSize
      })
    },
    resetTemp() {
      this.tempdata = {
        appKey: '',
        appSecret: '',
        ctime: '',
        enterprieName: '',
        id: '',
        mtime: '',
        remark: ''

      }
      this.formData = {
        enterprieName: '', // 企业名称
        appKey: '', // 企业账号
        appSecret: '', // 企业密钥
        id: '', // 自增主键ID
        remark: '' // 备注
      }
    }
  }
}
</script>
<style lang="scss">
.filter-container{
  float:right;
  width:360px;
  display:flex;
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
 }
}
</style>
