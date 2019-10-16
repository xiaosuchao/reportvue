<template>
  <div class="app-container">
    <div class="filter-container">
      <template v-for="(itemGroup,i) in arAddrs" >
        <template v-if="i<3">
          <span :key="'g'+i" style="margin-right:10px;">{{ arAddrName[i] }}</span>
          <el-select :key="'s'+i" v-model="arCode[i]" placeholder="类型" class="filter-item" style="width: 130px; margin-right:30px;" @change="selChange(i,$event)">
            <el-option v-for="itemAddr in itemGroup" :label="itemAddr.name" :key="itemAddr.code" :value="itemAddr.code"/>
          </el-select>
        </template>
      </template>
      <span v-if="getCode">位置编号:{{ getCode }}</span>
    </div>

    <el-row :gutter="30" class="rowAddrcells" >
      <el-col v-for="(itemGroup,i) in arAddrs" :key="'s'+i" :span="6" class="colAddrcells">
        <template v-if="i>2">
          <div class="tit">{{ arAddrName[i] }}</div>
          <ul v-if="arCode[i-1]" class="uladdrs">
            <li v-for="itemAddr in itemGroup" :key="itemAddr.code" :class="{seled:itemAddr.chked}" @click="selChange(i,itemAddr)">[{{ itemAddr.code.replace(itemAddr.parentCode,'') }}]{{ itemAddr.name }}</li>
          </ul>
          <div v-if="arCode[i-1]">
            <el-button-group>
              <el-button type="success" @click="handlei=i;handleEvent('create')" >添加</el-button>
              <el-button class="primary" type="primary" @click="handlei=i;handleEvent('update')" >编辑</el-button>
              <el-button type="danger" @click="handlei=i;handleEvent('delete')">删除</el-button>
            </el-button-group>
          </div>
        </template>
      </el-col>
    </el-row>

    <el-dialog :visible.sync="isShowEdit" :rules="rules" :title="editStatus==='create'?'位置添加':'位置编辑'">
      <el-form ref="tempdata" :rules="rules" :model="tempdata" class="dialogform" label-width="110px">
        <el-form-item label="父级ID">
          <el-input v-model="tempdata.parentCode" :disabled="true" placeholder="父级ID"/>
        </el-form-item>
        <el-form-item label="当前ID">
          <el-input v-model="tempdata.code" :disabled="true" placeholder="当前ID"/>
        </el-form-item>
        <!-- <el-form-item v-if="editStatus ==='create'" :label="(handlei===4?'三位':'四位')+'位置编号'" prop="nowcode">
          <el-input v-model="tempdata.nowcode" :placeholder="(handlei===4?'三位':'四位')+'位置编号'" :maxlength="handlei===4?3:4"/>
        </el-form-item> -->
        <el-form-item v-if="editStatus ==='create' && handlei===4" label="三位位置编号" prop="Tnowcode">
          <el-input v-model="tempdata.Tnowcode" placeholder="三位位置编号" maxlength="3"/>
        </el-form-item>
        <el-form-item v-if="editStatus ==='create' && handlei===3" label="四位位置编号" prop="Fnowcode">
          <el-input v-model="tempdata.Fnowcode" placeholder="四位位置编号" maxlength="4"/>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="tempdata.name" placeholder="位置名称"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editStatus==='create'?createData('tempdata'):updateData('tempdata')">确定</el-button>
        <el-button @click="isShowEdit = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getSubArea, createAddr, updateAddr, delRowAddr } from '@/api/addr'
