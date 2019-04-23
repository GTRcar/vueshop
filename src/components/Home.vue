<template>
  <el-container>
    <el-header>
      <div class="logo_box">
        <img src="../assets/img/heima.png" alt>
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout()">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isshow?'65px':'200px'">
        <div class="toogle_bar" @click="isshow=!isshow">|||</div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          :unique-opened="true"
          :collapse="isshow"
          :collapse-transition="false"
        >
          <el-submenu
            :index="item.id+''"
            :style="{width:isshow?'65px':'200px'}"
            v-for="(item,k) in menulist"
            :key="item.id"
          >
            <template slot="title">
              <i :class="'iconfont icon-'+iconList[k]"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item
              v-for="item2 in item.children"
              :key="item2.id"
              :index="item.id+'-'+item2.id"
            >
              <i class="el-icon-menu"></i>
              {{item2.authName}}
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  created() {
    this.getMenuList()
  },
  methods: {
    // 获得左侧菜单权限数据
    async getMenuList() {
      // axios到达后端获得左侧数据
      const { data: dt } = await this.$http.get('menus')
      console.log(dt)
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.msg)
      }
      this.menulist = dt.data
    },
    // 管理员退出系统
    logout() {
      this.$confirm('你确定要退出吗, 是否退出?', '退出', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // 如果退出了就清除token ，并且路由跳转到登录页面
          window.sessionStorage.removeItem('token')
          this.$router.push('/login')
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消退出'
          })
        })
    }
  },
  data() {
    return {
      // 左侧权限开关
      isshow: false,
      // 左侧导航数据成员
      menulist: [],
      iconList: ['users', 'tijikongjian', 'shangpin', 'danju', 'baobiao']
    }
  }
}
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
  .el-header {
    background-color: #373d41;
    display: flex;
    align-items: center; //纵轴对齐
    justify-content: space-between;
    padding: 0px;
    padding-right: 20px;
    .logo_box {
      display: flex;
      color: #fff;
      font-size: 22px;
      align-items: center;
      justify-content: space-between;
      img {
        width: 50px;
        height: 50px;
        margin-right: 10px;
        user-select: none;
      }
    }
  }
  .el-aside {
    background-color: #333744;
    .toogle_bar {
      background-color: #4a5064;
      color: #fff;
      text-align: center;
      height: 25px;
      line-height: 25px;
      font-size: 12px;
      letter-spacing: 0.1em;
      user-select: none;
      cursor: pointer;
    }
  }
  .el-main {
    background-color: #eaedf1;
  }
}
</style>
