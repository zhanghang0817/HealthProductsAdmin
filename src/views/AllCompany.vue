<template>
  <el-tabs type="border-card" v-model="activeName" v-loading='ifLoading'>
    <el-tab-pane label="e智通覆盖率(考核数据)" name="third">
      <el-row>
        <el-col :span="24">
          <el-select class="timeLong" v-model="coverRateTimeLong" placeholder="请选择" @change="coverRateChangeTime">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <div class="charts">
            <div style="width: 100%;height: 100%" id="container2">567</div>
          </div>
          <div class="table">
            <el-table :data="coverRateTableData" border style="width: 100%">
              <el-table-column width="100" label="日期">
                <template slot-scope="scope">
                  <span style="margin-left: 10px;">{{ scope.row.startDate | dateChange}}</span>
                </template>
              </el-table-column>
              <el-table-column  width="150" label="e智通总体覆盖率">
                <template slot-scope="scope">
                  <span style="margin-left: 10px;" v-html="$options.filters.quarterRate1(scope.row.sumRate)"></span>
                </template>
              </el-table-column>
              <el-table-column width="200" label="e智通总体覆盖资金账户数">
                <template slot-scope="scope">
                  <span style="margin-left: 10px;">{{ scope.row.sumAccount | count}}</span>
                </template>
              </el-table-column>
              <el-table-column  min-width="290" label="本月（环比上个季度）e智通新增覆盖率">
                <template slot-scope="scope">
                  <span style="margin-left: 10px;" v-html="$options.filters.quarterRate1(scope.row.momRate)"></span>
                </template>
              </el-table-column>
              <el-table-column  min-width="310" label="本月（环比上个季度）新增覆盖资金账户数">
                <template slot-scope="scope">
                  <span style="margin-left: 10px;">{{ scope.row.momAccount | count}}</span>
                  <el-button v-if="companyName!=='全公司'" @click="downLoad(scope.row.startDate, companyName,1,scope.row.next)" class="downLoad" :plain="true" type="text" size="small"><i class="fa fa-download"></i>下载已登录客户详单</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-col>
      </el-row>
      <el-pagination @current-change="coverRateHandleCurrentChange" :current-page="coverRateCp"  class="pager" layout="prev, pager, next" :total="coverRateTotal" :page-size="coverRatePs"></el-pagination>
    </el-tab-pane>
    <el-tab-pane label="本季度登录有效用户数(非考核数据)" name="first">
      <el-row>
        <el-col :span="24">
          <el-select class="timeLong" v-model="countTimeLong" placeholder="请选择" @change="countChangeTime">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <div class="charts">
            <div style="width: 100%;height: 100%" id="container">123</div>
          </div>
          <div class="table">
            <el-table :data="countTableData" border style="width: 100%">
              <el-table-column width="200" label="日期">
                <template slot-scope="scope">
                  <span style="margin-left: 10px;">{{ scope.row.month }}</span>
                </template>
              </el-table-column>
              <el-table-column label="使用过e智通的资金账户数">
                <template slot-scope="scope">
                  <span style="margin-left: 10px;">{{ scope.row.validNum | count}}</span>
                  <el-button v-if="companyName!=='全公司'" @click="downLoad(scope.row.month, companyName,0,scope.row.next)" class="downLoad" :plain="true" type="text" size="small"><i class="fa fa-download"></i>下载已登录客户详单</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-col>
      </el-row>
      <el-pagination @current-change="countHandleCurrentChange" :current-page="countCp" class="pager" layout="prev, pager, next" :total="countTotal" :page-size="countPs"></el-pagination>
    </el-tab-pane>
    <el-tab-pane label="本季度登录有效用户占比(非考核数据)" name="second">
      <el-row>
        <el-col :span="24">
          <el-select class="timeLong" v-model="ratioTimeLong" placeholder="请选择" @change="ratioChangeTime">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <div class="charts">
            <div style="width: 100%;height: 100%" id="container1">345</div>
          </div>
          <div class="table">
            <el-table :data="ratioTableData" border style="width: 100%">
              <el-table-column width="200" label="日期">
                <template slot-scope="scope">
                  <span style="margin-left: 10px;">{{ scope.row.month }}</span>
                </template>
              </el-table-column>
              <el-table-column label="使用过e智通的资金账户占比">
                <template slot-scope="scope">
                  <span style="margin-left: 10px;" v-html="$options.filters.quarterRate(scope.row.validRatio, scope.row.rateChange)"></span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-col>
      </el-row>
      <el-pagination @current-change="ratioHandleCurrentChange" :current-page="ratioCp"  class="pager" layout="prev, pager, next" :total="ratioTotal" :page-size="ratioPs"></el-pagination>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
