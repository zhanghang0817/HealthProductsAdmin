<template>
  <div>
    <el-dialog title="请先修改初始密码" :visible.sync="changePassword" size="tiny">
      <el-col :span="22">
        <el-form :model="changePassRule" :rules="passRules" ref="changePassRule" label-width="100px"
                 class="demo-ruleForm">
          <el-form-item label="用户名">
            <span>{{changePassRule.LoginUserName}}</span>
          </el-form-item>
          <el-form-item label="旧密码" prop="oldPass">
            <el-input type="password" v-model="changePassRule.oldPass" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="newPass">
            <el-input type="password" v-model="changePassRule.newPass" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
      </el-col>
      <span slot="footer" class="dialog-footer">
            <el-button @click="changePassForm('changePassRule')">确 认</el-button>
            <el-button type="primary" @click="changePassword=false">取 消</el-button>
          </span>
    </el-dialog>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position="left" label-width="0px" class="demo-ruleForm login-container">
      <h3 class="title">e智通运营数据后台登录</h3>
      <el-form-item prop="account">
        <el-input type="text" v-model="ruleForm.account" auto-complete="off" placeholder="账号"></el-input>
      </el-form-item>
      <el-form-item prop="checkPass">
        <el-input type="password" v-model="ruleForm.checkPass" auto-complete="off" placeholder="密码"></el-input>
      </el-form-item>
      <el-checkbox v-model="checked" class="remember">记住密码</el-checkbox>
      <el-form-item style="width:100%;">
        <el-button type="primary" style="width:100%;" @click="submitForm('ruleForm')">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: 'login',
  data () {
    let accTest = /^[A-Za-z0-9]+$/
    var NewPassRule = (rule, value, callback) => {
      if (this.changePassRule.newPass === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.changePassRule.newPass.length < 4 || this.changePassRule.newPass.length > 16) {
          callback(new Error('请输入4-16位的数字/字母'))
        } else if (!accTest.test(this.changePassRule.newPass)) {
          callback(new Error('请输入4-16位的数字/字母'))
        }
        callback()
      }
    }
    var OldPassRule = (rule, value, callback) => {
      if (this.changePassRule.oldPass === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.changePassRule.oldPass.length < 4 || this.changePassRule.oldPass.length > 16) {
          callback(new Error('请输入4-16位的数字/字母'))
        } else if (!accTest.test(this.changePassRule.oldPass)) {
          callback(new Error('请输入4-16位的数字/字母'))
        }
        callback()
      }
    }
    return {
      ruleForm: {
        account: localStorage.account ? localStorage.account : '',
        checkPass: localStorage.checkPass ? localStorage.checkPass : ''
      },
      rules: {
        account: [{
          required: true,
          message: '请输入账号',
          trigger: 'blur'
        }],
        checkPass: [{
          required: true,
          message: '请输入密码',
          trigger: 'blur'
        }]
      },
      checked: true,
      changePassword: false, // 修改密码
      changePassRule: {
        LoginUserName: '', // 用户名
        newPass: '', // 新密码
        oldPass: '' // 旧密码
      },
      // 修改密码验证
      passRules: {
        newPass: [
          {validator: NewPassRule, trigger: 'blur'}
        ],
        oldPass: [
          {validator: OldPassRule, trigger: 'blur'}
        ]
      }
    }
  },
  mounted: function () {
    if (localStorage.account) {
      this.checked = true
    } else {
      this.checked = false
    }
  },
  methods: {
    submitForm (formName) {
      let _this = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$http({
            method: 'POST',
            url: 'sqdl/passport/api/login',
            params: {loginName: _this.ruleForm.account, password: _this.ruleForm.checkPass, appId: 'CP170000003'},
            headers: {'X-Requested-With': 'XMLHttpRequest'},
            emulateJSON: true
          }).then(function (result) {
            if (result.data.message.code === 0) {
              this.$message({
                message: '登陆成功',
                type: 'success'
              })
            } else if (result.data.message.code === -102) {
              _this.changePassRule.oldPass = ''
              _this.changePassRule.newPass = ''
              _this.changePassword = true
              _this.changePassRule.LoginUserName = _this.ruleForm.account
              return false
            } else {
              this.$message({
                message: result.body.message.message,
                type: 'error'
              })
              return false
            }
            if (_this.checked) {
              localStorage.account = _this.ruleForm.account
              localStorage.checkPass = _this.ruleForm.checkPass
            } else {
              localStorage.removeItem('account')
              localStorage.removeItem('checkPass')
            }
            localStorage.account1 = _this.ruleForm.account
            localStorage.checkPass1 = _this.ruleForm.checkPass
            localStorage.id = result.body.data.id
            this.$router.push({ path: '/Home' })
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 修改默认密码
    changePass: function () {
      this.$http({
        url: 'sqdl/passport/api/forgetPassword',
        method: 'POST',
        params: {
          loginName: this.changePassRule.LoginUserName,
          pwd: this.changePassRule.oldPass,
          newPwd: this.changePassRule.newPass
        }
      }).then(
        function (response) {
          if (response.data.message.code === 0) {
            this.changePassword = false
            this.ruleForm.account = ''
            this.ruleForm.password = ''
            this.$message({
              message: '密码修改成功，请重新登录',
              type: 'success'
            })
          } else {
            this.$message({
              message: '密码修改失败',
              type: 'error'
            })
          }
        },
        function (response) {
          this.success('密码修改失败')
        }
      )
    },
    changePassForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.changePass()
        } else {
          return false
        }
      })
    }
  },
  watch: {},
  components: {}
}
</script>

<style scoped>
.login-container {
    border-radius: 5px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
}
.title {
      margin: 0px auto 40px auto;
      text-align: center;
      color: #505458;
    }
    .remember {
      margin: 0px 0px 35px 0px;
    }


</style>
