<!--suppress ALL -->
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
          <span class="demonstration"> 情绪识别：</span>
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
        <el-table-column  prop="publishAt" label="发布时间" align="left"  width="150">
          <template slot-scope="scope">
            {{scope.row.publishAt | timeDateChange}}
          </template>
        </el-table-column>

        <el-table-column prop="label" label="信号类别" align="center" width="140">
        </el-table-column>

        <el-table-column  prop="title" label="标题" align="left">
        </el-table-column>

        <el-table-column  prop="signalType" label="情绪识别"  align="left" width="150">

          <template slot-scope="scope">
            <span v-if="scope.row.signalType==='风险信号'" style="color: green"> {{scope.row.signalType}}</span>
            <span v-else style="color: red"> {{scope.row.signalType}}</span>
          </template>

        </el-table-column>

        <el-table-column  label="编辑"  align="center" width="230">
          <template slot-scope="scope">

            <div style="display: inline-flex">
              <div v-if="scope.row.preSignalType == undefined" style="display: inline-flex" >
                <div v-if="scope.row.signalType==='风险信号' || scope.row.signalType==='积极信号'">改为</div>
                <span  v-if="scope.row.signalType==='风险信号'" style="color: red" @click="setUpCurrentData(scope.row,'修改')">积极 &nbsp</span>
                <span  v-else-if="scope.row.signalType==='积极信号'" style="color: green" @click="setUpCurrentData(scope.row,'修改')">风险 &nbsp</span>
              </div>

              <div v-if="scope.row.deleteStatus == undefined" @click="setUpCurrentData(scope.row,'删除')"> &nbsp删除 &nbsp</div>
              <div v-if="scope.row.deleteStatus == 1" @click="setUpCurrentData(scope.row,'撤销')"> &nbsp撤销删除</div>
            </div>


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



      <el-dialog
        title="提示"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="handleClose">

        <div>
          <div v-html="promptMessage">{{promptMessage}}</div>
        </div>
        <div style="margin-top: 30px;display: inline-flex">
          <div style="color: red">注意：</div> <span>只能操作一次。请谨慎操作！</span>
        </div>

        <span slot="footer" class="dialog-footer">
             <el-button @click="dialogVisible = false">取 消</el-button>
             <el-button type="primary" @click="updateData()">确 定</el-button>
        </span>
      </el-dialog>

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

          users:[],
          targetSignalType:'',
          currentType:'',
          currentData:'',
          promptMessage:'',
          input_value:'',
          dialogVisible: false,
          classA:'red',
          currentPage: 1,

          listLoading: false,
          TimeSpace: [startDate, currentDate],
          type_options_value: '',
          type_options: [{
            value: '请选择'
          }, {
            value: '积极信号'
          }, {
            value: '风险信号'
          }],
          signal_type_value:'',
          signal_type_options: [{
            value: '全部'
          }, {
            value: '产业'
          }, {
            value: '焦点'
          }, {
            value: '政策'
          }],
          requestParams:{
            cp:1,
            ps:10
          },
          totalCount:0
        }
      },
      created: function () {

      },

      mounted:function(){

        this.defaultConfig();
        this.getSearchData();
      },

      //监听input变化
      watch:{
        type_options_value(curVal,oldVal){

          this.requestParams.signalType = this.type_options_value;
        },
        signal_type_value(curVal,oldVal){

          this.requestParams.labels = this.signal_type_value;
        },
        input_value(curVal,oldVal){

          clearTimeout(this.timeout);
          this.timeout = setTimeout(() => {
            this.requestParams.title = this.input_value;
          }, 500);
        },
        TimeSpace(){

          var startDate = this.TimeSpace[0];
          var endDate = this.TimeSpace[1];
          var startAt = startDate.getTime();
          var endAt = endDate.getTime();
          this.requestParams.startAt = startAt;
          this.requestParams.endAt = endAt;
          console.log(startAt,endAt);
        }
      },
      methods: {

        handleClose(done) {
          this.$confirm('确认关闭？')
            .then(_ => {
              done();
            })
            .catch(_ => {});
        },
        //设置当前选中数据以及状态
        setUpCurrentData(obj,type){

          this.dialogVisible = true;
          this.currentData = obj;
          this.currentType = type;

          if (this.currentType == '修改'){

            if (obj.signalType == '风险信号') {
              this.targetSignalType = '积极信号';

            }else if (obj.signalType == '积极信号') {
              this.targetSignalType = '风险信号';
            }
            this.promptMessage = '您确认将' +  this.currentData.title + '修改为' + this.targetSignalType + '吗？';

          } else if (this.currentType == '删除') {

            this.dialogVisible = true;
            this.promptMessage = '您确认将' +  this.currentData.title + '删除吗？';

          }else  if (this.currentType == '撤销') {

            this.dialogVisible = true;
            this.promptMessage = '您已删除' + this.currentData.title  + '<br/><br/><br/>确认撤销删除吗？';
          }

        },
        //更新数据状态
        updateData(){

          var preSignalType = this.currentData.signalType;

          if (this.currentType == '修改') {

            if (this.targetSignalType != '') {

              var params = {id:this.currentData.indexId,preSignalType:preSignalType,signalType:this.targetSignalType}
              this.requestUpdate('POST','/signal/content/change',params);
            }
          }
          if (this.currentType == '删除') {

            var params = {id:this.currentData.indexId,preSignalType:preSignalType,signalType:''}
            this.requestUpdate('POST','/signal/content/change',params);
          }
          if (this.currentType == '撤销') {

            this.requestUpdate('POST','/signal/content/change/cancel/delete',{id:this.currentData.indexId});
          }

          this.dialogVisible = false;
        },
        //查询按钮事件
        getSearchData(){

          if ( this.requestParams.labels == '全部'){

            this.requestParams.labels = '';
          }
          if ( this.requestParams.signalType == '请选择'){

            this.requestParams.signalType = '';
          }
          // alert(JSON.stringify(this.requestParams));
          this.getAllData();
        },
        //重置事件
        defaultConfig(){

          this.type_options_value = this.type_options[0].value;
          this.signal_type_value = this.signal_type_options[0].value;
          this.input_value = '';
          this.currentPage = 1;
          this.requestParams.cp = this.currentPage;
          this.requestParams.signalType = '';
          this.requestParams.labels = '';
          this.requestParams.startAt = '';
          this.requestParams.endAt = '';
          this.getSearchData();
        },
        // 点击分页
        pageChange: function (page) {
          this.requestParams.cp = page
          this.getSearchData()
        },

        //请求数据列表
        getAllData () {
          let _this = this
          _this.listLoading = true
          this.$http({
            method: 'GET',
            url: '/signal/content/change/get',
            params: _this.requestParams,
            headers: {'X-Requested-With': 'XMLHttpRequest'},
            body: {},
            emulateJSON: false
          }).then(function (result) {

            _this.users = result.body.data.list

            this.totalCount = result.body.data.totalCount;
            this.requestParams.cp = result.body.data.currentPage;

            _this.listLoading = false

          }).catch(() => {
            _this.$message.error('获取数据失败')
            _this.listLoading = false
          })
        },
        //修改请求（删除、修改、撤销删除）
        requestUpdate(method,url,params){
          let _this = this
          _this.listLoading = true
          this.$http({
            method: method,
            url:url,
            params: params,
            headers: {'X-Requested-With': 'XMLHttpRequest'},
            body: {},
            emulateJSON: false
          }).then(function (result) {

            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
              _this.getSearchData();
            }, 1000);

          }).catch(() => {
            _this.$message.error('操作失败!!!！')
          })

        }
      }
    }

</script>

<style>
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
