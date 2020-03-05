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

    <el-input ref="input" v-model="input_value" placeholder="请输入内容" style="width: 210px"></el-input>
    <el-button @click="getSearchData()">查询</el-button>
    <el-button @click.native="exportData">导出</el-button>

    <div style="height: 50px;width:100%;"></div>
    <el-table
      :data="users"
      style="width: 100%;text-align: center"
      v-loading = 'listLoading'>
      <el-table-column
        align="center"
        prop="phone"
        label="用户账号"
        width="150">
      </el-table-column>
      <el-table-column
        align="center"
        prop="serviceName"
        label="服务类型"
        width="150">
      </el-table-column>
      <el-table-column
        align="center"
        prop="orderType"
        label="商品类型"
        width="200">
      </el-table-column>
      <el-table-column
        align="center"
        prop="orderTermName"
        label="商品名称"
        width="130">
      </el-table-column>
      <el-table-column
        align="center"
        prop="userType"
        label="用户类型"
        width="120">
      </el-table-column>
      <el-table-column
        align="center"
        prop="orderTerm"
        label="服务时长"
        width="130">
        <template slot-scope="scope">
          {{scope.row.orderTerm + '个月'}}
        </template>
      </el-table-column>
      <el-table-column
      align="center"
      prop="serviceStartAt"
      label="权限（服务）开始时间"
      width="210">
        <template slot-scope="scope">
          {{scope.row.serviceStartAt | timeDateFormatChange}}
        </template>
    </el-table-column>
      <el-table-column
        align="center"
        prop="serviceEndAt"
        label="权限（服务）结束时间"
        width="210">
        <template slot-scope="scope">
          {{scope.row.serviceEndAt | timeDateFormatChange}}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="initDate"
        label="创建时间"
        width="120">
      </el-table-column>
      <el-table-column
        align="center"
        prop="serviceStatus"
        label="服务状态"
        width="150">
      </el-table-column>
      <el-table-column
        align="center"
        prop="orderId"
        label="订单编号"
        width="300">
      </el-table-column>
      <el-table-column
        align="center"
        prop="payPrice"
        label="下单价格"
        width="120"
        :formatter="formatePrice">
      </el-table-column>
      <el-table-column
        align="center"
        prop="orderPayType"
        label="订单类型"
        width="120">
          <template slot-scope="scope">
              <div v-if="scope.row.orderPayType === 0">付费</div>
              <div v-else-if="scope.row.orderPayType === 1">免费</div>
          </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="payway"
        label="支付方式"
        width="120">
        <template slot-scope="scope">
          <div v-if="scope.row.payway === 0">微信支付</div>
          <div v-else-if="scope.row.payway === 1">证联支付</div>
          <div v-else-if="scope.row.payway === 2">优惠券支付</div>
          <div v-else-if="scope.row.payway === 9">其他支付</div>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="payStatus"
        label="支付状态"
        width="120">
        <template slot-scope="scope">
          <div v-if="scope.row.payStatus === 0">未支付</div>
          <div v-else-if="scope.row.payStatus === 1">订单关闭</div>
          <div v-else-if="scope.row.payStatus === 2">已经支付</div>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="fundAccount"
        label="资金账号"
        width="110">
      </el-table-column>
      <el-table-column
        align="center"
        prop="name"
        label="客户姓名"
        width="110">
      </el-table-column>
      <el-table-column
        align="center"
        prop="deptName"
        label="中心营业部/分公司"
        width="230">
      </el-table-column>
      <el-table-column
        align="center"
        prop="subDeptName"
        label="营业部"
        width="280">
      </el-table-column>
      <el-table-column
        align="center"
        prop="couponId"
        label="优惠券id"
        width="150">
      </el-table-column>
      <el-table-column
        align="center"
        prop="couponType"
        label="优惠券类型"
        width="300">
        <template slot-scope="scope">
          <div v-if="scope.row.couponType === 1">每个自然月首次新增资产达5~30万</div>
          <div v-else-if="scope.row.couponType === 2">每个自然月首次新增资产达30万</div>
          <div v-else-if="scope.row.couponType === 3">首次开通创业板</div>
          <div v-else-if="scope.row.couponType === 4">新开港股通</div>
          <div v-else-if="scope.row.couponType === 5">新开科创板</div>
          <div v-else-if="scope.row.couponType === 6">新开沪深账户</div>
          <div v-else-if="scope.row.couponType === 7">新开两融账户</div>
          <div v-else-if="scope.row.couponType === 8">新开期权账户</div>
          <div v-else-if="scope.row.couponType === 100">投票活动中奖</div>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="couponPrice"
        label="优惠券金额"
        width="130"
        :formatter="formatePrice">
      </el-table-column>
    </el-table>

    <div class="block" style="float:right;margin:10px 18px">
      <el-button type="primary" :disabled="!hasProPage" @click="nextPage('-1')">上一页</el-button>
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
          type_options_value: '所有',
          type_options: [ {
            value: '所有'
          }, {
            value: '资金账号'
          }, {
            value: '手机号'
          }],
          input_value: '',
          requestParams: {
            cp: 1,
            ps: 20
          },
          hasNextPage: false,
          hasProPage: false,
          listLoading: false,
          currentPage: 1,
          users: ''
        }
      },

      mounted () {
        this.defaultConfig()
        this.getSearchData()
      },
      methods: {
        defaultConfig () {
          this.currentPage = 1
          this.hasProPage = false
          this.hasNextPage = false
          this.type_options_value = this.type_options[0].value
          this.requestParams.cp = this.currentPage
          this.requestParams.ps = 20
        },
        getSearchData () {
          this.getAllData()
        },
        getAllData () {
          if (this.type_options_value === '资金账号') {
            this.requestParams.fundAccount = this.input_value
          } else if (this.type_options_value === '手机号') {
            this.requestParams.phone = this.input_value
          }
          let _this = this
          _this.listLoading = true
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
          var path = 'quota/l2/csv?'
          var params = this.requestParams
          for (var prop in params) {
            if (params[prop] != undefined) {
              path += prop + '=' + params[prop] + '&'
            }
          }
          path = path.substr(0, path.length - 1)
          window.open('e/operate/' + path)
        },
        nextPage (p) {
          if (p === '-1') {
            this.currentPage -= 1
          } else if (p === '1') {
            this.currentPage += 1
          }
          if (this.currentPage <= 1) {
            this.hasProPage = false
            this.currentPage = 1
          } else {
            this.hasProPage = true
          }
          this.requestParams.cp = this.currentPage
          this.getAllData()
        },
        formatePrice :function(row, column) {
          if (row.couponPrice){
            return row.couponPrice/100
          }
        }
      },

      watch: {
        type_options_value (curVal, oldVal) {
          this.input_value = ''
          this.requestParams.phone = undefined
          this.requestParams.fundAccount = undefined
          this.currentPage = 1
          this.requestParams.cp = this.currentPage
          this.hasProPage = false
        },
        input_value (curVal, oldVal) {
        //   clearTimeout(this.timeout)
        //   this.timeout = setTimeout(() => {
        //     if (this.type_options_value === '资金账号') {
        //       this.requestParams.fundAccount = this.input_value
        //     } else if (this.type_options_value === '手机号') {
        //       this.requestParams.phone = this.input_value
        //     }
        //   }, 500)
        }
      }
    }
</script>

<style scoped>

</style>
