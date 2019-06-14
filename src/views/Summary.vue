<template>
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="简介管理" name="first">
      <el-table
        :data="tableData"
        border
        align="center"
        style="width: 100%">
        <el-table-column
          label="序号"
          type="index"
          width="80px">
        </el-table-column>
        <el-table-column
          prop="columnName"
          label="栏目*">
        </el-table-column>
        <el-table-column
          prop="content"
          label="简介*"
          width="500px">
          <template slot-scope="scope">
            <span>{{ scope.row.content | splitStr30}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="发布时间">
          <template slot-scope="scope">
            <span>{{ scope.row.createAt | timeDateChange}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="small" v-if="menuList.indexOf('summary:detail') == -1?false:true"
                       @click="editSummaryData(scope.row.id)">编辑
            </el-button>
            <el-button size="small" v-if="menuList.indexOf('summary:delete') == -1?false:true"
                       type="danger"
                       @click="removeTabSummary(scope.row.id)">删除
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
    </el-tab-pane>
    <el-tab-pane label="发布简介" name="second" v-if="menuList.indexOf('summary:add') == -1?false:true">

      <el-form :model="ruleForm2" :rules="rules" ref="ruleForm2" label-width="100px" class="demo-ruleForm">
        <el-form-item label="栏目*" prop="column">
          <el-select v-model="ruleForm2.column" placeholder="请选择活动区域">
            <el-option v-for="(item,index) in ruleForm2.columnList" :key="index" :label="item.name" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="简介*" class="iptWidth50" prop="content">
          <!--<quill-editor ref="myTextEditor" v-model="ruleForm2.content" :config="editorOption"-->
          <!--class="editorHei400"></quill-editor>-->
          <el-input type="textarea" class="areaHei200" v-model="ruleForm2.content"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm2')" :loading="subAddLoading">提交</el-button>
        </el-form-item>
      </el-form>

    </el-tab-pane>
  </el-tabs>
</template>
<script>
  import {quillEditor} from 'vue-quill-editor'
  export default {
    data () {
      var validateColumn = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请选择栏目'))
        } else {
          callback()
        }
      }
      var validateContent = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请填写简介'))
        } else {
          if (value.length > 300) {
            callback(new Error('简介填写300字以内'))
          }
          callback()
        }
      }
      return {
        activeName: 'first',
        subAddLoading: false, // 按钮loading
        ruleForm2: {
          column: '', // 简介
          columnList: '', // 简介列表
          content: ''
        },
        rules: {
          column: [
            {validator: validateColumn, trigger: 'blur'}
          ],
          content: [
            {validator: validateContent, trigger: 'blur'}
          ]
        },
        editorOption: {
          // something config
        },
        editSummaryId: '', // 编辑的简介id
        tableData: [], // 简介表格数据
        tablePs: '20',
        currentPage: '1', // 页码
        hasNextPage: false,
        hasProPage: false,
        menuList: [] // 权限
      }
    },
    components: {
      quillEditor
    },
    mounted () {
      this.menuList = localStorage.menuList
      this.getColoumes()
      this.getSummaryList()
    },
    methods: {
      handleClick (tab, event) {
        if (tab.name === 'first') {
          this.ruleForm2.content = ''
          this.resetForm('ruleForm2')
          this.editSummaryId = ''
        }
      },
      // 获取简介
      getColoumes () {
        this.$http({
          method: 'GET',
          url: '/e/u/opinion/introduce/coloums/search',
          params: {},
          headers: {'X-Requested-With': 'XMLHttpRequest'},
          emulateJSON: true
        }).then(function (result) {
          this.ruleForm2.columnList = result.data.data
        }).catch(() => {
          this.$message.error('请重新登录')
          this.$router.push('/')
        })
      },
      // 提交简介
      submitSummaryNews () {
        this.subAddLoading = true
        this.$http({
          method: 'POST',
          url: '/e/u/opinion/introduce',
          body: {
            columnCode: this.ruleForm2.column,
            content: this.ruleForm2.content
          },
          headers: {'X-Requested-With': 'XMLHttpRequest'},
          emulateJSON: false
        }).then(function (result) {
          console.log(result.data)
          console.log(result.data.message.code === 0)
          if (result.data.message.code === 0) {
            console.log(0)
            this.ruleForm2.content = ''
            this.resetForm('ruleForm2')
            this.getSummaryList()
            this.success('提交成功')
            this.subAddLoading = false
          } else {
            this.subAddLoading = false
          }
        }).catch(() => {
          this.subAddLoading = false
          this.$message.error('请重新登录')
          this.$router.push('/')
        })
      },
      // 提交简介表单
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
//          if (this.ruleForm2.content === '') {
//            this.warning('请填写相关简介')
//            return false
//          }
          if (valid) {
            if (this.editSummaryId === '') {
              this.submitSummaryNews()
            } else {
              console.log(1111)
              this.submitEditSummary()
            }
          } else {
            console.log(this.content)
            console.log('error submit!!')
            return false
          }
        })
      },
      // 重置表单
      resetForm (formName) {
        this.$refs[formName].resetFields()
      },
      // 获取简介列表
      getSummaryList () {
        this.$http({
          method: 'GET',
          url: '/e/u/opinion/introduce/search',
          params: {cp: this.currentPage, ps: this.tablePs},
          headers: {'X-Requested-With': 'XMLHttpRequest'},
          emulateJSON: true
        }).then(function (result) {
          console.log(result.data.data.introList)
          this.tableData = result.data.data.introList
          this.hasNextPage = result.data.data.hasNextPage
          this.currentPage = result.data.data.currentPage
          if (result.data.data.currentPage === 1 || !result.data.data.currentPage) {
            this.hasProPage = false
            this.currentPage = 1
          } else {
            this.hasProPage = true
          }
        }).catch(() => {
          this.$message.error('请重新登录')
          this.$router.push('/')
        })
      },
      // 编辑回显数据
      editSummaryData: function (id) {
        this.editSummaryId = id
        this.$http({
          method: 'GET',
          url: '/e/u/opinion/introduce/' + id,
          headers: {'X-Requested-With': 'XMLHttpRequest'},
          emulateJSON: false
        }).then(function (result) {
          console.log(result.data.data)
          this.ruleForm2.content = result.data.data.content
          this.ruleForm2.column = result.data.data.columnCode
          this.activeName = 'second'
        }).catch(() => {
          this.$message.error('请重新登录')
          this.$router.push('/')
        })
      },
      // 提交编辑数据
      submitEditSummary: function () {
        this.subAddLoading = true
        this.$http({
          method: 'PUT',
          url: '/e/u/opinion/introduce/' + this.editSummaryId,
          body: {
            columnCode: this.ruleForm2.column,
            content: this.ruleForm2.content
          },
          headers: {'X-Requested-With': 'XMLHttpRequest'},
          emulateJSON: false
        }).then(function (result) {
          console.log(result.data)
          console.log(result.data.message.code)
          if (result.data.message.code === 0) {
            this.ruleForm2.content = ''
            this.resetForm('ruleForm2')
            this.editSummaryId = ''
            this.getSummaryList()
            this.success('修改成功')
            this.subAddLoading = false
          } else {
            this.subAddLoading = false
          }
        }).catch(() => {
          this.subAddLoading = false
          this.$message.error('请重新登录')
          this.$router.push('/')
        })
      },
      // 上下页
      nextPage: function (val) {
        this.currentPage = Number(this.currentPage) + Number(val)
        if (this.currentPage <= 1) {
          this.hasProPage = false
          this.currentPage = 1
        }
        this.getSummaryList()
      },
      // 删除音频
      removeSummary (id) {
        console.log(id)
        this.$http({
          method: 'DELETE',
          url: '/e/u/opinion/introduce/' + id,
          headers: {'X-Requested-With': 'XMLHttpRequest'},
          emulateJSON: false
        }).then(function (result) {
          console.log(result.data)
          if (result.data.message.code === 0) {
            this.getSummaryList()
            this.success('删除成功')
          }
        }).catch(() => {
          this.$message.error('请重新登录')
          this.$router.push('/')
        })
      },
      // 删除简介弹窗
      removeTabSummary (id) {
        this.$confirm('确认删除该记录吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.removeSummary(id)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      success (msg) {
        this.$message({
          showClose: true,
          message: msg,
          type: 'success'
        })
      },
      warning (msg) {
        this.$message({
          showClose: true,
          message: msg,
          type: 'warning'
        })
      }
    }
  }
</script>
<style>
  .iptWidth50 {
    width: 50%;
  }

  .areaHei200 {
    height: 200px;
  }

  .areaHei200 > textarea {
    height: 100%;
  }
</style>
