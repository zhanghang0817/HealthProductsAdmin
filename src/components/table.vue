<template>
  <div>
    <el-table
      :data="tableData1"
      border
      align="center"
      style="width: 100%">
      <el-table-column
        label="序号"
        type="index"
        width="80px">
      </el-table-column>
      <el-table-column
        prop="title"
        label="标题*"
        width="260px">
        <template slot-scope="scope">
          <span><a :href='newsUrl+scope.row.id' target="_blank">{{ scope.row.title | subStr}}</a></span>
        </template>
      </el-table-column>
      <el-table-column
        label="来源">
        <template slot-scope="scope">
          <span>{{ scope.row.source | subStr}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="columnName"
        label="栏目*">
      </el-table-column>
      <el-table-column
        label="发布时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createAt | timeDateChange}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="small" v-if="menuList.indexOf('video:edit') == -1?false:true"
                     @click="editVideo(scope.row.id)">编辑
          </el-button>
          <el-button size="small" v-if="menuList.indexOf('video:delete') == -1?false:true"
                     type="danger"
                     @click="removeVideo(scope.row.id)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
  import { getH5PageHost } from '../lib/hostUtil.js'

  export default{
    props: ['tableData1'],
    data () {
      return {
        menuList: [],
        newsUrl: getH5PageHost() + '/yzt/djgd_lookNewsDetail.html?id=' // 新闻跳转的url
      }
    },
    methods: {
      // 子节点调用父节点方法
      removeVideo: function (itemId) {
        this.$emit('removeVideoFun', itemId)
      },
      editVideo: function (itemId) {
        console.log(itemId)
        this.$emit('editVideoFun', itemId)
      }
    },
    mounted () {
      this.menuList = localStorage.menuList
    }
  }
</script>
