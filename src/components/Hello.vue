<template>
  <el-row v-loading='ifLoading'>
    <el-col :span="24">
      <div class="radioContent">
        <el-radio-group v-model="radio2" class="radioGroup" @change="changeRadio">
          <el-radio v-for="(item, index) in salesDepartmentList" :key="index" class="radioList" :label="index">{{item}}</el-radio>
        </el-radio-group>
      </div>
      <all-company :companyName="companyName"></all-company>
    </el-col>
  </el-row>
</template>
<script>
  import AllCompany from '../views/AllCompany'
  export default {
    data () {
      return {
        activeName: 'first',
        times: '',
        radio2: 0,
        tableData: [],
        titleListy: [],
        salesDepartmentList: [],
        companyName: '',
        ifLoading: 1
      }
    },
    components: {
      AllCompany
    },
    methods: {
      handleClick (tab, event) {
        console.log(tab, event)
      },
      getComId: function () {
        this.radio2 = 0
        this.ifLoading = 1
        this.companyName = this.$route.query.companyId + '(总)'
        // alert(this.$route.query.companyId)
        var _this = this
        // var data = {
        //   name: this.$route.query.companyId
        // }
        // console.log(data)
        this.$http({
          method: 'GET',
          url: 'e/operate/salesdepartment/relation',
          params: {'name': this.$route.query.companyId},
          headers: {'X-Requested-With': 'XMLHttpRequest'},
          emulateJSON: true
        }).then(function (result) {
          var data = result.body.data
          _this.salesDepartmentList = data
          _this.ifLoading = 0
          // console.log(result.body.data)
        })
      },
      changeRadio: function (val) {
        this.companyName = this.salesDepartmentList[val]
      },
      handleCurrentChange: function (val) {
        console.log(val)
      }
    },
    watch: {
      '$route': 'getComId'
      // radio2: 'changeRadio'
    },
    mounted: function () {
      // var _this = this
      this.getComId()
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
  .radioContent {
    padding: 15px 0;
    margin-bottom: 20px;
    border: 1px solid #d1dbe5;
    box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);
  }
  .radioGroup{
    display: flex;
    flex-direction:row;
    flex-wrap:wrap;
  }
  .radioList {
    width: 180px;
    margin:10px 40px 10px 40px;
  }
  .charts {
    width: 100%;
    height: 200px;
    margin: 20px 0;
  }
  .pager {
    text-align: center;
    margin: 15px 0;
  }
  .el-radio:first-child{
    margin-left:15px;
  }
</style>
