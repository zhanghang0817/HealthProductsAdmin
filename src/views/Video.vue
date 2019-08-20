<template>
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="视频管理" name="first">
      <videoTable :table-data1="tableData" @removeVideoFun="removeTabVideo" @editVideoFun="editVideoData"></videoTable>
      <!--分页-->
      <div class="block" style="float:right;margin:10px 18px">
        <el-button type="primary" :disabled="!hasProPage" @click="nextPage('-1')">上一页</el-button>
        第{{currentPage}}页
        <el-button type="primary" :disabled="!hasNextPage" @click="nextPage('1')">下一页</el-button>
      </div>
    </el-tab-pane>
    <el-tab-pane label="发布视频" name="second" v-if="menuList.indexOf('video:add') == -1?false:true">

      <el-form :model="ruleForm2" :rules="rules" ref="ruleForm2" label-width="100px" class="demo-ruleForm">
        <el-form-item label="标题*" prop="title">
          <el-input type="input" v-model="ruleForm2.title" auto-complete="off" class="iptWidth50" :maxlength="40"
                    placeholder="请添加视频标题"></el-input>
        </el-form-item>
        <el-form-item label="来源" prop="source">
          <el-input type="input" v-model="ruleForm2.source" auto-complete="off" class="iptWidth50" :maxlength="10"
                    placeholder="示例：华创e智通"></el-input>
        </el-form-item>
        <el-form-item label="栏目*" prop="column">
          <el-select v-model="ruleForm2.column" placeholder="请选择栏目">
            <el-option v-for="(item,index) in ruleForm2.columnList" :key="index" :label="item.name" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="推送标题*" prop="pushTitle">
          <el-input type="input" v-model="ruleForm2.pushTitle" auto-complete="off" class="iptWidth50" :maxlength="15"
                    placeholder="请添加推送标题"></el-input>
        </el-form-item>
        <el-form-item label="视频*" prop="vidio">
          <el-input type="input" v-model="ruleForm2.vidio" class="iptWidth50" placeholder="请输入视频地址"></el-input>
        </el-form-item>
        <!--<el-form-item label="视频图片*" prop="vidioPic">-->
          <!--<el-input type="input" v-model="ruleForm2.vidioPic" class="iptWidth50" placeholder="请输入视频图片地址"></el-input>-->
          <!--<el-upload-->
            <!--class="upload-demo uploadAudioBut clearfix"-->
            <!--action="/jbg/gemantic/com/music.do"-->
            <!--:on-preview="handlePreview"-->
            <!--:on-remove="handleRemove"-->
            <!--:before-upload="beforeAvatarUpload"-->
            <!--:file-list="fileList">-->
            <!--<el-button type="primary">点击上传</el-button>-->
            <!--<div slot="tip" class="el-upload__tip uploadAudioFont fl">请上传 jpg/png 格式图片</div>-->
          <!--</el-upload>-->
        <!--</el-form-item>-->
        <el-form-item label="文章" class="editorHei500">
          <quill-editor ref="myTextEditor" v-model="ruleForm2.content" :config="editorOption"
                        class="editorHei400"></quill-editor>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="subAddLoading" @click="submitForm('ruleForm2')">提交</el-button>
        </el-form-item>
      </el-form>

    </el-tab-pane>
  </el-tabs>
</template>
<script>
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'
  import {quillEditor} from 'vue-quill-editor'
  import videoTable from '../components/table.vue'
  import { getH5PageHost } from '../lib/hostUtil.js'
  export default {
    data () {
      var vidioSource = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('音频不能为空'))
        } else {
          callback()
        }
      }