// import { selectRepetition } from '@/api/agency'
export default {
  data() {
    return {
      name: 'addrsset',
      arAddrs: (new Array(7)).fill([]),
      arCode: (new Array(7)).fill(''),
      arObj: (new Array(7)).fill(''),
      getCode: '',
      arAddrName: ['省份', '市', '区县', '街道', '楼宇', '楼层', '区位'],
      editStatus: '',
      isShowEdit: false,
      tempdata: { nowcode: '' },
      handlei: 0,
      maxl: 4,
      rules: {
        nowcode: [{ required: true, message: '请填写编码', trigger: 'blur' }],
        name: [{ required: true, message: '请填写名称', trigger: 'blur' }],
        Tnowcode: [
          { required: true, message: '请填写位置编码', trigger: 'blur' },
          { min: 3, max: 3, message: '请输入三位位置编码', trigger: 'blur' }
        ],
        Fnowcode: [
          { required: true, message: '请填写位置编码', trigger: 'blur' },
          { min: 4, max: 4, message: '请输入四位位置编码', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    'tempdata.Tnowcode': {
      handler(newVal, oldVal) {
        this.tempdata.code = this.tempdata.Tnowcode ? this.tempdata.parentCode + this.tempdata.Tnowcode : ''
      },
      deep: true
    },
    'tempdata.Fnowcode': {
      handler(newVal, oldVal) {
        console.log('newVal', newVal)
        this.tempdata.code = this.tempdata.Fnowcode ? this.tempdata.parentCode + this.tempdata.Fnowcode : ''
      },
      deep: true
    },
    'tempdata.code': {
      handler(newval, oldVal) {
        this.tempdata.code = newval
      },
      deep: true
    }
  },

  created() {
    this.loadSubArea(0, 1)
  },
  methods: {
    loadSubArea(parentCode, grade) {
      getSubArea({ parentCode, grade }).then(res => {
        this.arAddrs = this.arAddrs.map((v, i) => {
          if (i === grade - 1) { return res.data }
          return v
        })
      })
    },
    selChange(ci, cv) {
      console.log('///', ci, cv)
      // const ind = v.indexOf(this.arCode)
      // console.log(i)
      if (ci <= 2) {
        this.getCode = cv
      }
      if (ci > 2) {
        this.handlei = ci
        if (this.arObj[ci]) { this.arObj[ci].chked = false }
        this.arObj[ci] = cv
        cv.chked = true
        // this.arAddrs[ci] = this.arAddrs[ci].map(v => {
        //   if (v.code === cv.code) { v.chked = true } else { v.chked = false }
        //   return v
        // })
        this.arCode[ci] = cv.code
        cv = cv.code
      }

      this.arAddrs = this.arAddrs.map((v, i) => { return i > ci ? [] : v })
      this.arCode = this.arCode.map((v, i) => { return i > ci ? '' : v })
      this.arObj = this.arObj.map((v, i) => { return i > ci ? '' : v })
      console.log(this.arCode)
      this.loadSubArea(cv, ci + 2)
    },
    handleEvent(evname) {
      if (evname === 'create') {
        console.log(this.handlei)
        if (!this.arCode[this.handlei - 1]) {
          this.$notify.error({ title: '错误', message: '没有选择上级' })
          return
        }
        this.handleCreate()
      } else {
        if (!this.arObj[this.handlei]) {
          this.$notify.error({ title: '错误', message: '没有选择对象' })
          return
        }
        evname === 'update' ? this.handleUpdate() : this.handleDelete()
      }
    },
    handleCreate() {
      this.resetTemp()
      console.log(this.tempdata.parentCode)
      this.tempdata.parentCode = this.arCode[this.handlei - 1]
      this.tempdata.grade = this.handlei + 1
      this.editStatus = 'create'
      this.isShowEdit = true
      this.$nextTick(() => {
        this.$refs['tempdata'].clearValidate()
      })
    },
    handleUpdate() {
      this.editStatus = 'update'
      const objAddr = this.arObj[this.handlei]
      this.tempdata.code = objAddr.code
      this.tempdata = Object.assign({}, objAddr, { Fnowcode: objAddr.code.replace(new RegExp('^' + objAddr.parentCode, 'i'), ''), Tnowcode: objAddr.code.replace(new RegExp('^' + objAddr.parentCode, 'i'), ''), grade: this.handlei + 1 })
      this.isShowEdit = true
      this.$nextTick(() => {
        this.$refs['tempdata'].clearValidate()
      })
    },
    handleDelete() {
      const code = this.arObj[this.handlei]['code']
      this.$confirm('确定要删除吗？', '提示', { type: 'warning', confirmButtonText: '确定', cancelButtonText: '取消' }).then(
        () => {
          delRowAddr({ code }).then((res) => {
            this.$notify({
              title: '成功',
              message: '操作成功',
              type: 'success',
              duration: 2000
            })
          })
          console.log(this.arAddrs[this.handlei], code)
          this.arAddrs[this.handlei] = this.arAddrs[this.handlei].filter(v => { return v.code !== code })
          this.arAddrs = this.arAddrs.map(v => { return v })
          this.arCode[this.handlei] = ''
          this.arObj[this.handlei] = ''
          this.handlei = 0
        }
      )
    },
    resetTemp() {
      this.tempdata = {
        id: '',
        parentCode: '',
        code: '',
        nowcode: '',
        name: '',
        grade: 0
      }
    },
    createData(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.tempdata = Object.assign({}, this.tempdata, { nowcode: this.tempdata.Tnowcode || this.tempdata.Fnowcode })
          delete this.tempdata.Tnowcode
          delete this.tempdata.Fnowcode
          createAddr(this.tempdata).then(res => {
            console.log(res)
            this.arAddrs[this.handlei].push(res.data)
            this.$notify({
              title: '成功',
              message: res.msg,
              type: 'success',
              duration: 2000
            })
            this.isShowEdit = false
          }).catch(e => {
            // console.log(e)
            this.$message({
              title: '',
              message: e.msg,
              type: 'error',
              duration: 2000
            })
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    updateData(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          updateAddr(this.tempdata).then(res => {
            console.log(res)
            this.arObj[this.handlei] = this.tempdata
            this.arAddrs[this.handlei] = this.arAddrs[this.handlei].map(v => { return v.code === this.tempdata.code ? this.tempdata : v })

            this.$notify({
              title: '成功',
              message: res.msg,
              type: 'success',
              duration: 2000
            })
            this.isShowEdit = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.primary{
    margin-left:10px!important;
    margin-right:10px!important;
}
.el-button{
  border-radius:4px!important;
}
.rowAddrcells{
  text-align: center; padding-top: 36px;
  .colAddrcells{
    .uladdrs{
      height: 200px; border: 1px solid #ccc; border-radius: 8px; overflow: scroll; margin: 12px 0;padding:6px 0;
      li{cursor: pointer; line-height: 22px;}
      .seled{
        background: #409EFF;color:#fff;
      }
    }
  }
}

</style>

