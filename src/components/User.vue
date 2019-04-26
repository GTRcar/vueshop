<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区 -->
    <el-card class="box-card">
      <!-- 编辑用户 -->
      <el-dialog title="修改用户" :visible.sync="editUserDialog" width="40%">
        <el-form :model="editruleForm" :rules="editUserules" ref="editForm" label-width="100px">
          <el-form-item label="用户名" prop="username">
            <el-input disabled v-model="editruleForm.username"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editruleForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="editruleForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editUserDialog = false">取 消</el-button>
          <el-button type="primary" @click="xiugai()">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 添加用户 -->
      <el-dialog
        @close="$refs.addruleForm.resetFields()"
        title="添加用户"
        :visible.sync="addUserDialog"
        width="40%"
      >
        <el-form :model="addruleForm" :rules="addUserules" ref="addruleForm" label-width="100px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addruleForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addruleForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addruleForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="addruleForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addUserDialog = false">取 消</el-button>
          <el-button type="primary" @click="tianjia()">确 定</el-button>
        </span>
      </el-dialog>

      <el-row :gutter="24">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="querycdt.query"
            class="input-with-select"
            clearable
            @clear="getUserList()"
            @keyup.enter.native="getUserList()"
          >
            <el-button slot="append" @click="getUserList()" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="8">
          <el-button type="primary" @click="addUserDialog = true">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table stripe border :data="userList" style="width: 100%">
        <el-table-column type="index" label="序号" width="150"></el-table-column>
        <el-table-column prop="username" label="用户名" width="150"></el-table-column>
        <el-table-column prop="mobile" label="手机号码" width="150"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <!-- 获取每条信息的状态值
          {{mg_state===true?'显示':'不显示'}}
          当前环境是el-table环境内部有v-for遍历机制在el-table-column组件中，
          已经把每条记录信息放内部的插槽中
          <span slot-scope="info">{{info.row.mg_state===true?'显示':'不显示'}}</span>-->
          <el-switch
            v-model="info.row.mg_state"
            slot-scope="info"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="info">
            <el-row>
              <el-button
                @click="showEditeDialog(info.row.id)"
                size="mini"
                type="primary"
                icon="el-icon-edit"
              ></el-button>
              <el-button
                @click="delUser(info.row.id)"
                size="mini"
                type="danger"
                icon="el-icon-delete"
              ></el-button>
              <el-tooltip
                :enterable="false"
                class="item"
                effect="dark"
                content="角色分配"
                placement="top"
              >
                <el-button
                  size="mini"
                  type="warning"
                  icon="el-icon-setting"
                  @click="addUserdialog = true"
                ></el-button>
              </el-tooltip>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querycdt.pagenum"
        :page-sizes="[3, 5, 10, 20]"
        :page-size="querycdt.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tot"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getUserList()
  },
  methods: {
    // 添加用户

    // 分页相关，每页条数变化的处理
    // 把变化后的条数赋予给querycdt.pagesize
    handleSizeChange(val) {
      this.querycdt.pagesize = val
      // console.log(val)
      // 根据每条变化后的数据,重新获取数据this.getUserList()
      this.getUserList()
    },
    // 当前页码处理函数
    handleCurrentChange(val) {
      // 获取当前页码
      this.querycdt.pagenum = val
      // console.log(val)
      // 更新新数据。
      this.getUserList()
    },
    // 获取用于显示的真实用户数据
    async getUserList() {
      const { data: dt } = await this.$http.get('users', {
        params: this.querycdt
      })
      // 把获得数据赋值给tol
      this.tot = dt.data.total
      // console.log(dt)
      this.userList = dt.data.users
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.mata.msg)
      }
    },
    tianjia() {
      // 表单再次校验
      this.$refs.addruleForm.validate(async valid => {
        if (valid === true) {
          // 把添加好的各项表单域信息传递(axios)到服务器存储
          const { data: dt } = await this.$http.post('users', this.addruleForm)
          // console.log(dt)
          if (dt.meta.status !== 201) {
            return this.$message.error(dt.meta.msg)
          }
          // 数据添加成功：提示信息、关闭对话框、数据刷新
          this.$message.success(dt.meta.msg)
          this.addUserDialog = false
          this.getUserList()
        }
      })
    },
    // 删除用户
    delUser(id) {
      this.$confirm('你确定要删除该用户吗, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: dt } = await this.$http.delete('users/' + id)
          console.log(dt)
          if (dt.meta.status !== 200) {
            return this.$message.error(dt.meta.msg)
          }
          this.$message.success(dt.meta.msg)
          this.getUserList()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 展示编辑用户数据
    async showEditeDialog(id) {
      const { data: dt } = await this.$http.get('users/' + id)
      // console.log(dt)
      this.editruleForm = dt.data
      this.editUserDialog = true
    },
    xiugai() {
      this.$refs.editForm.validate(async valid => {
        if (valid === true) {
          const { data: dt } = await this.$http.put(
            'users/' + this.editruleForm.id,
            this.editruleForm
          )
          console.log(dt)
          if (dt.meta.status !== 200) {
            return this.$message.error(dt.meta.msg)
          }
          this.$message.success(dt.meta.msg)
          this.getUserList()
          this.editUserDialog = false
        }
      })
    }
  },

  data() {
    // 为手机号码自定义校验函数   是私有变量
    // @param  value被校验数据
    // @param callback:被校验的回调函数，校验无论成功或失败都执行
    var checkMobile = (rule, value, callback) => {
      // 手机号码规则：11位、1开始、纯数字、第二位是356789
      var reg = /^1[356789]\d{9}$/
      // 正则reg 与 目标内容匹配
      if (!reg.test(value)) {
        // 校验失败
        return callback(new Error('手机号码格式不正确'))
      }
      // 校验成功，继续执行
      callback()
    }

    return {
      addUserules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
        mobile: [
          { required: true, message: '手机号码必填', trigger: 'blur' },
          // 自定义校验规则应用
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 修改用户规则
      editUserules: {
        email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
        mobile: [
          { required: true, message: '手机号码必填', trigger: 'blur' },
          // 自定义校验规则应用
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      addUserDialog: false,
      addruleForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 编辑用户
      editUserDialog: false,
      editruleForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addUserdialog: false,
      // 用户总记录条数
      tot: 0,
      // 声明用户列表数据成员
      userList: [],
      // 获取用户数据的条件参数
      querycdt: {
        // 搜索模糊关键字。
        query: '',
        // 要显示的页数。
        pagenum: 1,
        // 每一页显示的条数。
        pagesize: 3
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>
