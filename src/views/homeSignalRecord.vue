<template>

  <div style="text-align: center">
    <div class="select_div_top" style="margin-bottom: 30px">
      <div>
        <span class="demonstration"> 时间：</span>
        <el-date-picker
          v-model="TimeSpace"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          style="width: 219px"
        >
        </el-date-picker>

      </div>

      <div>
        <span class="demonstration"> 操作记录：</span>
        <el-select v-model="type_options_value" placeholder="请选择" style="width: 223px">
          <el-option
            v-for="item in type_options"
            :key="item.value"
            :label="item.value"
            :value="item.value">
          </el-option>
        </el-select>

      </div>
    </div>

    <div class="select_div_top">
      <div>
        <span class="demonstration"> 标题：</span>
        <el-input ref="input" v-model="input_value" placeholder="请输入内容" style="width: 219px"></el-input>
      </div>

      <div>
        <span class="demonstration"> 信号类别：</span>
        <el-select v-model="signal_type_value" placeholder="请选择" style="width: 223px">
          <el-option
            v-for="item in signal_type_options"
            :key="item.value"
            :label="item.value"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
    </div>

    <div class="select_button" style="display: flex;align-items: flex-end;justify-content: flex-start">

      <div style="margin-left: 40px">
        <el-button @click="getSearchData">查询</el-button>
      </div>

      <div style="margin-left: 30px" >
        <el-button @click="defaultConfig">重置</el-button>
      </div>
    </div>

    <div style="height: 100px;width:100%;margin-top: 50px">

      <el-table :data="users"  v-loading="listLoading" style="width: 100%;"  >
        <el-table-column  prop="createAt" label="修改时间" align="left"  width="150">
          <template slot-scope="scope">
            {{scope.row.createAt | timeDateChange}}
          </template>
        </el-table-column>

        <el-table-column prop="label" label="信号类别" align="center" width="140">
        </el-table-column>

        <el-table-column  prop="title" label="标题" align="left">
        </el-table-column>


        <!--删除：		afterSignalType:未知信号-->
        <!--撤销删除：	产业、焦点，preSignalType:未知信号-->
        <!--政策 afterSignalType：空信号-->
        <!--修改风险：	preSignalType:积极信号 && afterSignalType：风险信号-->
        <!--修改积极：	preSignalType:风险信号 && afterSignalType：积极信号-->

        <el-table-column  label="操作记录"  align="center" width="300">
          <template slot-scope="scope" :inline="true">

            <span v-if="scope.row.afterSignalType == '未知信号'">删除</span>
            <span v-if="(scope.row.afterSignalType == '空信号' && scope.row.label == '政策') || scope.row.preSignalType == '未知信号'">撤销删除</span>
            <span v-if="scope.row.preSignalType == '积极信号' && scope.row.afterSignalType == '风险信号'">修改为风险</span>
            <span v-if="scope.row.preSignalType == '风险信号' && scope.row.afterSignalType == '积极信号'">修改为积极</span>

          </template>
        </el-table-column>

      </el-table>


      <el-row type="flex" justify="center" class="zoom-pagi" style="margin-top: 20px">
        <el-col type="flex" justify="center">
          <el-pagination align="center"
                         :current-page.sync="requestParams.cp"
                         :page-size="requestParams.ps"
                         :total="totalCount"
                         class="pagination"
                         layout="total, prev, pager, next, jumper"
                         @current-change="pageChange">
          </el-pagination>
        </el-col>
      </el-row>


      <!--<div class="block" style="float:right;margin:10px 18px">-->
        <!--<el-button type="primary" :disabled="!hasProPage" @click="nextPage('-1')">上一页</el-button>-->
        <!--第{{currentPage}}页-->
        <!--<el-button type="primary" :disabled="!hasNextPage" @click="nextPage('1')">下一页</el-button>-->
      <!--</div>-->
    </div>

  </div>

</template>


