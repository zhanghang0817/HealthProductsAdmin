<template>
  <div>
    <el-button type="primary" icon="plus" class="btnBottom" @click="openDialog()">新建分组</el-button>
    <el-table
      :data="tableData"
      border
      align="center"
      style="width: 100%">
      <el-table-column
        prop="title"
        label="类别名称">
        <template slot-scope="scope">
          <span>{{ scope.row.sGroupName| decodeStr}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="初始资金">
        <template slot-scope="scope">
          <span>{{ scope.row.fInitFund}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="运行时间"
        width="200px">
        <template slot-scope="scope">
          <span>{{ scope.row.sStartDay+' 至 '+scope.row.sEndDay}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="交易品种">
        <template slot-scope="scope">
          <span>{{ scope.row.iTradeVariety|tabTradeVariety}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="单只买入额限制">
        <template slot-scope="scope">
          <span>{{ scope.row.fSingleStockLimit*100+'%'}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="佣金费率">
        <template slot-scope="scope">
          <span>{{ scope.row.fCommissionRate*100+'%'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="80px">
        <template slot-scope="scope">
          <el-button size="small" @click="editDialog(scope.row.sGroupId)">编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="diaLogTitle" :visible.sync="dialogFormVisible">
      <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-width="100px" class="demo-ruleForm">
        <el-form-item label="分组名称" prop="name" :label-width="formLabelWidth" class="input1">
          <el-input v-model="ruleForm2.name" auto-complete="off" :readonly=editReadOnly></el-input>
        </el-form-item>
        <el-form-item label="运行时间" prop="startTime" :label-width="formLabelWidth" class="input1">
          <div class="block">
            <el-date-picker
              v-model="ruleForm2.startTime"
              type="date"
              editable
              placeholder="选择开始日期"
              @change="dateStartChange"
              :readonly=editReadOnly
              :picker-options="pickerOptions0">
            </el-date-picker>
            —
            <el-date-picker
              v-model="ruleForm2.endTime"
              type="date"
              editable
              placeholder="选择结束日期"
              @change="dateEndChange"
              :readonly=editReadOnly
              :picker-options="pickerOptions0">
            </el-date-picker>
          </div>
        </el-form-item>
        <el-form-item prop="initFund" label="初始资金" :label-width="formLabelWidth">
          <el-select v-model="ruleForm2.initFund" placeholder="请选择初始资金" :disabled=editReadOnly>
            <el-option label="10万" value="100000">10万</el-option>
            <el-option label="30万" value="300000">30万</el-option>
            <el-option label="50万" value="500000">50万</el-option>
            <el-option label="100万" value="1000000">100万</el-option>
            <el-option label="500万" value="5000000">500万</el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="tradeVariety" label="交易品种" :label-width="formLabelWidth">
          <el-select v-model="ruleForm2.tradeVariety" placeholder="请选择交易品种" :disabled=editReadOnly>
            <el-option label="A股" value="1"></el-option>
            <el-option label="A股非ST" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="singleStockLimit" label="单只买入：小于等于初始资金总额" :label-width="buyOnlyWidth" class="input2">
          <el-input v-model="ruleForm2.singleStockLimit" auto-complete="off" :readonly=editReadOnly></el-input>
          %
        </el-form-item>
        <el-form-item prop="commissionRate" label="佣金费率" :label-width="formLabelWidth" class="input1">
          <el-input v-model="ruleForm2.commissionRate" auto-complete="off" :readonly=editReadOnly></el-input>
          %
        </el-form-item>
        <!--<el-form-item label="印花税率" :label-width="formLabelWidth" class="input2">-->
        <!--<el-input v-model="form.name" auto-complete="off"></el-input>%-->
        <!--</el-form-item>-->
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm2')" :disabled="addSign" v-show=!editReadOnly>提交
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    data () {
      var validateTime = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请选择输入开始时间'))
        } else if (this.ruleForm2.endTime === '') {
          callback(new Error('请选择输入结束时间'))
        } else {
          callback()
        }
      }
      return {
        pickerOptions0: {
          disabledDate (time) {
            return time.getTime() < Date.now() - 8.64e7
          }
        },
        ruleForm2: {
          name: '', // 组合名称
          startTime: '', // 组合开始时间
          endTime: '', // 组合结束时间
          initFund: '', // 组合初始资金
          tradeVariety: '', // 交易品种
          singleStockLimit: '', // 小于等于初始资金百分比
          commissionRate: '' // 佣金费率
        },
        rules2: {
          name: [
            {required: true, message: '请输入分组名称', trigger: 'blur'}
          ],
          startTime: [
            {required: true, validator: validateTime, trigger: 'blur'}
          ],
          initFund: [
            {required: true, message: '请选择初始资金', trigger: 'blur'}
          ],
          tradeVariety: [
            {required: true, message: '请选择交易品种', trigger: 'blur'}
          ],
          singleStockLimit: [
            {required: true, message: '请输入单只买入时，小于等于的初始资金总额', trigger: 'blur'}
          ],
          commissionRate: [
            {required: true, message: '请输入佣金费率', trigger: 'blur'}
          ]
        },

        editReadOnly: false, // 是否可编辑
        editGroupId: '', // 编辑分组id
        editGroup: '', // 编辑分组
        tableData: [], // 表格数据
        dialogFormVisible: false, // 弹框显示隐藏
        diaLogTitle: '新建分组', // 弹框标题
        addSign: false, // 阻止二次提交
        formLabelWidth: '120px',
        buyOnlyWidth: '274px'
      }
    },
    mounted () {
      this.getTableList()
    },
    methods: {
      dateStartChange (val) {
        this.ruleForm2.startTime = val
      },
      dateEndChange (val) {
        this.ruleForm2.endTime = val
      },
      // 获取表格数据
      getTableList () {
        this.$http({
          method: 'GET',
          url: '/dengtacj/investmentAdviser/queryBaseGroup.do',
          params: {},
          headers: {'X-Requested-With': 'XMLHttpRequest'},
          emulateJSON: true
        }).then(function (result) {
          this.tableData = result.data.list
        }).catch(() => {
          this.$message.error('请重新登录')
          this.$router.push('/')
        })
      },
      // 添加投顾组合
      addGroup (id) {
        this.addSign = true
        this.$http({
          method: 'POST',
          url: '/dengtacj/investmentAdviser/newGroupSubmit.do',
          body: {
            groupName: this.ruleForm2.name.trim(),
            startDay: this.ruleForm2.startTime,
            endDay: this.ruleForm2.endTime,
            initFund: this.ruleForm2.initFund,
            tradeVariety: this.ruleForm2.tradeVariety,
            singleStockLimit: this.ruleForm2.singleStockLimit.trim() / 100,
            userId: '',
            groupId: id === undefined ? '' : id,
            commissionRate: this.ruleForm2.commissionRate.trim() / 100
          },
          headers: {'X-Requested-With': 'XMLHttpRequest'},
          emulateJSON: true
        }).then(function (result) {
          console.log(result.data.message.message)
          this.addSign = false
          if (result.data.message.code === 0) {
            if (this.editGroupId === '') {
              this.success('添加成功')
            } else {
              this.success('修改成功')
            }
            this.editGroupId = ''
            this.resetForm()
            this.getTableList()
            this.dialogFormVisible = false
          } else {
            this.$message.error(result.data.message.message)
          }
        }).catch(() => {
          this.$message.error('请重新登录')
          this.$router.push('/')
        })
      },
      // 打开弹窗
      openDialog () {
        this.editGroupId = ''
        this.resetForm()
        this.diaLogTitle = '新建分组'
        this.dialogFormVisible = true
      },
      // 编辑数据
      editDialog (id) {
        this.diaLogTitle = '编辑分组'
        this.editGroupId = id
        for (var i = 0; i < this.tableData.length; i++) {
          if (this.tableData[i].sGroupId === id) {
            this.editGroup = this.tableData[i]
          }
        }
        this.ruleForm2.name = decodeURI(this.editGroup.sGroupName)
        this.ruleForm2.startTime = this.editGroup.sStartDay
        this.ruleForm2.endTime = this.editGroup.sEndDay
        this.ruleForm2.initFund = this.editGroup.fInitFund.toString()
        this.ruleForm2.tradeVariety = this.editGroup.iTradeVariety.toString()
        this.ruleForm2.singleStockLimit = (this.editGroup.fSingleStockLimit * 100).toString()
        this.ruleForm2.commissionRate = (this.editGroup.fCommissionRate * 100).toString()
        let nowTime = this.getTime().replace(/-+/g, '')
        let editStTime = this.ruleForm2.startTime.replace(/-+/g, '')
        let editEnTime = this.ruleForm2.endTime.replace(/-+/g, '')
        if (nowTime >= editStTime && nowTime <= editEnTime) {
          this.editReadOnly = true
        } else {
          this.editReadOnly = false
        }
        this.dialogFormVisible = true
      },
      // 提交表单
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let stTime = this.ruleForm2.startTime.split('-')
            let enTime = this.ruleForm2.endTime.split('-')
            if (enTime[0] < stTime[0]) {
              this.$message.error('运行时间初始时间要小于结束时间')
              return
            } else if (enTime[0] === stTime[0]) {
              if (enTime[1] < stTime[1]) {
                this.$message.error('运行时间初始时间要小于结束时间')
                return
              } else if (enTime[1] === stTime[1]) {
                if (enTime[2] < stTime[2]) {
                  this.$message.error('运行时间初始时间要小于结束时间')
                  return
                }
              }
            }
            if (this.editGroupId) {
              this.addGroup(this.editGroupId)
            } else {
              this.addGroup()
            }
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      // 重置表单
      resetForm () {
        this.ruleForm2.name = ''
        this.ruleForm2.startTime = ''
        this.ruleForm2.endTime = ''
        this.ruleForm2.initFund = ''
        this.ruleForm2.tradeVariety = ''
        this.ruleForm2.singleStockLimit = ''
        this.ruleForm2.commissionRate = ''
      },
      // 获取当前时间
      getTime () {
        var date = new Date()
        var nowMonth = date.getMonth() + 1
        var strDate = date.getDate()
        var seperator = '-'
        if (nowMonth >= 1 && nowMonth <= 9) {
          nowMonth = '0' + nowMonth
        }
        if (strDate >= 0 && strDate <= 9) {
          strDate = '0' + strDate
        }
        return date.getFullYear() + seperator + nowMonth + seperator + strDate
      },
      success (msg) {
        this.$message({
          showClose: true,
          message: msg,
          type: 'success'
        })
      }
    },
    filters: {
      tabTradeVariety: function (val) {
        if (!val) return val
        return val === 1 ? 'A股' : val === 2 ? 'A股非ST' : ''
      }
    }
  }
</script>
<style scoped>
  .btnBottom {
    margin-bottom: 10px;
  }

  .input1 .el-input {
    width: 42%;
  }

  .input2 .el-input {
    width: 18%;
  }
</style>
