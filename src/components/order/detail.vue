<template>
  <el-dialog :visible.sync="isShowDetail" title="订单详情" width="80%">
    <el-tabs type="border-card">
      <el-tab-pane label="订单信息">
        <el-form ref="infoform" class="col2form" label-width="80px">
          <el-form-item label="订单编号">
            {{ tmpitem.id }}
          </el-form-item>
          <el-form-item label="手机号">
            {{ tmpitem.mobile }}
          </el-form-item>
          <el-form-item label="订单行程">
            {{ tmpitem.departure +' - '+ tmpitem.destination }}
          </el-form-item>
          <el-form-item label="人数">
            {{ tmpitem.contacts.length }}
          </el-form-item>
          <el-form-item label="出发城市">
            {{ tmpitem.departure }}
          </el-form-item>
          <el-form-item label="目的城市">
            {{ tmpitem.destination }}
          </el-form-item>

          <el-form-item label="行程日期">
            {{ tmpitem.start_date }}
          </el-form-item>
          <el-form-item label="返程日期">
            {{ tmpitem.end_date }}
          </el-form-item>

          <el-table :data="tmpitem.contacts">
            <template v-for="item in colPerson">
              <el-table-column :fixed="item.fixed" :key="item.id" :prop="item.prop" :label="item.label" :min-width="item.width" align="center">
                <template slot-scope="scope">
                  <template v-if="item.prop == 'photo'">
                    <div class="photobox">
                      <img v-for="(itemp,pi) in JSON.parse(scope.row[item.prop]) " :src="itemp" :key="'p'+pi" alt="">
                    </div>
                  </template>
                  <template v-else>
                    <span>{{ scope.row[item.prop] | showstr(item.prop) }}</span>
                  </template>
                </template>
              </el-table-column>
            </template>
          </el-table>
        </el-form>

      </el-tab-pane>
      <el-tab-pane label="发送行程">
        <el-form ref="scheduleform" :model="scheduleform" :rules="schrules" class="col2form scheduleform" label-width="80px">
          <template v-for="(schitem,i) in scheduleform.items" >
            <section :key="'sch'+i">
              <el-form-item label="出发城市">
                <el-input v-model="schitem.start_city" placeholder="出发城市"/>
              </el-form-item>
              <el-form-item label="航司">
                <el-input v-model="schitem.airport_company" placeholder="航司"/>
              </el-form-item>
              <el-form-item label="航班">
                <el-input v-model="schitem.airport_no" placeholder="航班"/>
              </el-form-item>
              <el-form-item label="出发机场" class="inp2out">
                <el-input v-model="schitem.start_airport" placeholder="机场"/>
                <el-input v-model="schitem.start_tower" placeholder="航站楼"/>
              </el-form-item>
              <el-form-item label="出发时间">
                <el-input v-model="schitem.start_time" placeholder="出发时间"/>
              </el-form-item>
              <el-form-item label="飞行时间">
                <el-input v-model="schitem.duration" placeholder="飞行时间"/>
              </el-form-item>
              <el-form-item label="机型">
                <el-input v-model="schitem.airport_type" placeholder="机型"/>
              </el-form-item>
              <el-form-item label="到达城市">
                <el-input v-model="schitem.arrive_city" placeholder="到达城市"/>
              </el-form-item>
              <el-form-item label="到达机场" class="inp2out">
                <el-input v-model="schitem.arrive_airport" placeholder="到达机场"/>
                <el-input v-model="schitem.arrive_tower" placeholder="到达机场"/>
              </el-form-item>
              <el-form-item label="到达时间">
                <el-input v-model="schitem.arrive_time" placeholder="到达时间"/>
              </el-form-item>
              <el-form-item label="转机事项">
                <el-input v-model="schitem.description" placeholder="转机事项"/>
              </el-form-item>
              <el-form-item label="">
                <el-checkbox v-model="schitem.is_visa" >需要过境签</el-checkbox>
              </el-form-item>

              <el-button v-if="i>0" type="danger" class="btndel" icon="el-icon-delete" circle/>
              <el-button v-if="i== scheduleform.items.length-1" type="success" class="btnadd" icon="el-icon-plus" circle/>
            </section>

          </template>
          <el-form-item label="订单价格" prop="tot_price">
            <el-input v-model="scheduleform.total" placeholder="订单价格"/>
          </el-form-item>
          <el-form-item label="内部价格">
            <el-input v-model="scheduleform.platprice" placeholder="内部价格"/>
          </el-form-item>
          <el-form-item label="支付时效" prop="deadline">
            <el-input v-model="scheduleform.deadline" placeholder="支付时效"/>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="scheduleform.note" placeholder="备注"/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="large" @click="setSchedule" >提交</el-button>
          </el-form-item>

        </el-form>
      </el-tab-pane>

    </el-tabs>
  </el-dialog>
</template>

<script>
export default {
  prop: ['isShowDetail']
}
</script>
