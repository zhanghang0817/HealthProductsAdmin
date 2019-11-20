<script src="../../../../project/cordova-app/platforms/android/cordova/lib/builders/GradleBuilder.js"></script>
<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="未处理" name="0"></el-tab-pane>
      <el-tab-pane label="已处理" name="3"></el-tab-pane>
    </el-tabs>
    <el-table :data="users" highlight-current-row v-loading="listLoading" style="width: 100%;">
      <el-table-column prop="id" label="序号" width="80">
      </el-table-column>
      <el-table-column prop="createAt" label="提交时间" width="150">
        <template slot-scope="scope">
          {{scope.row.createAt | timeDateChange}}
        </template>
      </el-table-column>
      <el-table-column prop="osType" label="系统" width="90" >
      </el-table-column>
      <el-table-column prop="osVersion" label="系统版本号" width="110">
      </el-table-column>
      <el-table-column prop="appVersion" label="APP版本号" width="110">
      </el-table-column>
      <el-table-column prop="contact" label="联系方式" width="168">
      </el-table-column>
      <el-table-column prop="content" label="反馈内容" min-width="180">
        <template slot-scope="scope">
          <p>{{scope.row.content | contentLimit}} &nbsp;<i class="el-icon-picture" v-if="scope.row.imageUrls"></i></p>
        </template>
      </el-table-column>
      <el-table-column prop="updateAt" label="处理时间" width="150" v-if="activeName == 3">
        <template slot-scope="scope">
          {{scope.row.updateAt | timeDateChange}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)" v-if="menuList.indexOf('feedback:detail') == -1?false:true">详情</el-button>
          <el-button size="small" type="primary" @click="handleRead(scope.$index, scope.row)" v-if="menuList.indexOf('feedback:review') == -1?false:true && activeName == 0">已阅</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--编辑页面-->
    <!--编辑界面-->
    <el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false" :visible.sync="editFormVisible" top="2%" v-loading="editListLoading">
      <el-form :model="editForm" label-width="100px" ref="editForm">
        <el-form-item label="序号：" prop="id">
          {{editForm.id}}
        </el-form-item>
        <el-form-item label="提交时间：" prop="createAt">
          {{editForm.createAt | timeDateChange}}
        </el-form-item>
        <el-form-item label="系统：" prop="osType">
          {{editForm.osType}}
        </el-form-item>
        <el-form-item label="系统版本号：" prop="osVersion">
          {{editForm.osVersion}}
        </el-form-item>
        <el-form-item label="APP版本号：" prop="appVersion">
          {{editForm.appVersion}}
        </el-form-item>
        <el-form-item label="联系方式：" prop="contact">
          {{editForm.contact}}
        </el-form-item>
        <el-form-item label="反馈内容：" prop="content">
          {{editForm.content}}
        </el-form-item>
        <el-form-item label="反馈截图：" prop="imageUrls">
          <big-img v-if="showImg" @clickit="viewImg" :imgSrc="imgSrc"></big-img>
          <img v-for="item in editForm.imageUrls" :src="concatImageUrl(item)" alt="" class="feedbackPicture" @click="clickImg($event)">
          <!--<template slot-scope="scope">-->
          <!--<el-row>-->
          <!--<el-col>-->
          <!--<big-img v-if="showImg" @clickit="viewImg" :imgSrc="imgSrc"></big-img>-->
          <!--<img v-for="item in scope.editForm.imageUrls" :src="item" alt="" class="feedbackPicture" @click="clickImg($event)">-->
          <!--</el-col>-->
          <!--</el-row>-->
          <!--</template>-->
        </el-form-item>
        <el-form-item label="处理状态：" prop="dealStatus">
          {{editForm.dealStatus | dealStatus}}
        </el-form-item>
        <el-form-item label="处理时间：" prop="updateAt" v-if="activeName == 3">
          {{editForm.updateAt | timeDateChange}}
        </el-form-item>
        <el-form-item label="处理意见：" prop="refuseReason">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请填写处理意见"
            @input="textareaFunc"
            v-model.trim="editForm.refuseReason">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editSubmit" :loading="editLoading" :disabled="isSubmit">提交</el-button>
      </div>
    </el-dialog>
    <!--分页-->
    <div class="block" style="float:right;margin:10px 18px">
      <el-button type="primary" :disabled="!hasProPage" @click="nextPage('-1')">上一页</el-button>
      第{{currentPage}}页
      <el-button type="primary" :disabled="!hasNextPage" @click="nextPage('1')">下一页</el-button>
    </div>
  </div>