//  import MD5 from './assets/md5.js'
  import md5 from 'js-md5'
  export default {
    data () {
      return {
        activeName: 'third',
        options: [{
          value: 5,
          label: '近5月'
        }, {
          value: 10,
          label: '近10月'
        }, {
          value: 20,
          label: '近20月'
        }],
        // depName: '',
        countTimeLong: 5,
        countCp: 1,
        countCp20: 1,
        countPs: 5,
        countTotal: 1,
        countTableData: [],
        ratioTimeLong: 5,
        ratioCp: 1,
        ratioCp20: 1,
        ratioPs: 5,
        ratioTotal: 1,
        ratioTableData: [],
        ifLoading: 1,
        coverRateTimeLong: 5,
        coverRateCp: 1,
        coverRateCp20: 1,
        coverRatePs: 5,
        coverRateTotal: 1,
        coverRateTableData: []
      }
    },
    methods: {
      countHandleCurrentChange: function (val) {
        this.countCp = val
        this.getData(val, 'loginValid/totalByMonth')
      },
      ratioHandleCurrentChange: function (val) {
        // alert(val)
        this.ratioCp = val
        this.getData(val, 'loginValid/ratioByMonth')
      },
      coverRateHandleCurrentChange: function (val) {
        // alert(val)
        this.coverRateCp = val
        this.getData(val, 'assess/coverRate')
      },
      countChangeTime: function (val) {
        this.countTimeLong = val
        this.countCp = 1
        this.getData(1, 'loginValid/totalByMonth', val)
      },
      ratioChangeTime: function (val) {
        this.ratioTimeLong = val
        this.ratioCp = 1
        this.getData(1, 'loginValid/ratioByMonth', val)
      },
      coverRateChangeTime: function (val) {
        this.coverRateTimeLong = val
        this.coverRateCp = 1
        this.getData(1, 'assess/coverRate', val)
      },
      getData: function (cp, address, month) {
        let _this = this
        let timeLongs
        let ps
        if (address === 'loginValid/ratioByMonth') {
          timeLongs = month || this.ratioTimeLong
          ps = this.countPs
        } else if (address === 'loginValid/totalByMonth') {
          timeLongs = month || this.countTimeLong
          ps = this.ratioPs
        } else {
          timeLongs = month || this.coverRateTimeLong
          ps = this.coverRatePs
        }
        if (!_this.companyName) {
          _this.companyName = '全公司'
        } else {
          _this.companyName = _this.companyName
        }
        this.$http({
          method: 'GET',
          url: 'e/operate/' + address,
          params: {monthNum: timeLongs, depName: _this.companyName, cp: cp, ps: ps, sign: md5('cp=' + cp + '&depName=' + _this.companyName + '&monthNum=' + timeLongs + '&ps=' + ps + '&appKey=3EBD34571F489A357385AEFAEDACF9C1' + '&key=')},
          headers: {'X-Requested-With': 'XMLHttpRequest'},
          emulateJSON: true
        }).then(function (result) {
          if (address === 'loginValid/ratioByMonth') {
            _this.ratioTableData = result.body.data.validList
            _this.ratioTotal = result.body.data.totalSize
          } else if (address === 'loginValid/totalByMonth') {
            _this.countTableData = result.body.data.validList
            let nextDate1 = _this.countTableData[0].month.substring(0, 4)
            let nextDate2 = Number(_this.countTableData[0].month.substring(5, 7)) + 1
            if (nextDate2 < 10) {
              nextDate2 = '0' + nextDate2
            } else if (nextDate2 > 12) {
              nextDate1 = Number(nextDate1) + 1
              nextDate2 = '01'
            }
            let nextDate = nextDate1 + '-' + nextDate2
            _this.countTableData.unshift({'month': nextDate, 'next': 1})
            _this.countTotal = result.body.data.totalSize
          } else {
            _this.coverRateTableData = result.body.data.validList
//            let nextDate = Number(_this.coverRateTableData[0].startDate) + 2678400000
            _this.coverRateTableData.unshift({'startDate': Date.parse(new Date()), 'next': 1})
            _this.coverRateTotal = result.body.data.totalSize
          }
          _this.ifLoading = 0
        }).catch(() => {
          this.$message.error('请重新登录')
          _this.$router.push('/')
        })
        // 创建图表
        this.$http({
          method: 'GET',
          url: 'e/operate/' + address,
          params: {monthNum: timeLongs, depName: _this.companyName, cp: 1, ps: 22, sign: md5('cp=1' + '&depName=' + _this.companyName + '&monthNum=' + timeLongs + '&ps=22' + '&appKey=3EBD34571F489A357385AEFAEDACF9C1' + '&key=')},
          headers: {'X-Requested-With': 'XMLHttpRequest'},
          emulateJSON: true
        }).then(function (result) {
          var ratioLineData = []
          let xData = []
          let yData = []
          let zData = []
          if (address === 'loginValid/totalByMonth') {
            // 创建图表
            var tit = ''
            let chartDatas = result.body.data.validList.reverse()
            for (var i = 0; i <= chartDatas.length - 1; i++) {
              var temp = []
              temp.push(chartDatas[i].startDate)
              temp.push(chartDatas[i].validNum)
              xData.push(chartDatas[i].startDate)
              zData.push(chartDatas[i].month)
              yData.push(chartDatas[i].validNum)
              ratioLineData.push(temp)
            }
            if (chartDatas.length === 1) {
              tit = chartDatas[0].month
            } else {
              tit = chartDatas[0].month + '~' + chartDatas[chartDatas.length - 1].month
            }
            // tit = result.body.data.validList[result.body.data.validList.length - 1].month + '~' + result.body.data.validList[0].month
            this.createChart('container', ratioLineData, tit, xData, yData)
          } else if (address === 'loginValid/ratioByMonth') {
            // 创建图表
            var tit1 = ''
            let chartDatas = result.body.data.validList.reverse()
            for (var j = 0; j <= chartDatas.length - 1; j++) {
              var tem = []
              tem.push(chartDatas[j].startDate)
              tem.push(chartDatas[j].validRatio)
              tem.push(chartDatas[j].rateChange)
              xData.push(chartDatas[j].startDate)
              yData.push(chartDatas[j].validRatio)
              zData.push(chartDatas[j].month)
              ratioLineData.push(tem)
            }
            if (chartDatas.length === 1) {
              tit1 = chartDatas[0].month
            } else {
              tit1 = chartDatas[0].month + '~' + chartDatas[chartDatas.length - 1].month
            }
            // tit1 = result.body.data.validList[result.body.data.validList.length - 1].month + '~' + result.body.data.validList[0].month
            this.createChart('container1', ratioLineData.reverse(), tit1, xData, yData)
          } else {
            // 创建图表
            var tit2 = ''
            let chartDatas = result.body.data.validList.reverse()
            for (var p = 0; p <= chartDatas.length - 1; p++) {
              var tem2 = []
              tem2.push(chartDatas[p].startDate)
              tem2.push(chartDatas[p].sumRate)
              tem2.push(chartDatas[p].momRate)
              xData.push(chartDatas[p].startDate)
              yData.push(chartDatas[p].sumRate)
              zData.push(chartDatas[p].startDate)
              ratioLineData.push(tem2)
            }
            if (chartDatas.length === 1) {
//              tit2 = chartDatas[0].startDate
              let date = new Date(parseInt(chartDatas[0].startDate))
              let Y = date.getFullYear() + '-'
              let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1)
              tit2 = Y + M
            } else {
              let date = new Date(parseInt(chartDatas[0].startDate))
              let Y = date.getFullYear() + '-'
              let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1)
              let v1 = Y + M
              let date1 = new Date(parseInt(chartDatas[chartDatas.length - 1].startDate))
              let Y1 = date1.getFullYear() + '-'
              let M1 = (date1.getMonth() + 1 < 10 ? '0' + (date1.getMonth() + 1) : date1.getMonth() + 1)
              let v2 = Y1 + M1
              tit2 = v1 + '~' + v2
            }
            // tit1 = result.body.data.validList[result.body.data.validList.length - 1].month + '~' + result.body.data.validList[0].month
            this.createChart('container2', ratioLineData.reverse(), tit2, xData, yData)
          }
        })
      },
      getAllData: function () {
        this.getData(1, 'loginValid/totalByMonth')
        this.getData(1, 'loginValid/ratioByMonth')
        this.getData(1, 'assess/coverRate')
      },
      downLoad: function (month, name, index, next) {
        if (!name) {
          name = '全公司'
        }
        let _type = ''
        if (next) {
          _type = 'now'
        }
        if (index !== 1) {
          window.location.href = '/e/operate/account/download?depName=' + name + '&startDate=' + month + '&type=' + _type
        } else {
          let date = new Date(parseInt(month))
          let Y = date.getFullYear() + '-'
          let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1)
          let month1 = Y + M
          if (next) {
            window.location.href = '/e/operate/account/download?depName=' + name + '&startDate=' + month1 + '&type=' + _type
            return
          }
          window.location.href = '/e/operate/account/exportAccountCsv?depName=' + name + '&startDate=' + month1 + '&calRule=' + '1' + '&type=' + _type
        }
      },
      createChart: function (id, data, tit, xData, yData) {
        var chart = require('highcharts')
        chart.chart(id, {
          chart: {type: 'spline'},
          title: {text: ''},
          xAxis: {
            type: 'datetime',
            tickLength: 0, // X轴下标长度
            categories: xData,
            labels: {
              style: {
                fontSize: '10px',
                color: '#677d91'
              },
              formatter: function () {
                var temptime = this.value
                var date = new Date(parseInt(temptime, 10))
                var y = date.getFullYear()
                var m = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
                return y + '.' + m
              }
            }},
          yAxis: {
            title: '',
            labels: {
              formatter: function () {
//                console.log(this.value)
                let str1 = ''
                if (id === 'container1' || id === 'container2') {
                  // 添加%
                  str1 = this.value + '%'
                } else {
                  // 不添加%
                  str1 = this.value
                }
                return str1
              }
            }
          },
          tooltip: {
            backgroundColor: 'transparent',   // 背景颜色
            borderColor: '#333',         // 边框颜色
            borderRadius: 10,             // 边框圆角
            borderWidth: 0.1,               // 边框宽度
            shadow: true,                 // 是否显示阴影
            animation: false,               // 是否启用动画效果
            useHTML: true,
            style: {
              padding: 1
            },
            formatter: function () {
              if (id === 'container1' || id === 'container2') {
                var rr = ''
                for (var k = 0; k < data.length; k++) {
                  if (data[k][0] === this.x) {
                    rr = data[k][2]
                    if (data[k][2] === 0) {
                      rr = 0
                    } else {
                      rr = data[k][2]
                    }
                  }
                }
              }

              var temp = this.x
              var d = new Date(parseInt(temp, 10))
              var month = d.getMonth() + 1 < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1
              if (id === 'container1' || id === 'container2') {
                if (rr > 0) {
                  rr = '+' + chart.numberFormat(rr, 2) + '%'
                  return '<div style=" background: #fff; border-radius: 5px; width:160px; height: 71px; position: relative;"> <span style="font-family: 微软雅黑;font-weight:normal; text-align:center;display:block; width: 100%; color: #999; font-size:14px; line-height: 21px; height: 21px; position: absolute; top: 10px; left: 0;">' + d.getFullYear() + '.' + month + '</span> <span style="font-family: 微软雅黑;font-weight:normal; text-align:center;display:block; color: #333; font-size:20px; line-height: 30px; height: 30px; position: absolute; top: 31px; left: 10px;">' + chart.numberFormat(this.y, 2) + '%</span>' + ' <span style="font-family: 微软雅黑;font-weight:normal; text-align:center;display:block; color: #f55461; font-size:20px; line-height: 30px; height: 30px; position: absolute; top: 31px; right: 10px;">' + rr + '</span></div>'
                } else if (rr < 0) {
                  rr = chart.numberFormat(rr, 2) + '%'
                  return '<div style=" background: #fff; border-radius: 5px; width:160px; height: 71px; position: relative;"> <span style="font-family: 微软雅黑;font-weight:normal; text-align:center;display:block; width: 100%; color: #999; font-size:14px; line-height: 21px; height: 21px; position: absolute; top: 10px; left: 0;">' + d.getFullYear() + '.' + month + '</span> <span style="font-family: 微软雅黑;font-weight:normal; text-align:center;display:block; color: #333; font-size:20px; line-height: 30px; height: 30px; position: absolute; top: 31px; left: 10px;">' + chart.numberFormat(this.y, 2) + '%</span>' + ' <span style="font-family: 微软雅黑;font-weight:normal; text-align:center;display:block; color: #4eb09e; font-size:20px; line-height: 30px; height: 30px; position: absolute; top: 31px; right: 10px;">' + rr + '</span></div>'
                } else {
                  return '<div style=" background: #fff; border-radius: 5px; width:160px; height: 71px; position: relative;"> <span style="font-family: 微软雅黑;font-weight:normal; text-align:center;display:block; width: 100%; color: #999; font-size:14px; line-height: 21px; height: 21px; position: absolute; top: 10px; left: 0;">' + d.getFullYear() + '.' + month + '</span> <span style="font-family: 微软雅黑;font-weight:normal; text-align:center;display:block; color: #333; font-size:20px; line-height: 30px; height: 30px; position: absolute; top: 31px; left: 10px;">' + chart.numberFormat(this.y, 2) + '%</span>' + ' <span style="font-family: 微软雅黑;font-weight:normal; text-align:center;display:block; color: #333; font-size:20px; line-height: 30px; height: 30px; position: absolute; top: 31px; right: 10px;">0.00%</span></div>'
                }
              } else {
                var ss = '0'
                if (this.y === '') {
                  ss = '0'
                } else if (this.y.toString().indexOf('.') > 0) {
                  ss = chart.numberFormat(this.y, 1, '.', ',')
                } else {
                  ss = chart.numberFormat(this.y, 0, '.', ',')
                }
                return '<div style=" background: #fff; border-radius: 5px; width:120px; height: 71px; position: relative;"> <span style="font-family: 微软雅黑;font-weight:normal; text-align:center;display:block; width: 100%; color: #999; font-size:14px; line-height: 21px; height: 21px; position: absolute; top: 10px; left: 0;">' + d.getFullYear() + '.' + month + '</span> <span style="font-family: 微软雅黑;font-weight:normal; text-align:center;display:block; width: 100%; color: #333; font-size:20px; line-height: 30px; height: 30px; position: absolute; top: 31px; left: 0;">' + ss + '</span></div>'
              }
            }
          },
          plotOptions: {
            series: {
              events: {
                legendItemClick: function (e) {
                  return false
                }
              },
              line: {
                connectNulls: true
              }
            }
          },
          credits: {enabled: false},
          legend: {
            enabled: true,
            align: 'center',
            verticalAlign: 'bottom',
            labelFormatter: function () {
              return ' <label style="color: #000;font-family: 微软雅黑;font-size: 0.85em;font-weight:normal; text-align:center; line-height: 1.5em; height: 1.5em;">' + this.name + '</label>'
            }
          },
          series: [{name: tit, data: yData}]
        })
      },
