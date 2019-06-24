<template>
  <div>
    <el-row>
      <el-col :span="8">
        <div class="block">
          <span class="demonstration">选择时间段：</span>
          <el-date-picker
            v-model="TimeSpace"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="block">
          <span class="demonstration">选择营业部：</span>
          <el-select v-model="value" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="block">
          <span class="demonstration">有效期：</span>
          <el-select v-model="validityTime_value" placeholder="请选择">
            <el-option
              v-for="item in validityTime_options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
      </el-col>
    </el-row>
    <el-row style="margin-top: 30px">
      <el-col :span="8">
        <div class="block">
          <span class="demonstration"> 资金账号：</span>
          <el-input v-model="input" placeholder="请输入内容" style="width: 200px"></el-input>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="block">
          <span class="demonstration">类型：</span>
          <el-select v-model="type_value" placeholder="请选择">
            <el-option
              v-for="item in type_options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="block">
          <span class="demonstration">领取状态：</span>
          <el-select v-model="getStatus_value" placeholder="请选择">
            <el-option
              v-for="item in getStatus_options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
      </el-col>
    </el-row>

    <el-row style="margin-top: 40px">
      <div style="text-align: center">
        <el-button v-if="menuList.indexOf('level2coupon:query') == -1?false:true">查询</el-button>
        <el-button>重置</el-button>
        <el-button v-if="menuList.indexOf('level2coupon:excel') == -1?false:true">导出</el-button>
      </div>
    </el-row>

    <el-row style="margin-top: 40px">
      <div><span>统计：</span><span>*********************</span></div>
    </el-row>

    <el-table
      :data="tableData"
      style="width: 100%"
      height="250">
      <el-table-column
        fixed
        prop="date"
        label="新建时间"
        width="150">
      </el-table-column>
      <el-table-column
        prop="name"
        label="资金账号"
        width="120">
      </el-table-column>
      <el-table-column
        prop="branch"
        label="中心营业部/分公司"
        width="180">
      </el-table-column>
      <el-table-column
        prop="sales"
        label="营业部"
        width="120">
      </el-table-column>
      <el-table-column
        prop="type"
        label="类型"
        width="120">
      </el-table-column>
      <el-table-column
        prop="validity_time"
        label="有效期"
        width="120">
      </el-table-column>
      <el-table-column
        prop="fund_account"
        label="登陆资金账号"
        width="120">
      </el-table-column>
      <el-table-column
        prop="get_time"
        label="领取时间"
        width="120">
      </el-table-column>
      <el-table-column
        prop="state"
        label="优惠券状态"
        width="120">
      </el-table-column>
      <el-table-column
        prop="use_time"
        label="使用时间"
        width="120">
      </el-table-column>
    </el-table>

    <el-pagination
      background
      :pager-count="11"
      :page-size="15"
      layout="prev, pager, next"
      :total="1000"
      style="margin-top: 30px;text-align: right"
    >
    </el-pagination>
  </div>
</template>

<script>
  export default {
    data() {
      var currentDate = new Date();
      var month = currentDate.getMonth();
      var endDate = new Date();
      endDate.setMonth(month+1)
      return {
        menuList: [],    // 获取权限

        TimeSpace:[currentDate,endDate],
        input:'',

        validityTime_options: [{
          value: '选项1',
          label: '3个月'
        }, {
          value: '选项2',
          label: '1个月'
        }, {
          value: '选项3',
          label: '所有'
        }],
        validityTime_value: '',

        type_options: [{
          value: '选项1',
          label: '存量用户--手册登录E智通'
        }, {
          value: '选项2',
          label: '新开沪深证券账户（线上/线下）'
        }, {
          value: '选项3',
          label: '其他类型'
        }, {
          value: '选项4',
          label: '所有'
        }],
        type_value: '',

        getStatus_options: [{
          value: '选项1',
          label: '未领取'
        }, {
          value: '选项2',
          label: '已领取'
        }, {
          value: '选项3',
          label: '已使用'
        }, {
          value: '选项4',
          label: '已过期'
        }, {
          value: '选项5',
          label: '已失效'
        }],
        getStatus_value: ''
      };
    },

    mounted: function () {
      this.menuList = localStorage.menuList
      this.getAllData()
    }
  };
</script>

<style>

</style>