//      var vidioPicSource = (rule, value, callback) => {
//        if (!value) {
//          return callback(new Error('视频图片不能为空'))
//        } else {
//          callback()
//        }
//      }
      var validateTitle = (rule, value, callback) => {
        console.log(value)
        if (value === '') {
          callback(new Error('请输入标题'))
        } else if (value.length > 40) {
          callback(new Error('标题不能大于40个字符'))
        } else {
          callback()
        }
      }
      var validatePushTitle = (rule, value, callback) => {
//        console.log(value)
        if (value === '') {
          callback(new Error('请输入推送标题'))
        } else if (value.length > 15) {
          callback(new Error('标题不能大于15个字符'))
        } else {
          callback()
        }
      }
      var validateColumn = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请选择栏目'))
        } else {
          callback()
        }
      }
      var validateSource = (rule, value, callback) => {
        this.ruleForm2.source = value.replace(/\s+/g, '')
        if (value.length > 10) {
          callback(new Error('来源不能大于10个字符'))
        } else {
          callback()
        }
      }
      return {
        activeName: 'first',
        subAddLoading: false, // 按钮loading
        ruleForm2: {
          title: '',
          source: '',
          vidio: '',
//          vidioPic: '',
          column: '',
          columnList: '',
          content: '',
          pushTitle:''
        },
        rules: {
          title: [
            {validator: validateTitle, trigger: 'blur'}
          ],
          column: [
            {validator: validateColumn, trigger: 'blur'}
          ],
          vidio: [
            {validator: vidioSource, trigger: 'blur'}
          ],
//          vidioPic: [
//            {validator: vidioPicSource, trigger: 'blur'}
//          ],
          source: [
            {validator: validateSource, trigger: 'blur'}
          ],
          pushTitle:[
            {validator: validatePushTitle, trigger: 'blur'}
          ]
        },
        editorOption: {
          // something config
        },
        newsUrl: getH5PageHost() + '/yzt/djgd_hearNewsDetail.html?id=', // 新闻跳转的url
        tablePs: '20',
        currentPage: '1', // 页码
        hasNextPage: false,
        hasProPage: false,
        tableData: [], // 表格音频列表
        editId: '', // 被修改音频的id
        fileList: [], // 上传音频列表
        menuList: []  // 权限
      }
    },
    components: {
      'quillEditor': quillEditor,
      'videoTable': videoTable
    },
    mounted () {
      this.menuList = localStorage.menuList
      this.getColoumes()
      this.getVideoList()
    },
    methods: {
      // tab切换时触发
      handleClick (tab, event) {
//        console.log(tab, event)
        if (tab.name === 'first') {
          this.ruleForm2.content = ''
          this.ruleForm2.source = ''
          this.resetForm('ruleForm2')
          this.editId = ''
          this.fileList = []
        }
      },
      // 获取简介
      getColoumes () {
        this.$http({
          method: 'GET',
          url: '/e/u/opinion/video/coloums/search',
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
      // 上传是视频限制
      beforeAvatarUpload (file) {
        console.log(file)
        let isPIC
//        if (navigator.userAgent.indexOf('Firefox') > -1) {
//          isJPG = /\.(mp3)$/.test(file.name)
//          console.log(isJPG)
//        } else {
//          isJPG = file.type === 'audio/mp3'
//        }
        isPIC = file.type === 'image/jpeg' || file.type === 'image/png'
        const isLt10M = file.size / 1024 / 1024 < 10
        if (!isPIC) {
          this.$message.error('上传图片只能是 jpg/png 格式!')
        }
        if (!isLt10M) {
          this.$message.error('上传图片大小不能超过 10MB!')
        }
        return isPIC && isLt10M
      },
      // 提交研播新闻
      submitVideoNews () {
        this.subAddLoading = true
        this.$http({
          method: 'POST',
          url: '/e/u/opinion/video',
          body: {
            title: this.ruleForm2.title.trim(),
            source: this.ruleForm2.source.trim(),
            columnCode: this.ruleForm2.column,
            videoUrl: this.ruleForm2.vidio,
            articleContent: this.ruleForm2.content,
            pushHeadline: this.ruleForm2.pushTitle
          },
          headers: {'X-Requested-With': 'XMLHttpRequest'},
          emulateJSON: false
        }).then(function (result) {
          console.log(result.data)
          if (result.data.message.code === 0) {
            this.ruleForm2.content = ''
            this.ruleForm2.source = ''
            this.resetForm('ruleForm2')
            this.getVideoList()
            this.fileList = []
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
      // 删除音频
      removeVideo (id) {
        this.$http({
          method: 'DELETE',
          url: '/e/u/opinion/video/' + id,
          headers: {'X-Requested-With': 'XMLHttpRequest'},
          emulateJSON: false
        }).then(function (result) {
          console.log(result.data)
          if (result.data.message.code === 0) {
            this.getVideoList()
            this.success('删除成功')
          }
        }).catch(() => {
          this.$message.error('请重新登录')
          this.$router.push('/')
        })
      },
      // 删除音频弹窗
      removeTabVideo (id) {
        console.log(id)
        this.$confirm('确认删除该记录吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.removeVideo(id)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      // 新建音频
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.editId === '') {
              this.submitVideoNews()
            } else {
              this.submitEditVideo()
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
      // 获取音频列表
      getVideoList () {
        this.$http({
          method: 'GET',
          url: '/e/u/opinion/video/search',
          params: {cp: this.currentPage, ps: this.tablePs},
          headers: {'X-Requested-With': 'XMLHttpRequest'},
          emulateJSON: true
        }).then(function (result) {
          console.log(result.data.data.videoList)
          this.tableData = result.data.data.videoList
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
      // 上下页
      nextPage: function (val) {
        this.currentPage = Number(this.currentPage) + Number(val)
        if (this.currentPage <= 1) {
          this.hasProPage = false
          this.currentPage = 1
        }
        this.getVideoList()
      },
      // 编辑回显数据
      editVideoData: function (id) {
        console.log(id)
        this.editId = id
        this.$http({
          method: 'GET',
          url: '/e/u/opinion/video/' + id,
          headers: {'X-Requested-With': 'XMLHttpRequest'},
          emulateJSON: false
        }).then(function (result) {
//          console.log(result.data.data)
//          console.log(result.data.data.articleContent)
          this.ruleForm2.content = result.data.data.articleContent
          this.ruleForm2.source = result.data.data.source
          this.ruleForm2.title = result.data.data.title
          this.ruleForm2.column = result.data.data.columnCode
          this.ruleForm2.vidio = result.data.data.videoUrl
          this.ruleForm2.pushTitle = result.data.data.pushHeadline
          this.activeName = 'second'
        }).catch(() => {
          this.$message.error('请重新登录')
          this.$router.push('/')
        })
      },
      // 提交编辑数据
      submitEditVideo: function () {
        this.subAddLoading = true
        this.$http({
          method: 'PUT',
          url: '/e/u/opinion/video/' + this.editId,
          body: {
            title: this.ruleForm2.title,
            source: this.ruleForm2.source,
            columnCode: this.ruleForm2.column,
            videoUrl: this.ruleForm2.vidio,
            articleContent: this.ruleForm2.content,
            pushHeadline: this.ruleForm2.pushTitle
          },
          headers: {'X-Requested-With': 'XMLHttpRequest'},
          emulateJSON: false
        }).then(function (result) {
          console.log(result.data)
          if (result.data.message.code === 0) {
            this.ruleForm2.content = ''
            this.ruleForm2.source = ''
            this.resetForm('ruleForm2')
            this.getVideoList()
            this.editId = ''
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
      },
      handleRemove (file, fileList) {
        console.log(file, fileList)
      }
//      handlePreview (file) {
//        this.ruleForm2.vidioPic = 'http://download.zq88.cn/' + file.response.path
//      }
    }
  }
</script>
<style>
  .iptWidth50 {
    width: 50% !important;
  }

  .editorHei500 {
    height: 500px;
  }

  .editorHei400 {
    height: 400px;
  }

  .fl, .el-upload--text {
    float: left;
  }

  .uploadAudioBut {
    padding-top: 10px;
  }

  .uploadAudioFont {
    margin: 0 0 0 10px;
  }

  .el-upload-list {
    margin: 45px 0 5px 0 !important;
  }

  .clearfix:after {
    content: ".";
    height: 0;
    clear: both;
    display: block;
    overflow: hidden;
  }

  .clearfix {
    zoom: 1;
  }
</style>
