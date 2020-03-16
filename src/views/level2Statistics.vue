<template>
  <div>
    <div v-show="showStatistics">
      <el-row>
        <el-col :span="7">
          <span class="demonstration" style="color:red">*</span>
          <span class="demonstration"> 选择时间：</span>
          <el-select v-model="type_time_value" placeholder="请选择" style="width: 180px">
            <el-option
              v-for="item in type_time"
              :key="item.value"
              :label="item.value"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="8">
          <mark
            style="position:fixed;top:0;bottom:0;left:0;right:0;background:rgba(0,0,0,0);z-index:999;"
            v-show="showSeason"
            @click.stop="showSeason=false"
          ></mark>

          <el-input placeholder="请选择季度" v-model="showValue" style="width:138px;" @focus="showSeason=true" v-show="seasonShow">
            <i slot="prefix" class="el-input__icon el-icon-date"></i>
          </el-input>
          <el-card
            class="box-card"
            style="width:322px;padding: 0 3px 20px;margin-top:10px;position:fixed;z-index:9999"
            v-show="showSeason"
          >
            <div slot="header" class="clearfix" style="text-align:center;padding:0">
              <button
                type="button"
                aria-label="前一年"
                class="el-picker-panel__icon-btn el-date-picker__prev-btn el-icon-d-arrow-left"
                @click="prev"
              ></button>
              <span role="button" class="el-date-picker__header-label">{{year}}年</span>
              <button
                type="button"
                aria-label="后一年"
                @click="next"
                class="el-picker-panel__icon-btn el-date-picker__next-btn el-icon-d-arrow-right"
              ></button>
            </div>
            <div class="text item" style="text-align:center;">
              <el-button
                type="text"
                size="medium"
                style="width:40%;color: #606266;float:left;"
                @click="selectSeason(0)"
              >第一季度</el-button>
              <el-button
                type="text"
                size="medium"
                style="float:right;width:40%;color: #606266;"
                @click="selectSeason(1)"
              >第二季度</el-button>
            </div>
            <div class="text item" style="text-align:center;">
              <el-button
                type="text"
                size="medium"
                style="width:40%;color: #606266;float:left;"
                @click="selectSeason(2)"
              >第三季度</el-button>
              <el-button
                type="text"
                size="medium"
                style="float:right;width:40%;color: #606266;"
                @click="selectSeason(3)"
              >第四季度</el-button>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-date-picker
            v-model="monthData"
            type="month"
            placeholder="选择月"
            v-show="monthShow"
            value-format="yyyy-MM"
            clearable="false">
          </el-date-picker>
        </el-col>

        <el-col :span="8">
          <el-date-picker
            v-model="yearData"
            type="year"
            placeholder="选择年"
            v-show="yearShow"
            value-format="yyyy"
            clearable="false">
          </el-date-picker>
        </el-col>
      </el-row>

      <div>
        <div style="height: 30px;"></div>
        <span class="demonstration" style="color:red">*</span>
        <span class="demonstration"> 统计方式：</span>
        <el-select v-model="type_options_value" placeholder="统计方式" style="width: 180px">
          <el-option
            v-for="item in type_options"
            :key="item.value"
            :label="item.value"
            :value="item.value">
          </el-option>
        </el-select>
        <el-button style="margin-left: 25px" type="primary" @click="getSearchData()">查询</el-button>
      </div>

      <el-table :data="datas"
                v-loading = 'listLoading'
                style="margin-top: 30px"
                v-show="showResult">

        <el-table-column
                    align="center"
                    :label = this.type_tab_title >
          <template slot-scope="scope">
            <span v-if="scope.row.deptName != null">{{scope.row.deptName}}</span>
            <span v-else-if="scope.row.subDeptName != null">{{scope.row.subDeptName}}</span>
            <span v-else-if="scope.row.payway!= null &&  scope.row.payway=== 0">微信支付</span>
            <span v-else-if="scope.row.payway!= null &&  scope.row.payway=== 1">证联支付</span>
            <span v-else-if="scope.row.payway!= null &&  scope.row.payway=== 2">优惠券支付</span>
            <span v-else-if="scope.row.payway!= null &&  scope.row.payway=== 9">其他支付</span>
            <span v-else-if="scope.row.orderTermName!= null">{{scope.row.orderTermName}}</span>
            <span v-else-if="scope.row.serviceName!= null">{{scope.row.serviceName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         prop="totalCount"
                         label="用户数">
          <template slot-scope="scope">
          <span  style="color:blue" @click="showDetailPage(scope.row)">{{scope.row.totalCount}}</span>
          </template>
        </el-table-column>
      </el-table>


    </div>
    <div v-show="showDetail">
      <div style="display: inline-flex">
        <span @click="backToStatisticPage" style="color:blue">数据统计</span>
        <span>》明细详单</span>
        <!--      <span>明细详单</span>-->
      </div>
      <div style="height: 20px"></div>
      <el-col>
        <el-button @click.native="exportData">导出</el-button>
      </el-col>
      <el-col>
        <div style="height: 20px"></div>
        <el-table
          :data="users"
          style="width: 100%;text-align: center"
          v-loading = 'listLoading'
        >
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
      </el-col>
    </div>

    <div class="block" style="float:right;margin:10px 18px" v-show="showResult">
      <el-button type="primary" :disabled="!hasProPage" @click="nextPage('-1')">上一页</el-button>
      第{{currentPage}}页
      <el-button type="primary" :disabled="!hasNextPage" @click="nextPage('1')">下一页</el-button>
    </div>
  </div>

</template>

<script>
    export default {
      name: 'level2Statistics',
      data: function () {
        return {
          type_options_value: '全部',
          type_tab_title: '全部',
          type_options: [{
            value: '全部'
          }, {
            value: '中心分公司'
          }, {
            value: '营业部'
          }, {
            value: '支付方式'
          }, {
            value: '商品名称'
          }],
          input_value: '',
          monthData: new Date(),
          yearData: '',
          showSeason: false,
          season: '',
          year: new Date().getFullYear(),
          showValue: '',
          hisMonthData: '',
          hisYearData: '',
          type_time_value: '按月统计',
          type_time: [{
            value: '按月统计'
          }, {
            value: '按季度统计'
          }, {
            value: '按年统计'
          }],
          seasonShow: false,
          monthShow: true,
          yearShow: false,
          showResult: false,
          showStatistics: true,
          showDetail: false,
          datas: '',
          currentPage: 1,
          historyCp: '',
          historyHasNp: '',
          historyHasPp: '',
          paramYear: '',
          paramMonth: '',
          paramSeason: '',
          hasNextPage: false,
          hasProPage: false,
          listLoading: false,
          requestParams: {
            statisticsParam: 'all',
            ps: 20,
            cp: 1,
            year: new Date().getFullYear(),
            month: new Date().getMonth() + 1
          },
          columnConfig: [],
          itemId: ''
        }
      },
      props: {
        valueArr: {
          default: () => {
            return ['01-03', '04-06', '07-09', '10-12']
          },
          type: Array
        },
        getValue: {
          default: () => {},
          type: Function
        },
        defaultValue: {
          default: '',
          type: String
        }
      },
      created () {
        if (this.defaultValue) {
          let value = this.defaultValue
          let arr = value.split('-')
          this.year = arr[0].slice(0, 4)
          let str = arr[0].slice(4, 6) + '-' + arr[1].slice(4, 6)
          let arrAll = this.valueArr
          this.showValue = `${this.year}年${arrAll.indexOf(str) + 1}季度`
        }
      },
      watch: {
        defaultValue (value, oldValue) {
          let arr = value.split('-')
          this.year = arr[0].slice(0, 4)
          let str = arr[0].slice(4, 6) + '-' + arr[1].slice(4, 6)
          let arrAll = this.valueArr
          this.showValue = `${this.year}年${arrAll.indexOf(str) + 1}季度`
        },
        type_time_value (curValue, oldValue) {
          this.resetPageConfig()
          if (curValue === '按月统计') {
            if (this.hisMonthData !== '') {
              let arr = this.hisMonthData.split('-')
              this.requestParams.year = arr[0]
              this.requestParams.month = arr[1]
            }
            this.seasonShow = false
            this.monthShow = true
            this.yearShow = false
          } else if (curValue === '按季度统计') {
            if (this.season !== '') {
              this.selectSeason(this.season - 1)
            }
            this.seasonShow = true
            this.monthShow = false
            this.yearShow = false
          } else if (curValue === '按年统计') {
            if (this.hisYearData !== '') {
              this.requestParams.year = this.hisYearData
              this.requestParams.month = undefined
              this.requestParams.quarter = undefined
            }
            this.seasonShow = false
            this.monthShow = false
            this.yearShow = true
          }
        },
        monthData (curValue, oldValue) {
          this.resetPageConfig()
          this.hisMonthData = curValue
          let arr = curValue.split('-')
          this.requestParams.year = arr[0]
          this.requestParams.month = arr[1]
          // this.requestParams.year = curValue.getFullYear()
          // this.requestParams.month = curValue.getMonth()
          this.requestParams.quarter = undefined
        },
        yearData (curValue, oldValue) {
          this.resetPageConfig()
          this.hisYearData = curValue
          this.requestParams.year = curValue
          this.requestParams.month = undefined
          this.requestParams.quarter = undefined
        },
        type_options_value (curValue, oldValue) {
          this.resetPageConfig()
          if (curValue === '全部') {
            this.requestParams.statisticsParam = 'all'
          } else if (curValue === '中心分公司') {
            this.requestParams.statisticsParam = 'deptName'
            // this.type_tab_title = '中心营业部/分公司'
          } else if (curValue === '营业部') {
            this.requestParams.statisticsParam = 'subDeptName'
          } else if (curValue === '支付方式') {
            this.requestParams.statisticsParam = 'payway'
          } else if (curValue === '商品名称') {
            this.requestParams.statisticsParam = 'orderTermName'
          }
        }
      },
      mounted: function () {
        if (window.history && window.history.pushState) {
          // 向历史记录中插入了当前页
          history.pushState(null, null, document.URL)
          window.addEventListener('popstate', this.goBack, false)
        }
      },
      destroyed () {
        window.removeEventListener('popstate', this.goBack, false)
      },
      methods: {
        one () {
          this.showSeason = false
        },
        prev () {
          this.year = this.year * 1 - 1
        },
        next () {
          this.year = this.year * 1 + 1
        },
        resetPageConfig () {
          this.currentPage = 1
          this.hasProPage = false
          this.requestParams.cp = this.currentPage
        },
        selectSeason (i) {
          this.resetPageConfig()
          let that = this
          that.season = i + 1
          let arr = that.valueArr[i].split('-')
          that.getValue(that.year + arr[0] + '-' + that.year + arr[1])
          that.showSeason = false
          this.showValue = `${this.year}年${this.season}季度`
          this.requestParams.year = this.year
          this.requestParams.quarter = this.season
          this.requestParams.month = undefined
        },
        getSearchData () {
          let _this = this
          _this.listLoading = true
          _this.colConfigs = undefined
          _this.datas = undefined

          this.$http({
            method: 'GET',
            url: 'e/operate/quota/l2/statistics',
            params: this.requestParams,
            headers: {'X-Requested-With': 'XMLHttpRequest'},
            body: {},
            emulateJSON: false
          }).then(function (result) {
            _this.datas = result.body.data.groupInfos
            _this.currentPage = result.body.data.currentPage
            _this.hasNextPage = result.body.data.hasNextPage
            _this.listLoading = false
            this.type_tab_title = this.type_options_value === '中心分公司' ? '中心营业部/分公司' : this.type_options_value
            _this.colConfigs = [{
              prop: this.requestParams.statisticsParam,
              label: (this.type_options_value === '中心分公司' ? '中心营业部/分公司' : this.type_options_value)
            }, {
              prop: 'totalCount',
              label: '用户数'}
            ]
            _this.showResult = true
          }).catch(() => {
            _this.$message.error('获取数据失败')
            _this.listLoading = false
          })
        },
        nextPage (p) {
          if (p === '-1') {
            if (!this.hasProPage) {
              return
            }
            this.currentPage -= 1
          } else if (p === '1') {
            if (!this.hasNextPage) {
              return
            }
            this.currentPage += 1
          }
          if (this.currentPage <= 1) {
            this.hasProPage = false
            this.currentPage = 1
          } else {
            this.hasProPage = true
          }
          this.requestParams.cp = this.currentPage
          if (this.showStatistics) {
            this.getSearchData()
          } else if (this.showDetail) {
            this.getDetailPage()
          }
        },
        showDetailPage (item) {
          this.showStatistics = false
          this.showDetail = true
          // this.requestParams.deptSerialNo = undefined
          // this.requestParams.subDeptSerialNo = undefined
          // this.requestParams.payway = undefined
          // this.requestParams.orderTerm = undefined
          if (this.type_options_value === '中心分公司') {
              // this.itemId = item.deptSerialNo
            this.requestParams.deptSerialNo = item.deptSerialNo
          } else if (this.type_options_value === '营业部') {
              // this.itemId = item.subDeptSerialNo
            this.requestParams.subDeptSerialNo = item.subDeptSerialNo
          } else if (this.type_options_value === '支付方式') {
              // this.itemId = item.payway
            this.requestParams.payway = item.payway
          } else if (this.type_options_value === '商品名称') {
              // this.itemId = item.orderTerm
            this.requestParams.orderTerm = item.orderTerm
          }
          this.historyCp = this.currentPage
          this.historyHasNp = this.hasNextPage
          this.historyHasPp = this.hasProPage
          this.currentPage = 1
          this.requestParams.cp = this.currentPage
          this.getDetailPage()
        },
        getDetailPage () {
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
        backToStatisticPage () {
          this.requestParams.deptSerialNo = undefined
          this.requestParams.subDeptSerialNo = undefined
          this.requestParams.payway = undefined
          this.requestParams.orderTerm = undefined
          this.showStatistics = true
          this.showDetail = false
          this.currentPage = this.historyCp
          this.requestParams.cp = this.currentPage
          this.hasProPage = this.historyHasPp
          this.hasNextPage = this.historyHasNp
        },
        exportData () {
          debugger
          var path = 'quota/l2/csv?'
          var params = this.requestParams
          for (var prop in params) {
            if (params[prop] !== undefined) {
              path += prop + '=' + params[prop] + '&'
            }
          }
          path = path.substr(0, path.length - 1)
          window.open('e/operate/' + path)
        },
        goBack () {
          if (this.showDetail) {
            this.backToStatisticPage()
            return
          }
          history.pushState(null, null, document.URL)
        },
        formatePrice: function (row, column) {
          if (row.couponPrice) {
            return row.couponPrice / 100
          }
        }
      }
    }
</script>

<style scoped>

</style>