//      签名
      sign: function (obj, appKey, reverse) {
        let arr = []
        var str2 = ''
        for (let i in obj) {
          let str1 = i + '=' + obj[ i ] + '&'// i 就代表 data 里面的 user pass 等等 而data[ i ] 就代表 userName    12121 就是 i 所对应的值；
          arr.push(str1)
        }
        if (reverse === undefined) {
          str2 = arr.sort().join('') + 'appKey=' + appKey + '&key='
        } else {
          str2 = arr.sort().join('') + 'appKey=' + appKey + '&key=' + reverse.toString().split('').reverse().join('')
        }
        // console.log(str);
//        let hash = this.$md5().md5(str2)
        let hash = md5(str2)
        obj.sign = hash
      }
    },
    filters: {
      count: function (count) {
        if (count) {
          return parseFloat(count).toLocaleString()
        } else {
          return '--'
        }
      },
      ratio: function (ratio) {
        if (ratio) {
          return ratio.toFixed(2) + ' %'
        } else {
          return '--'
        }
      },
      quarterRate: function (ratio, val) {
        let floatHtml
        let ratioHtml
        if (Number(val) > 0) {
          let vals = (Math.round(val * 100) / 100).toFixed(2)
//          let vals = val.toFixed(2)
          floatHtml = '<i class="fa fa-arrow-up upRed" style="color:#f05050;">' + vals + '%</i>'
        } else if (Number(val) < 0) {
          let vals = (Math.round(val * 100) / 100).toFixed(2)
//          let vals = val.toFixed(2)
          floatHtml = '<i class="fa fa-arrow-down downGreen" style="color:#77b43d;">' + vals + '%</i>'
        } else {
          floatHtml = val
        }
        if (ratio) {
          ratioHtml = ratio.toFixed(2) + ' %'
        } else {
          return '--'
        }
        return ratioHtml + (floatHtml ? '&nbsp;&nbsp;&nbsp;&nbsp;' + floatHtml + '' : '&nbsp;&nbsp;&nbsp;&nbsp;--')
      },
      quarterRate1: function (rate) {
        if (rate) {
          return rate.toFixed(2) + ' %'
        } else {
          return '--'
        }
      },
      dateChange: function (nS) {
        if (!nS || isNaN(nS)) {
          return ''
        }
        let date = new Date(parseInt(nS))
        let Y = date.getFullYear() + '-'
        let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1)
        // h = (date.getHours() < 10 ? '0'+(date.getHours()) : date.getHours())+ ':';
        // m = (date.getMinutes() < 10 ? '0'+(date.getMinutes()) : date.getMinutes());
        // s = date.getSeconds();
        return Y + M
      }
    },
    props: ['company-name'],
    mounted: function () {
      this.getAllData()
//      alert(md5('aa'))
    },
    watch: {
      'companyName': 'getAllData'
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .charts {
    width: 100%;
    height: 200px;
    margin: 20px 0;
  }
  .upRed {
    color: #f05050;
  }
  .downGreen {
    color: #77b43d;
  }
  .pager {
    text-align: center;
    margin: 15px 0;
  }
  .timeLong {
    float: right;
  }
  .firstTitle {
    width: 150px;
  }
  .downLoad {
    float: right;
  }
</style>