</template>
<script>
  import BigImg from '../components/BigImg.vue'
  export default {
    data () {
      return {
        activeName: '0',
//        列表
        users: [],
        listLoading: false,
//        编辑页面
        editForm: {},
        editFormVisible: false,
        editLoading: false,
        isSubmit: true,
        editListLoading: false,
//        放大图片
        showImg: false,
        imgSrc: '',
//        翻页
        currentPage: 1,
        hasNextPage: false,
        hasProPage: false,
        menuList: []    // 获取权限
      }
    },
    methods: {
      textareaFunc () {
        if (this.editForm.refuseReason.length === 0) {
          this.isSubmit = true
        } else {
          this.isSubmit = false
        }
      },
      handleClick (tab, event) {
//        console.log(tab, event)
      },
      changeOption () {
//        alert(this.activeName)  // 在getAllData方法中就用这个值区分未处理还是已处理
        this.currentPage = 1
        this.getAllData()
      },
      getAllData () {
        let _this = this
        _this.listLoading = true
        if (_this.editForm.refuseReason) {
          _this.isSubmit = false
        }
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
//      页面分页
      nextPage: function (val) {
        this.currentPage = Number(this.currentPage) + Number(val)
        if (this.currentPage <= 1) {
          this.hasProPage = false
          this.currentPage = 1
        }
        this.getAllData()
      },
//      拼接反馈图片的url
      concatImageUrl (item) {
//        return 'http://10.0.0.112/' + item
        return 'http://download.zq88.cn/' + item
      },
//      显示编辑界面
      handleEdit: function (index, row) {
        this.editListLoading = this.editFormVisible = true
        let _this = this
        let _id = row.id
        this.$http({
          method: 'GET',
          url: 'e/operate/suggestion/detail',
          params: {id: _id},
          headers: {'X-Requested-With': 'XMLHttpRequest'},
          body: {},
          emulateJSON: false
        }).then(function (result) {
          if (result.body.message.code === 0) {
            _this.editForm = result.body.data
            if (_this.editForm.imageUrls) {
              _this.editForm.imageUrls = _this.editForm.imageUrls.split(',')
            }
            if (_this.editForm.refuseReason) {
              _this.isSubmit = false
            } else {
              _this.isSubmit = true
            }
            _this.editListLoading = false
          }
        }).catch(() => {
        })
      },
//      编辑提交按钮
      editSubmit: function () {
        let _this = this
        this.$confirm('确认提交吗？', '提示', {}).then(() => {
          _this.editLoading = true
          this.$http({
            method: 'POST',
            url: 'e/operate/suggestion/review',
            params: {id: this.editForm.id, content: this.editForm.refuseReason},
            headers: {'X-Requested-With': 'XMLHttpRequest'},
//            body: {id: _this.editForm.id, content: _this.editForm.refuseReason},
            emulateJSON: false
          }).then(function (response) {
            if (response.body.message.code === 0) {
              setTimeout(function () {
                _this.$message({
                  message: '提交成功',
                  type: 'success'
                })
                _this.editLoading = false
                _this.editFormVisible = false
                _this.getAllData()
              }, 300)
            } else {
              _this.$message({
                message: '提交失败,请重新提交',
                type: 'error'
              })
              _this.editLoading = false
              _this.editFormVisible = false
            }
          }).catch(() => {
            _this.editLoading = false
            this.$message.error('信息有误，请重新确认信息后提交！')
          })
        })
      },
//      已阅
      handleRead: function (index, row) {
        let _id = row.id
        this.$http({
          method: 'POST',
          url: 'e/operate/suggestion/review',
          params: {id: _id},
          headers: {'X-Requested-With': 'XMLHttpRequest'},
          body: {},
          emulateJSON: false
        }).then(function (result) {
          if (result.body.message.code === 0) {
            this.$message.success('已阅')
            this.getAllData()
          }
        }).catch(() => {
        })
      },
//      放大图片部分
      clickImg: function (e) {
        this.showImg = true
        // 获取当前图片地址
        this.imgSrc = e.currentTarget.src
      },
      viewImg: function () {
        this.showImg = false
      }
    },
    filters: {
      contentLimit: function (json) {
        if (json) {
//                    return json.length > 100 ? '[有图]' + json.substring(0,100) + '...' : json
          return json.length > 40 ? json.substring(0, 40) + '...' : json
        }
      }
    },
    components: {
      'big-img': BigImg
    },
    watch: {
      'activeName': 'changeOption'
    },
    mounted: function () {
      this.menuList = localStorage.menuList
      this.getAllData()
    }
  }
</script>
<style scoped>
  .feedbackPicture {width:100px;height: 100px;margin-right: 15px}
</style>
