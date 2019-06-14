<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="私募管理" name="first">
        <el-form :inline="true" :model="searchInline" class="demo-form-inline">
          <el-form-item label="产品名称">
            <el-autocomplete
              v-model="searchInline.productName"
              :fetch-suggestions="querySearchAsync"
              @select="handleSelect"
            ></el-autocomplete>
          </el-form-item>
          <el-form-item label="管理人">
            <el-autocomplete
              v-model="searchInline.custodian"
              :fetch-suggestions="querySearchAsync"
              @select="handleSelect"
            ></el-autocomplete>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
            <el-button type="primary" @click="resetting">重置</el-button>
          </el-form-item>
        </el-form>
        <el-table
          :data="tableData"
          border
          align="center"
          style="width: 100%">
          <el-table-column
            prop="title"
            fixed
            label="产品名称"
            width="100px">
            <template slot-scope="scope">
              <span>{{ scope.row.title | subStr}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="管理人">
            <template slot-scope="scope">
              <span>{{ scope.row.source | subStr}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="风险等级"
            width="100px">
          </el-table-column>
          <el-table-column
            label="起购金额(万元)"
            width="140px">
            <template slot-scope="scope">
              <span>{{ scope.row.createAt | timeDateChange}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="收益分配方式"
            width="140px">
            <template slot-scope="scope">
              <span>{{ scope.row.createAt | timeDateChange}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="产品成立日"
            width="140px">
            <template slot-scope="scope">
              <span>{{ scope.row.createAt | timeDateChange}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="产品到期日"
            width="140px">
            <template slot-scope="scope">
              <span>{{ scope.row.createAt | timeDateChange}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="产品状态"
            width="100px">
            <template slot-scope="scope">
              <span>{{ scope.row.createAt | timeDateChange}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="是否下架"
            width="100px">
            <template slot-scope="scope">
              <span>{{ scope.row.createAt | timeDateChange}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="下架时间"
            width="100px">
            <template slot-scope="scope">
              <span>{{ scope.row.createAt | timeDateChange}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" width="280px">
            <template slot-scope="scope">
              <el-button size="small"
                         @click="editData(scope.row.id)">编辑
              </el-button>
              <el-button size="small"
                         type="danger"
                         @click="addNetValueWin(scope.row.id)">增加净值数据
              </el-button>
              <el-button size="small"
                         type="danger"
                         @click="lookNetValue(scope.row.id)">净值查看
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!--分页-->
        <div class="block" style="float:right;margin:10px 18px">
          <el-button type="primary" :disabled="!hasProPage" @click="nextPage('-1')">上一页</el-button>
          第{{currentPage}}页
          <el-button type="primary" :disabled="!hasNextPage" @click="nextPage('1')">下一页</el-button>
        </div>
        <div style="float:right;margin: 10px 18px;">前往
          <el-input v-model="jumperPage" class="jumperPage"></el-input>
          页
        </div>
      </el-tab-pane>

      <el-tab-pane label="私募编辑" name="second">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="产品名称" prop="name" class="input1">
            <el-input v-model="ruleForm.name" :maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="管理人" prop="administrant" class="input1">
            <el-input v-model="ruleForm.administrant" :maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="基金状态" prop="region">
            <el-select v-model="ruleForm.region" placeholder="请选择活动区域">
              <el-option label="运作中" value="shanghai"></el-option>
              <el-option label="预约购买" value="beijing"></el-option>
              <el-option label="销售结束" value="beijing"></el-option>
              <el-option label="已下架" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否分级" prop="region">
            <el-select v-model="ruleForm.region" placeholder="请选择活动区域">
              <el-option label="是" value="shanghai"></el-option>
              <el-option label="否" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="产品风险等级" prop="region">
            <el-select v-model="ruleForm.region" placeholder="请选择活动区域">
              <el-option label="R1" value="shanghai"></el-option>
              <el-option label="R2" value="beijing"></el-option>
              <el-option label="R3" value="beijing"></el-option>
              <el-option label="R4" value="beijing"></el-option>
              <el-option label="R5" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="基金类型" prop="region">
            <el-select v-model="ruleForm.region" placeholder="请选择活动区域">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <!--查看弹窗-->
    <el-dialog :title="lookTitle" :visible.sync="dialogTableVisible">
      <el-table :data="gridData">
        <el-table-column property="date" label="发布时间"></el-table-column>
        <el-table-column property="name" width="200" label="份额净值/万份收益"></el-table-column>
        <el-table-column property="address" width="200" label="累计净值/7日年化收益"></el-table-column>
        <el-table-column property="address" label="操作">
          <template slot-scope="scope">
            <el-button size="small"
                       @click="editData(scope.row.id)">修改
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <!--添加弹窗-->
    <el-dialog :title="lookTitle" :visible.sync="dialogFormVisible">
      <el-form :model="addForm">
        <el-form-item label="发布时间" :label-width="formLabelWidth" class="input1">
          <el-input v-model="addForm.name" auto-complete="off" :readonly=true></el-input>
        </el-form-item>
        <el-form-item label="份额净值/万份收益" :label-width="formLabelWidth" class="input1">
          <el-input v-model="addForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="累计净值/7日年化收益" :label-width="formLabelWidth" class="input1">
          <el-input v-model="addForm.name" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addNetValue()">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
  export default {
    data () {
      return {
        activeName: 'first',
        searchInline: {
          productName: '', // 产品名称
          custodian: '' // 管理人
        },
        tableData: [
          {'title': '1'}
        ],
        // 基金列表
        tablePs: '15',
        currentPage: 1, // 页码
        jumperPage: '', // 跳转页码
        hasNextPage: false,
        hasProPage: false,
        restaurants: [],
        timeout: null,
        // 弹窗
        lookTitle: 'aaa--净值数据', // 查看弹窗
        gridData: [
          {'date': '1'}
        ], // 净值列表
        dialogTableVisible: false,
        dialogFormVisible: false,
        formLabelWidth: '150px',
        addForm: {
          name: '',
          region: ''
        }, // 添加列表
        // 私募编辑列表
        ruleForm: {
          name: '', // 基金名称
          administrant: '', // 管理人
          region: ''
        },
        rules: {
          name: [
            { required: true, message: '请输入基金名称', trigger: 'blur' }
          ],
          administrant: [
            { required: true, message: '请输入管理人', trigger: 'blur' }
          ],
          region: [
            { required: true, message: '请选择活动区域', trigger: 'change' }
          ],
          date1: [
            { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
          ],
          date2: [
            { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
          ],
          type: [
            { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
          ],
          resource: [
            { required: true, message: '请选择活动资源', trigger: 'change' }
          ],
          desc: [
            { required: true, message: '请填写活动形式', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      // 模糊查询
      loadAll () {
        return [
          {'value': '三全鲜食（北新泾店）', 'address': '长宁区新渔路144号'},
          {'value': 'Hot honey 首尔炸鸡（仙霞路）', 'address': '上海市长宁区淞虹路661号'},
          {'value': '新旺角茶餐厅', 'address': '上海市普陀区真北路988号创邑金沙谷6号楼113'}
        ]
      },
      querySearchAsync (queryString, cb) {
        var restaurants = this.restaurants
        var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
          cb(results)
        }, 3000 * Math.random())
      },
      createStateFilter (queryString) {
        return (state) => {
          return (state.value.indexOf(queryString.toLowerCase()) === 0)
        }
      },
      handleSelect (item) {
        console.log(item)
      },
      handleClick (tab, event) {
        console.log(tab, event)
      },
      // 查询
      onSubmit () {
        console.log('submit!')
      },
      // 重置
      resetting () {
        console.log('resetting!')
        this.searchInline.custodian = ''
        this.searchInline.productName = ''
      },
      // 编辑数据
      editData () {
        console.log('编辑')
      },
      // 添加净值
      addNetValueWin () {
        this.dialogFormVisible = true
      },
      addNetValue () {
        console.log('添加')
      },
      // 查看净值
      lookNetValue () {
        console.log('查看')
        this.dialogTableVisible = true
      },
      // 编辑提交
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!')
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      resetForm (formName) {
        this.$refs[formName].resetFields()
      }
    },
    mounted () {
      this.restaurants = this.loadAll()
    }
  }
</script>
<style scoped>
  .jumperPage {
    width: 50px;
  }

  .input1 .el-input {
    width: 42%;
  }
</style>
