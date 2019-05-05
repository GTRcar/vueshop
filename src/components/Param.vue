<template>
  <div>
    <!--面包屑-->
    <com-crumb nm="参数"></com-crumb>
    <!--卡片区-->
    <el-card class="box-card">
      <!-- 警告区 -->
      <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" show-icon></el-alert>
      <!-- 级联选择器3级别分类 -->
      <el-row>
        <el-col>
          选择商品分类：
          <el-cascader
            expand-trigger="hover"
            :options="catThreeList"
            v-model="catThreeSelected"
            :props="catThreeProps"
            @change="catThreeChange()"
            clearable
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- tabs标签切换 -->
      <el-tabs v-model="activeName" @tab-click="tabsClick()">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled="showButton">添加动态参数</el-button>
          <!--数据列表区域-->
          <el-table :data="manyParamList" border stripe style="width: 100%">
            <el-table-column type="expand" width="50">
              <template slot-scope="info">
                <el-tag v-for="(v,k) in info.row.attr_vals_arr" :key="k">{{v}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column type="index" label="序号" width="200"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作" width="200">
              <el-button type="primary" icon="el-icon-edit" size="mini">修改</el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态参数" name="only">
          <el-button type="primary" size="mini" :disabled="showButton">添加静态参数</el-button>
          <!--数据列表区域-->
          <el-table :data="onlyParamList" border stripe style="width: 100%">
            <el-table-column type="expand" width="50">
              <template slot-scope="info">
                <el-tag v-for="(v,k) in info.row.attr_vals_arr" :key="k">{{v}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column type="index" label="序号" width="200"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作" width="200">
              <el-button type="primary" icon="el-icon-edit" size="mini">修改</el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getCatThreeList()
  },
  methods: {
    // 专门 根据分类、参数类型 获得对应的参数列表数据
    // 1) 选取第3级别分类发生调用
    // 2) tabs标签切换后发生调用(条件是已经选择了第3级别分类)
    async getParamList() {
      const { data: dt } = await this.$http.get(
        `categories/${this.catThreeId}/attributes`,
        { params: { sel: this.activeName } }
      )
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }

      // 把参数可选值 由"字符串"变为"数组"格式另创建成员(attr_vals_arr)存储
      dt.data.forEach(item => {
        item.attr_vals_arr = item.attr_vals.split(' ')
      })
      // console.log(dt.data)
      // 把获得的参数信息赋予给manyParamList 或 onlyParamList成员
      if (this.activeName === 'many') {
        this.manyParamList = dt.data
      } else {
        this.onlyParamList = dt.data
      }
    },
    // tabs标签切换的回调处理
    tabsClick() {
      // 如果当前已经选取了第3级别分类，就立即获得对应参数列表
      if (this.catThreeId !== 0) {
        this.getParamList()
      }
    },
    // 3级别分类 之 级联选择器内容变化的回调处理
    catThreeChange() {
      // 感知当前选取的分类情况
      // console.log(this.catThreeSelected)
      var len = this.catThreeSelected.length
      if (len === 3) {
        // 正常选取第3级别分类了
        this.showButton = false // 按钮激活
        // 把第3级别分类的id获得到并赋予给 catThreeId 成员
        this.catThreeId = this.catThreeSelected[2]
        // 获得用于展示的参数列表
        this.getParamList()
      } else {
        // 非第3级别 分类选取处理
        this.showButton = true // 禁用按钮
        this.catThreeSelected = [] // 重置级联选择器
        this.catThreeId = 0 // 收回catThreeId
        // 收回获得好的"参数列表"数据
        this.manyParamList = []
        this.onlyParamList = []
      }
    },
    // 获得级联选择器需要的3级别分类信息
    async getCatThreeList() {
      const { data: dt } = await this.$http.get('categories', {
        params: { type: 3 }
      })
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }
      // 把获得好的分类数据赋予给catThreeList
      this.catThreeList = dt.data
    }
  },
  data() {
    return {
      // 动态参数接收成员
      manyParamList: [],
      // 静态参数接收成员
      onlyParamList: [],
      // 接收选取的第3级别分类的id信息
      catThreeId: 0,
      // 添加参数按钮激活标志
      showButton: true,
      // 给tabs标签定义激活项目("定义"和"获取"激活项目)
      activeName: 'only',
      // 接收3级别分类信息
      catThreeList: [],
      // 接收级联选择器的激活信息
      catThreeSelected: [],
      // 级联选择器属性定义
      catThreeProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.el-row {
  margin-top: 15px;
}
.el-tag {
  margin: 10px 5px;
}
</style>
