<template>
  <!-- <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="年度考核数据" name="first">年度考核数据</el-tab-pane>
    <el-tab-pane label="季度考核数据" name="second">季度考核数据</el-tab-pane>
  </el-tabs> -->
  <el-tabs type="border-card" v-model="activeName" v-loading='ifLoading'>
    <el-tab-pane label="年度(非考核数据)" name="first">
      <el-button @click="downLoad(0)" class="downLoad" :plain="true" type="info" size="small"><i class="fa fa-download"></i>下载历史年度考核</el-button>
      <el-table :data="yearTableData" border style="width: 100%">
        <el-table-column v-for="(item,index) in yearTitleListy" :key="index" :label="item">
          <template slot-scope="scope">
            <span v-if="index===0" style="margin-left: 10px">{{ scope.row.depName }}</span>
            <span v-else style="margin-left: 10px">{{ scope.row[item] | rate}}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-tab-pane>
    <el-tab-pane label="季度(非考核数据)" name="second">
      <el-button @click="downLoad(1)" class="downLoad" :plain="true" type="info" size="small"><i class="fa fa-download"></i>下载历史季度考核</el-button>
      <el-table :data="quarterTableData" border style="width: 100%">
        <el-table-column v-for="(item,index) in quarterTitleListy" :key="index" :label="item">
          <template slot-scope="scope">
            <span v-if="index===0" style="margin-left: 10px">{{ scope.row.depName }}</span>
            <span v-else style="margin-left: 10px" v-html="$options.filters.quarterRate(scope.row[item])"></span>
          </template>
        </el-table-column>
      </el-table>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
  export default {
    data () {
      return {
        activeName: 'first',
        yearTableData: [],
        yearTitleListy: [],
        quarterTableData: [],
        quarterTitleListy: [],
        ifLoading: 1
      }
    },
    methods: {
      handleClick (tab, event) {
        console.log(tab, event)
      },
      downLoad: function (flag) {
        window.location.href = '/e/operate/check/download?flag=' + flag
      }
    },
    mounted: function () {
      let _this = this
      // 获取年数据
      this.$http.get('e/operate/check/year').then(function (result) {
        // console.log(result.data)
        let data = result.data.data
        _this.yearTableData = data.rateData
        _this.yearTitleListy = data.header[0].header.split(',')
        _this.ifLoading = 0
      }).catch(() => {
        this.$message.error('请重新登录')
        _this.$router.push('/')
      })
      // 获取季度数据
      this.$http.get('e/operate/check/quarter').then(function (result) {
        // console.log(result.data)
        let data = result.data.data
        _this.quarterTableData = data.rateData
        _this.quarterTitleListy = data.header[0].header.split(',')
      })
    },
    filters: {
      rate: function (val) {
        return val ? val + '%' : '--'
      },
      quarterRate: function (val) {
        let rate = val.replace('[', '').replace(']', '').split(',')[0]
        let float = val.replace('[', '').replace(']', '').split(',')[1]
        let floatHtml

        if (Number(float) > 0) {
          floatHtml = '<i class="fa fa-arrow-up upRed" style="color:#f05050;">' + float + '</i>'
        } else if (Number(float) < 0) {
          floatHtml = '<i class="fa fa-arrow-down downGreen" style="color:#77b43d;">' + float + '</i>'
        } else {
          floatHtml = float
        }
        return (rate ? rate + '%' : '--') + (floatHtml ? '&nbsp;&nbsp;' + floatHtml + '' : '--')
      }
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .downLoad {
    float: right;
    margin-bottom: 15px;
  }
  .upRed {
    color: #f05050;
  }
  .downGreen {
    color: #77b43d;
  }
</style>
