<template>
  <div>
    <span class="demonstration"> 请输入筛选信息：</span>
    <el-select v-model="type_options_value" placeholder="请选择" style="width: 180px">
      <el-option
        v-for="item in type_options"
        :key="item.value"
        :label="item.value"
        :value="item.value">
      </el-option>
    </el-select>

    <el-input ref="input" v-model="input_value" placeholder="请输入内容" style="width: 219px"></el-input>
    <el-button type="primary" @click="getSearchData()">查询</el-button>
    <el-button @click.native="exportData">导出</el-button>

<!--    <el-button v-if="menuList.indexOf('level2coupon:excel') == -1?false:true" @click="exportExcel">导出</el-button>-->

    <div style="height: 50px;width:100%;"></div>

    <el-table
      :data="users"
      style="width: 100%;text-align: center"
    >

      <el-table-column
        align="center"
        prop="id"
        label="用户账号"
        width="110">
      </el-table-column>
      <el-table-column
        align="center"
        prop="serviceName"
        label="服务类型"
        width="180">
      </el-table-column>
      <el-table-column
        align="center"
        prop="sales"
        label="商品类型"
        width="280">
      </el-table-column>
      <el-table-column
        align="center"
        prop="type"
        label="商品名称"
        width="250">
      </el-table-column>
      <el-table-column
        align="center"
        prop="userType"
        label="用户类型"
        width="120">
      </el-table-column>
      <el-table-column
        align="center"
        prop="phone"
        label="服务时长"
        width="130">
      </el-table-column>
      <el-table-column
      align="center"
      prop="serviceStartAt"
      label="权限（服务）开始时间"
      width="120">
    </el-table-column>
      <el-table-column
        align="center"
        prop="serviceEndAt"
        label="权限（服务）结束时间"
        width="120">
      </el-table-column>
      <el-table-column
        align="center"
        prop="get_time"
        label="创建时间"
        width="120">
      </el-table-column>
      <el-table-column
        align="center"
        prop="serviceStatus"
        label="服务状态"
        width="200">
      </el-table-column>
      <el-table-column
        align="center"
        prop="orderId"
        label="订单编号"
        width="120">
      </el-table-column>
      <el-table-column
        align="center"
        prop="use_time"
        label="下单价格"
        width="120">
      </el-table-column>
      <el-table-column
        align="center"
        prop="orderPayType"
        label="订单类型"
        width="120">
      </el-table-column>
      <el-table-column
        align="center"
        prop="use_time"
        label="支付方式"
        width="120">
      </el-table-column>
      <el-table-column
        align="center"
        prop="payStatus"
        label="支付状态"
        width="120">
      </el-table-column>
      <el-table-column
        align="center"
        prop="fundAccount"
        label="资金账号"
        width="110">
      </el-table-column>
      <el-table-column
        align="center"
        prop="branch"
        label="中心营业部/分公司"
        width="180">
      </el-table-column>
      <el-table-column
        align="center"
        prop="sales"
        label="营业部"
        width="280">
      </el-table-column>
      <el-table-column
        align="center"
        prop="type"
        label="优惠券id"
        width="250">
      </el-table-column>
      <el-table-column
        align="center"
        prop="validity_time"
        label="优惠券类型"
        width="120">
      </el-table-column>
      <el-table-column
        align="center"
        prop="phone"
        label="优惠券金额"
        width="130">
      </el-table-column>
    </el-table>

    <div class="block" style="float:right;margin:10px 18px">
      <el-button type="primary" :disabled="hasProPage" @click="nextPage('-1')">上一页</el-button>
      第{{currentPage}}页
      <el-button type="primary" :disabled="!hasNextPage" @click="nextPage('1')">下一页</el-button>
    </div>
  </div>
</template>

<script>
    export default {
      name: 'level2StatisticData',
      data: function () {
        return {
          type_options_value: '资金账号',
          type_options: [ {
            value: '资金账号'
          }, {
            value: '手机号'
          }],
          input_value: '50016518',
          requestParams: {
            cp: '1',
            ps: '10'
          },
          hasNextPage: false,
          hasProPage: false,
          listLoading: false,
          currentPage: '1',
          users: ''
        }
      },

      mounted () {
        // alert('获取数据')
        this.defaultConfig()
        this.getSearchData()
      },
      methods: {
        defaultConfig () {
          this.type_options_value = this.type_options[0].value
          this.requestParams.cp = 1
          this.requestParams.ps = 10
          this.requestParams.queryType = 'fund'
          this.requestParams.queryContent = ''
        },
        getSearchData () {
          // alert('查询')
          this.getAllData()
        },
        getAllData () {
          // alert('查询所有数据')
          if (this.type_options_value === '资金账号') {
            this.requestParams.fundAccount = this.input_value
          } else if (this.type_options_value === '手机号') {
            this.requestParams.phone = this.input_value
          }
          let _this = this
          _this.isLoading = true
          this.$http({
            method: 'GET',
            url: 'e/operate/quota/l2/info',
            params: this.requestParams,
            headers: {'X-Requested-With': 'XMLHttpRequest'},
            body: {},
            emulateJSON: false
          }).then(function (result) {
            _this.users = result.body.data.infos
            _this.currentPage = result.body.data.currentPage
            _this.hasNextPage = result.body.data.hasNextPage
            _this.listLoading = false
          }).catch(() => {
            _this.$message.error('获取数据失败')
            _this.listLoading = false
          })
        },
        exportData () {
          alert('导出')
        }
      },

      watch: {
        type_options_value (curVal, oldVal) {
          this.input_value = ''
        }
        // input_value (curVal, oldVal) {
        //   clearTimeout(this.timeout)
        //   this.timeout = setTimeout(() => {
        //     if (this.type_options_value === '资金账号') {
        //       this.requestParams.fundAccount = this.input_value
        //     } else if (this.type_options_value === '手机号') {
        //       this.requestParams.phone = this.input_value
        //     }
        //   }, 500)
        // }
      }
    }
</script>

<style scoped>

</style>
