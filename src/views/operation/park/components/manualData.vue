<template>
  <div class="manualData">
    <el-dialog
      :visible.sync="manualEntryFlag"
      title="手动入场"
      width="40%"
      @beforeClose="beforeClose"
    >
      <el-form ref="manualData" :model="manualData" :rules="dialogRules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="车牌号/VIN" prop="plateVin">
          <el-input v-model="manualData.plateVin" style="width:97%" maxlength="17" placeholder="车牌号/VIN"/>
        </el-form-item>
        <el-form-item v-if="!colorFlag" label="颜色">
          <el-select v-model="manualData.fColor" sty-fle="width:89%" placeholder="请选择">
            <el-option
              v-for="item in manualData.carColor"
              :key="item"
              :label="item"
              :value="item"/>
          </el-select>
          <a style="font-size:14px;text-decoration:underline" @click="colorChange">其他</a>
        </el-form-item>
        <el-form-item v-if="colorFlag" label="颜色">
          <el-input v-model="manualData.fColor" style="width:97%;" maxlength="4" placeholder="颜色"/>
        </el-form-item>
        <el-form-item v-if="!letteerflag" label="手动选择" >
          <el-select
            v-model="letterValue"
            placeholder="请选择"
            style="width:20%"
            @change="letterChange">
            <el-option
              v-for="item in letterData"
              :key="item"
              :label="item"
              :value="item"/>
          </el-select>
          <el-cascader
            :options="letteerBy"
            v-model="manualData.selectedOptions3"
            :props="carprops"
            style="width:67%"
            change-on-select
          />
          <a style="font-size:14px;text-decoration:underline" @click="changeLetter">其他</a>
        </el-form-item>
        <el-form-item v-if="letteerflag" label="品牌">
          <el-input v-model="manualData.fBrand" placeholder="品牌" maxlength="8" style="width:97%;"/>
        </el-form-item>
        <el-form-item v-if="letteerflag" label="车系">
          <el-input v-model="manualData.fModel" placeholder="车系" maxlength="6" style="width:97%"/>
        </el-form-item>
        <el-form-item v-if="letteerflag" label="类型">
          <el-input v-model="manualData.fType" placeholder="类型" maxlength="6" style="width:97%"/>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="manualData.note" type="textarea" maxlength="200" placeholder="请输入..." style="width:97%" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="manualSet('manualData')">确 定</el-button>
        <el-button @click="beforeClose">取 消</el-button>
      </div>
  </el-dialog></div>
</template>
<script>
import {
  manualentry,
  letter,
  byletter
} from '@/api/car'
export default {
  props: {
    manualEntrys: {
      type: Boolean,
      required: true
    },
    carStoreid: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      dialogRules: {
        plateVin: [
          { min: 7, max: 17, message: '车牌最少为7位，VIN为17位', trigger: 'blur' },
          { required: true, message: '请输入车牌号', trigger: 'blur' },
          { pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/, message: '请输入正确的车牌号/VIN格式' }
        ]
      },
      manualData: {
        fPlatenum: '',
        fColor: '',
        fBrand: '',
        fModel: '',
        fCurrentId: '',
        fId: '',
        fPresenceStatus: '',
        fType: '',
        plateVin: '',
        queryshopfilter: '',
        selectedOptions3: [],
        carColor: ['黑色', '白色', '银色', '红色', '蓝色', '橘色', '黄色', '紫色']
      },
      userToken: this.$store.state.user.token,
      colorFlag: false,
      letteerflag: false,
      letterValue: '',
      letterData: [],
      letteerBy: [],
      carprops: {
        value: 'fBrand',
        label: 'fBrand',
        children: 'children'
      },
      // carStore: this.carStoreid,
      manualEntryFlag: ''
    }
  },
  watch: {
    // manualEntrys: function(val, oldval) {
    //   console.log(val)
    // }
  },
  created() {
    this.letters()
  },
  methods: {
    beforeClose() {
      this.manualData = {
        fPlatenum: '',
        fColor: '',
        fBrand: '',
        fModel: '',
        fCurrentId: '',
        fId: '',
        fPresenceStatus: '',
        fType: '',
        plateVin: '',
        queryshopfilter: '',
        selectedOptions3: [],
        carColor: ['黑色', '白色', '银色', '红色', '蓝色', '橘色', '黄色', '紫色']

      }
      this.manualEntryFlag = false
      this.$nextTick(() => {
        this.$refs['manualData'].clearValidate()
      })
    },
    letters() {
      letter().then(res => {
        this.letterData = res.data
      })
    },
    changeLetter() {
      this.letteerflag = !this.letteerflag
    },
    colorChange() {
      this.colorFlag = !this.colorFlag
    },
    letterChange(val) {
      this.letterDis = true
      byletter({ letter: val }).then(res => {
        this.letteerBy = res.data
        this.letteerflag = false
      })
    },
    manualSet(manualData) {
      this.$refs[manualData].validate((valid) => {
        if (valid) {
          /* eslint-disable */if (this.manualData.selectedOptions3.length != 0) {
             var arr = this.manualData.selectedOptions3[1].split('/')
            var data = {
              token: this.userToken,
              fPlatenum: this.manualData.plateVin,
              fColor: this.manualData.fColor,
              fBrand: this.manualData.selectedOptions3[0],
              fModel: arr[0],
              fType: arr[1],
              fIntoRemarks: this.manualData.note,
              fAid: this.carStoreid
            }
          } else {
           var datas = {
              token: this.userToken,
              fPlatenum: this.manualData.plateVin,
              fColor: this.manualData.fColor || '',
              fBrand: this.manualData.fBrand || '',
              fModel: this.manualData.fModel || '',
              fType: this.manualData.fType || '',
              fIntoRemarks: this.manualData.note,
              fAid: this.carStoreid
            }
          }
          manualentry(data || datas).then(res => {
            this.manualEntryFlag = false
            this.$message({
              type: 'success',
              message: res.msg
            })
            this.$emit('manualSet',{flag:true})
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
  }
}
</script>
