<template>
  <div id="login-container">
    <!-- <p>管理员登录系统</p> -->
    <div id="login-box">
      <div id="logo-box">
        <img src="../assets/img/logo.png" alt>
      </div>
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFromRules">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" placeholder="请输入用户名">
            <i slot="prefix" class="iconfont icon-1USER"></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" show-password placeholder="请输入用户密码">
            <i slot="prefix" class="iconfont icon-password"></i>
          </el-input>
        </el-form-item>
        <el-row>
          <el-col :offset="15">
            <el-button type="primary" @click="login()">登陆</el-button>
            <el-button type="info" @click="resetForm()">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    login() {
      // 对form表单进行整体的验证
      this.$refs.loginFormRef.validate(async valid => {
        if (valid === true) {
          const { data: dt } = await this.$http.post('login', this.loginForm)
          // const data = await this.$router.push('/login')
          console.log(dt)
          if (dt.meta.status !== 200) {
            return this.$message.error(dt.meta.msg)
          }
          window.sessionStorage.setItem('token', dt.data.token)
          this.$router.push('/home')
        }

        // console.log(valid)
      })

      // console.log(this)
    },
    resetForm() {
      this.$refs.loginFormRef.resetFields()
    }
  },
  data() {
    return {
      loginFromRules: {
        username: { required: true, message: '请输入用户名', trigger: 'blur' },
        password: {
          required: true,
          message: '请输入用户密码',
          trigger: 'blur'
        }
      },
      loginForm: {
        username: 'admin',
        password: '123456'
      }
    }
  }
}
</script>

<style lang="less" scoped>
#login-container {
  background-color: #2b4b6b;
  height: 100%;
  overflow: hidden;
  #login-box {
    width: 450px;
    height: 304px;
    background-color: #fff;
    border-radius: 4px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    #logo-box {
      width: 130px;
      height: 130px;
      border: 1px solid #eee;
      border-radius: 50%;
      padding: 8px;
      box-shadow: 0 0 10px #eee;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #fff;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
    .el-form {
      position: absolute;
      bottom: 0;
      width: 100%;
      padding: 20px;
      box-sizing: border-box;
    }
  }
}
</style>
