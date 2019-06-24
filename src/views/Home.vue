<template>
  <el-row class="container">
    <el-col :span="24" class="header">
      <el-col :span="10" class="logo" :class="collapsed?'logo-collapse-width':'logo-width'">
        {{collapsed ?'':sysName}}
      </el-col>
      <el-col :span="10">
        <!-- <div class="tools" @click.prevent="collapse">
          <i class="fa fa-align-justify"></i>
        </div> -->
      </el-col>
      <el-col :span="4" class="userinfo">
        <el-dropdown trigger="hover">
          <span class="el-dropdown-link userinfo-inner"><img :src="sysUserAvatar" /> {{sysUserName}}</span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </el-col>
    <el-col :span="24" class="main">
      <aside :class="collapsed?'menu-collapsed':'menu-expanded'">
        <!--导航菜单-->
        <el-menu default-active="1" class="el-menu-vertical-demo branchOfficeListf" @open="handleOpen" @close="handleClose" unique-opened v-show="!collapsed">
          <el-menu-item index="1" @click="goPage('/assessment')" v-if="menuList.indexOf('quota:view') == -1?false:true"><i class="fa fa-line-chart"></i>指标汇总(非考核)</el-menu-item>
          <el-menu-item index="2" @click="goPage('/allCompany')" v-if="menuList.indexOf('allCompany:view') == -1?false:true"><i class="fa fa-university"></i>全公司</el-menu-item>
          <el-submenu index="3" v-if="menuList.indexOf('subCompany:view') == -1 || noSub?false:true">
              <template slot="title"><i class="fa fa-sitemap"></i>中心营业部/分公司</template>
                <el-menu-item @click="goComPage(item)" v-for="item in navList" :index="item" :key="item">{{item}}</el-menu-item>
          </el-submenu>
          <el-menu-item index="4" @click="goPage('/feedback')" v-if="menuList.indexOf('feedback:view') == -1?false:true"><i class="fa fa-edit"></i>意见反馈</el-menu-item>
          <el-submenu index="5" v-if="menuList.indexOf('viewpoint:view') == -1?false:true">
            <template slot="title" v-if="menuList.indexOf('viewpoint:view') == -1?false:true"><i class="fa fa-pencil-square"></i>独家观点</template>
            <el-menu-item  index="1-1" @click="goPage('/audio')" v-if="menuList.indexOf('audio:view') == -1?false:true">研听</el-menu-item>
            <el-menu-item  index="1-2" @click="goPage('/video')" v-if="menuList.indexOf('video:view') == -1?false:true">研播</el-menu-item>
            <el-menu-item  index="1-3" @click="goPage('/summary')" v-if="menuList.indexOf('summary:view') == -1?false:true">简介</el-menu-item>
          </el-submenu>
          <el-submenu index="6" v-if="menuList.indexOf('simulationGroup:view') == -1?false:true">
            <template slot="title" v-if="menuList.indexOf('simulationGroup:view') == -1?false:true"><i class="fa fa-calendar"></i>模拟组合管理</template>
            <el-menu-item  index="1-1" @click="goPage('/portfolioMage')" v-if="menuList.indexOf('group:view') == -1?false:true">组合管理</el-menu-item>
            <el-menu-item  index="1-2" @click="goPage('/GroupMage')" v-if="menuList.indexOf('grouping:view') == -1?false:true">分组管理</el-menu-item>
          </el-submenu>
          <el-menu-item index="7" @click="goPage('/level2coupon')" v-if="menuList.indexOf('level2coupon:view') == -1?false:true"><i class="fa fa-ticket"></i>Level2体验券管理</el-menu-item>
          <!--<el-submenu index="7" v-if="isShowAllCompany">-->
            <!--<template slot="title"><i class="fa fa-industry"></i>私募资管产品</template>-->
            <!--<el-menu-item  index="1-1" @click="goPage('/privateEquity')">私募数据</el-menu-item>-->
            <!--<el-menu-item  index="1-2" @click="goPage('/customMade')">用户定制信息</el-menu-item>-->
          <!--</el-submenu>-->
        </el-menu>
      </aside>
      <section class="content-container">
        <div class="grid-content bg-purple-light">
          <el-col :span="24" class="breadcrumb-container">
            <el-breadcrumb separator="/" class="breadcrumb-inner">
              <el-breadcrumb-item>
                <strong style="color:#48576a;">{{ $route.name }}</strong>
              </el-breadcrumb-item>
              <el-breadcrumb-item v-for="(item, index) in navList" :key="item" v-if="$route.query.companyId == item">
                {{ item }}
              </el-breadcrumb-item>
            </el-breadcrumb>
          </el-col>
          <el-col :span="24" class="content-wrapper">
            <transition name="fade" mode="out-in">
              <router-view></router-view>
            </transition>
          </el-col>
        </div>
      </section>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: 'home',
  data () {
    return {
      sysName: 'e智通 | 运营数据后台',
      collapsed: false,
      sysUserName: '',
      sysUserAvatar: require('../assets/header.jpg'),
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      navList: [],
      noSub: false,
      isShowAllCompany: false,
      menuList: []   // 侧边栏一级菜单
    }
  },
  methods: {
    onSubmit () {
      console.log('submit!')
    },
    handleOpen: function () {},
    handleClose: function () {},
    handleselect: function (a, b) {},
//    logout: function () {
//      let _this = this
//      this.$confirm('确认退出吗?', '提示', {
//      }).then(() => {
//        sessionStorage.removeItem('account')
//        _this.$router.push('/')
//      }).catch(() => {})
//    },
    logout: function () {
      let _this = this
      this.$confirm('确认退出吗?', '提示', {
      }).then(() => {
        this.$http({
          method: 'POST',
          url: 'sqdl/passport/api/logout',
          params: {appId: 'CP170000003'},
          headers: {'X-Requested-With': 'XMLHttpRequest'},
          emulateJSON: true
        }).then(function (result) {
          console.log(result)
          sessionStorage.removeItem('account')
          _this.$router.push('/')
        })
      }).catch(() => {})
    },
    collapse: function () {
      this.collapsed = !this.collapsed
    },
    showMenu (i, status) {
      this.$refs.menuCollapsed.getElementsByClassName('submenu-hook-' + i)[0].style.displastatus ? 'block' : 'none'
    },
    goPage: function (path) {
      this.$router.push(path)
    },
    goComPage: function (id) {
      this.$router.push({path: '/hello', query: { companyId: id }})
    },
    getCenter: function () {
      let _this = this
      let _id = localStorage.id
      this.$http({
        method: 'GET',
        url: 'sqdl/passport/api/menus',
        params: {appId: 'CP170000003', userId: _id},
        headers: {'X-Requested-With': 'XMLHttpRequest'},
        emulateJSON: true
      }).then(function (result) {
        _this.menuList = result.body.data
        localStorage.setItem('menuList', _this.menuList)
        if (_this.menuList.indexOf('subCompany:view') !== -1) {
          _this.getSubCompany()
        } else {
          _this.enterToPage()
        }
      }).catch(() => {
//        this.$message.error('请重新登录')
//        _this.$router.push('/')
      })
    },
    getSubCompany: function () {
      let _this = this
      let _account = localStorage.account1
      let _checkPass = localStorage.checkPass1
      this.$http({
        method: 'GET',
        url: 'e/operate/user/subCompany',
        params: {userName: _account, password: _checkPass},
        headers: {'X-Requested-With': 'XMLHttpRequest'},
        emulateJSON: true
      }).then(function (result) {
//        console.log(result)
        if (result.body.data.allDep) {
          _this.navList = result.body.data.centerDep
        } else if (result.body.data.centerDep) {
          _this.navList = result.body.data.centerDep.split(',')
        }
        _this.enterToPage()
        if (!result.body.data.centerDep) {
          _this.noSub = true
        }
      })
    },
    enterToPage: function () {
      let _this = this
      if (_this.menuList.indexOf('quota:view') !== -1) {
        _this.$router.push('/assessment')
        return false
      } else if (_this.menuList.indexOf('allCompany:view') !== -1) {
        _this.$router.push('/allCompany')
        return false
      } else if (_this.menuList.indexOf('subCompany:view') !== -1) {
        _this.$router.push({path: '/hello', query: {companyId: _this.navList[0]}})
        return false
      } else if (_this.menuList.indexOf('feedback:view') !== -1) {
        _this.$router.push('/feedback')
        return false
      } else if (_this.menuList.indexOf('audio:view') !== -1) {
        _this.$router.push('/audio')
        return false
      } else if (_this.menuList.indexOf('video:view') !== -1) {
        _this.$router.push('/video')
        return false
      } else if (_this.menuList.indexOf('summary:view') !== -1) {
        _this.$router.push('/summary')
        return false
      } else if (_this.menuList.indexOf('group:view') !== -1) {
        _this.$router.push('/portfolioMage')
        return false
      } else if (_this.menuList.indexOf('grouping:view') !== -1) {
        _this.$router.push('/GroupMage')
        return false
      } else if (_this.menuList.indexOf('level2coupon:view') !== -1) {
        _this.$router.push('/level2Mage')
        return false
      }
    }
  },
  mounted: function () {
    this.getCenter()
  },
  components: {}
}
</script>

