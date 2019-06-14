<template>
  <div>
    <div v-if="pageIndex==='1'">
      审核状态&nbsp;&nbsp;
      <el-select size="small" v-model="status">
        <el-option
          v-for="item in selectoption1"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      &nbsp;&nbsp;组合分组&nbsp;&nbsp;
      <el-select size="small" v-model="groupsId" placeholder="请选择">
        <el-option
          v-for="item in selectoption2"
          :key="item.sGroupId"
          :label="item.sGroupName"
          :value="item.sGroupId">
        </el-option>
      </el-select>
      <el-button type="primary" size="small" @click="search()">查找</el-button>
      <el-table
        :data="list"
        border
        align="center"
        style="width: 100%; margin-top:20px;">
        <el-table-column
          prop="sGroupName"
          label="组合名称">
        </el-table-column>
        <el-table-column
          prop="sBaseGroupName"
          label="组合分组">
        </el-table-column>
        <el-table-column
          prop="sUserName"
          label="真实姓名">
        </el-table-column>
        <el-table-column
          label="证书类型">
          <template slot-scope="scope">
            <!-- <span>{{ scope.row.createAt}}</span> -->
            <span>证券投资咨询业务(投资顾问)</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="sCategoryNum"
          label="证书编号">
        </el-table-column>
        <el-table-column
          label="状态">
          <template slot-scope="scope">
            <span>{{ initStatus(scope.row.iVerifyResult)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="申请时间">
          <template slot-scope="scope">
            <span>{{ scope.row.lApplyTime*1000 | timeDateChange}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="组合ID">
          <template slot-scope="scope">
            <span>{{ scope.row.sGroupId}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="投顾ID">
          <template slot-scope="scope">
            <span>{{ scope.row.sUserId}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80px">
          <template slot-scope="scope">
            <el-button size="small"
                       @click="editData(scope.row)">查看
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
    </div>
    <!-- 详情页 -->
    <div v-if="pageIndex==='2'" style="width:80%; margin: 0 auto">
      <p>姓名：{{editList.sUserName}}</p>
      <p>资格证种类：证券投资咨询业务（投资顾问）</p>
      <p>资格证号码：{{editList.sCategoryNum}}</p>
      <p>所在公司：{{editList.sCompany}}</p>
      <p>擅长领域：{{editList.sGoodAt}}</p>
      <p>组合名称：{{editList.sGroupName}}</p>
      <p>组合简介：{{editList.sGroupDesc}}</p>
      <p>组合类别：{{editList.sBaseGroupName}}</p>
      <p>身份证正面：</p>
      <p><img v-bind:src="'http://download.zq88.cn/'+editList.sPicFront" style="width: 300px;"></p>
      <p>身份证反面：</p>
      <p><img v-bind:src="'http://download.zq88.cn/'+editList.sPicBack" style="width: 300px;"></p>
      <div>
        <p>申请时间：{{editList.lApplyTime*1000 | timeDateChange}}</p>
        <p v-if="editList.iVerifyResult!==1">审核时间：{{editList.lVerifyTime*1000 | timeDateChange}}</p>
        <p>审核结果：{{initStatus(editList.iVerifyResult)}}</p>
        <p v-if="editList.iVerifyResult!==1">审核结果描述：{{editList.sVerifyDesc}}</p>
      </div>
      <p v-if="editList.iVerifyResult===1">
        <el-radio v-model="radio" label="2">审核通过并展示</el-radio>
        <el-radio v-model="radio" label="3">拒绝</el-radio>
        <el-radio v-model="radio" label="4">审核通过不展示</el-radio>
      </p>
      <el-input
        v-if="editList.iVerifyResult===1"
        type="textarea"
        :rows="6"
        placeholder="请输入审核结果描述"
        v-model="textarea" style="margin-bottom: 30px;">
      </el-input>
      <el-button type="primary" size="primary" @click="back()">返回</el-button>
      <el-button v-if="editList.iVerifyResult===1" type="primary" size="primary" :disabled="ifSubmit" @click="submit()">
        提交
      </el-button>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        list: [],
        editList: [], // 编辑页面的数据
        pageIndex: '1',
        currentPage: 1, // 当前页
        totalPage: 1, // 总页数
        hasProPage: false, // 是否有上一页
        hasNextPage: false, // 是否有下一页
        ifSubmit: false, // 是否已提交成功
        groupsId: '',
        status: '0', // 审核状态
        groups: '', // 组合分组
        tagState: '', // 判断是否为禧阳财富组合 0 不是禧阳财富组合 1 是禧阳财富组合
        selectoption1: [{
          value: '0',
          label: '全部'
        }, {
          value: '1',
          label: '待审核'
        }, {
          value: '2',
          label: '审核通过并展示'
        }, {
          value: '3',
          label: '已拒绝'
        }, {
          value: '4',
          label: '审核通过不展示'
        }],
        selectoption2: [],
        // 审核
        radio: '2',
        textarea: '' // 审核描述
      }
    },
    methods: {
      alert () {
        console.log(this.status)
      },
      // 编辑
      editData (row) {
        this.editList = row
        console.log(this.editList)
        this.pageIndex = '2'
      },
      // 返回
      back () {
        this.pageIndex = '1'
        this.ifSubmit = false
      },
      // 上下页
      nextPage: function (val) {
        this.currentPage = Number(this.currentPage) + Number(val)
        if (this.currentPage <= 1) {
          this.hasProPage = false
          this.currentPage = 1
        } else {
          this.hasProPage = true
        }
        this.getList()
      },
      // 查找
      search () {
        this.currentPage = 1
        this.getList()
      },
      submit () {
        this.$http({
          method: 'POST',
          url: '/dengtacj/investmentAdviser/verifySubmit.do',
          params: {
            userId: this.editList.sUserId,
            accountId: this.editList.sGroupId,
            verifyResult: this.radio,
            verifyDesc: this.textarea
          },
          headers: {'X-Requested-With': 'XMLHttpRequest'},
          emulateJSON: true
        }).then(function (result) {
          console.log(result.data)
          if (result.data.message.code === 0) {
            this.$message('提交成功')
            console.log(this.radio)
            if (this.radio !== '3') {
//              this.ifXycfGroup()
            }
            this.getList()
            this.ifSubmit = true
          } else {
            this.$message.error(result.data.message.message)
          }
        }).catch(() => {
          this.$message.error('提交失败')
        })
      },
      // 获取分组id
      getId () {
        this.$http.get('/dengtacj' + '/investmentAdviser/queryBaseGroup.do', {
          params: {}
        }).then(function (data) {
          let result = data.data
          this.selectoption2 = result.list
        }).catch(function (err) {
          console.log(err)
        })
      },
      // 获取列表数据
      getList () {
        this.$http.get('/dengtacj' + '/investmentAdviser/queryIdentify.do', {
          params: {
            userId: '',
            status: this.status,
            accountId: this.groupsId,
            pageSize: 20,
            currentPage: this.currentPage
          }
        }).then(function (data) {
          let result = data.data
          this.list = result.list
          if (this.currentPage < result.totalPage) {
            this.hasNextPage = true
          } else {
            this.hasNextPage = false
          }
        }).catch(function (err) {
          console.log(err)
        })
      },
      // 格式化审核状态
      initStatus (e) {
        if (e === 1) {
          return '待审核'
        } else if (e === 2) {
          return '审核通过并展示'
        } else if (e === 3) {
          return '已拒绝'
        } else if (e === 4) {
          return '审核通过不展示'
        }
      },
      // 审核通过同步投顾数据（投顾数据保存在融汇）
      hczqSynchrodata () {
        let isAttend
        switch (this.radio) {
          case '2':
            isAttend = 1 // 展示
            break
          case '4':
            isAttend = 0 // 不展示
            break
        }
        console.log(isAttend)
        this.$http({
          method: 'POST',
          url: '/analyse/hczq/home/' + '/game/adviserGroup/addGroup.do',
          params: {
            userId: this.editList.sUserId,
            accountId: this.editList.sGroupId,
            realName: this.editList.sUserName,
            groupName: this.editList.sGroupName,
            imgFront: 'http://download.zq88.cn/' + this.editList.sPicFront,
            imgBack: 'http://download.zq88.cn/' + this.editList.sPicBack,
            categoryType: 0,
            categoryNum: this.editList.sCategoryNum,
            company: this.editList.sCompany,
            goodAt: this.editList.sGoodAt,
            content: this.editList.sGroupDesc,
            isAttend: isAttend,
            userType: 8,
            tagState: this.tagState
          },
          headers: {'X-Requested-With': 'XMLHttpRequest'},
          emulateJSON: true
        }).then(function (result) {
          console.log(result)
          console.log(result.data)
          if (result.data.message.code === 0) {
//            this.$message('提交成功2')
          } else {
//            this.$message.error(result.data.message.message)
          }
        }).catch(() => {
          this.$message.error('提交失败2')
        })
      },
      // 判断是否为禧阳财富组合
      ifXycfGroup: function () {
        this.$http.get('/dengtacj' + '/investmentAdviser/accountInfo.do', {
          params: {
            uid: this.editList.sUserId,
            accountId: this.editList.sGroupId
          }
        }).then(function (data) {
          if (data.data.message.code === 0) {
            console.log(data)
            console.log(data.data.tagState)
            this.tagState = data.data.tagState
            this.hczqSynchrodata()
          }
        }).catch(function (err) {
          console.log(err)
        })
      }
    },
    mounted: function () {
      this.getId()
      this.getList()
    }
  }
</script>
