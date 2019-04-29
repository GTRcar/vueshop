<template>
  <div>
    <com-crumb nm="角色"></com-crumb>
    <!--角色授权的对话框 -->
    <el-dialog title="分配权限" :visible.sync="distributeDialog" width="50%">
      <!-- :model绑定表单数据对象的，固定用法 -->
      <el-form ref="distributeRef" :model="distributeForm" label-width="120px">
        <el-form-item label="当前角色：">{{distributeForm.roleName}}</el-form-item>
        <el-form-item label="分配的权限：">
          <el-tree
            :data="rightsInfo"
            :props="treeProps"
            :default-checked-keys="defaultChecked"
            :default-expand-all="true"
            show-checkbox
            node-key="id"
            ref="treeRef"
          ></el-tree>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="distributeDialog = false">取 消</el-button>
        <el-button type="primary" @click="fenRights()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 卡片区 -->
    <el-card class="box-card">
      <el-button type="primary">添加角色</el-button>
      <el-table stripe border style="width: 100%" :data="roleList">
        <el-table-column type="expand">
          <!-- 获取每条角色记录 -->
          <template slot-scope="info">
            <!-- 第一级别权限遍历 -->
            <el-row
              v-for="(v,k) in info.row.son"
              :key="v.id"
              :style="{'border-bottom':'1px solid rgb(235, 238, 245)',
              'border-top':k==0?'1px solid rgb(235, 238, 245)':''}"
            >
              <el-col :span="5">
                <el-tag closable>{{v.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 第二级别 -->
              <el-col :span="19">
                <el-row
                  v-for="(vv,kk) in v.children"
                  :key="vv.id"
                  :style="{'border-top':kk!==0? '1px solid rgb(235, 238, 245)':''}"
                >
                  <el-col :span="6">
                    <el-tag closable>{{vv.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 第三级别 -->
                  <el-col :span="18">
                    <el-tag
                      closable
                      v-for="vvv in vv.children"
                      :key="vvv.id"
                      type="warning"
                      @close="delRights(info.row,vvv.id)"
                    >{{vvv.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述" width="240"></el-table-column>
        <el-table-column prop label="操作" width="340">
          <template slot-scope="info">
            <el-button
   
              size="mini"
              type="primary"
              icon="el-icon-edit"
            >编辑</el-button>
            <el-button

              size="mini"
              type="danger"
              icon="el-icon-delete"
            >删除</el-button>
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showDistributeDialog(info.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getRoleList()
  },
  methods: {
    // 分配权限存储入库
    async fenRights() {
      // roleid  ： this.distributeForm.id
      // 全选、半选 的权限id: getCheckedKeys / getHalfCheckedKeys
      var ids1 = this.$refs.treeRef.getCheckedKeys()
      var ids2 = this.$refs.treeRef.getHalfCheckedKeys()
      // console.log(ids1, ids2)  // [116, 117, 150]  [101, 104]
      // 合并ids1和ids2并以字符串呈现
      var ids12 = ids1.concat(ids2).join(',')
      // console.log(ids12) //116, 117, 150, 101, 104

      const { data: dt } = await this.$http.post(
        `roles/${this.distributeForm.id}/rights`,
        { rids: ids12 }
      )
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }
      // 角色分配权限成功：关闭对话框、提示、刷新数据
      this.distributeDialog = false
      this.$message.success(dt.meta.msg)
      this.getRoleList()
    },
    //   当前角色role每一条对象    展现对话框
    async showDistributeDialog(role) {
      // 获得用于分配的权限数据
      const { data: dt } = await this.$http.get('rights/tree')
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }
      // 把获得好用于分配的权限数据赋予给rightsInfo成员
      this.rightsInfo = dt.data
      // 把当前角色拥有的第三级别权限的id获得到，并以数组呈现
      // 具体从参数role中获取   因为每一条数据里面都有id值
      var idKeys = [] //接收第三级别权限id
      this.getHaveRights(role, idKeys)
      console.log(idKeys)
      // 把拥有的第三级别权限的id数组赋予给defaultChecked成员
      this.defaultChecked = idKeys
      // 把role参数赋予给distributeForm表单数据对象
      this.distributeForm = role
      // 展示对话框
      this.distributeDialog = true
    },
    // 以递归遍历的方式把一个角色的全部第3级别权限id给获得到
    getHaveRights(node, arr) {
      if (node.son) {
        node.children = node.son
      }
      // 如果是第三级别权限，把其id给到arr里面
      if (!node.children) {
        return arr.push(node.id)
      }
      // 如果是第1/2级别的权限，就要遍历其children，继续挖掘内部节点
      node.children.forEach(item => {
        this.getHaveRights(item, arr)
      })
    },
    //   删除全权限
    delRights(roles, rightsId) {
      this.$confirm('你确定要删除此权限吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: dt } = await this.$http.delete(
            `roles/${roles.id}/rights/${rightsId}`
          )
          //   console.log(dt)
          if (dt.meta.status !== 200) {
            this.$message.error(dt.meta.msg)
          }
          // 成功提示
          this.$message.success(dt.meta.msg)

          //   this.getRoleList()不符合用户需求
          //  更新数据
          //  当前展开行不要收起来  只对当前拥有的权限做更新就可以
          roles.son = dt.data
        })
        .catch(() => {})
    },
    //   获取角色列表的数据
    async getRoleList() {
      const { data: dt } = await this.$http.get('roles')

      //   判断、
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }
      //   替换掉children
      dt.data.forEach(item => {
        // 替换掉children
        item.son = item.children
        //    删除children
        delete item.children
      })
      //  console.log(dt)
      // 把数据赋值给空数组
      this.roleList = dt.data
    }
  },
  data() {
    return {
      /** 分配权限相关1 */
      //默认选中权限 给角色拥有权限集合是数组的形式，具体是叶子(第三级别)
      defaultChecked: [],
      // 给大树 设置相关属性
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      // 定义被选取全选的数据成员
      rightsInfo: [],
      // 对话框显示标志
      distributeDialog: false,
      // 表单数据对象
      distributeForm: {
        id: 0, // 角色id
        roleName: '', // 角色名称
        roleDesc: '' // 角色描述
      },

      // 首先声明角色数据列表
      roleList: []
    }
  }
}
</script>

<style lang="less" scoped>
.el-row {
  display: flex;
  align-items: center;
}
.el-tag {
  margin: 10px 5px;
}
</style>