<style scoped>
  .container {
    position: absolute;
    top: 0px;
    bottom: 0px;
    width: 100%;
  }
  .container .header {
    height: 60px;
    line-height: 60px;
    background: #20a0ff;
    color:#fff;
  }
  .container .header .userinfo {
    text-align: right;
    padding-right: 35px;
    float: right;
  }
  .container .header .userinfo .userinfo-inner {
    cursor: pointer;
    color:#fff;
  }
  .container .header .userinfo .userinfo-inner img {
    width: 40px;
    height: 40px;
    border-radius: 20px;
    margin: 10px 0px 10px 10px;
    float: right;
  }
  .container .header .logo {
    height:60px;
    font-size: 18px;
    font-family: 'Hiragino Sans GB';
    padding-left:20px;
    padding-right:20px;
    border-color: rgba(238,241,146,0.3);
    border-right-width: 1px;
    border-right-style: solid;
  }
  .container .header .logo img {
    width: 40px;
    float: left;
    margin: 10px 10px 10px 18px;
  }
  .container .header .logo .txt {
    color:#fff;
  }
  .container .header .logo-width{
    width:230px;
  }
  .container .header .logo-collapse-width{
    width:60px
  }
  .container .header .tools{
    padding: 0px 23px;
    width:14px;
    height: 60px;
    line-height: 60px;
    cursor: pointer;
  }
  .container .main {
    display: flex;
    position: absolute;
    top: 60px;
    bottom: 0px;
    overflow: hidden;
  }
  .container .main aside {
    flex:0 0 230px;
    width: 230px;
  }
  .container .main aside .el-menu {
    height: 100%;
  }
  .container .main aside .collapsed {
    width:60px;
  }
  .container .main aside .collapsed .item {
    position: relative;
  }
  .container .main aside .collapsed .submenu {
    position:absolute;
    top:0px;
    left:60px;
    z-index:99999;
    height:auto;
    display:none;
  }
  .container .main .menu-collapsed {
    flex:0 0 60px;
    width: 60px;
  }
  .container .main .menu-expanded {
    flex:0 0 230px;
    width: 230px;
  }
  .container .main .content-container {
    flex:1;
    overflow-y: scroll;
    padding: 20px;
  }
  /*.container .main .content-container .breadcrumb-container .title {
    width: 200px;
    float: left;
    color: #475669;
  }*/
  .container .main .content-container .breadcrumb-container .breadcrumb-inner {
    float: right;
    margin-bottom: 15px;
  }
  .container .main .content-container .content-wrapper {
    background-color: #fff;
    box-sizing: border-box;
  }
  .branchOfficeListf{
    overflow-y: scroll;
  }
</style>
