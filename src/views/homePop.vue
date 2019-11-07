<template>
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="弹窗管理" name="first">
      <!--<el-table-->
      <!--:data="tableData"-->
      <!--border-->
      <!--style="width: 100%">-->
      <!--<el-table-column-->
      <!--label="发布时间"-->
      <!--width="180">-->
      <!--<template slot-scope="scope">-->
      <!--<span style="margin-left: 10px">{{ scope.row.date }}</span>-->
      <!--</template>-->
      <!--</el-table-column>-->
      <!--<el-table-column-->
      <!--label="弹窗类型"-->
      <!--width="180">-->
      <!--<template slot-scope="scope">-->
      <!--<span style="margin-left: 10px">{{ scope.row.dataType }}</span>-->
      <!--</template>-->
      <!--</el-table-column>-->

      <!--<el-table-column-->
      <!--label="标题"-->
      <!--width="180">-->
      <!--<template slot-scope="scope">-->
      <!--<span style="margin-left: 10px">{{ scope.row.title }}</span>-->
      <!--</template>-->
      <!--</el-table-column>-->

      <!--<el-table-column-->
      <!--label="内容"-->
      <!--width="180">-->
      <!--<template slot-scope="scope">-->
      <!--<span style="margin-left: 10px">{{ scope.row.content }}</span>-->
      <!--</template>-->
      <!--</el-table-column>-->

      <!--<el-table-column-->
      <!--label="图片"-->
      <!--width="180">-->
      <!--<template slot-scope="scope">-->
      <!--<span style="margin-left: 10px">{{ scope.row.dataType }}</span>-->
      <!--</template>-->
      <!--</el-table-column>-->

      <!--<el-table-column-->
      <!--label="按钮"-->
      <!--width="120">-->
      <!--<template slot-scope="scope">-->
      <!--<span style="margin-left: 10px">{{ scope.row.btnCount }}</span>-->
      <!--</template>-->
      <!--</el-table-column>-->

      <!--<el-table-column-->
      <!--label="弹出频率"-->
      <!--width="180">-->
      <!--<template slot-scope="scope">-->
      <!--<span style="margin-left: 10px">{{ scope.row.btnCount }}</span>-->
      <!--</template>-->
      <!--</el-table-column>-->

      <!--<el-table-column-->
      <!--label="上线"-->
      <!--width="180">-->
      <!--<template slot-scope="scope">-->
      <!--<el-switch-->
      <!--v-model="value"-->
      <!--active-color="#13ce66"-->
      <!--inactive-color="#ff4949">-->
      <!--</el-switch>-->
      <!--</template>-->
      <!--</el-table-column>-->


      <!--<el-table-column label="操作"-->
      <!--width="200">-->
      <!--<template slot-scope="scope">-->
      <!--<el-button-->
      <!--size="mini"-->
      <!--@click="handleEdit(scope.$index, scope.row)">编辑-->
      <!--</el-button>-->
      <!--<el-button-->
      <!--size="mini"-->
      <!--type="danger"-->
      <!--@click="handleDelete(scope.$index, scope.row)">删除-->
      <!--</el-button>-->
      <!--</template>-->
      <!--</el-table-column>-->
      <!--</el-table>-->
      <!--&lt;!&ndash;分页&ndash;&gt;-->
      <!--<div class="block" style="float:right;margin:10px 18px">-->
      <!--<el-button type="primary" :disabled="!hasProPage" @click="nextPage('-1')">上一页</el-button>-->
      <!--第{{currentPage}}页-->
      <!--<el-button type="primary" :disabled="!hasNextPage" @click="nextPage('1')">下一页</el-button>-->
      <!--</div>-->
    </el-tab-pane>


    <el-tab-pane label="发布音频" name="second">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
        <el-form-item label="弹窗类型：" prop="region">
          <el-select v-model="ruleForm.popType" placeholder="请选择弹窗类型" @change="popTypeChanged">
            <el-option label="版本升级提示" value="8"></el-option>
            <el-option label="强制升级提示" value="7"></el-option>
            <el-option label="文字通知弹窗" value="5"></el-option>
            <el-option label="图片通知弹窗" value="4"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="上传图片：" prop="name" v-if="elItem.uploadImageView">

          <el-upload
            class="upload-demo"
            action="/jbg/gemantic/com/music.do"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-success="handleSuccess"
            :file-list="fileList">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>


        <el-form-item label="弹窗标题：" prop="title" v-if="elItem.title">
          <el-col :span="6">
            <el-input v-model="ruleForm.title" placeholder="请输入弹窗标题"></el-input>
          </el-col>
        </el-form-item>

        <el-form-item label="版本号：" prop="version" v-if="elItem.version">
          <el-col :span="6">
            <el-input v-model="ruleForm.version" placeholder="请输入版本号"></el-input>
          </el-col>
        </el-form-item>

        <el-form-item label="图片链接：" prop="urlImage" v-if="elItem.imageUrl">
          <el-col :span="6">
            <el-input v-model="ruleForm.urlImage" placeholder="请输入图片链接"></el-input>
          </el-col>
        </el-form-item>

        <el-form-item label="弹窗内容：" prop="content" v-if="elItem.contentPop">
          <el-input type="textarea" v-model="ruleForm.content" placeholder="请输入弹窗内容"></el-input>
        </el-form-item>

        <el-row v-if="elItem.firstBtn">
          <el-col :span="6">
            <el-form-item label="按钮1文字：" prop="textFirstBtn">
              <el-input v-model="ruleForm.textFirstBtn" placeholder="请输入按钮文字"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="colorFirstBtn">
              <el-select v-model="ruleForm.colorFirstBtn" placeholder="请选择按钮颜色">
                <el-option label="蓝色" value="0"></el-option>
                <el-option label="灰色" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="urlFirstBtn">
              <el-input v-model="ruleForm.urlFirstBtn" placeholder="请输入按钮指令/链接"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row v-if="elItem.secondBtn">
          <el-col :span="6">
            <el-form-item label="按钮2文字：">
              <el-input v-model="ruleForm.textSecondBtn" placeholder="请输入按钮文字"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-select v-model="ruleForm.colorSecondBtn" placeholder="请选择按钮颜色">
                <el-option label="蓝色" value="0"></el-option>
                <el-option label="灰色" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-input v-model="ruleForm.urlSecondBtn" placeholder="请输入按钮指令/链接"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="立即升级按钮：" prop="upgradeBtn" v-if="elItem.upgradeBtn">
          <el-col :span="6">
            <el-input v-model="ruleForm.upgradeBtn" placeholder="请输入按钮文字"></el-input>
          </el-col>
        </el-form-item>

        <el-form-item label="暂不升级按钮：" prop="notUpgradeBtn" v-if="elItem.notUpgradeBtn">
          <el-col :span="6">
            <el-input v-model="ruleForm.notUpgradeBtn" placeholder="请输入按钮文字"></el-input>
          </el-col>
        </el-form-item>

        <el-form-item label="是否上线：" prop="delivery">
          <el-switch v-model="ruleForm.delivery"></el-switch>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
        </el-form-item>
      </el-form>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
  import {getDownloadHost, getH5PageHost} from '../lib/hostUtil.js'

  export default {
    name: 'homePop',
    data() {
      return {
        activeName: 'first',
        value: true,
        fileList: [], // 上传音频列表
        tableData: [{
          date: '2016-05-02',
          dataType: '版本升级提示',
          content: '版本升级提示',
          btnCount: '1个',
          title: '创业板上市风险提示'
        }, {
          date: '2016-05-04',
          dataType: '强制升级提示',
          content: '强制升级提示',
          btnCount: '1个',
          title: '创业板上市风险提示'
        }, {
          date: '2016-05-01',
          dataType: '文字通知弹窗',
          content: '文字通知弹窗',
          btnCount: '1个',
          title: '创业板上市风险提示'
        }, {
          date: '2016-05-03',
          dataType: '图片通知弹窗',
          content: '图片通知弹窗',
          btnCount: '1个',
          title: '创业板上市风险提示'
        }],
        ruleForm: {
          title: '',//标题
          popType: "",//弹窗类型
          version: '',//版本号
          content: '',//弹窗内容
          textFirstBtn: '',//按钮1文字
          colorFirstBtn: '',//按钮1色值
          urlFirstBtn: '',//按钮1链接
          textSecondBtn: '',//按钮2文字
          colorSecondBtn: '',//按钮2色值
          urlSecondBtn: '',//按钮2链接
          textBtn: '',
          upgradeBtn: '',//按钮2链接
          notUpgradeBtn: '',//按钮2链接
          imageWebUrl: '',//图片下载链接
          urlImage: '',//图片跳转链接
          delivery: true//是否上线
        },
        rules: {
          title: [
            {required: true, message: '请输入标题名称', trigger: 'blur'},
          ],
          version: [
            {required: true, message: '请输入版本号', trigger: 'blur'}
          ],
          content: [
            {required: true, message: '请输入弹窗内容', trigger: 'blur'}
          ],
          textFirstBtn: [
            {required: true, message: '请输入按钮文字', trigger: 'blur'}
          ],
          colorFirstBtn: [
            {required: true, message: '请输入按钮文字', trigger: 'blur'}
          ],
          urlFirstBtn: [
            {required: true, message: '请输入按钮文字', trigger: 'blur'}
          ],
          upgradeBtn: [
            {required: true, message: '请输入按钮文字', trigger: 'blur'}
          ],
          notUpgradeBtn: [
            {required: true, message: '请输入按钮文字', trigger: 'blur'}
          ],
          colorBtn: [
            {required: true, message: '请输入按钮颜色', trigger: 'blur'}
          ],
          urlBtn: [
            {required: true, message: '请输入按钮指令/链接', trigger: 'blur'}
          ],
          urlImage: [
            {required: true, message: '请输入图片链接', trigger: 'blur'}
          ]
        },
        elItem: {
          imageUrl: false,
          title: false,
          contentPop: false,
          version: false,
          firstBtn: false,
          secondBtn: false,
          upgradeBtn: false,
          notUpgradeBtn: false,
          uploadImageView: false
        }
      }
    },
    methods: {
      handleClick(tab, event) {
//        console.log(tab, event)
        if (tab.name === 'first') {
          this.reset();
          this.fileList = [];
        }
      },
      handleEdit(index, row) {
        console.log(index, row)
      },
      handleDelete(index, row) {
        console.log(index, row)
      },
      onSubmit() {
        console.log('submit!')
      },
      submitForm() {
        let body = {
          popupType: parseInt(this.ruleForm.popType),
          publishStatus: this.ruleForm.delivery ? 1 : 0,
        };

        switch (this.ruleForm.popType) {
          case "8":
            body.buttonOneLabel = this.ruleForm.upgradeBtn;
            body.buttonTwoLabel = this.ruleForm.notUpgradeBtn;
            body.content = this.ruleForm.content;
            body.title = this.ruleForm.content;
            body.appVersion = this.ruleForm.content;
            break;
          case "7":
            body.buttonOneLabel = this.ruleForm.upgradeBtn;
            body.content = this.ruleForm.content;
            body.title = this.ruleForm.content;
            body.appVersion = this.ruleForm.content;
            break;
          case "5":
            body.buttonOneLabel = this.ruleForm.textFirstBtn;
            body.buttonOneColor = this.ruleForm.colorFirstBtn;
            body.buttonOneCommand = this.ruleForm.urlFirstBtn;
            body.buttonTwoLabel = this.ruleForm.textSecondBtn;
            body.buttonTwoColor = this.ruleForm.colorSecondBtn;
            body.buttonTwoCommand = this.ruleForm.urlSecondBtn;
            body.content = this.ruleForm.content;
            body.title = this.ruleForm.content;
            break;
          case "4":
            body.picAdUrl = this.ruleForm.urlImage;
            body.picUrl = this.ruleForm.imageWebUrl;
            break;
        }

        this.$http({
          method: 'POST',
          url: '/e/operate/popup',
          body: body,
          headers: {'X-Requested-With': 'XMLHttpRequest'},
          emulateJSON: false
        }).then(function (result) {
          console.log(result.data);
          if (result.data.message.code === 0) {
            this.reset();
            // this.getAudioList()
            this.fileList = [];
            this.success('提交成功')
          } else {
            this.warning('提交失败')
          }
        }).catch(() => {
          this.warning('提交失败')
        })
      },

      popTypeChanged(value) {
        this.reset();
        this.ruleForm.popType = value;
        switch (value) {
          case "8":
            this.elItem.title = true;
            this.elItem.version = true;
            this.elItem.contentPop = true;
            this.elItem.upgradeBtn = true;
            this.elItem.notUpgradeBtn = true;
            break;
          case "7":
            this.elItem.title = true;
            this.elItem.version = true;
            this.elItem.contentPop = true;
            this.elItem.upgradeBtn = true;
            break;
          case "5":
            this.elItem.title = true;
            this.elItem.contentPop = true;
            this.elItem.firstBtn = true;
            this.elItem.secondBtn = true;
            break;
          case "4":
            this.elItem.imageUrl = true;
            this.elItem.uploadImageView = true;
            break
        }


      },
      reset() {
        this.elItem.title = false;
        this.elItem.version = false;
        this.elItem.contentPop = false;
        this.elItem.upgradeBtn = false;
        this.elItem.notUpgradeBtn = false;
        this.elItem.imageUrl = false;
        this.elItem.firstBtn = false;
        this.elItem.secondBtn = false;
        this.elItem.uploadImageView = false;

        this.ruleForm.title = '';
        this.ruleForm.popType = '';
        this.ruleForm.version = '';
        this.ruleForm.content = '';
        this.ruleForm.textFirstBtn = '';
        this.ruleForm.colorFirstBtn = '';
        this.ruleForm.urlFirstBtn = '';
        this.ruleForm.textSecondBtn = '';
        this.ruleForm.colorSecondBtn = '';
        this.ruleForm.urlSecondBtn = "";
        this.ruleForm.urlSecondBtn = "";
        this.ruleForm.upgradeBtn = "";
        this.ruleForm.notUpgradeBtn = "";
        this.ruleForm.imageWebUrl = "";
        this.ruleForm.urlImage = "";
        this.ruleForm.delivery = true;
        this.fileList = [];
      },
      handleRemove(file, fileList) {
        console.log(file, fileList)
      },
      handlePreview(file) {
        console.log('http://download.zq88.cn/' + file.response.path)
        this.ruleForm.imageWebUrl = getDownloadHost() + '/' + file.response.path
      },
      handleSuccess(response, file, fileList) {
        console.log('http://download.zq88.cn/' + file.response.path)
        this.ruleForm.imageWebUrl = getDownloadHost() + '/' + response.path
      },
      // 上传音频限制
      beforeAvatarUpload(file) {
//        console.log(file)
        let isJPG
        if (navigator.userAgent.indexOf('Firefox') > -1) {
          isJPG = /\.(mp3)$/.test(file.name)
//          console.log(isJPG)
        } else {
          isJPG = file.type === 'audio/mp3'
        }
        const isLt50M = file.size / 1024 / 1024 < 50
        if (!isJPG) {
          this.$message.error('上传音频只能是 mp3 格式!')
        }
        if (!isLt50M) {
          this.$message.error('上传音频大小不能超过 50MB!')
        }
        return isJPG && isLt50M
      },
      success(msg) {
        this.$message({
          showClose: true,
          message: msg,
          type: 'success'
        })
      },
      warning(msg) {
        this.$message({
          showClose: true,
          message: msg,
          type: 'warning'
        })
      },
    }
  }
</script>

<style scoped>

</style>
