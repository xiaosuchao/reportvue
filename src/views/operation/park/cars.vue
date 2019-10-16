<template>
  <div class="carBox">
    <div class="carStore">
      <p>
        <span @click="showTree"><input v-model = "carStoreName" style="height:40px;width:200px;color:#606266;border-radius:4px;border:1px solid #dcdfe6;padding-left:10px;" type="text" placeholder="请选择店铺"></span>
      </p>
    </div>
    <elTree :isshowtreedialog="treedialog" @chloc="selectloc"/>
    <div class="carTitle">
      <ul>
        <li>在场车辆 : {{ carNums }}</li>
        <li>本日累计{{ carBrandS }}车辆入场:{{ appointInCarCount }}</li>
        <li>本日累计入场 : {{ totalEntrance }}</li>
        <li>本日累计离场 : {{ totalAppearance }}</li>
        <li>预约到店：{{ bookingVehicleCount }}</li>
        <li>售后离场 : {{ afterSales }}</li>
        <li>销售离场 : {{ beforeSales }}</li>
        <li>试驾车离场: {{ tryCars }}</li>
      </ul>
    </div>
    <div class="filterCar">
      <el-row>
        <el-col>
          <el-form :inline="true" :model="formInline" class="demo-form-inline" label-width="90px">
            <el-popover
              ref="popover1"
              placement="top-start"
              width="200"
              trigger="focus"
              content="请输入车牌号/VIN、品牌、车系、车型、颜色关键词进行搜索"/>
            <el-form-item label="关键词">
              <el-input v-popover:popover1 v-model="listQuery.fPlatenum" placeholder="请输入车牌号/VIN、品牌、车系、车型、颜色" @input="searchL"/>
            </el-form-item>
            <el-form-item label="日期">
              <el-date-picker
                :picker-options="pickerOptions"
                :default-time="['00:00:00','23:59:59']"
                v-model="Datealue"
                style="width:100%"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                value-format="yyyy-MM-dd HH:mm:ss"
                end-placeholder="结束日期"/>
            </el-form-item>
            <el-form-item>
              <div class="filterR">
                <a style="border-bottom: 1px solid #606266;color:#c1c1c1;padding-bottom: 10px;font-size:14px;color:#606266" @click="submitS">{{ moreInfo===false?'&nbsp;&nbsp;&nbsp;更 多&nbsp;&nbsp;&nbsp;':'&nbsp;&nbsp;&nbsp;收 起&nbsp;&nbsp;&nbsp;' }}</a>
                <el-button style="margin-left:10px;" type="primary" @click="submit">&nbsp;&nbsp;&nbsp;提 交&nbsp;&nbsp;&nbsp;</el-button>
              </div>
            </el-form-item>
          </el-form>
        </el-col>
        <!-- <el-col :span="filterR" :xl="xr">
          <div class="filterR">
            <a style="border-bottom: 1px solid #606266;color:#c1c1c1;padding-bottom: 10px;font-size:14px;color:#606266" @click="submitS">{{ moreInfo===false?'&nbsp;&nbsp;&nbsp;更 多&nbsp;&nbsp;&nbsp;':'&nbsp;&nbsp;&nbsp;收 起&nbsp;&nbsp;&nbsp;' }}</a>
            <el-button style="margin-left:10px;" type="primary" @click="submit">&nbsp;&nbsp;&nbsp;提 交&nbsp;&nbsp;&nbsp;</el-button>
          </div>
        </el-col> -->
      </el-row>
      <el-row>
        <el-col v-if="moreInfo">
          <el-form :inline="true" :model="formInline" :label-position="labelPosition" class="demo-form-inline" label-width="88px">
            <el-form-item label="品牌" class="moreInfo">
              <el-select v-model="listQuery.fBrand" clearable placeholder="请选择">
                <el-option v-for="item in formInline.brand" :key="item.value" :value="item.value"/>
              </el-select>
            </el-form-item>
            <el-form-item label="车系" class="fModel">
              <el-select v-model="listQuery.fModel" clearable placeholder="请选择" >
                <el-option v-for="item in formInline.model" :key="item.value" :value="item.value"/>
              </el-select>
            </el-form-item>
            <el-form-item label="车型" class="moreInfo">
              <el-select v-model="listQuery.fType" clearable placeholder="请选择">
                <el-option v-for="item in formInline.type" :key="item.value" :value="item.value"/>
              </el-select>
            </el-form-item>
            <el-form-item label="颜色" class="moreInfo">
              <el-select v-model="listQuery.fColor" clearable placeholder="请选择">
                <el-option v-for="item in formInline.color" :key="item.value" :value="item.value"/>
              </el-select>
            </el-form-item>
            <el-form-item label="在场状态" class="moreInfo">
              <el-select v-model="listQuery.fPresenceStatus" clearable placeholder="请选择">
                <el-option v-for="item in formInline.fPresenceStatus" :key="item.key" :label="item.value" :value="item.key"/>
              </el-select>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
    <div class="btnBox">
      <div class="ManualBox">
        <el-button v-if="exportCarFlag" type="primary" @click="exportCar">导出</el-button>
        <el-button v-if="manualFlag" type="primary" @click="manualEntrying">手动入场</el-button>
        <el-button v-if="orderFlag" type="primary" @click="firstShow">接待确认</el-button>
        <el-button v-if="outFlag" style="margin-left:7px;" type="primary" @click="handOutCars">手动离场</el-button>
        <el-button v-if="optsBtnCode.includes('operationParkingMarkOut')" style="margin-left:7px;" type="primary" @click="markOut">标记离场</el-button>
      </div>
    </div>
    <el-dialog
      :visible.sync="pointFlag"
      title="标记离场"
      width="40%"
    >
      <el-form ref="Markorder" :model="Markorder" :rules="dialogRules" label-width="60px" class="demo-ruleForm">
        <el-form-item label="备注" prop="carInfoRemarks">
          <el-input v-model="Markorder.carInfoRemarks" type="textarea"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="markTrue('Markorder')">确 定</el-button>
        <el-button @click="pointFlag = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="pointTip"
      title="提示"
      width="25%"
    >
      <div>
        <p>&nbsp;&nbsp;请确认是否将当前所选日期内的全部在场车辆标记为离场？</p>
        <p style="color:red;">（不可撤销，请谨慎操作！如果筛选了车牌号，则只操作该车辆）</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="markPoint">确 定</el-button>
        <el-button @click="pointTip = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="firstEntryShow"
      title="接待确认"
      width="50%"
    >
      <el-form ref="order" :model="order" :rules="dialogRules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="车牌号/VIN" prop="plateVin">
          <el-input v-model="order.plateVin" style="width:97%" maxlength="17" placeholder="请输入车牌号/VIN"/>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="order.name" style="width:97%" maxlength="4" placeholder="请输入姓名"/>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="order.phone" style="width:97%" maxlength="11" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="order.gender" style="width:69%" placeholder="请选择" @change="orderGender">
            <el-option
              v-for="item in genderData"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="业务人员" >
          <el-input v-model="userRealName" :disabled="userRealNameFlag" placeholder="请输入业务人员姓名" maxlength="7" style="width:69%" />
        </el-form-item>
        <el-form-item label="里程表信息" >
          <el-input v-model.number="order.fInMileage" placeholder="请输入里程表信息" maxlength="7" style="width:69%" />&nbsp;km
        </el-form-item>
        <el-form-item label="业务类型" prop="optsGrantLeave">
          <el-select v-model="order.optsGrantLeave" filterable placeholder="请选择" style="width:69%" >
            <el-option
              v-for="item in optsGrantLeave"
              :key="item.code"
              :label="item.value"
              :value="item.code"

            />
          </el-select>
        </el-form-item >
        <el-form-item v-show="order.optsGrantLeave == 'operationparkafterSale'" label="维修工单号">
          <el-input v-model="order.AfterSaleCode" style="width:97%" placeholder="维修工单号"/>
        </el-form-item>
        <el-form-item v-show="order.optsGrantLeave == 'operationparkafterSale'" label="流水号">
          <el-input v-model="order.fAfterFlowCode" style="width:97%" placeholder="流水号"/>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="order.note" type="textarea" style="width:97%" maxlength="200" placeholder="请输入..."/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="firstouts('order')">确 定</el-button>
        <el-button @click="firstEntryShow = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="editShow"
      title="编辑"
      width="40%"
    >
      <el-form ref="editData" :model="editData" :rules="dialogRules" label-width="100px">
        <el-form-item label="车牌号/VIN" prop="plateVin">
          <el-input v-model="editData.plateVin" maxlength="17" style="width:97%" placeholder="请输入车牌号/VIN"/>
        </el-form-item>

        <el-form-item label="手动选择">
          <el-select
            v-model="letterValue"
            placeholder="请选择"
            style="width:20%"
            @change="letterChange">
            <el-option
              v-for="item in brandData"
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
            @change="handleChange"
          />
          <a style="font-size:14px;text-decoration:underline" @click="letteerother">其他</a>
        </el-form-item>
        <el-form-item label="颜色">
          <el-select v-if="editColor" v-model="editData.fColor" style="width:89%" placeholder="请选择">
            <el-option
              v-for="item in manualData.carColor"
              :key="item"
              :label="item"
              :value="item"/>
          </el-select>
          <el-input v-if="!editColor" v-model="editData.fColor" style="width:89%;" maxlength="4" placeholder="颜色"/>
          <a style="font-size:14px;text-decoration:underline" @click="btncolorFlag">其他</a>
        </el-form-item>
        <el-form-item v-if="editLetter" label="品牌">
          <el-input v-model="editData.fBrand" :disabled="letterDis" style="width:97%" placeholder="请输入车的品牌"/>
        </el-form-item>
        <el-form-item v-if="editLetter" label="车系">
          <el-input v-model="editData.fModel" :disabled="letterDis" style="width:97%" placeholder="请输入车系"/>
        </el-form-item>
        <el-form-item v-if="editLetter" label="车型">
          <el-input v-model="editData.fType" :disabled="letterDis" style="width:97%" placeholder="请输入车系"/>
        </el-form-item>
        <el-form-item v-if="editLetter" label="备注">
          <el-input v-model="editData.fCarInfoRemarks" style="width:97%" placeholder="请输入备注"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editTrue('editData')">确 定</el-button>
        <el-button @click="editShow = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="handOuts"
      title="手动离场"
      width="40%"
    >
      <el-form ref="manualout" :model="manualout" :rules="dialogRules" label-width="100px">
        <el-form-item label="车牌号/VIN" prop="plateVin">
          <el-input v-model="manualout.plateVin" style="width:97%" maxlength="17" placeholder="请输入车牌号/VIN"/>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="manualout.note" type="textarea" style="width:97%" placeholder="请输入..."/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="manualoutSet('manualout')">确 定</el-button>
        <el-button @click="handOuts = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="handOut"
      title="手动离场"
      width="40%"
    >
      <el-form :model="order" label-width="80px">
        <p style="text-align:center;color:#000;">主管未审核，是否继续放行？</p>
        <el-form-item label="业务类型">
          <el-select v-model="fCarLiftingRodType" placeholder="请选择" style="width:97%" >
            <el-option
              v-for="item in oneTypes"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="fCarLiftingRodType==='其他'" label="其他">
          <el-input v-model="fOtherRemarks" type="textarea" maxlength="200" placeholder="请输入..." style="width:97%" />

        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="fLeaveRemarks" type="textarea" maxlength="200" placeholder="请输入..." style="width:97%" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="manualoutaA">确 定</el-button>
        <el-button @click="handOut = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="manualEntrys"
      title="手动入场"
      width="40%"
    >
      <el-form ref="manualData" :model="manualData" :rules="dialogRules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="车牌号/VIN" prop="plateVin">
          <el-input v-model="manualData.plateVin" style="width:97%" maxlength="17" placeholder="车牌号/VIN"/>
        </el-form-item>
        <el-form-item label="颜色">
          <el-select v-if="!colorFlag" v-model="manualData.fColor" sty-fle="width:89%" placeholder="请选择">
            <el-option
              v-for="item in manualData.carColor"
              :key="item"
              :label="item"
              :value="item"/>
          </el-select>
          <el-input v-if="colorFlag" v-model="manualData.fColor" style="width:89%;" maxlength="4" placeholder="颜色"/>
          <a style="font-size:14px;text-decoration:underline" @click="colorChange">其他</a>
        </el-form-item>
        <el-form-item label="手动选择" required>
          <el-col :span="6">
            <el-form-item prop="letterValue">
              <el-select
                v-if="!letteerflag"
                v-model="manualData.letterValue"
                placeholder="请选择"
                prop="letterValue"
                @change="letterChange">
                <el-option
                  v-for="item in brandData"
                  :key="item"
                  :label="item"
                  :value="item"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="18">
            <el-form-item>
              <el-cascader
                v-if="!letteerflag"
                :options="letteerBy"
                v-model="manualData.selectedOptions3"
                :props="carprops"
                change-on-select
              />
              <a style="font-size:14px;text-decoration:underline" @click="changeLetter">其他</a>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item v-if="letteerflag" label="品牌" prop="fBrand">
          <el-input v-model="manualData.fBrand" placeholder="品牌" maxlength="8" style="width:97%;"/>
        </el-form-item>
        <el-form-item v-if="letteerflag" label="车系">
          <el-input v-model="manualData.fModel" placeholder="车系" maxlength="6" style="width:97%"/>
        </el-form-item>
        <el-form-item v-if="letteerflag" label="车型">
          <el-input v-model="manualData.fType" placeholder="车型" maxlength="6" style="width:97%"/>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="manualData.note" type="textarea" maxlength="200" placeholder="请输入..." style="width:97%" />
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="manualSet('manualData')">确 定</el-button>
        <el-button @click="manualEntrys = false">取 消</el-button>
      </span>
    </el-dialog>
    <div style="border:1px solid #ccc;">
      <el-row :gutter="20" class="carsBox" >
        <el-col :lg="12" :xl="12" :md="12" :xs="12" class="leftBox">
          <div class="grid-content bg-purple">
            <el-table
              v-if="isRouterAlive"
              :row-class-name="tableRowClassName"
              :row-style="selectedHighlight"
              :data="tableData.list"
              :default-sort="{prop: 'date', order: 'descending'}"
              style="width: 100%"
              @row-click="dataClick"
            >
              <el-table-column prop="fPlatenum" label="车牌号/VIN" min-width="70" align="center">
                <template slot-scope="scope">
                  <div>
                    <span v-if="scope.row.businessButton==1" class="lookTips">{{ scope.row.checkCarBrand }}看车</span>{{ scope.row.fPlatenum }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="inDateStr" label="进场时间" sortable min-width="100" align="center"/>
              <el-table-column prop="fBrand" label="品牌" min-width="40" align="center"/>
              <el-table-column prop="fModel" label="车系" min-width="70" align="center"/>
              <el-table-column prop="fColor" label="颜色" min-width="40" align="center"/>
              <el-table-column prop="status" label="在场状态" min-width="40" align="center"/>
              <el-table-column label="操作" min-width="65" align="center">
                <template slot-scope="scope">
                  <button v-if="scope.row.showEditButton==1" class="edit" @click="editCars(scope.row)">编辑</button>
                  <button v-if="scope.row.showEditButton==2" class="noedit">编辑</button>
                </template>
              </el-table-column>
            </el-table>
            <pagination
              v-show="total>0"
              :total="total"
              :pager-count="7"
              :page.sync="listQuery.pageNum"
              :limit.sync="listQuery.limit"
              style="margin-left:-5px;"
              @pagination="carInfoLists"
            />
          </div>
        </el-col>
        <el-col :lg="1" :xl="1" :md="1" :xs="1">
          <p class="dragBtn" style="width:20px;min-height:920px;border-left:1px solid #ccc;border-right:1px solid #ccc;display:flex;justify-content:center" @mousemove="dragMousedown">
            <img style="display:block;width:15px;height:10px;margin-top:300px;" src="../../../assets/images/retract.png" alt>
          </p>
        </el-col>
        <el-col :lg="11" :xl="11" :md="11" :xs="11" style="display:flex;">
          <div class="carsInfo">
            <div v-if="!rightCar" style="min-width:50%;min-height:300px;display:flex;align-items:center;justify-content:center">
              <p>车辆详情信息展示......</p>
            </div>
            <div v-if="rightCar" class="rightCar">
              <div v-show="plateDetails.imgs||plateDetails.outImg" class="imagesBox" >
                <viewer class="up">
                  <img :src="plateDetails.outImg" width="50%" alt height="155">
                  <img :src="plateDetails.imgs" width="50%" alt height="155">
                </viewer>
                <div v-show="plateDetails.carImg" class="down">
                  <viewer v-for="(item,idx) in plateDetails.carImg" :key="idx">
                    <img v-lazy="item" width="50%" alt height="155">
                  </viewer>
                </div>
              </div>
              <div v-show="!plateDetails.imgs&&!plateDetails.outImg" class="imagesBox">
                <img src="../../../assets/images/bgPic.png" width="48%" alt height="155">
                <img src="../../../assets/images/bgPic.png" width="48%" alt height="155">
                <img src="../../../assets/images/bgPic.png" width="48%" alt height="155">
                <img src="../../../assets/images/bgPic.png" width="48%" alt height="155">
                <img src="../../../assets/images/bgPic.png" width="48%" alt height="155">
                <img src="../../../assets/images/bgPic.png" width="48%" alt height="155">
                <img src="../../../assets/images/bgPic.png" width="48%" alt height="155">
              </div>
              <div class="rigthTop">
                <el-row>
                  <el-button v-if="orderFlag&&plateDetails.showStartWorkRevoke==4" type="primary" style="margin-top:20px" @click="updateStartworks">变更接待</el-button>
                </el-row>
                <el-row>
                  <el-button v-if="orderFlag&&plateDetails.showStartWorkRevoke==3" type="primary" style="margin-top:20px" @click="showOrderBtn">接待确认</el-button>
                </el-row>
                <el-row>
                  <el-button v-if="orderFlag&&plateDetails.showStartWorkRevoke==2" type="info" style="margin-top:20px">接待确认</el-button>
                </el-row>
                <el-row>
                  <el-button v-if="orderFlag&&plateDetails.showStartWorkRevoke==1" type="primary" style="margin-top:20px" @click="removkeworked">撤销接待</el-button>
                </el-row>

                <el-row>
                  <el-button v-if="tryFlag&&plateDetails.showTrialRunCarButton==3" type="primary" style="margin-top:10px" @click="tryCarFlag = true">临时离场</el-button>
                </el-row>
                <el-row>
                  <el-button v-if="tryFlag&&plateDetails.showTrialRunCarButton==2" type="info" style="margin-top:10px">临时离场</el-button>
                </el-row>
                <el-row>
                  <el-button v-if="tryFlag&&plateDetails.showTrialRunCarButton==1" type="primary" style="margin-top:10px" @click="untryCarFlag">撤销离场</el-button>
                </el-row>
                <el-row>
                  <el-button v-if="financialFlag && plateDetails.showRevoke==3" type="primary" style="margin-top:10px" @click="FinancialFlag">财务结算</el-button>
                </el-row>
                <el-row>
                  <el-button v-if="financialFlag &&plateDetails.showRevoke==2" type="info" style="margin-top:10px">财务结算</el-button>
                </el-row>
                <el-row>
                  <el-button v-if="financialFlag &&plateDetails.showRevoke==1" type="primary" style="margin-top:10px" @click="undo">撤销结算</el-button>
                </el-row>
                <el-row>
                  <el-button v-if ="saleStatusFlag&&plateDetails.showAouthRevoke==3" type="primary" style="margin-top:10px" @click="dialogVisibleInfo">电子放行单</el-button>
                </el-row>
                <el-row>
                  <el-button v-if ="saleStatusFlag&&plateDetails.showAouthRevoke==2" type="info" style="margin-top:10px">电子放行单</el-button>
                </el-row>
                <el-row>
                  <el-button v-if ="saleStatusFlag&&plateDetails.showAouthRevoke==1" type="primary" style="margin-top:10px" @click="undoSale">撤销放行</el-button>
                </el-row>
                <el-row>
                  <el-button v-if="outFlag&&plateDetails.handleave=='1'" type="primary" style="margin-top:10px" @click="Handout">手动离场</el-button>
                </el-row>
                <el-row>
                  <el-button v-if="outFlag&&plateDetails.handleave=='2'" type="info" style="margin-top:10px">手动离场</el-button>
                </el-row>
                <ul class="rightlist">
                  <li><span>车牌号：</span>{{ plateDetails.DetailsNumber }}</li>
                  <li><span>品牌：</span>{{ plateDetails.DetailBrand }}</li>
                  <li><span>车系：</span>{{ plateDetails.carsType }}</li>
                  <li><span>车型：</span>{{ plateDetails.DetailsType }}</li>
                  <li><span>颜色：</span>{{ plateDetails.DetailsColor }}</li>
                  <li><span>接待人：</span>{{ plateDetails.fWorker }}</li>
                  <li><span>业务类型：</span>{{ plateDetails.VehicleType }}<time v-if="plateDetails.VehicleType==='临时离场'">（{{ plateDetails.fAuthorizedReason }}）</time></li>
                  <li><span>是否预约：</span>{{ plateDetails.fReserveStatus }}</li>
                  <li><span>入场时间：</span>{{ plateDetails.inDateStr }}</li>
                  <li><span>离场时间：</span>{{ plateDetails.PlayingTime }}</li>
                  <li v-if="insCar">内部车辆不需要审核</li>
                  <!-- <span>{{ plateDetails.saleStatus }}授权离场：{{ plateDetails.ifsale }}</span> -->
                  <li v-if="!insCar"><span>电子放行单：</span>{{ plateDetails.ifsale }}</li>
                  <li v-if="!insCar"><span>财务结算：</span>{{ plateDetails.Financial }}</li>
                  <li><span>在场状态：</span>{{ plateDetails.fPresenceStatus }}</li>
                  <li><span>是否接待：</span>{{ plateDetails.fWorkStatus }}</li>
                  <li><span>备注：</span>{{ plateDetails.showRemarks }}</li>
              </ul></div>
              <el-dialog
                :visible.sync="dialogVisible"
                width="40%"
              >
                <div slot="title" class="border-bottom:1px solid #ccc!important">电子放行单</div>
                <el-form ref="authorization" :model="authorization" :rules="dialogRules" label-width="110px">
                  <el-form-item label="车牌号/VIN">
                    <el-input v-model="authorization.fPlatenum" disabled style="width:97%" placeholder="请输入车牌号"/>
                  </el-form-item>
                  <el-form-item label="姓名">
                    <el-input v-model="authorization.name" style="width:97%;" maxlength="5" placeholder="请输入姓名"/>
                  </el-form-item>
                  <el-form-item label="手机号">
                    <el-input v-model="authorization.phone" style="width:97%" maxlength="11" placeholder="请输入手机号"/>
                  </el-form-item>
                  <el-form-item label="性别" style="width:69%">
                    <el-select v-model="authorization.gender" placeholder="请选择">
                      <el-option
                        v-for="item in genderData"
                        :key="item.id"
                        :label="item.label"
                        :value="item.id"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="接待人">
                    <el-input v-model="authorization.fWorker" :disabled="fWorkerFlag" style="width:97%" placeholder="请输入接待人姓名"/>
                  </el-form-item>

                  <el-form-item label="里程表信息">
                    <el-input v-model.number="authorization.fInMileage" placeholder="请输入里程表信息" maxlength="10" style="width:69%"/>&nbsp;km
                  </el-form-item>
                  <el-form-item label="备注">
                    <el-input v-model="authorization.note" type="textarea" style="width:97%" placeholder="请输入..."/>
                  </el-form-item>
                  <el-form-item v-show="ApprovalShow" label="主管审核">
                    <el-select v-model="Approval" placeholder="请选择">
                      <el-option
                        v-for="item in fApproval"
                        :key="item.id"
                        :label="item.label"
                        :value="item.id"
                      />
                    </el-select>
                  </el-form-item>
                  <p style="color:red;margin-left:100px;">请注意：</p>
                  <p style="color:red;margin-left:110px;">1、请您审核驾驶员是否得到车主授权</p>
                  <p style="color:red;margin-left:110px;">2、请您审核车辆是否完成维修订单结算</p>
                </el-form>
                <span slot="footer" class="dialog-footer">
                  <el-button type="primary" @click="dialogVisibleBtn('authorization')">确 定</el-button>
                  <el-button @click="dialogVisible = false">取 消</el-button>
                </span>
              </el-dialog>

              <el-dialog
                :visible.sync="FinancialDataFlag"
                title="财务结算"
                width="40%"
              >
                <p style="text-align:center;font-size:18px;color:#303133">是否已结算?</p>
                <el-form label-width="60px">
                  <el-form-item label="车牌号">
                    <el-input v-model="plateDetails.DetailsNumber" disabled type="text" style="width:97%;" maxlength="200" placeholder="请输入..."/>
                  </el-form-item>
                  <el-form-item label="工单号">
                    <el-input v-model="plateDetails.AfterSaleCode" disabled type="text" style="width:97%;" maxlength="200" placeholder="请输入..."/>
                  </el-form-item>
                  <el-form-item label="备注">
                    <el-input v-model="FinancialNote" type="textarea" style="width:97%;" maxlength="200" placeholder="请输入..."/>
                  </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                  <el-button type="primary" @click="FinancialBtn">确 定</el-button>
                  <el-button @click="FinancialDataFlag = false">取 消</el-button>
                </span>
              </el-dialog>
              <el-dialog
                :visible.sync="showOrderFlag"
                :title="dialogText[dialogStatus]"
                width="40%"
              >
                <el-form ref="order" :model="order" :rules="dialogRules" label-width="100px">
                  <el-form-item label="车牌号/VIN">
                    <el-input v-model="order.plateNumber" disabled style="width:97%" maxlength="17" placeholder="请输入车牌号"/>
                  </el-form-item>
                  <el-form-item label="姓名">
                    <el-input v-model="order.name" placeholder="请输入姓名" maxlength="4" style="width:97%;"/>
                  </el-form-item>
                  <el-form-item label="手机号">
                    <el-input v-model="order.phone" placeholder="请输入手机号" maxlength="11" style="width:97%;"/>
                  </el-form-item>
                  <el-form-item label="性别">
                    <el-select v-model="order.gender" placeholder="请选择" style="width:69%" @change="orderGender">
                      <el-option
                        v-for="item in genderData"
                        :key="item.id"
                        :label="item.label"
                        :value="item.id"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="业务人员" >
                    <el-input v-model="order.userRealName" :disabled="userRealNameFlag" placeholder="请输入业务人员姓名" maxlength="7" style="width:69%" />
                  </el-form-item>
                  <el-form-item label="里程表信息">
                    <el-input v-model.number="order.fInMileage" placeholder="请输入里程表信息" maxlength="10" style="width:69%"/>&nbsp;km
                  </el-form-item>
                  <el-form-item label="业务类型" prop="optsGrantLeave">
                    <el-select v-model="order.optsGrantLeave" filterable placeholder="请选择" style="width:69%" >
                      <el-option
                        v-for="item in optsGrantLeave"
                        :key="item.code"
                        :label="item.value"
                        :value="item.code"
                      />
                    </el-select>
                  </el-form-item >
                  <el-form-item v-show="order.optsGrantLeave == 'operationparkafterSale'" label="维修工单号">
                    <el-input v-model="order.AfterSaleCode" style="width:97%" placeholder="维修工单号"/>
                  </el-form-item>
                  <el-form-item v-show="order.optsGrantLeave == 'operationparkafterSale'" label="流水号">
                    <el-input v-model="order.fAfterFlowCode" style="width:97%" placeholder="流水号"/>
                  </el-form-item>
                  <el-form-item label="备注">
                    <el-input v-model="order.note" type="textarea" style="width:97%;" maxlength="200" placeholder="请输入..."/>
                  </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                  <el-button type="primary" @click="dialogStatus==='create'?orderTrue('order'):updatetrue('order')">确 定</el-button>
                  <el-button @click="showOrderFlag = false">取 消</el-button>
                </span>
              </el-dialog>
              <el-dialog
                :visible.sync="byBrand"
                title="选择品牌"
                width="40%"
              >
                <el-form :model="order" label-width="80px">
                  <el-form-item label="选择品牌">
                    <el-select v-model="queryshopfilter" value-key="value" placeholder="请选择" style="width:69%" >
                      <el-option
                        v-for="(item, index) in queryshopfilterData"
                        :key="index"
                        :label="item.value"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item >
                </el-form>
                <span slot="footer" class="dialog-footer">
                  <el-button type="primary" @click="SetBrand">确 定</el-button>
                  <el-button @click="byBrand = false">取 消</el-button>
                </span>
              </el-dialog>
              <el-dialog
                :visible.sync="oneOut"
                title="手动离场"
                width="40%"
              >
                <el-form :model="order" label-width="80px">
                  <p style="text-align:center;color:#000;">主管未审核，是否继续放行？</p>
                  <el-form-item label="业务类型">
                    <el-select v-model="fCarLiftingRodType" placeholder="请选择" style="width:97%" >
                      <el-option
                        v-for="item in oneTypes"
                        :key="item"
                        :label="item"
                        :value="item"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item v-if="fCarLiftingRodType==='其他'" label="其他">
                    <el-input v-model="fOtherRemarks" type="textarea" maxlength="200" placeholder="请输入..." style="width:97%" />

                  </el-form-item>
                  <el-form-item label="备注">
                    <el-input v-model="oneRemarks" type="textarea" maxlength="200" placeholder="请输入..." style="width:97%" />
                  </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                  <el-button type="primary" @click="oneoutaT">确 定</el-button>
                  <el-button @click="oneOut = false">取 消</el-button>
                </span>
              </el-dialog>
              <el-dialog
                :visible.sync="tryCarFlag"
                title="临时离场"
                width="40%"
              >
                <el-form ref="trialdriver" :model="trialdriver" :rules="dialogRules" label-width="96px">
                  <el-form-item label="驾驶员姓名" prop="drivername">
                    <el-input v-model="trialdriver.drivername" placeholder="请输入驾驶员姓名" maxlength="4" style="width:97%"/>
                  </el-form-item>
                  <el-form-item label="手机号">
                    <el-input v-model="trialdriver.phone" placeholder="请输入驾驶员手机号" maxlength="11" style="width:97%"/>
                  </el-form-item>
                  <el-form-item label="性别">
                    <el-select v-model="trialdriver.gender" placeholder="请选择" style="width:69%">
                      <el-option
                        v-for="item in genderData"
                        :key="item.id"
                        :label="item.label"
                        :value="item.id"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="里程表信息">
                    <el-input v-model.number="trialdriver.fInMileage" placeholder="请输入里程表信息" maxlength="12" style="width:69%"/>&nbsp;km
                  </el-form-item>
                  <el-form-item label="离场原因" prop="fAuthorizedReason">
                    <el-select v-model="trialdriver.fAuthorizedReason" placeholder="请选择" style="width:69%">
                      <el-option
                        v-for="item in fAuthorizedReason"
                        :key="item"
                        :label="item"
                        :value="item"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item :prop="trialdriver.fAuthorizedReason==='其他'?'fTrialdriverRemarks':''" label="备注">
                    <el-input v-model="trialdriver.fTrialdriverRemarks" type="textarea" maxlength="200" style="width:97%" placeholder="请输入..."/>
                  </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                  <el-button type="primary" @click="setTryCar('trialdriver')">确 定</el-button>
                  <el-button @click="tryCarFlag = false">取 消</el-button>
                </span>
              </el-dialog>
              <el-dialog
                :visible.sync="oneleaveFlag"
                title="手动离场"
                width="30%">
                <span>是否让该车离场?</span>
                <span slot="footer" class="dialog-footer">
                  <el-button type="primary" @click="setOne">确 定</el-button>
                  <el-button @click="oneleaveFlag = false">取 消</el-button>
                </span>
              </el-dialog>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import { getToken } from '@/utils/auth'
import Pagination from '@/components/Pagination'
import elTree from './components/selectTree'
import { mapGetters } from 'vuex'
import Cookies from 'js-cookie'
import ReconnectingWebSocket from '@/utils/ReconnectingWebsocket'
import {
  getCarInfo,
  carInfoList,
  queoneCar,
  colorinfo,
  brandinfo,
  modelinfo,
  typeinfo,
  authorization,
  financial,
  onecurrent,
  saleApproval,
  oneCar,
  updateone,
  manualentry,
  handOut,
  leaveOne,
  setstayout,
  setOrder,
  financialrevoke,
  trialdrivers,
  authocurrent,
  handLeave,
  forcestartwork,
  aouthRevoke,
  removkeStartwork,
  letter,
  byletter,
  removkeDriver,
  queryshopfilter,
  updatequickBrand,
  updateStartwork,
  batchcleanOut,
  OssImg
} from '@/api/car'
export default {
  components: { Pagination, elTree },
  data() {
    var fInMileage = (rule, value, callback) => {
      var reg = /^[1-9]+[0-9]*]*$/
      if (value !== '') {
        if (!reg.test(value)) {
          callback(new Error('请输入正确的数字格式'))
        } else {
          callback()
        }
      }
    }
    var phone = (rule, value, callback) => {
      var reg = /^\d{11}$/
      if (value !== '') {
        if (!reg.test(value)) {
          callback(new Error('请输入正确的手机号格式'))
        } else {
          callback()
        }
      }
    }
    var selectedOptions3 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请选择车的品牌、车系'))
      } else {
        callback()
      }
    }
    return {
      labelPosition: 'right',
      filterL: 16,
      filterR: 8,
      xl: 11,
      xr: 13,
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近六个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 180)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      dialogRules: {
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        drivername: [{ required: true, message: '请输入驾驶员姓名', trigger: 'blur' }],
        phone: [
          { trigger: 'blur' },
          { validator: phone, trigger: 'blur' }
        ],
        plateVin: [
          { min: 7, max: 17, message: '车牌最少为7位，VIN为17位', trigger: 'blur' },
          { required: true, message: '请输入车牌号/VIN', trigger: 'blur' }
          // { pattern: /^[A-Za-z0-9]([/])+$/, message: '请输入正确的车牌号/VIN格式' }
        ],
        fInMileage: [
          { validator: fInMileage, trigger: 'blur' }
        ],
        selectedOptions3: [
          { validator: selectedOptions3, trigger: 'blur' }
        ],
        fBrand: [{ required: true, message: '请输入品牌', trigger: 'blur' }],
        fTrialdriverRemarks: [{ required: true, message: '请输入备注', trigger: 'blur' }],
        optsGrantLeave: [{ required: true, message: '请选择业务类型', trigger: 'change' }],
        fAuthorizedReason: [{ required: true, message: '请选择离场原因', trigger: 'change' }],
        letterValue: [{ required: true, message: '请选择品牌', trigger: 'change' }],
        carInfoRemarks: [{ required: true, message: '请填写备注', trigger: 'blur' }]
      },
      treedialog: false,
      moreInfo: false,
      colorFlag: false,
      colorFlags: true,
      isRouterAlive: true,
      testpages: 100,
      rightCar: false,
      name: 'cars',
      carNums: '',
      carBrandS: '',
      cartypes: '',
      fAid: '',
      totalEntrance: '',
      appointInCarCount: '',
      bookingVehicleCount: '',
      totalAppearance: '',
      afterSales: '',
      beforeSales: '',
      others: 15,
      tryCars: 10,
      submitonly: true,
      formInline: {
        plateNumber: '',
        color: '',
        type: '',
        brand: '',
        model: '',
        fPresenceStatus: [
          { key: 1, value: '在场' },
          { key: 2, value: '离场' }
        ]
      },
      carStoreid: '',
      carStoreName: '',
      leftMove: '',
      Datealue: '',
      plateDetails: {
        fId: '',
        fCurrentId: '',
        DetailsNumber: '京M1234',
        DetailBrand: '奔驰',
        carsType: 'GLA',
        DetailsColor: '红色',
        DetailsType: '',
        VehicleType: '',
        inDateStr: '2019-03-21 16:21:31',
        PlayingTime: '2019-03-21 15:21:31',
        currentState: '是',
        Financial: '否',
        saleStatus: '',
        ifsale: '',
        currentId: '',
        fPresenceStatus: '',
        fWorkStatus: '',
        showAouthRevoke: '',
        imgs: [],
        outImg: [],
        carImg: [],
        fFinancialSettlement: '',
        showRemarks: '', // 备注字段
        fReserveStatus: '',
        fDealerCode: '',
        fWorker: ''// 开单人
      },
      dialogVisible: false, // 授权出场
      tryDrive: false, // 试乘试驾 Dialog
      oneleaveFlag: false, // 单个车辆离场
      authorization: {
        name: '',
        phone: '',
        fPlatenum: '',
        fInMileage: '',
        fWorker: '',
        gender: '',
        note: ''
      },
      tableData: {
        list: [],
        pages: '',
        pageNum: '',
        pageSize: '',
        currentPage: 1
      },
      options: [{
        code: 'operationparkBeforeSale',
        value: '销售',
        type: 'seltype'
      }, {
        code: 'operationparkafterSale',
        value: '售后需结算',
        type: 'seltype'
      },
      {
        code: 'operationparkafterSaleNoSettlement',
        value: '售后未成交离场',
        type: 'seltype'
      },
      {
        code: 'operationparkothers',
        value: '其他',
        type: 'seltype'
      },
      {
        code: 'operationparkmainteDrive',
        value: '临时离场',
        type: 'selbtn'
      }, {
        code: 'operationManualEntry',
        value: '手动进场',
        type: 'selbtn'
      }, {
        code: 'operationManualExit',
        value: '手动离场',
        type: 'selbtn'
      }, {
        code: 'operationTestDriverStartWork',
        value: '试驾试乘开单',
        type: 'selbtn'
      }, {
        code: 'operationparkupdatereception',
        value: '接待人可编辑权限',
        type: 'selbtn'
      }, {
        code: 'opreationInCarStartWork',
        value: '接待确认',
        type: 'selbtn'
      }, {
        code: 'operationparkfinancialAudit',
        value: '财务审核',
        type: 'selbtn'
      },
      {
        code: 'opreationAuthorizedAppearance',
        value: '授权出场审核',
        type: 'selbtn'
      },
      {
        code: 'operationParkingDataExport',
        value: '导出',
        type: 'selbtn'
      },
      {
        code: 'operationParkingMarkOut',
        value: '标记离场',
        type: 'selbtn'
      }
      ],
      impower: '',
      arcodes: '',
      optsGrantLeave: [],
      optsBtn: [],
      optsBtnCode: [],
      pageShow: true,
      insCar: false,
      tryDriveBtns: false,
      tryDriveCars: [], // 试乘试驾车辆信息
      platenums: '', // 试乘试驾车牌号
      gender: '',
      genders: '',
      genderData: [{
        id: '2',
        label: '男'
      }, {
        id: '3',
        label: '女'
      }],
      fApproval: [
        {
          id: '1',
          label: '通过'
        }, {
          id: '3',
          label: '不需要审核'
        }
      ],
      Approval: '',
      ApprovalShow: false,
      btnFlagData: [],
      listQuery: {
        pageNum: 1,
        limit: 10,
        sort: '+id',
        fPlatenum: '',
        fColor: '',
        fBrand: '',
        fModel: '',
        fType: '',
        fPresenceStatus: ''

      },
      total: 0,
      defaultProps: {
        children: 'children',
        label: 'organizationName',
        isLeaf: 'leaf'
      },
      FinancialDataFlag: false,
      FinancialNote: '',
      userToken: this.$store.state.user.token,
      showOrderFlag: false,
      byBrand: false,
      queryshopfilterData: [],
      queryshopfilter: '',
      order: {
        plateNumber: '',
        plateVin: '',
        userRealName: '',
        name: '',
        phone: '',
        fInMileage: '',
        gender: '',
        optsGrantLeave: '',
        note: '',
        carType: [{
          id: '1',
          label: '事故车'
        }, {
          id: '2',
          label: '无牌车照'
        }
        ],
        typeData: '',
        outReason: '',
        genderData: ''
      },
      editShow: false,
      editData: {
        plateVin: '',
        fBrand: '',
        fColor: '',
        fModel: '',
        fId: '',
        fType: ''
      },
      manualEntrys: false,
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
      manualFlag: false, // 保安权限---手动进场
      outFlag: false, // 手动出场
      orderFlag: false, // 开工单的权限
      tryCarflag: false, // 试乘按钮控制
      tryCarFlag: false, // 试乘试驾权限
      financialFlag: false, // 财务审核按钮
      saleStatusFlag: false, // 审核出场
      saleStatusFlagN: false,
      tryFlag: false, // 维修试乘审核
      exportCarFlag: false,
      pointFlag: false, // 标记离场
      showInp: false,
      handOuts: false,
      HandoutData: {
        plateNumber: '',
        fAid: ''
      },
      handOut: false,
      oneOut: false,
      firstEntryShow: false,
      manualout: {
        passInCar: '',
        plateVin: '',
        InCarData: '',
        note: ''
      },
      trialdriver: {
        fInMileage: '',
        fTrialdriverRemarks: '',
        drivername: '',
        phone: '',
        gender: '',
        genderD: '',
        fAuthorizedReason: ''
      },
      fAuthorizedReason: ['维修试车', '移库', '其他'],
      getIndex: '',
      fLeaveRemarks: '',
      oneRemarks: '',
      oneTypes: ['售后', '看车', '其他'],
      letterBrand: '',
      fCarLiftingRodType: '',
      fOtherRemarks: '',
      websock: null,
      carsModel: false,
      letterData: [],
      letterValue: '',
      letteerBy: [],
      carprops: {
        value: 'fBrand',
        label: 'fBrand',
        children: 'children'
      },
      letteerflag: false,
      letterDis: false,
      editLetter: true,
      editColor: true,
      userRealNameFlag: true,
      fWorkerFlag: false,
      dialogText: {
        update: '变更接待',
        create: '接待确认'
      },
      brandTxt: '',
      brandData: [],
      dialogStatus: '',
      y: 0,
      isDown: false,
      l: 0,
      lockReconnect: false, // 是否真正建立连接
      timeout: 28 * 1000, // 30秒一次心跳
      timeoutObj: null, // 心跳心跳倒计时
      serverTimeoutObj: null, // 心跳倒计时
      seltree: '',
      pointTip: false,
      Markorder: {
        carInfoRemarks: ''
      }
    }
  },
  computed: {
    ...mapGetters([
      'orgtree',
      'userRealName',
      'organizationId',
      'organizationName',
      'organizationChain',
      'selectOrgTree'
    ])
  },
  watch: {
    selectOrgTree: {
      handler(val, oldVal) {
      },
      immediate: true
    }
  },
  mounted() {},
  created() {
    this.btnFlag()
    this.authorizations()// 获取权限
    this.storeTree()
    this.initWebSocket()
    this.letters()
    this.queryshopfilters()
  },
  methods: {
    storeTree() {
      if (localStorage.getItem('carStoreName')) {
        console.log('localStorage', localStorage.getItem('carStoreName'))
        this.carStoreName = localStorage.getItem('carStoreName')
        this.carStoreid = localStorage.getItem('carStoreid')
      } else {
        if (this.selectOrgTree) {
          this.carStoreName = this.getFirstOrganizationName(this.selectOrgTree)
          this.carStoreid = this.getFirstOrganizationId(this.selectOrgTree)
          localStorage.setItem('carStoreid', this.carStoreid)
          localStorage.setItem('carStoreName', this.carStoreName)
        }
      }
      this.carInfoLists()
      this.getCarInfos()
      this.colorinfos()
      this.brandinfos()
      this.modelinfos()
      this.typeinfos()
    },
    selectloc(obj) {
      this.treedialog = false
      if (obj) {
        this.carStoreid = obj.organizationAddressCode
        this.carStoreName = obj.organizationName
        localStorage.setItem('carStoreName', obj.organizationName)
        localStorage.setItem('carStoreid', obj.organizationAddressCode)
        this.rightCar = false
        this.getCarInfos()
        this.carInfoLists()
        this.colorinfos()
        this.brandinfos()
        this.modelinfos()
        this.typeinfos()
        this.treedialog = false
      }
    },
    dragMousedown(e) {
      var box = document.querySelector('.carsBox')
      var leftBox = document.querySelector('.leftBox')
      var rightBox = document.querySelector('.carsInfo')
      var dragBtn = document.querySelector('.dragBtn')
      dragBtn.onmousedown = function(e) {
        var startX = e.clientX
        dragBtn.left = dragBtn.offsetLeft
        document.onmousemove = function(e) {
          var endX = e.clientX
          var moveLen = dragBtn.left + (endX - startX)
          var maxT = box.clientWidth - dragBtn.offsetWidth
          if (moveLen < 150) moveLen = 150
          if (moveLen > maxT - 150) moveLen = maxT - 150

          dragBtn.style.left = moveLen
          leftBox.style.width = moveLen + 'px'
          rightBox.style.width = (box.clientWidth - moveLen - 5) + 'px'
        }
        document.onmouseup = function(evt) {
          console.log('mouseup')
          document.onmousemove = null
          document.onmouseup = null
          dragBtn.releaseCapture && dragBtn.releaseCapture()
        }
        dragBtn.setCapture && dragBtn.setCapture()
        return false
      }
    },
    firstShow() {
      this.firstEntryShow = true
      this.resetOrder()
      this.$nextTick(() => {
        this.$refs['order'].clearValidate()
      })
    },
    resetManualData() {
      this.manualData = {
        fPlatenum: '',
        fColor: '',
        fBrand: '',
        fModel: '',
        fCurrentId: '',
        fPresenceStatus: '',
        fType: '',
        plateVin: '',
        queryshopfilter: '',
        selectedOptions3: [],
        carColor: ['黑色', '白色', '银色', '红色', '蓝色', '橘色', '黄色', '紫色']

      }
      this.$nextTick(() => {
        this.$refs['manualData'].clearValidate()
      })
    },
    searchL() {
      this.submit()
    },
    letters() {
      letter().then(res => {
        this.letterData = res.data
      })
    },
    changeLetter() {
      var reg = new RegExp('[\\u4E00-\\u9FFF]+', 'g')
      if (reg.test(this.manualData.letterValue)) { this.letterBrand = this.manualData.letterValue }
      this.letteerflag = !this.letteerflag
      this.manualData.fBrand = this.manualData.selectedOptions3[0] || this.letterBrand
      if (this.manualData.selectedOptions3[1]) {
        this.manualData.fModel = this.manualData.selectedOptions3[1].split('/')[0]
        this.manualData.fType = this.manualData.selectedOptions3[1].split('/')[1]
      }
    },
    colorChange() {
      this.colorFlag = !this.colorFlag
    },
    letterChange(val) {
      var reg = new RegExp('[\\u4E00-\\u9FFF]+', 'g')
      if (reg.test(val)) {
        this.letterBrand = val
        this.editData.fBrand = val
      }
      byletter({ letter: val }).then(res => {
        this.letteerBy = res.data
        this.letteerflag = false
      })
    },
    handleChange(val) {
      this.editData.fBrand = this.manualData.selectedOptions3[0]
      if (this.manualData.selectedOptions3[1]) {
        this.editData.fModel = this.manualData.selectedOptions3[1].split('/')[0]
        this.editData.fType = this.manualData.selectedOptions3[1].split('/')[1]
      }
    },
    letteerother() {
      this.letteerflag = !this.letteerflag
      this.letterValue = ''
      this.letterDis = false
      this.manualData.selectedOptions3 = []
    },
    selectedHighlight({ row, rowIndex }) {
      if ((this.getIndex) === rowIndex) {
        return {
          'background-color': '#ebeef5'
        }
      }
    },
    btncolorFlag() {
      this.editColor = !this.editColor
      // this.letterDis = !this.letterDis
    },
    tableRowClassName({ row, rowIndex }) {
      // 把每一行的索引放进row
      row.index = rowIndex
    },
    showTree() {
      this.treedialog = true
    },
    getFirstOrganizationName(orgtree) {
      return (orgtree[0].children && orgtree[0].children.length) ? this.getFirstOrganizationName(orgtree[0].children) : orgtree[0].organizationName
    },
    getFirstOrganizationId(orgtree) {
      // console.log(orgtree[0].organizationAddressCode)
      return (orgtree[0].children && orgtree[0].children.length) ? this.getFirstOrganizationId(orgtree[0].children) : orgtree[0].organizationAddressCode
    },

    btnFlag() {
      this.options.forEach(val => {
        this.btnFlagData.push(val.code)
      })
    },

    formatter(row, column) {
      return row.address
    },
    // 渲染汽车的颜色           --过滤筛选
    colorinfos() {
      colorinfo({ fAid: this.carStoreid }).then(res => {
        if (res.code === 0) {
          this.formInline.color = res.data
        }
      })
    },
    // 渲染汽车的品牌
    brandinfos() {
      brandinfo({ fAid: this.carStoreid }).then(res => {
        if (res.code === 0) {
          this.formInline.brand = res.data
        }
      })
    },
    // 渲染汽车的款式
    modelinfos() {
      modelinfo({ fAid: this.carStoreid }).then(res => {
        this.formInline.model = res.data
      })
    },
    // 渲染汽车的类型
    typeinfos() {
      typeinfo({ fAid: this.carStoreid }).then(res => {
        this.formInline.type = res.data
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
              fBrand: this.manualData.selectedOptions3[0] || this.brandData[0] || this.brandData[1],
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
              fBrand: this.manualData.fBrand || '' || this.letterBrand ,
              fModel: this.manualData.fModel || '',
              fType: this.manualData.fType || '',
              fIntoRemarks: this.manualData.note,
              fAid: this.carStoreid
            }
          }
          manualentry(data || datas).then(res => {
            this.manualEntrys = false
            this.carInfoLists()
            this.$message({
              type: 'success',
              message: res.msg
            })
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    manualoutSet(manualout) {
      this.$refs[manualout].validate((valid) => {
        if (valid) {
          console.log(this.carStoreid)
          var data = {
            token: this.userToken,
            fAid: this.carStoreid,
            fLeaveRemarks: this.manualout.note,
            fPlatenum: this.manualout.plateVin
          }
          setstayout(data).then(res => {
            this.handOuts = false
            if(res.code === 0) {
              this.carInfoLists()
            }else if (res.data.flag === 10) {
              this.byBrand = true
              this.queryshopfilters()
              Cookies.set('byBrand',2) 
            }else if (res.data.flag === 9) {
              this.handOut = true
              this.resetHandout()
              this.HandoutData.plateNumber = res.data.fPlatenum
              this.HandoutData.fAid = res.data.fAid
            }
           
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetHandout() {
      this.fCarLiftingRodType = ''
      this.fOtherRemarks = ''
      this.fLeaveRemarks = ''
    },
    manualoutaA() {
      handLeave({ fOtherRemarks: this.fOtherRemarks, fCarLiftingRodType: this.fCarLiftingRodType, fLeaveRemarks: this.fLeaveRemarks, fAid: this.HandoutData.fAid, fPlatenum: this.HandoutData.plateNumber, token: this.userToken }).then(res => {
        this.handOut = false
        this.carInfoLists()
        this.dataClick(this.plateDetails)
        console.log(this.plateDetails)
      }).catch(e=>{
        this.$message({
          type:'error',
          message:e.msg
        })
      })
    },
    firstouts(order) {
      this.$refs[order].validate((valid) => {
        if (valid) {
          this.firstEntryShow = false
          if (this.order.optsGrantLeave === 'operationparkBeforeSale') {
            this.impower = 3
          }
          if (this.order.optsGrantLeave === 'operationparkafterSale') {
            this.impower = 2
          }
          if (this.order.optsGrantLeave === 'operationparkmainteDrive') {
            this.impower = 5
          }
          if (this.order.optsGrantLeave === 'operationparkafterSaleNoSettlement') {
            this.impower = 28
          }
          if(this.order.optsGrantLeave === 'operationparkothers') {
            this.impower = 6
          }
          if (this.order.gender === '未填写') {
            this.order.genderData === 1
          }
          if (this.order.gender === '男') {
            this.order.genderData === 2
          }
          if (this.order.gender === '女') {
            this.order.genderData === 3
          }
          var data = {
            token: this.userToken,
            fAid: this.carStoreid,
            fPlatenum: this.order.plateVin,
            fOrderType: this.impower,
            fInMileage: this.order.fInMileage,
            fStartWorkName: this.order.name,
            fStartWorkPhone: this.order.phone,
            fStartWorkGender: this.order.genderData,
            fAfterSaleCode: this.order.AfterSaleCode,
            fStartWorkRemarks: this.order.note,
            fAfterFlowCode: this.order.fAfterFlowCode,
            fWorker: this.userRealName
          }
          forcestartwork(data).then(res => {
            if (res.data.flag && res.data.flag === 2) {
              this.updateStartworks()
            }
            if (res.msg == '操作成功') {
              this.carInfoLists()
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    submitS() {
      this.moreInfo = !this.moreInfo
      // this.formInline.plateNumber = ''
      this.listQuery.fColor = ''
      this.listQuery.fBrand = ''
      this.listQuery.fModel = ''
      // this.Datealue = ''
      this.listQuery.fPresenceStatus = ''
    },
    // 提交筛选信息
    submit() {
      function checkTime(i) {
        if (i < 10) {
          i = '0' + i
        }
        return i
      }
      var startTime = ''; var endTime = ''
      if (this.Datealue) {
        var date = new Date(this.Datealue[0])
        var date1 = new Date(this.Datealue[1])
        startTime = date.getFullYear() + '-' + checkTime(date.getMonth() + 1) + '-' + checkTime(date.getDate()) + ' ' + checkTime(date.getHours()) + ':' + checkTime(date.getMinutes()) + ':' + checkTime(date.getSeconds())
        endTime = date1.getFullYear() + '-' + checkTime((date1.getMonth() + 1)) + '-' + checkTime(date1.getDate()) + ' ' + checkTime(date1.getHours()) + ':' + checkTime(date1.getMinutes()) + ':' + checkTime(date1.getSeconds())
      } else {
        startTime = ''
        endTime = ''
      }
      this.listQuery.checkTimeBefore = startTime || ''
      this.listQuery.checkTimeAfter = endTime || ''
      this.carInfoLists()
      this.getCarInfos()
    },
    // 汽车店铺当日的车辆信息
    getCarInfos() {
      getCarInfo({ fAid: this.carStoreid, organizationChain: this.organizationChain,sameDayBefore:this.Datealue[0], sameDayAfter:this.Datealue[1]}).then(res => {
        if (res.code === 0) {
          this.carBrandS = res.data.carBrand
          this.carNums = res.data.vehiclesOnTheSpotCount
          this.totalEntrance = res.data.admissionCount
          this.totalAppearance = res.data.appearanceCount
          this.afterSales = res.data.afterSaleVehicleCount
          this.beforeSales = res.data.preSaleVehicleCount
          this.appointInCarCount = res.data.appointInCarCount
          // this.others = res.data.toBeConfirmedCount
          this.tryCars = res.data.trialDrivingExitCount
          this.bookingVehicleCount = res.data.bookingVehicleCount
        }
      })
    },
    editCars(row) {
      this.editData.fId = row.fId
      oneCar({ fId: this.editData.fId }).then(res => {
        this.letters()
        this.queryshopfilters()
        this.manualData.selectedOptions3 = []
        this.letterValue = ''
        this.editShow = true
        this.editData.plateVin = res.data.fPlatenum
        this.editData.fColor = res.data.fColor
        this.editData.fBrand = res.data.fBrand
        this.editData.fModel = res.data.fModel
        this.editData.fType = res.data.fType
        this.editData.fCarInfoRemarks=res.data.fCarInfoRemarks
      })
    },
    editTrue(editData) {
      this.$refs[editData].validate((valid) => {
        if (valid) {
          /* eslint-disable */if (this.manualData.selectedOptions3.length != 0) {
            var arr = this.manualData.selectedOptions3[1].split('/')
            var data = {
              fPlatenum: this.editData.plateVin,
              fColor: this.editData.fColor,
              fBrand: this.manualData.selectedOptions3[0],
              fModel: arr[0],
              fId: this.editData.fId,
              fType: arr[1],
              fCarInfoRemarks:this.editData.fCarInfoRemarks
            }
          } else {
            var datas = {
              fPlatenum: this.editData.plateVin,
              fColor: this.editData.fColor,
              fBrand: this.editData.fBrand,
              fModel: this.editData.fModel,
              fId: this.editData.fId,
              fType: this.editData.fType,
              fCarInfoRemarks:this.editData.fCarInfoRemarks
            }
          }
          updateone(data || datas).then(res => {
            this.$message({
              type: 'success',
              message: res.msg
            })
            this.dataClick(this.editData)
            this.editShow = false
            this.carInfoLists()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    carInfoLists() {
      this.listQuery.fAid = this.carStoreid
      carInfoList(this.listQuery).then(res => {
        if (res.code === 0) {
          this.tableData.list = res.data.list
          this.tableData.pages = res.data.pages
          this.tableData.pageNum = res.data.pageNum
          this.S = res.data.pageSize
          this.total = res.data.total
          for (var i = 0; i < this.tableData.list.length; i++) {
            if (this.tableData.list[i].fPresenceStatus === '1') {
              this.tableData.list[i].status = '在场'
            }
            if (this.tableData.list[i].fPresenceStatus === '2') {
              if(this.tableData.list[i].fSuspectedStatus === 1) {
                this.tableData.list[i].status = '离场'
               }
              if(this.tableData.list[i].fSuspectedStatus === 2) {
                this.tableData.list[i].status = '系统判定离场'
              }
              if(this.tableData.list[i].fSuspectedStatus === 3) {
                this.tableData.list[i].status = '手动离场'
              }
              if(this.tableData.list[i].fSuspectedStatus === 4) {
                this.tableData.list[i].status = '标记离场'
              }
            }
          }
        }
      })
    },
    initWebSocket() {
      var wsuri = ''
      console.log(process.env.BASE_API)
      // wsuri = 'wss://digital.auc2.com/internal/websocket/listen'   // 这个地址由后端童鞋提供 ---生产环境
      // if (process.env.BASE_API.indexOf('apidev')!==-1) {
      //   wsuri = 'wss://digital-test.auc2.com/internal/websocket/listen'// 这个地址由后端童鞋提供 ---本地环境
      // }
      // if (process.env.BASE_API.indexOf('test')!==-1) {
      //   wsuri = 'wss://digital-test.auc2.com/internal/websocket/listen'// 这个地址由后端童鞋提供 ---测试环境
      // }
      // if (process.env.BASE_API.indexOf('demo')!==-1) {
      //   wsuri = 'wss://digital-demo.auc2.com/internal/websocket/listen'// 这个地址由后端童鞋提供 ---演示环境
      // }
      // wsuri = process.env.WSS_API
      wsuri = process.env.NODE_ENV==='production'?"wss://"+window.location.host+"/internal/websocket/listen":process.env.WSS_API
      console.log('wsuri:',wsuri)
      this.websock = new ReconnectingWebSocket(wsuri)
      this.websock.onmessage = this.websocketonmessage
      this.websock.onopen = this.websocketonopen
      this.websock.onerror = this.websocketonerror
      this.websock.onclose = this.websocketclose

      this.websock.debug = true // 记录调试消息(默认false)
      this.websock.automaticOpen = true // 实例化时立即尝试连接(默认true)
      this.websock.reconnectInterval = 1000 // 尝试重新连接之前延迟的毫秒数(默认1000)
      this.websock.maxReconnectInterval = 30000 // 延迟重新连接尝试的最大毫秒数(默认30000)
      this.websock.reconnectDecay = 1.5 // 重新连接延迟的增加率。允许重新连接尝试在问题仍然存在时退出。(默认1.5)
      this.websock.timeoutInterval = 2000 // 在关闭和重试之前等待连接成功的最长时间(默认2000,毫秒单位)
      this.websock.maxReconnectAttempts = null // 在放弃之前将进行的最大重新连接尝试次数。如果为null，则将继续永久重新连接尝试(默认null)
    },
    // reconnect() {//重新连接
    //   var that = this;
    //   if(that.lockReconnect) {
    //       return;
    //   };
    //   that.lockReconnect = true;
    //   //没连接上会一直重连，设置延迟避免请求过多
    //   that.timeoutnum && clearTimeout(that.timeoutnum);
    //   that.timeoutnum = setTimeout(function () {
    //       //新连接
    //       that.initWebSocket();
    //       that.lockReconnect = false;
    //   },5000);
    // },
    // reset(){//重置心跳
    //     var that = this;
    //     //清除时间
    //     clearTimeout(that.timeoutObj);
    //     clearTimeout(that.serverTimeoutObj);
    //     //重启心跳
    //     that.start();
    // },
    // start(){//开启心跳
    //     var self = this;
    //     self.timeoutObj && clearTimeout(self.timeoutObj);
    //     self.serverTimeoutObj && clearTimeout(self.serverTimeoutObj);
    //     self.timeoutObj = setTimeout(function(){
    //         //这里发送一个心跳，后端收到后，返回一个心跳消息，
    //         if (self.websock.readyState == 1) {//如果连接正常
    //             self.websock.send("heartCheck");
    //         }else{//否则重连
    //             self.reconnect();
    //         }
    //         self.serverTimeoutObj = setTimeout(function() {
    //             //超时关闭
    //             self.websock.close();
    //         }, self.timeout);

    //     }, self.timeout)
    // },
    websocketonopen(e) {
      // this.start()
      console.log('建立连接', e)
    },
    websocketonmessage(e) {
      // this.reset();
      console.log(e)
      if (e.data === '连接成功') {
        console.log(e.data)
      } else {
        console.log('又进新车了呀~~~~~哇哈哈~~')
        const a = JSON.parse(e.data)// 将json字符串转换成json对象
        console.log(a)
        console.log(this.carStoreid)
        /* eslint-disable */if (this.carStoreid == parseInt(a.storeNo)) { // eslint-disable-line no-undef
        console.log('该刷新拉~~~~')
        this.carInfoLists()
        }
      }
    },
    websocketonerror(e) {
      // this.reconnect();
      console.log('连接建立失败...重连', e)
    },
    websocketclose(e) {
      // this.reconnect()
      console.log('断开连接', e)
    },
    // 点击查看车辆详情
    dataClick(row) {
      this.getIndex = row.index
      this.rightCar = true
      queoneCar({ fId: row.fId, token: this.userToken }).then(res => {
        if(row.inDateStr){
          OssImg({ Authorization: this.userToken, platNum: row.fPlatenum, timeStr:row.inDateStr && Date.parse(new Date(row.inDateStr.replace(/-/g, "/")))/1000, dealerId: row.fDealerCode }).then( res => {
             // var imgs = res.data.slice(0,8)
            this.plateDetails.carImg = res.data.map(item=>{
            return item.imgUrl
            })
          })
        }
        
        this.manualData.fCurrentId = res.data.fCurrentId
        this.manualSet.fPresenceStatus = res.data.fPresenceStatus
        this.manualData.fId = res.data.fId
        this.plateDetails.fCurrentId = res.data.fCurrentId
        this.plateDetails.fId = res.data.fId
        this.plateDetails.showRemarks = res.data.showRemarks
        this.plateDetails.AfterSaleCode = res.data.fAfterSaleCode
        if (res.code === 0) {
          this.plateDetails.currentId = res.data.fCurrentId
          if (res.data.showRemarks === '') {
            this.plateDetails.showRemarks = '无'
          } else {
            this.plateDetails.showRemarks = res.data.showRemarks
          }
          if (res.data.fPlatenum === '') {
            this.plateDetails.DetailsNumber = '无'
          } else {
            this.plateDetails.DetailsNumber = res.data.fPlatenum
          }
          if (res.data.fBrand === '') {
            this.plateDetails.DetailBrand = '无'
          } else {
            this.plateDetails.DetailBrand = res.data.fBrand
          }
          if (res.data.fModel === '') {
            this.plateDetails.carsType = '无'
          } else {
            this.plateDetails.carsType = res.data.fModel
          }
          if (res.data.fColor === '') {
            this.plateDetails.DetailsColor = '无'
          } else {
            this.plateDetails.DetailsColor = res.data.fColor
          }
          if (res.data.fType === '') {
            this.plateDetails.DetailsType = '无'
          } else {
            this.plateDetails.DetailsType = res.data.fType
          }
          if (res.data.inDateStr === '') {
            this.plateDetails.inDateStr = '无'
          } else {
            this.plateDetails.inDateStr = res.data.inDateStr
          }
          if (res.data.outDateStr === '') {
            this.plateDetails.PlayingTime = '无'
          } else {
            this.plateDetails.PlayingTime = res.data.outDateStr
          }
          if (res.data.fAuthorizedReason === '') {
            this.plateDetails.fAuthorizedReason = '无'
          } else {
            this.plateDetails.fAuthorizedReason = res.data.fAuthorizedReason
          }
          this.plateDetails.imgs = res.data.fCarLiftingRodInImgUrl

          this.plateDetails.outImg = res.data.fCarLiftingRodOutImgUrl
          
          // 客户状态
          switch (res.data.fStatus) {
            case '1':
              this.plateDetails.VehicleType = '待确认'
              break
            case '2':
              this.plateDetails.VehicleType = '售后到场'
              break
            case '3':
              this.plateDetails.VehicleType = '销售'
              break
            case '4':
              this.plateDetails.VehicleType = '内部车辆'
              break
            case '5':
              this.plateDetails.VehicleType = '临时离场'
              break
             case '6':
              this.plateDetails.VehicleType = '其他'
              break
            default:
              this.plateDetails.VehicleType = '请稍后，结果马上出来'
          }
          // 客户状态
          switch (res.data.fReserveStatus) {
            case '1':
              this.plateDetails.fReserveStatus = '预约'
              break
            case '2':
              this.plateDetails.fReserveStatus = '未预约'
              break
            case '3':
              this.plateDetails.fReserveStatus = '内部车辆'
              break
            case '4':
              this.plateDetails.fReserveStatus = '试驾车辆'
              break
            default:
              this.plateDetails.VehicleType = '请稍后，结果马上出来'
          }
          this.plateDetails.fFinancialSettlement = res.data.fFinancialSettlement
          // 财务结算
          switch (res.data.fFinancialSettlement) {
            case '1':
              this.plateDetails.Financial = '待结算'
              break
            case '2':
              this.plateDetails.Financial = '已结算'
              break
            case '3':
              this.plateDetails.Financial = '不需要结算'
              break
            case '4':
              this.plateDetails.Financial = '无'
              break
            default:
              this.plateDetails.Financial = '请稍后，结果马上出来'
          }
          if (res.data.fCurrentId === 0 || res.data.fCurrentId === -2) {
            this.insCar = true
          } else {
            this.insCar = false
            // 客户状态
            switch (res.data.fStatus) {
              case '1':
                this.plateDetails.saleStatus = '待确认'
                break
              case '2':
                this.plateDetails.saleStatus = '售后'
                break
              case '3':
                this.plateDetails.saleStatus = '销售'
                break
              case '5':
                this.plateDetails.saleStatus = '临时离场'
                break
              default:
                this.plateDetails.saleStatus = '内部'
            }
            // 客户状态是否授权
            if (res.data.fapproval === 1) {
              this.plateDetails.ifsale = '已发放'
            }
            if (res.data.fapproval === 2) {
              this.plateDetails.ifsale = '未发放'
            }
            if (res.data.fapproval === 3) {
              this.plateDetails.ifsale = '不需要发放'
            }
            this.plateDetails.handleave = res.data.fPresenceStatus
            // 在场_离场状态
            
            if (res.data.fPresenceStatus === '1') {
              this.plateDetails.fPresenceStatus = '在场'
            }
            // 详情页  手动离场 --START
            if (res.data.fPresenceStatus === '2') {             
              if (res.data.fSuspectedStatus === 1) {
                this.plateDetails.fPresenceStatus = '离场'
              }
              if (res.data.fSuspectedStatus === 2) {
                this.plateDetails.fPresenceStatus = '系统判定离场'
              }
              if (res.data.fSuspectedStatus === 3) {
                this.plateDetails.fPresenceStatus = '手动离场'
              }
              if (res.data.fSuspectedStatus === 4) {
                this.plateDetails.fPresenceStatus = '标记离场'
              }
            }
            this.plateDetails.fDealerCode = res.data.fDealerCode
            // 详情页  手动离场 --END
            if (res.data.fPresenceStatus === '3') {
              this.plateDetails.fPresenceStatus = '正在审核'
            }
            if (res.data.fPresenceStatus === '4') {
              this.plateDetails.fPresenceStatus = '审核完成待离场'
            }
            if (res.data.fWorkStatus === 1) {
              this.plateDetails.fWorkStatus = '已接待'
            }
            if (res.data.fWorkStatus === 2) {
              this.plateDetails.fWorkStatus = '未接待'
            }
            if (res.data.showRevoke === '') {
              this.plateDetails.showRevoke = '无'
            } else { this.plateDetails.showRevoke = res.data.showRevoke }
            if (res.data.fWorker === '') {
              this.plateDetails.fWorker = '无'
            } else { this.plateDetails.fWorker = res.data.fWorker }
            if (res.data.showStartWorkRevoke === '') {
              this.plateDetails.showStartWorkRevoke = '无'
            } else { this.plateDetails.showStartWorkRevoke = res.data.showStartWorkRevoke }
            //
            if (res.data.showAouthRevoke === '') {
              this.plateDetails.showAouthRevoke = '无'
            } else { this.plateDetails.showAouthRevoke = res.data.showAouthRevoke }
            if (res.data.showTrialRunCarButton === '') {
              this.plateDetails.showTrialRunCarButton = '无'
            } else { this.plateDetails.showTrialRunCarButton = res.data.showTrialRunCarButton }
          }
        }
      })
    },
    // manualEntrying() {
    //   this.manualEntrys = true
    //   this.resetManualData()
    // },
    setTryCar(trialdriver) {
      this.$refs[trialdriver].validate((valid) => {
        if (valid) {
          var data = {
            carId: this.plateDetails.fId,
            token: this.userToken,
            currentId: this.plateDetails.fCurrentId,
            fInMileage: this.trialdriver.fInMileage,
            fTrialdriverRemarks: this.trialdriver.fTrialdriverRemarks,
            fName: this.trialdriver.drivername,
            fPhone: this.trialdriver.phone,
            fGender: this.trialdriver.gender,
            fAuthorizedReason: this.trialdriver.fAuthorizedReason
          }
          trialdrivers(data).then(res => {
            this.$message({
              type: 'success',
              message: res.msg
            })
            if (res.code === 0) {
              this.dataClick(this.plateDetails)
              this.tryCarFlag = false
            }
          })
        } else {
          return false
        }
      })
    },

    // 财务结算
    FinancialFlag() {
      if (this.plateDetails.currentId === 0 || this.plateDetails.currentId === -2) {
        this.$confirm('该车不需要财务结算。', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // this.dataClick(this.plateDetails)
          this.FinancialDataFlag = false
        })
      } else if (this.plateDetails.fFinancialSettlement === '2') {
        this.$confirm('该车已经结算。', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.FinancialDataFlag = false
        })
      } else {
        this.FinancialDataFlag = true
      }
    },
    FinancialBtn() {
      this.FinancialDataFlag = false
      financial({ currentId: this.plateDetails.currentId, token: this.userToken, fFinanceRemarks: this.FinancialNote }).then(res => {
        this.$message({
          type: 'success',
          message: res.msg
        })
        this.dataClick(this.plateDetails)
      })
    },
    undo() {
      this.$confirm('此操作是撤销财务结算状态, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        financialrevoke({ currentId: this.plateDetails.fCurrentId }).then(res => {
          this.$message({
            type: 'success',
            message: '已撤销成功！'
          })
          this.dataClick(this.plateDetails)
        })
      })
    },
    resetOutCars() {
      this.manualout = {
        passInCar: '',
        plateVin: '',
        InCarData: '',
        note: ''
      }
      this.$nextTick(() => {
        this.$refs['manualout'].clearValidate()
      })
    },
    handOutCars() {
      this.handOuts = true
      this.resetOutCars()
    },
    markOut() {
    if(this.Datealue){
      this.pointTip=true
    } else {
        this.$message({
          type:'error',
          message:'请选择日期！再进行此操作。'
        })
    }
    },
    markTrue(formName) {
        var start = this.Datealue[0]
        var end = this.Datealue[1]      
        this.$refs[formName].validate((valid) => {
          if (valid) {
            batchcleanOut({checkTimeBefore: start, checkTimeAfter: end,fAid:this.carStoreid,carInfoRemarks:this.Markorder.carInfoRemarks,fPlatenum:this.listQuery.fPlatenum}).then(res => {
              this.pointFlag = false
              this.carInfoLists()
              // this.dataClick(this.plateDetails)

            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });      
    },
    markPoint() {
      this.pointFlag = true
      this.pointTip = false
      this.$nextTick(() => {
      this.$refs['Markorder'].clearValidate()
      })
    },
    Handout() {
      if(this.plateDetails.DetailBrand==='无'){
        this.byBrand=true
        this.handOuts = false        
        this.queryshopfilters()
        Cookies.set('byBrand',2)
      }else if(this.manualSet.fPresenceStatus === '1') {
        this.oneleaveFlag = true
      } else {
        this.$message({
          type: 'success',
          message: '该车已经离场'
        })
        this.oneleaveFlag = false
      }
    },
    setOne() {
      var data = {
        token: this.userToken,
        fCurrentId: this.plateDetails.fCurrentId,
        fId: this.plateDetails.fId
      }
      handOut(data).then(res => {
        if (res.code === 0 && res.data === 0) {
          this.$message({
            type: 'success',
            message: '该车已经成功离场'
          })
          this.carInfoLists()
          this.dataClick(this.plateDetails)
          this.oneleaveFlag = false
        }
        if (res.code === 0 && res.data === 9) {
          this.oneOut = true
          this.oneleaveFlag = false
        }
      })
    },
    oneoutaT() {
      leaveOne({ fLeaveRemarks: this.oneRemarks, fId: this.plateDetails.fId, fCurrentId: this.plateDetails.fCurrentId, token: this.userToken, fCarLiftingRodType: this.fCarLiftingRodType, fOtherRemarks: this.fOtherRemarks }).then(res => {
          this.carInfoLists()
          this.oneOut = false
          this.oneleaveFlag = false
          this.dataClick(this.plateDetails)
        
      })
    },

    // 权限设置----------
    authorizations() {
      var arr = this.btnFlagData.join(',')
      authorization({ code: arr }).then(res => {
        if (res.code === 0) {
          const rescodes = res.data
          const arcodes = this.options.filter(v => {
            return rescodes.indexOf(v.code) > -1
          })
          this.optsGrantLeave = arcodes.filter(v => { return v.type === 'seltype' })
          this.optsGrantLeave.filter(v => {})
          this.optsBtn = arcodes.filter(v => { return v.type === 'selbtn' })
          this.optsBtnCode = this.optsBtn.map(v => { return v.code }) 
          console.log('................',this.optsBtnCode)
          this.optsBtn.forEach(item => {
            if (item.code === 'operationparkupdatereception') {
              this.userRealNameFlag = false
            }
            // 手动进场
            if (item.code === 'operationManualEntry') {
              this.manualFlag = true
            }
            // 手动出场
            if (item.code === 'operationManualExit') {
              this.outFlag = true
            }
            // 进场车辆开工单
            if (item.code === 'opreationInCarStartWork') {
              this.orderFlag = true
            }
            // 财务审核
            if (item.code === 'operationparkfinancialAudit') {
              this.financialFlag = true
            }
            // 授权出场
            if (item.code === 'opreationAuthorizedAppearance') {
              this.saleStatusFlag = true
            }
            // 维修试驾车  按钮
            if (item.code === 'operationparkmainteDrive') {
              this.tryFlag = true
            }
            if(item.code === 'operationParkingDataExport'){
              this.exportCarFlag = true
            }
          })
        }
      })
    },
    updateStartworks(){
      // this.$nextTick(() => {
      //   this.$refs['order'].clearValidate()
      // })
      this.$confirm('该车辆已被接待,是否仍然变更接待?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        this.resetOrder()
        this.dialogStatus = 'update'
        this.order.userRealName = this.userRealName
        this.order.plateNumber = this.plateDetails.DetailsNumber
        this.showOrderFlag = true
      })
    },
    showOrderBtn() {
      this.dialogStatus = 'create'
      // this.$nextTick(() => {
      //   this.$refs['order'].clearValidate()
      // })
      this.resetOrder()
      if (this.plateDetails.currentId === 0) {
        this.dialogVisible = false
        this.$confirm('内部车辆，不需要接待。', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
      } else if (this.plateDetails.currentId === -2) {
        this.dialogVisible = false
        this.$confirm('该车是试驾车辆，请去试乘车辆管理页面。', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
      } else if(this.plateDetails.DetailBrand==="无"){
        this.showOrderFlag = false        
        this.byBrand =true
        this.queryshopfilters()
        Cookies.set('byBrand',1)
      } else if (this.plateDetails.showStartWorkRevoke === 1 || this.plateDetails.showStartWorkRevoke === 3) {
        this.onecurrents()
      
      }
    },
    onecurrents(){
      onecurrent({ currentId: this.plateDetails.fCurrentId, fId: this.plateDetails.fId }).then(res => { 
        console.log(res)
        this.showOrderFlag = true
          if (res.code === 6) {
            this.showOrderFlag = false
          }
          if (res.code === 0) {
            this.showOrderFlag = true
            this.order.plateNumber = res.data.fPlatenum
            this.order.name = res.data.fStartWorkName
            this.order.phone = res.data.fStartWorkPhone
            this.order.fInMileage = res.data.fInMileage
            this.order.note = res.data.fStartWorkRemarks
            this.order.userRealName = this.userRealName
            this.order.optsGrantLeave = res.data.powerCode
            if (res.data.fStartWorkGender === 1) {
              this.order.gender = '未填写'
            }
            if (res.data.fStartWorkGender === 2) {
              this.order.gender = '男'
            }
            if (res.data.fStartWorkGender === 3) {
              this.order.gender = '女'
            }
          }
        })
    },
    resetOrder(){
      this.order = {
        plateNumber: '',
        plateVin: '',
        userRealName: '',
        name: '',
        phone: '',
        fInMileage: '',
        gender: '',
        optsGrantLeave: '',
        note: '',
        typeData: '',
        outReason: '',
        genderData: ''
      }
    },
    queryshopfilters(){
      this.queryshopfilter = ''
      queryshopfilter({token:this.userToken}).then(res => {
        this.queryshopfilterData = res.data
        // this.byBrand = true
        this.brandTxt = this.queryshopfilterData.map(v => {
          return v.value
        })        
        if (this.letterData) {
          this.brandData = this.brandTxt.concat(this.letterData)
        }
        var typeArr = this.queryshopfilterData.filter(item => {
          if(item.index === 1){
            this.cartypes = item.value
          }
        })
      })
    },
    manualEntrying() {
      this.resetManualData()
      this.manualEntrys = true
      this.letters()
      this.queryshopfilters()
    },
    SetBrand(){
      console.log(this.plateDetails.fId)
      var data={
        fBrand: this.queryshopfilter,
        fId:this.plateDetails.fId,
        buttonStatus:Cookies.set('byBrand')
      }
      updatequickBrand(data).then(res => {
        this.$message({
            type: 'success',
            message: res.msg
          })
        this.byBrand =false
        this.carInfoLists()
        this.dataClick(this.plateDetails)
        if(Cookies.get('byBrand')==1&&res.data==1){
          this.showOrderFlag=true
          this.dialogStatus = 'create'
          this.onecurrents()
          return
        }else if(Cookies.get('byBrand')==1&&res.data==2){
          this.showOrderFlag=false 
          return 
        }else if(Cookies.get('byBrand')==3&&res.data==1){ 
          this.authocurrents()
          return
        }else if(Cookies.get('byBrand')==2&&res.data==1){  
          if(this.manualSet.fPresenceStatus === '1') {
            this.oneleaveFlag = true
          } else {
            this.$message({
              type: 'success',
              message: '该车已经离场'
            })
            this.oneleaveFlag = false
          }
        }
      }).catch(res=>{
        console.log(res)
      })
    },
    removkeworked() {
      this.$confirm('此操作是撤销接待, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        var data = {
          currentId: this.plateDetails.fCurrentId,
          carId: this.manualData.fId
        }
        removkeStartwork(data).then(res => {
          if (res.code === 0) {
           this.dataClick(this.plateDetails)
          }
        })
      }).catch( e=> {

      })
    },
    orderGender(val) {
      this.order.genderData = val
    },
   updatetrue(order) {
      this.$refs[order].validate((valid) => {
        if (valid) {
          if (this.order.optsGrantLeave === 'operationparkBeforeSale') {
            this.impower = 3
          }
          if (this.order.optsGrantLeave === 'operationparkafterSale') {
            this.impower = 2
          }
          if (this.order.optsGrantLeave === 'operationparkmainteDrive') {
            this.impower = 5
          }
          if (this.order.optsGrantLeave === 'operationparkafterSaleNoSettlement') {
            this.impower = 28
          }
          if(this.order.optsGrantLeave === 'operationparkothers') {
            this.impower = 6
          }
          if (this.order.gender === '未填写') {
            this.order.genderData === 1
          }
          if (this.order.gender === '男') {
            this.order.genderData === 2
          }
          if (this.order.gender === '女') {
            this.order.genderData === 3
          }
          var data = {
            token: this.userToken,
            carId: this.plateDetails.fId,
            fId: this.plateDetails.fCurrentId,
            fPlatenum: this.order.plateNumber,
            fOrderType: this.impower,
            fInMileage: this.order.fInMileage,
            fStartWorkName: this.order.name,
            fStartWorkPhone: this.order.phone,
            fStartWorkGender: this.order.genderData,
            fAfterSaleCode: this.order.AfterSaleCode,
            fStartWorkRemarks: this.order.note,
            fAfterFlowCode: this.order.fAfterFlowCode,
            fWorker: this.order.userRealName,
            fAid: this.carStoreid
          }
          updateStartwork(data).then(res => {
            this.$message({
              type: 'success',
              message: res.msg
            })
            if (res.msg === '操作成功') {
              this.dataClick(this.plateDetails)
            }
            this.showOrderFlag = false
          })
        } else {
          return false
        }
      })
    },
    orderTrue(order) {
      this.$refs[order].validate((valid) => {
        if (valid) {
          if (this.order.optsGrantLeave === 'operationparkBeforeSale') {
            this.impower = 3
          }
          if (this.order.optsGrantLeave === 'operationparkafterSale') {
            this.impower = 2
          }
          if (this.order.optsGrantLeave === 'operationparkmainteDrive') {
            this.impower = 5
          }
          if (this.order.optsGrantLeave === 'operationparkafterSaleNoSettlement') {
            this.impower = 28
          }
          if(this.order.optsGrantLeave === 'operationparkothers') {
            this.impower = 6
          }
          if (this.order.gender === '未填写') {
            this.order.genderData === 1
          }
          if (this.order.gender === '男') {
            this.order.genderData === 2
          }
          if (this.order.gender === '女') {
            this.order.genderData === 3
          }
          var data = {
            token: this.userToken,
            carId: this.plateDetails.fId,
            fId: this.plateDetails.fCurrentId,
            fPlatenum: this.order.plateNumber,
            fOrderType: this.impower,
            fInMileage: this.order.fInMileage,
            fStartWorkName: this.order.name,
            fStartWorkPhone: this.order.phone,
            fStartWorkGender: this.order.genderData,
            fAfterSaleCode: this.order.AfterSaleCode,
            fStartWorkRemarks: this.order.note,
            fAfterFlowCode: this.order.fAfterFlowCode,
            fWorker: this.order.userRealName
          }
          setOrder(data).then(res => {
            this.$message({
              type: 'success',
              message: res.msg
            })
            if (res.msg === '操作成功') {
              this.dataClick(this.plateDetails)
              this.carInfoLists()
            }
            this.showOrderFlag = false
          })
        } else {
          return false
      }
      })
    },
    dialogVisibleInfo() {
      if(this.plateDetails.DetailBrand==="无"){
        this.dialogVisible = false
        this.byBrand =true
        this.queryshopfilters()
        Cookies.set('byBrand',3)
      }else if (this.plateDetails.currentId === 0) {
        this.dialogVisible = false
        this.$confirm('内部车辆，不需要授权。', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
      } else if (this.plateDetails.currentId === -2) {
        this.dialogVisible = false
        this.$confirm('该车是试驾车辆，请去试乘车辆管理页面。', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
      } else {
        this.authocurrents()
      }
    },
    authocurrents() {
      authocurrent({ currentId: this.plateDetails.currentId, carBrand: this.plateDetails.DetailBrand }).then(res => {
          if (res.code === 0) {
            this.dialogVisible = true
            if (res.data.fStartWorkGender === 1) {
              this.authorization.gender = '未填写'
            }
            if (res.data.fStartWorkGender === 2) {
              this.authorization.gender = '男'
            }
            if (res.data.fStartWorkGender === 3) {
              this.authorization.gender = '女'
            }
            this.authorization.name = res.data.fStartWorkName
            this.authorization.phone = res.data.fStartWorkPhone
            this.authorization.fPlatenum = res.data.fPlatenum
            this.authorization.fInMileage = res.data.fInMileage
            this.authorization.fWorker = res.data.fWorker
            if(res.data.fWorkStatus===1){
              this.fWorkerFlag = true
            }else{
              this.fWorkerFlag = false
            }
            if (res.data.Approval === 1) {
              this.ApprovalShow = false
              this.Approval = 1
            }
          }
          if (res.code === 6) {
            this.$message({
              type: 'success',
              message: res.msg
            })
            this.dialogVisible = false
          } else if (res.code === 3) {
            this.dialogVisible = false
            this.$message({
              type: 'success',
              message: res.msg
            })
          }
        })
    },
    undoSale() {
      this.$confirm('此操作撤销离场授权, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        aouthRevoke({ currentId: this.plateDetails.fCurrentId }).then(res => {
          this.$message({
            type: 'success',
            message: res.msg
          })
          this.dataClick(this.plateDetails) 
          this.saleStatusFlagN = false
          this.saleStatusFlag = true
        })
      })
    },
    untryCarFlag() {
      this.$confirm('此操作试撤销临时离场,是否继续', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        removkeDriver({ currentId: this.plateDetails.fCurrentId, carId: this.plateDetails.fId }).then(res => {
          this.$message({
            type: 'success',
            message: res.msg
          })
          this.dataClick(this.plateDetails)
        })
      })
    },
    dialogVisibleBtn(authorization) {
      this.$refs[authorization].validate((valid) => {
        if (valid) {
          if (this.authorization.gender === '男') {
            this.genders === 2
          }
          if (this.authorization.gender === '女') {
            this.genders === 3
          }
          var data = {
            fApproval: this.Approval,
            fOrderType: this.impower,
            fPlatenum: this.authorization.fPlatenum,
            fPhone: this.authorization.phone,
            fGender: this.genders,
            fName: this.authorization.name,
            fId: this.plateDetails.currentId,
            token: this.userToken,
            fAuthorizationRemarks: this.authorization.note
          }
          saleApproval(data).then(res => {
            this.$message({
              type: 'success',
              message: res.msg
            })
            if (res.code === 0) {
              this.dataClick(this.plateDetails)
            }
            this.dialogVisible = false
            if (res.code === 6) {
              this.$message({
                type: 'success',
                message: res.msg
              })
            } else if (res.code === 3) {
              this.dialogVisible = false
              this.$message({
                type: 'success',
                message: res.msg
              })
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    exportCar(){
      let startTime = ''
      let endTime = ''
      if(this.Datealue){
        startTime = this.Datealue[0]
        endTime = this.Datealue[1]
      }
      axios(
        {
          url: process.env.BASE_API + '/unicorn/parking/incar/excel?checkTimeAfter='+endTime+'&&checkTimeBefore='+startTime+'&&fAid='+this.carStoreid+'&&fPlatenum='+this.listQuery.fPlatenum+'&&fColor='+this.listQuery.fColor+'&&fBrand='+this.listQuery.fBrand+'&&fModel='+this.listQuery.fModel+'&&fType='+this.listQuery.fType+'&&fPresenceStatus='+this.listQuery.fPresenceStatus,
          headers: { Authorization: getToken() },
          method: 'get',
          responseType: 'blob'
        }
      ).then((res) => {
        if (res.status === 200) {
          const fileName = (res.headers['content-disposition'] && res.headers['content-disposition'].indexOf('filename=') > -1)
            ? decodeURIComponent(res.headers['content-disposition'].split('filename=')[1])
            : '导出信息.xlsx'
          const blob = new Blob([res.data])
          if ('download' in document.createElement('a')) { // 非IE下载
            console.log('非IE')
            const elink = document.createElement('a')
            elink.download = fileName
            elink.style.display = 'none'
            elink.href = URL.createObjectURL(blob)
            document.body.appendChild(elink)
            elink.click()
            URL.revokeObjectURL(elink.href) // 释放URL 对象
            document.body.removeChild(elink)
          } else { // IE10+下载
            navigator.msSaveBlob(blob, fileName)
          }
        } else {
          Message({
            message: '导出失败',
            type: 'error',
            duration: 2 * 1000
          })
        }
      })
// incarExcel
    },

  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.el-button--info:hover{
  border-color:#666!important;
  background:#666!important;
}
.lookTips{
  width:30px;
  height:15px;
  border-radius: 12px;
  color:#fff;
  background:#00adef;
  font-size:12px;
  padding:2px 3px;
  margin-right:5px;
}
.moreInfo .el-select{
  width:94%!important;
}
.fModel{
    margin-left:-14px!important;
  }
.storeDialog .el-dialog{
   min-height:400px!important;
}


.el-form-item__error{
  margin-left:60px!important;
}
.rigthTop  .el-button{
  width:110px!important;
}
.u_tree{
  height:30px!important;
  font-size: 16px;
  z-index:999;
  // border:1px solid #ccc;
}
.u_tree {
  font-size: 16px;
  z-index: 99;
  .el-tree-node__label {
    font-size: 15px;
  }
}
.u_tree.el-tree--highlight-current {
  height: 20px;
  margin-top: 10px;
  .el-tree-node.is-current > .el-tree-node__content {
    .el-tree-node__label {
      border: 1px sold transparent;
    }
  }
}
.carBox {
  width: 100%;
  .carStore {
    width: 100%;
    height: 50px;
    p{
      float:right;
      margin-top:0px;
      display:flex;
      span{
        display:block;
        line-height:50px;
        margin-right:10px;
      }
    }
  }

  .carTitle {
    width: 100%;
    height: 40px;
    border: 1px solid #ccc;
    ul {
      display: flex;
      align-items:center;
      height: 40px;
      li {
        color:#333;
        padding-left: 15px;
        font-size: 14px;
      }
    }
  }
  .edit{
      outline:none;
      border:none;
      border-radius:2px;
      background:#00ADEF;
      color:#fff;
  }
  .noedit{
      outline:none;
      border:none;
      border-radius:2px;
      background:#909399;
      color:#fff;
  }
  .filterCar {
    width: 100%;
    height: auto;
    margin-top: 10px;
    position: relative;
    padding-left:20px;
    .filterR{
      width:190px;
    }
  }
.btnBox{
  height:50px;
  width:100%;
.ManualBox{
  max-width:520px;
  height:50px;
  margin-top:-7px;
  float:right;
}
}
  .carsInfo {
    width: 100%;
    height: auto;
    min-height: 500px;
    .leftCar {
      min-width: 1000px;
      min-height:500px;
      border-right: 1px solid #ccc;
      float:left;
    }
    .leftCars {
      width: 0;
    }
@media screen and (min-width: 1660px) and(max-width: 1920px) {
  .rightCar {
      float:right;
      display: flex;
      width:100%; 
      .imagesBox {
        margin-top: 20px;
        width:62%;
        margin-left:-4%;
        height: auto;
        margin-top: -1px;
         .up{
          img{
            float:right;
          }
        }
        .down{
          div{
            margin-top:10px;
            img{
            float:right;
            margin-top:10px;
          }
          }
        }
      }
      .rightlist {
        .carsType{
          span{
            width:90px;
          }
        }
       li{
        display: flex;   
        align-items: center;  
      
        span{
          display: block;
          float:left;
          color:#666666;
        }
       }
      }
      .rigthTop {
        width:38%;
        ul {
          margin-top: 20px;
          li {
            margin-top: 10px;
            span {
              display: block;
              margin-top: 5px;
            }
          }
        }
      }
    }
}
@media screen and (min-width: 1270px) and(max-width: 1660px) {
  .rightCar {
      float:right;
      display: flex;
      width:100%; 
      .imagesBox {
        margin-top: 20px;
        width:62%;
        margin-left:-4%;
        height: auto;
        margin-top: -1px;
         .up{
          img{
            float:right;
          }
        }
        .down{
          div{
            margin-top:10px;
            img{
            float:right;
            margin-top:10px;
          }
          }
        }
      }
      .rightlist {
        .carsType{
          span{
            width:90px;
          }
        }
       li{
        display: flex;   
        align-items: center;  
      
        span{
          display: block;
          float:left;
          color:#666666;
        }
       }
      }
      .rigthTop {
        width:38%;       
        ul {
          margin-top: 20px;
          li {
            margin-top: 10px;
            span {
              display: block;
              margin-top: 5px;
            }
          }
        }
      }
    }
}
       .rightCar {
      width:100%;
      float:right;
      display: flex;
      justify-content:space-between;
      .imagesBox {
        // max-width:500px;
        width:62%;
        height: auto;
        margin-top: 20px;
        margin-left:-4%;
        margin-right:10px;
        .up{
          img{
            float:right;
          }
        }
        .down{
          div{
            margin-top:10px;
            img{
            float:right;
            margin-top:10px;
          }
          }
        }
      }
      
      .rightlist {
       li{
        display: flex;   
        align-items: center;
        font-size:14px;
        span{
          display: block;
          float:left;
          color:#8c8c8c;
        }
       }
      }
      .rigthTop {
        width:38%;
        ul {
          margin-top: 20px;
          li {
            margin-top: 10px;
            span {
              display: block;
              margin-top: 5px;
            }
          }
        }
      }
      .del {
        outline: none;
        border: none;
        border-radius: 2px;
        border: 1px solid #ccc;
        background: #fff;
        color: #6c6c6c;
        margin-left:10px;
     }
     .note{
       display: flex;
       label{
        font-size: 14px;
        color: #606266;
        line-height: 40px;
       }
       input{
         width:80%;
         display:block;
         height:40px;
         outline:none;
         border-radius:4px;
         padding:0 15px;
         border:none;
         border:1px solid #dcdfe6;
       }
     }
    }
  }
}
</style>
