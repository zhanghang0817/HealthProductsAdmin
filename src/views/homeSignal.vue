<!--suppress ALL -->
<template>

  <div style="text-align: center">

      <div class="select_div_top" style="margin-bottom: 30px">
        <div>
          <span class="demonstration"> 时间：</span>
          <!--<el-input ref="input" v-model="input_value" placeholder="请输入内容" style="width: 219px;"></el-input>-->

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
          <span class="demonstration"> 情绪识别：</span>
          <el-select v-model="type_options_value" placeholder="请选择" style="width: 223px">
            <el-option
              v-for="item in type_options"
              :key="item.value"
              :label="item.label"
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
              :label="item.label"
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
        <el-button @click="getResetData">重置</el-button>
      </div>
    </div>

    <div style="height: 100px;width:100%;background-color: aqua;margin-top: 80px">

      <el-table :data="tableData" highlight-current-row v-loading="listLoading" style="width: 100%;">
        <el-table-column  prop="publishAt" label="发布时间" align="left"  width="150">
          <template slot-scope="scope">
            {{scope.row.publishAt | timeDateChange}}
          </template>
        </el-table-column>

        <el-table-column prop="label" label="信号类别" align="center" width="140">
        </el-table-column>

        <el-table-column prop="title" label="标题" align="left">
        </el-table-column>

        <el-table-column prop="signalType" label="情绪识别"  align="left" width="150">
        </el-table-column>px

        <el-table-column  label="编辑"  align="center" width="150">
        </el-table-column>

      </el-table>

      <div class="block" style="float:right;margin:10px 18px">
        <el-button type="primary" :disabled="!hasProPage" @click="nextPage('-1')">上一页</el-button>
        第{{currentPage}}页
        <el-button type="primary" :disabled="!hasNextPage" @click="nextPage('1')">下一页</el-button>
      </div>

    </div>

  </div>

</template>

<script>
    export default {
      name: "homeSignal",

      data: function () {

        var currentDate = new Date();
        var month = currentDate.getMonth();
        var startDate = new Date();
        startDate.setMonth(month - 1)

        return {

          currentPage: 1,
          hasNextPage: false,
          hasProPage: false,
          listLoading: false,
          TimeSpace: [startDate, currentDate],
          type_options_value: '',
          type_options: [{
            value: 'all',
            label: '全部'
          }, {
            value: '1',
            label: '积极信号'
          }, {
            value: '2',
            label: '风险信号'
          }],
          signal_type_value:'',
          signal_type_options: [{
            value: 'all',
            label: '全部'
          }, {
            value: '1',
            label: '产业'
          }, {
            value: '2',
            label: '焦点'
          }, {
            value: '3',
            label: '政策'
          }],
          tableData: [{
            publishAt: '1564454149749',
            label: '产业',
            title: '上海市普陀区金沙江路 1518 弄',
            signalType:'风险信号',

          }, {
            publishAt: '1564454149749',
            label: '产业',
            title: '上海市普陀区金沙江路 1518 弄',
            signalType:'风险信号',
          }]

        }
      },
      created: function () {


      },

      mounted:function(){

        this.defaultConfig();
        // this.getAllData();
      },

      //监听input变化
      watch:{
        type_options_value(curVal,oldVal){

          clearTimeout(this.timeout);
          this.timeout = setTimeout(() => {
            console.log(this.type_options_value);
          }, 500);
        },

        TimeSpace(){

          var startDate = this.TimeSpace[0];
          var endDate = this.TimeSpace[1];
          var startAt = startDate.getTime();
          var endAt = endDate.getTime();
          console.log(startAt,endAt);
        }
      },
      methods: {

        getResetData(){

        },

        getSearchData(){

        },
        defaultConfig(){

          this.type_options_value = this.type_options[0].value;
          this.signal_type_value = this.signal_type_options[0].value;

        },
        nextPage: function (val) {
          this.currentPage = Number(this.currentPage) + Number(val)
          if (this.currentPage <= 1) {
            this.hasProPage = false
            this.currentPage = 1
          }
          this.getAllData()
        },
        getAllData () {
          let _this = this
          _this.listLoading = true
          this.$http({
            method: 'GET',
            url: 'e/operate/suggestion/list',
            params: {status: _this.activeName, ps: 10, cp: _this.currentPage},
            headers: {'X-Requested-With': 'XMLHttpRequest'},
            body: {},
            emulateJSON: false
          }).then(function (result) {

            _this.users = result.body.data.suggestList
            _this.hasNextPage = result.body.data.hasNextPage
            _this.currentPage = result.body.data.currentPage
            _this.listLoading = false
            if (result.body.data.currentPage === 1 || !result.body.data.currentPage) {
              _this.hasProPage = false
              _this.currentPage = 1
            } else {
              _this.hasProPage = true
            }
          }).catch(() => {
            _this.$message.error('获取数据失败')
            _this.listLoading = false
          })
        },
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
