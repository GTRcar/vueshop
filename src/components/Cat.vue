<template>
  <div>
    <!--面包屑-->
    <com-crumb nm="分类"></com-crumb>

    <!-- 添加分类的对话框 -->
    <el-dialog title="添加分类" :visible.sync="addCatDialog" width="50%" @close="resetFrom">
      <el-form :rules="addCatRules" ref="addCatRef" :model="addCat" label-width="120px">
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCat.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="分类上级：">
          <el-cascader
            expand-trigger="hover"
            :options="catTwoList"
            v-model="catTwoSelected"
            :props="catTwoProps"
            change-on-select
            clearable
            @change="catTwoChange()"
            style="width:100%"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCatDialog = false">取 消</el-button>
        <el-button type="primary" @click="tianjia()">确 定</el-button>
      </span>
    </el-dialog>

    <!--卡片区-->
    <el-card class="box-card">
      <el-button type="primary" @click="showAddCatDialog()">添加分类</el-button>
      <!-- 数据表格 -->
      <el-table :data="catList" border stripe style="width: 100%" row-key="cat_id">
        <el-table-column prop="cat_name" label="分类名称"></el-table-column>
        <el-table-column prop="cat_level" label="等级" width="240">
          <template slot-scope="info">
            <el-tag v-if="info.row.cat_level==0">一级</el-tag>
            <el-tag v-else-if="info.row.cat_level==1" type="success">二级</el-tag>
            <el-tag v-else type="warning">三级</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="340">
          <template slot-scope="info">
            <el-button type="primary" icon="el-icon-edit" size="mini">修改</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getCatList()
  },
  methods: {
    /** 添加分类相关1 */
    // 清空表单
    resetFrom() {
      // 重置from表单
      this.$refs.addCatRef.resetFields()
      // 分类上级重置
      this.catTwoSelected = []
      //重置from表单的数据
      this.addCat.cat_pid = 0
      this.addCat.cat_level = 0
    },
    // 收集数据存储入库
    tianjia() {
      this.$refs.addCatRef.validate(async valid => {
        if (valid === true) {
          const { data: dt } = await this.$http.post('categories', this.addCat)
          if (dt.meta.status !== 201) {
            return this.$message.error(dt.meta.msg)
          }
          this.$message.success(dt.meta.msg)
          this.addCatDialog = false
          this.getCatList()
        }
      })
    },
    // 级联选择器变化的处理
    catTwoChange() {
      // console.log(this.catTwoSelected)
      // 计算当前分类的 pid 和level
      var len = this.catTwoSelected.length
      if (len === 0) {
        // 没有选取上级
        this.addCat.cat_pid = 0
        this.addCat.cat_level = 0
      } else {
        // 有选取上级
        this.addCat.cat_pid = this.catTwoSelected[len - 1]
        this.addCat.cat_level = len
      }
      console.log(this.addCat)
    },
    // 展开对话框逻辑
    async showAddCatDialog() {
      // 获得用于选取的上级分类(1/2两个级别的)
      const { data: dt } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }
      // 把获得好的1/2级别分类赋予给catTwoList
      this.catTwoList = dt.data

      // 显示对话框
      this.addCatDialog = true
    },
    /** 添加分类相关2 */

    // 获取分类列表数据
    async getCatList() {
      const { data: dt } = await this.$http.get('categories', {
        params: this.querycdt
      })
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }
      // 分类获得成功，同时赋予给catList
      this.catList = dt.data.result
    }
  },
  data() {
    return {
      /** 添加分类相关1 */
      // 接收选中的上级分类信息
      catTwoSelected: [],
      // 给级联选取器定义项目属性
      catTwoProps: {
        label: 'cat_name', // 定义显示字段
        value: 'cat_id', // 起作用的字段新定义
        children: 'children' // 父子关系数据衔接字段
      },
      // 接收1/2级分类信息
      catTwoList: [],
      // 对话框显示标志
      addCatDialog: false,
      // 表单校验
      addCatRules: {
        cat_name: [{ required: true, message: '分类名称必填', trigger: 'blur' }]
      },
      // 表单数据对象
      addCat: {
        cat_name: '', //新分类名称
        cat_pid: 0, //新分类ID
        cat_level: 0 //新分类等级
      },
      /** 添加分类相关2 */

      // 接收用于显示的分类列表数据
      catList: [],
      // 查询分类需要的参数对象
      querycdt: {
        type: 3, //分类列表有几层
        pagenum: 1,
        pagesize: 5
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>
