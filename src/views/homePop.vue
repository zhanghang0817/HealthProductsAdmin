<template>
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="弹窗管理" name="first">
      <el-table
        :data="tableData"
        border
      >

        <el-table-column
          label="发布时间"
          width="150" align="center">
          <template slot-scope="scope">
            <!--<span style="margin-left: 10px">{{ scope.row.createAt}}</span>-->
            {{scope.row.createAt | timeDateChange}}
          </template>
        </el-table-column>
        <el-table-column
          label="弹窗类型"
          width="150" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.popupType == 8">版本升级提示</span>
            <span v-if="scope.row.popupType == 7">强制版本升级提示</span>
            <span v-if="scope.row.popupType == 5">文字弹窗提示</span>
            <span v-if="scope.row.popupType == 4">图片弹窗提示</span>
          </template>
        </el-table-column>

        <el-table-column
          label="标题"
          width="180" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.title }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="内容"
          width="" align="center">
          <template slot-scope="scope">
            <span style="overflow: hidden;-webkit-line-clamp: 2;text-overflow: ellipsis;display: -webkit-box;-webkit-box-orient: vertical;">{{ scope.row.content}}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="图片"
          width="100" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.picUrl!= undefined" style="overflow: hidden;-webkit-line-clamp: 3;text-overflow: ellipsis;display: -webkit-box;-webkit-box-orient: vertical;"><a :href="scope.row.picUrl" target="_blank"
                                                         rel="noopener noreferrer">{{scope.row.picUrl}}</a></span>
            <span v-else>--</span>
          </template>
        </el-table-column>

        <el-table-column
          label="按钮"
          width="100" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.buttonOneLabel!= undefined && scope.row.buttonTwoLabel!= undefined && scope.row.buttonOneLabel!= '' && scope.row.buttonTwoLabel!= '' ">2个</span>
            <span v-else-if="scope.row.buttonOneLabel!= undefined || scope.row.buttonTwoLabel!= undefined">1个</span>
            <span v-else>--</span>
          </template>
        </el-table-column>

        <!--<el-table-column-->
        <!--label="弹出频率"-->
        <!--width="180">-->
        <!--<template slot-scope="scope">-->
        <!--<span style="margin-left: 10px">{{ scope.row.btnCount }}</span>-->
        <!--</template>-->
        <!--</el-table-column>-->

        <el-table-column
          label="上线"
          width="100" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.publishStatus==1?true:false"
              value="1"
              active-color="#13ce66"
              inactive-color="#ff4949"

              @change="changeStatus($event,scope.row,scope.$index)"
            >
            </el-switch>
          </template>
        </el-table-column>


        <el-table-column label="操作"
                         width="150" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEdit(scope.$index, scope.row)">编辑
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>

        <!--<el-table-column-->
        <!--label="发布时间"-->
        <!--width="150" align="center">-->
        <!--<template slot-scope="scope">-->
        <!--{{scope.row.createAt | timeDateChange}}-->
        <!--</template>-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
        <!--label="弹窗类型"-->
        <!--width="150" align="center">-->
        <!--<template slot-scope="scope">-->
        <!--<span v-if="scope.row.popupType == 8">版本升级提示</span>-->
        <!--<span v-if="scope.row.popupType == 7">强制版本升级提示</span>-->
        <!--<span v-if="scope.row.popupType == 5">文字弹窗提示</span>-->
        <!--<span v-if="scope.row.popupType == 4">图片弹窗提示</span>-->
        <!--</template>-->
        <!--</el-table-column>-->

        <!--<el-table-column-->
        <!--label="标题"-->
        <!--width="180" align="center">-->
        <!--<template slot-scope="scope">-->
        <!--<span>{{ scope.row.title }}</span>-->
        <!--</template>-->
        <!--</el-table-column>-->

        <!--<el-table-column-->
        <!--label="内容"-->
        <!--width="" align="center">-->
        <!--<template slot-scope="scope">-->
        <!--<span>{{ scope.row.content }}</span>-->
        <!--</template>-->
        <!--</el-table-column>-->

        <!--<el-table-column-->
        <!--label="图片"-->
        <!--width="100" align="center">-->
        <!--<template slot-scope="scope">-->
        <!--<span>{{ scope.row.dataType }}</span>-->
        <!--</template>-->
        <!--</el-table-column>-->

        <!--<el-table-column-->
        <!--label="按钮"-->
        <!--width="100" align="center">-->
        <!--<template slot-scope="scope">-->
        <!--<span-->
        <!--v-if="scope.row.buttonOneLabel != undefined && scope.row.buttonTwoLabel.length != undefined ">2个</span>-->
        <!--<span v-else-if="scope.row.buttonOneLabel!= undefined || scope.row.buttonTwoLabel!= undefined">1个</span>-->
        <!--<span v-else>&#45;&#45;</span>-->
        <!--</template>-->
        <!--</el-table-column>-->

        <!--&lt;!&ndash;<el-table-column&ndash;&gt;-->
        <!--&lt;!&ndash;label="弹出频率"&ndash;&gt;-->
        <!--&lt;!&ndash;width="180">&ndash;&gt;-->
        <!--&lt;!&ndash;<template slot-scope="scope">&ndash;&gt;-->
        <!--&lt;!&ndash;<span style="margin-left: 10px">{{ scope.row.btnCount }}</span>&ndash;&gt;-->
        <!--&lt;!&ndash;</template>&ndash;&gt;-->
        <!--&lt;!&ndash;</el-table-column>&ndash;&gt;-->

        <!--<el-table-column-->
        <!--label="上线"-->
        <!--width="100" align="center">-->
        <!--<template slot-scope="scope">-->
        <!--<el-switch-->
        <!--v-model="scope.row.publishStatus==1?true:false"-->
        <!--value="1"-->
        <!--active-color="#13ce66"-->
        <!--inactive-color="#ff4949"-->
        <!--@change="changeStatus($event,scope.row,scope.$index)"-->
        <!--&gt;-->
        <!--</el-switch>-->
        <!--</template>-->
        <!--</el-table-column>-->


        <!--<el-table-column label="操作"-->
        <!--width="150" align="center">-->
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

      </el-table>
      <div class="block" style="float:right;margin:10px 18px">
      <el-button type="primary" :disabled="!hasProPage" @click="nextPage('-1')">上一页</el-button>
      第{{currentPage}}页
      <el-button type="primary" :disabled="!hasNextPage" @click="nextPage('1')">下一页</el-button>
      </div>
    </el-tab-pane>

    <el-tab-pane label="发布弹窗" name="second">
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
            :before-upload="beforeAvatarUpload"
            :file-list="fileList">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2MB</div>
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

        <el-form-item label="上传图片链接：" v-if="ruleForm.imageWebUrl!= undefined && ruleForm.imageWebUrl!= ''">
         <span>
           <a :href="ruleForm.imageWebUrl" target="_blank" rel="noopener noreferrer">{{ruleForm.imageWebUrl}}</a>
         </span>
        </el-form-item>

        <el-form-item label="图片链接：" prop="urlImage" v-if="elItem.imageUrl">
          <el-col :span="12">
            <el-input v-model="ruleForm.urlImage" placeholder="请输入图片链接"></el-input>
            <div style="font-size: 8px">跳转H5实例：{"pageId":"webView","url":"http://www.hczq.com/","title":"华创证劵"}</div>
          </el-col>
        </el-form-item>

        <el-form-item label="弹窗内容：" prop="content" v-if="elItem.contentPop">
          <el-input :rows="5" type="textarea" v-model="ruleForm.content" placeholder="请输入弹窗内容"></el-input>
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
          <el-col :span="12">
            <el-form-item prop="urlFirstBtn">
              <el-input v-model="ruleForm.urlFirstBtn" placeholder="请输入按钮指令/链接"></el-input>
              <div style="font-size: 8px">跳转H5实例：{"pageId":"webView","url":"http://www.hczq.com/","title":"华创证劵"}</div>
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
          <el-col :span="12">
            <el-form-item>
              <el-input v-model="ruleForm.urlSecondBtn" placeholder="请输入按钮指令/链接"></el-input>
              <div style="font-size: 8px">跳转H5实例：{"pageId":"webView","url":"http://www.hczq.com/","title":"华创证劵"}</div>
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
        currentPage:1,
        hasNextPage: false,
        hasProPage: false,
        isEditForm: false,
        activeName: 'first',
        value: true,
        fileList: [], // 上传音频列表
        tableData: [],
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
            {required: true, message: '请输入按钮颜色', trigger: 'blur'}
          ],
          urlFirstBtn: [
            {required: true, message: '请输入按钮指令/链接', trigger: 'blur'}
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

    mounted: function () {
      this.requestDataList()
    },
    methods: {

      changeStatus(e, row, index) {

        var body = {};
        row.publishStatus = e==true?1:0;
        Object.keys(row).forEach(function(key){

          if (row[key] != undefined || row[key] != null){
            console.log(key,row[key]);
            body[key] = row[key];
          }
        });

        this.operationRequest('PUT', body);

      },
      handleClick(tab, event) {
        if (tab.name === 'first') {
          this.reset();
          this.fileList = [];
        }
      },
      nextPage: function (val) {
        this.currentPage = Number(this.currentPage) + Number(val)
        if (this.currentPage <= 1) {
          this.hasProPage = false
          this.currentPage = 1
        }
        this.requestDataList()
      },
      //请求数据列表
      requestDataList() {

        this.$http({
          method: 'GET',
          url: '/e/operate/popup'+'?cp='+this.currentPage +'&ps='+8,
          body: '',
          headers: {'X-Requested-With': 'XMLHttpRequest'},
          emulateJSON: false
        }).then(function (result) {

          if (result.data.message.code === 0) {

            this.tableData = result.data.data.popups;
            this.currentPage = result.data.data.currentPage;
            this.hasNextPage = result.data.data.hasNextPage
            if (result.data.data.currentPage === 1 || !result.data.data.currentPage) {
              this.hasProPage = false
              this.currentPage = 1
            } else {
              this.hasProPage = true
            }

          } else {
            this.warning('请求数据失败！')
          }
        }).catch(() => {
        })

      },
      handleEdit(index, row) {

        this.isEditForm = true;
        this.activeName = "second";
        this.ruleForm.popType = row.popupType.toString()
        this.ruleForm.id = row.id


        this.ruleForm.delivery = row.publishStatus == 1?true:false;

        this.switchWithType(this.ruleForm.popType);
        debugger
        switch (this.ruleForm.popType) {
          case "8":
            this.ruleForm.upgradeBtn = row.buttonOneLabel;
            this.ruleForm.notUpgradeBtn = row.buttonTwoLabel;
            this.ruleForm.content = row.content;
            this.ruleForm.title = row.title;
            this.ruleForm.version = row.appVersion;
            break;
          case "7":
            this.ruleForm.upgradeBtn = row.buttonOneLabel;
            this.ruleForm.content = row.content;
            this.ruleForm.title = row.title;
            this.ruleForm.version = row.appVersion;
            break;
          case "5":
            this.ruleForm.textFirstBtn = row.buttonOneLabel;
            this.ruleForm.colorFirstBtn = row.buttonOneColor;
            this.ruleForm.urlFirstBtn = row.buttonOneCommand;
            this.ruleForm.textSecondBtn = row.buttonTwoLabel;
            this.ruleForm.colorSecondBtn = row.buttonTwoColor;
            this.ruleForm.urlSecondBtn = row.buttonTwoCommand;
            this.ruleForm.content = row.content;
            this.ruleForm.title = row.title;
            break;
          case "4":
            this.ruleForm.urlImage = row.picAdUrl;
            this.ruleForm.imageWebUrl = row.picUrl;
            break;
        }

        setTimeout(() => {
          this.isEditForm = false;
        }, 0.5);

      },
      handleDelete(index, row) {

        this.operationRequest('DELETE', '', '/e/operate/popup/' + row.id);
      },
      onSubmit() {
        console.log('submit!')
      },
      submitForm() {
        let body = {
          popupType: parseInt(this.ruleForm.popType),
          publishStatus: this.ruleForm.delivery ? '1' : '0',
          id: this.ruleForm.id
        };

        switch (this.ruleForm.popType) {
          case "8":
            body.buttonOneLabel = this.ruleForm.upgradeBtn;
            body.buttonTwoLabel = this.ruleForm.notUpgradeBtn;
            body.content = this.ruleForm.content;
            body.title = this.ruleForm.title;
            body.appVersion = this.ruleForm.version;
            break;
          case "7":
            body.buttonOneLabel = this.ruleForm.upgradeBtn;
            body.content = this.ruleForm.content;
            body.title = this.ruleForm.title;
            body.appVersion = this.ruleForm.version;
            break;
          case "5":
            body.buttonOneLabel = this.ruleForm.textFirstBtn;
            body.buttonOneColor = this.ruleForm.colorFirstBtn;
            body.buttonOneCommand = this.ruleForm.urlFirstBtn;
            body.content = this.ruleForm.content;
            body.title = this.ruleForm.title;
            break;
          case "4":
            body.picAdUrl = this.ruleForm.urlImage;
            body.picUrl = this.ruleForm.imageWebUrl;
            break;
        }

        //id没有值是创建，有值是编辑
        if (body.id == '' || body.id == undefined) {

           delete body.id;

          if (!this.paramsValidate(body)) {
            this.warning('请填写全部必须参数!');
            return;
          }
          if (this.ruleForm.popType == "5") {
            body.buttonTwoLabel = this.ruleForm.textSecondBtn;
            body.buttonTwoColor = this.ruleForm.colorSecondBtn;
            body.buttonTwoCommand = this.ruleForm.urlSecondBtn;
          }

          this.operationRequest('POST', body);

        } else {

          this.operationRequest('PUT', body);
        }
      },

      //通用方法
      operationRequest(method, body, url) {

        if (url == '' || url == undefined) {
          url = '/e/operate/popup'
        }

        debugger
        this.$http({
          method: method,
          url: url,
          body: body,
          headers: {'X-Requested-With': 'XMLHttpRequest'},
          emulateJSON: false
        }).then(function (result) {
          console.log(result.data);
          if (result.data.message.code === 0) {
            this.requestDataList();
            this.reset();
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

        if (!this.isEditForm) {
          this.reset();
        }
        this.ruleForm.popType = value;
        this.switchWithType(value);
      },
      switchWithType(type) {

        switch (type) {
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
        this.$refs['ruleForm'].clearValidate();

        this.elItem.title = false;
        this.elItem.version = false;
        this.elItem.contentPop = false;
        this.elItem.upgradeBtn = false;
        this.elItem.notUpgradeBtn = false;
        this.elItem.imageUrl = false;
        this.elItem.firstBtn = false;
        this.elItem.secondBtn = false;
        this.elItem.uploadImageView = false;

        this.ruleForm.id = '';
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
        const isJPG = file.type === 'image/jpeg';
        const isPNG = file.type === 'image/png';
        const isPG = (isJPG || isPNG);                                      //限制图片格式为jpg / png
        const isLt2M = file.size / 1024 / 1024 < 2;                         //限制图片大小
        if (!isPG) {
          this.$message.error('上传图片只能是 JPG 或 PNG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 2MB!');
        }
        return isPG && isLt2M;

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
      }, paramsValidate(params) {
        let flag = true;
        for (let key in params) {
          if (!params[key]) return;
        }
        return flag;
      }
    }
  }
</script>

<style scoped>

</style>
