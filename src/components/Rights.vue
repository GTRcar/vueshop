<template>
  <div>
    <com-crumb nm="权限"></com-crumb>
    <el-card class="box-card">
      <el-table stripe border :data="rightList" style="width: 100%">
        <el-table-column type="index" label="序号" width="200"></el-table-column>
        <el-table-column prop="authName" label="权限名称" width="200"></el-table-column>
        <el-table-column prop="path" label="路径" width="200"></el-table-column>
        <el-table-column label="等级">
          <template slot-scope="info">
            <el-tag v-if="info.row.level==0">一级</el-tag>
            <el-tag v-else-if="info.row.level==1" type="success">二级</el-tag>
            <el-tag v-else type="success">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  // 创建声明周期函数
  created() {
    this.getRightsList()
  },
  methods: {
    async getRightsList() {
      const { data: dt } = await this.$http.get('rights/list')
      console.log(dt)
      if (dt.meta.status !== 200) {
        this.$message.console.error(dt.meta.msg)
      }
      this.$message.success(dt.meta.msg)
      this.rightList = dt.data
    }
  },
  data() {
    return {
      // 声明数据列表
      rightList: []
    }
  }
}
</script>

<style lang="less" scoped>
</style>
