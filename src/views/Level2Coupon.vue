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
            end-placeholder="结束日期"
            style="width: 219px"
          >
          </el-date-picker>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="block">
          <span class="demonstration">选择营业部：</span>
          <el-select v-model="sales_value" placeholder="请选择" style="width: 146px" @change="queryBranch">
            <el-option
              v-for="item in sales_options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select v-model="branch_value" :disabled="branch_selected" placeholder="请选择" style="width: 73px">
            <el-option
              v-for="item in branch_options"
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
          <el-select v-model="validityTime_value" style="width: 219px" placeholder="请选择">
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
          <el-input ref="input" v-model="fund_account_value" placeholder="请输入内容" style="width: 219px"></el-input>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="block">
          <span class="demonstration">类型：</span>
          <el-select v-model="type_value" placeholder="请选择" style="width: 223px">
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
          <el-select v-model="getStatus_value" placeholder="请选择" style="width: 219px">
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
        <el-button v-if="menuList.indexOf('level2coupon:query') == -1?false:true" @click="getCouponsData">查询</el-button>
        <el-button @click="reset">重置</el-button>
        <el-button v-if="menuList.indexOf('level2coupon:excel') == -1?false:true" @click="exportExcel">导出</el-button>
      </div>
    </el-row>

    <el-row style="margin-top: 40px">
      <div><span style="color: red">统计：</span><span>{{descStr}}</span></div>
    </el-row>

    <el-row v-if="menuList.indexOf('level2coupon:manual') == -1?false:true">
      <el-upload
        class="upload-demo uploadBtn"
        ref="upload"
        action="e/operate/quota/coupon/manual"
        :on-change="onchangeFunc"
        :on-remove="handleRemove"
        :on-success="handleSuccess"
        :before-upload="beforeAvatarUpload"
        :limit="1"
        :auto-upload="true"
        :file-list="fileList">
        <el-button slot="trigger" size="small" type="primary">导入资金账号</el-button>
        <!--<el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>-->
        <div slot="tip" class="el-upload__tip">上传文件限制为txt格式，导入后将立即发送优惠券，请确保数据无误</div>
      </el-upload>
    </el-row>

    <el-table
      :data="tableData"
      style="width: 100%;text-align: center;margin-top: 40px"
      height="600"
    >
      <el-table-column
        align="center"
        fixed
        prop="date"
        label="新建时间"
        width="120">
      </el-table-column>
      <el-table-column
        align="center"
        prop="fund_account"
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
        label="类型"
        width="250">
      </el-table-column>
      <el-table-column
        align="center"
        prop="validity_time"
        label="有效期"
        width="120">
      </el-table-column>
      <el-table-column
        align="center"
        prop="phone"
        label="登陆账号"
        width="130">
      </el-table-column>
      <el-table-column
        align="center"
        prop="get_time"
        label="领取时间"
        width="120">
      </el-table-column>
      <el-table-column
        align="center"
        prop="state"
        label="优惠券状态"
        width="200">
      </el-table-column>
      <el-table-column
        align="center"
        prop="use_time"
        label="使用时间"
        width="120">
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
    data() {
      var currentDate = new Date();
      var month = currentDate.getMonth();
      var startDate = new Date();
      startDate.setMonth(month - 1)
      return {
        menuList: [],    // 获取权限
        descStr: '************************',
        currentPage: 1,
        hasNextPage: false,
        hasProPage: false,
        TimeSpace: [startDate, currentDate],
        fund_account_value: '',

        sales_options: [],
        sales_value: '',

        branch_options: [],
        branch_value: '',
        branch_selected: false,

        validityTime_options: [
          {
            value: 'all',
            label: '所有'
          },
          {
            value: '6',
            label: '6个月'
          }, {
            value: '3',
            label: '3个月'
          }, {
            value: '1',
            label: '1个月'
          }],
        validityTime_value: '',

        type_options: [{
          value: 'all',
          label: '所有'
        }, {
          value: '1',
          label: '每个自然月首次新增资产达5~30万'
        }, {
          value: '2',
          label: '每个自然月首次新增资产达30万'
        }, {
          value: '3',
          label: '创业板'
        }, {
          value: '4',
          label: '新开港股通'
        }, {
          value: '5',
          label: '新开科创板'
        }, {
          value: '6',
          label: '新开沪深账户'
        }, {
          value: '7',
          label: '新开两融账户'
        }, {
          value: '8',
          label: '新开期权账户'
        }, {
          value: '100',
          label: '投票送券'
        }],
        type_value: '',

        getStatus_options: [{
          value: 'all',
          label: '所有'
        }, {
          value: '1',
          label: '未领取'
        }, {
          value: '0',
          label: '已领取'
        }, {
          value: '2',
          label: '已使用'
        }, {
          value: '3',
          label: '已过期（未使用）'
        }, {
          value: '4',
          label: '已失效（未领取）'
        }],
        getStatus_value: '',

        tableData: [],
        departmentName: '所有营业部',

        fileList: [], // 上传文件列表
      };
    },
    methods: {
      handleRemove(file, fileList) {
        this.fileList = fileList;
      },

      onchangeFunc(file, fileList) {
        this.fileList = fileList;
      },
      // 上传音频限制
      beforeAvatarUpload(file) {
//        console.log(file)
        let isTXT
        if (navigator.userAgent.indexOf('Firefox') > -1) {
          isTXT = /\.(txt)$/.test(file.name)
//          console.log(isJPG)
        } else {
          isTXT = file.type === 'text/plain'
        }
        if (!isTXT) {
          this.$message.error('文件只能是txt格式!')
        }
//        this.$confirm('确定上传并给用户发送优惠券？', '提示', {
//          confirmButtonText: '确定',
//          cancelButtonText: '取消',
//          type: 'warning',
//        }).then(() => {
//          this.$message({
//            type: 'success',
//            message: '确认上传',
//          });
//          if (!isTXT) {
//            this.$message.error('文件只能是txt格式!')
//          }
//          return isTXT
//        }).catch(() => {
//          this.$message({
//            type: 'info',
//            message: '取消上传'
//          });
//          return false
//        });
        return isTXT
      },

      submitUpload:function() {
        if (this.fileList && this.fileList.length > 0) {
          this.open();
        } else {
          this.alert();
        }
      },

      alert:function() {
        this.$alert('请先选择上传文件！', {
          confirmButtonText: '确定',
        });
      },

      execUpload: function() {
        this.$refs.upload.submit();
      },

      open :function() {
        this.$confirm('确定上传并给用户发送优惠券？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          this.$message({
            type: 'success',
            message: '确认上传',
          });
          this.execUpload();
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消上传'
          });
        });
      },
      handleSuccess:function(response, file, fileList) {
        //默认选定 网络投票，后期新增其他类型需要改动
        this.type_value = this.type_options[9].value;
        this.$refs.upload.clearFiles();
        this.$notify({
          title: '成功',
          message: '文件上传成功！稍后请查询',
          type: 'success'
        });
      },

      assembleQueryParams: function () {
        var params = {};
        var startDate = this.TimeSpace[0];
        startDate.setHours(0);
        startDate.setMinutes(0);
        startDate.setSeconds(0);
        var startAt = startDate.getTime();
        params.startAt = startAt;

        var endDate = this.TimeSpace[1];
        endDate.setHours(23);
        endDate.setMinutes(59);
        endDate.setSeconds(59);
        var endAt = endDate.getTime();
        params.endAt = endAt;
        var fund_account_value = this.fund_account_value;
        if (!this.isEmpty(fund_account_value)) {
          params.fundAccount = fund_account_value;
        }

        var sales_value = this.sales_value;
        var sales_name = '';
        this.sales_options.map(function (value) {
          if (value.value == sales_value) {
            if (value.value !== "all") {
              params.deptSerialNo = value.value;
              sales_name = value.label;
            }
          }
        });

        var branch_value = this.branch_value;
        var branch_name = '';
        this.branch_options.map(function (value) {
          if (value.value == branch_value) {
            if (value.value !== "all") {
              params.subDeptSerialNo = value.value;
              branch_name = value.label;
            }
          }
        });

        if (!this.isEmpty(sales_name) && !this.isEmpty(branch_name)) {
          this.departmentName = sales_name + '--' + branch_name;
        } else {
          this.departmentName = '所有营业部';
        }


        var validityTime_value = this.validityTime_value;
        this.validityTime_options.map(function (value) {
          if (value.value == validityTime_value) {
            if (value.value !== "all") {
              params.couponTerm = value.value;
            }
          }
        });

        var type_value = this.type_value;
        this.type_options.map(function (value) {
          if (value.value == type_value) {
            if (value.value !== "all") {
              params.couponType = value.value;
            }

          }
        });

        var getStatus_value = this.getStatus_value;
        this.getStatus_options.map(function (value) {
          if (value.value == getStatus_value) {
            if (value.value !== "all") {
              params.status = value.value;
            }
          }
        });
        return params;
      }, getCouponsData: function (cp) {
        var params = this.assembleQueryParams();
        if (cp && !isNaN(cp)) {
          params.cp = cp;
        }
        params.ps = 20;
        this.tableData = [];

        var path = 'quota/coupon/info';
        this.$http({
          method: 'GET',
          url: 'e/operate/' + path,
          params: params,
          headers: {'X-Requested-With': 'XMLHttpRequest'},
          emulateJSON: true
        }).then(function (result) {
          var data = result.body.data;
          if (!data) return;
          this.hasNextPage = data.hasNextPage;
          this.currentPage = data.currentPage;
          if (data.currentPage == 1) {
            this.hasProPage = true;
          } else {
            this.hasProPage = false;
          }
          var totalNum = data.totalNum;
          var receivedNum = data.receivedNum;
          var usedNum = data.usedNum;
          var unreceivedExpiresNum = data.unreceivedExpiresNum;
          var unusedExpiresNum = data.unusedExpiresNum;
          if (data.currentPage == 1) {
            this.descStr = this.departmentName + '，已发：' + totalNum + '，已领取：' + receivedNum + '，已使用：' + usedNum + '，已过期（未使用）：' + unusedExpiresNum + ',已失效（未领取）：' + unreceivedExpiresNum;
          }
          if (data.infos) {
            for (var i = 0; i < data.infos.length; i++) {
              var info = data.infos[i];
              var item = {};
              item.date = info.createAt ? this.formatTime("yyyy-MM-dd \r\n hh:mm:ss", new Date(+info.createAt)) : '-';
              item.fund_account = info.fundAccount;
              item.branch = info.deptName;
              item.sales = info.subDeptName;

              this.type_options.map(function (value) {
                if (value.value == info.couponType) {
                  item.type = value.label;
                }
              });

              this.validityTime_options.map(function (value) {
                if (value.value == info.couponTerm) {
                  item.validity_time = value.label;
                }
              });

              this.getStatus_options.map(function (value) {
                if (value.value == info.status) {
                  item.state = value.label;
                }
              })

              item.phone = info.phone ? info.phone : '-';

              item.get_time = info.receiveAt ? this.formatTime("yyyy-MM-dd \r\n hh:mm:ss", new Date(+info.receiveAt)) : '-';
              item.use_time = info.usedAt ? this.formatTime("yyyy-MM-dd \r\n hh:mm:ss", new Date(+info.usedAt)) : '-';
              this.tableData.push(item);
            }
          }

        })
      },

      queryBranch: function (value) {
        if (value === 'all' || value === '所有') {
          this.branch_selected = true;
          this.branch_options = [];
          this.branch_value = '';
        } else {
          this.branch_selected = false;
          this.getData('quota/coupon/branchInfo', value);
        }

      },

      getBranchInfo: function () {
        this.getData('quota/coupon/branchInfo');
      },

      getData(path, branchNo) {
        var params = {};
        if (branchNo) {
          params.upBranchNo = branchNo;
        }
        ;
        this.$http({
          method: 'GET',
          url: 'e/' + 'operate/' + path,
          headers: {'X-Requested-With': 'XMLHttpRequest'},
          emulateJSON: true,
          params: params
        }).then(function (result) {
          var arrays;
          if (branchNo) {
            this.branch_options = [];
            arrays = this.branch_options;
          } else {
            arrays = this.sales_options;
          }

          var data = result.body.data;
          for (var i = 0; i < data.length; i++) {
            var item = data[i];
            var option = {};
            option.value = item.branchNo;
            option.label = item.branchName;
            arrays.push(option);
          }

          if (branchNo) {
            if (data) {
              this.branch_value = this.branch_options[0].value
            }
          } else {
            var option = {}
            option.value = 'all';
            option.label = '所有';
            arrays.unshift(option);
            this.sales_value = this.sales_options[0].value;
            //查询当前选中状态的优惠券数据
            this.getCouponsData();
          }

        })
      },

      exportExcel: function () {
        var path = 'quota/coupon/csv?';
        var params = this.assembleQueryParams()
        for (var prop in params) {
          path += prop + '=' + params[prop] + '&';
        }
        path = path.substr(0, path.length - 1);
        window.open('e/operate/' + path);
      },

      formatTime: function (fmt, date) {
        if (date == null || !date) {
          return '-'
        }
        //格式化时间
        var o = {
          "M+": date.getMonth() + 1,                 //月份
          "d+": date.getDate(),                    //日
          "h+": date.getHours(),                   //小时
          "m+": date.getMinutes(),                 //分
          "s+": date.getSeconds(),                 //秒
        };
        if (/(y+)/.test(fmt)) {
          fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (var k in o) {
          if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
          }
        }
        return fmt;
      },


      //判断字符是否为空的方法
      isEmpty: function (obj) {
        if (typeof obj == "undefined" || obj == null || obj == "") {
          return true;
        } else {
          return false;
        }
      },

      nextPage: function (val) {
        this.currentPage = Number(this.currentPage) + Number(val)
        if (this.currentPage <= 1) {
          this.hasProPage = false
          this.currentPage = 1
        }
        this.getCouponsData(this.currentPage)
      },

      reset: function () {
        var currentDate = new Date();
        var month = currentDate.getMonth();
        var startDate = new Date();
        startDate.setMonth(month - 1);
        this.descStr = '************************';
        this.currentPage = 1;
        this.hasNextPage = false;
        this.hasProPage = false;
        this.TimeSpace = [startDate, currentDate];
        this.fund_account_value = '';
        this.getStatus_value = this.getStatus_options[0].value;
        this.type_value = this.type_options[0].value;
        this.validityTime_value = this.validityTime_options[0].value;
        this.sales_value = this.sales_options[0].value;
        this.branch_value = '';
        this.getCouponsData(this.currentPage);
      }

    },
    mounted: function () {
      this.menuList = localStorage.menuList;
      this.getBranchInfo();
      this.getStatus_value = this.getStatus_options[0].value;
      this.type_value = this.type_options[0].value;
      this.validityTime_value = this.validityTime_options[0].value;
    }
  };


</script>

<style>
  .block {
    text-align: right;
    padding-right: 30px;
  }

  .uploadBtn {
    padding-top: 20px;
  }

</style>
