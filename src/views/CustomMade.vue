<template>
  <div>
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="投资人">
        <el-autocomplete
          v-model="formInline.investor"
          :fetch-suggestions="querySearchAsync"
          @select="handleSelect"
        ></el-autocomplete>
      </el-form-item>
      <el-form-item label="客户经理">
        <el-autocomplete
          v-model="formInline.clientManager"
          :fetch-suggestions="querySearchAsync"
          @select="handleSelect"
        ></el-autocomplete>
      </el-form-item>
      <el-form-item label="基金名称">
        <el-autocomplete
          v-model="formInline.fundName"
          :fetch-suggestions="querySearchAsync"
          @select="handleSelect"
        ></el-autocomplete>
      </el-form-item>
      <el-form-item label="投资人电话">
        <el-autocomplete
          v-model="formInline.investorTel"
          :fetch-suggestions="querySearchAsync"
          @select="handleSelect"
        ></el-autocomplete>
      </el-form-item>
      <el-form-item label="客户经理电话">
        <el-autocomplete
          v-model="formInline.clientManagerTel"
          :fetch-suggestions="querySearchAsync"
          @select="handleSelect"
        ></el-autocomplete>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      border
      align="center"
      style="width: 100%">
      <el-table-column
        prop="title"
        label="预定时间">
        <template slot-scope="scope">
          <span><a :href='newsUrl+scope.row.id' target="_blank">{{ scope.row.title | subStr}}</a></span>
        </template>
      </el-table-column>
      <el-table-column
        label="投资人姓名">
        <template slot-scope="scope">
          <span>{{ scope.row.source | subStr}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="联系电话">
      </el-table-column>
      <el-table-column
        label="基金名称">
        <template slot-scope="scope">
          <span>{{ scope.row.createAt | timeDateChange}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="产品成立日">
        <template slot-scope="scope">
          <span>{{ scope.row.createAt | timeDateChange}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="产品到期日">
        <template slot-scope="scope">
          <span>{{ scope.row.createAt | timeDateChange}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="产品状态">
        <template slot-scope="scope">
          <span>{{ scope.row.createAt | timeDateChange}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="客户经理">
        <template slot-scope="scope">
          <span>{{ scope.row.createAt | timeDateChange}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="客户经理电话"
        width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.createAt | timeDateChange}}</span>
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
  </div>
</template>
<script>
  export default {
    data () {
      return {
        formInline: {
          investor: '', // 投资人
          clientManager: '', // 客户经理
          fundName: '', // 基金名
          investorTel: '', // 投资人电话
          clientManagerTel: '' // 客户经理电话
        },
        tableData: [], // 用户列表
        tablePs: '15',
        currentPage: 1, // 页码
        jumperPage: '', // 跳转页码
        hasNextPage: false,
        hasProPage: false,
        restaurants: [],
        timeout: null
      }
    },
    methods: {
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
      // 上下页
      nextPage: function (val) {
        this.currentPage = Number(this.currentPage) + Number(val)
        if (this.currentPage <= 1) {
          this.hasProPage = false
          this.currentPage = 1
        }
        this.getAudioList()
      },
      onSubmit () {
        console.log('submit!')
      }
    },
    mounted () {
      this.restaurants = this.loadAll()
    }
  }
</script>
<style scoped>
  .width20 {
    width: 27.5%;
  }
  .jumperPage {
    width: 50px;
  }
</style>