<script>
    export default {
      name: 'homeSignalRecord',

      data: function () {
        var currentDate = new Date()
        var month = currentDate.getMonth()
        var startDate = new Date()
        startDate.setMonth(month - 1)

        return {

          totalCount:0,
          users: [],
          targetSignalType: '',
          currentType: '',
          currentData: '',
          input_value: '',
          classA: 'red',
          currentPage: 1,
          hasNextPage: false,
          hasProPage: false,
          listLoading: false,
          TimeSpace: [startDate, currentDate],
          type_options_value: '',
          type_options: [{
            value: '请选择',
            operateType: ''
          }, {
            value: '删除'

          }, {
            value: '撤销删除'

          }, {
            value: '修改为风险'

          }, {
            value: '修改为积极'
          }
          ],
          signal_type_value: '',
          signal_type_options: [{
            value: '全部'
          }, {
            value: '产业'
          }, {
            value: '焦点'
          }, {
            value: '政策'
          }],
          requestParams: {
            cp: 1,
            ps: 10
          }
        }
      },

      // 监听input变化
      watch: {
        type_options_value (curVal, oldVal) {
          this.requestParams.operateType = this.type_options_value
          console.log(this.requestParams.operateType)
        },
        signal_type_value (curVal, oldVal) {
          this.requestParams.labels = this.signal_type_value
          console.log(this.requestParams.labels)
        },
        input_value (curVal, oldVal) {
          clearTimeout(this.timeout)
          this.timeout = setTimeout(() => {
            this.requestParams.title = this.input_value
          }, 500)
        },
        TimeSpace () {
          var startDate = this.TimeSpace[0]
          var endDate = this.TimeSpace[1]
          var startAt = startDate.getTime()
          var endAt = endDate.getTime()
          this.requestParams.startAt = startAt
          this.requestParams.endAt = endAt
          console.log(startAt, endAt)
        }
      },

      mounted: function () {
        this.getAllData()
  },
      methods: {

        // 获取所有的数据
        getAllData () {
          this.requestMethods('GET', '/signal/content/all', this.requestParams)
        },
        // 获取条件查询查询数据
        getSearchData () {
          if (this.requestParams.labels == '全部') {
            this.requestParams.labels = ''
          }
          if (this.requestParams.operateType == '请选择') {
            this.requestParams.operateType = ''
          }
          this.getRequestSearchData()
        },

        // 根据条件搜索请求
        getRequestSearchData () {
          this.requestMethods('GET', '/signal/content/dim/content/title/change', this.requestParams)
        },
        // 重置事件
        defaultConfig () {
          this.type_options_value = this.type_options[0].value
          this.signal_type_value = this.signal_type_options[0].value
          this.input_value = ''
          this.currentPage = 1
          this.requestParams.cp = this.currentPage
          this.requestParams.signalType = ''
          this.requestParams.labels = ''
          this.requestParams.startAt = ''
          this.requestParams.endAt = ''
          this.getAllData()
        },

        // 点击分页
        pageChange: function (page) {
          this.requestParams.cp = page
          this.getSearchData()
        },

        requestMethods (method, url, params) {

          debugger
          let _this = this
          _this.listLoading = true
          this.$http({
            method: method,
            url: url,
            params: params,
            headers: {'X-Requested-With': 'XMLHttpRequest'},
            body: {},
            emulateJSON: false
          }).then(function (result) {

            _this.users = result.body.data.list
            this.totalCount = result.body.data.totalCount
            this.requestParams.cp = result.body.data.currentPage
            _this.listLoading = false
          }).catch(() => {
            _this.$message.error('操作失败!!!！')
          })
        }
      }

    }
</script>

<style scoped>

  .select_div_top{
    width: 60%;
    display: flex;
    justify-content:space-between;
    /*line-height: 60px;*/
  }
  .select_button{

    float: right;
    margin-top: -120px;
    width: 40%;
    height:120px;
  }

</style>
