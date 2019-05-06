<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <!--搜索区域-->
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!--数据列表区域-->
      <el-table :data="orderList" border scripe>
        <el-table-column type="index" width="70px"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price" width="90px"></el-table-column>
        <el-table-column label="是否付款" prop="order_pay" width="100px">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.order_pay=='是'">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send" width="100px"></el-table-column>
        <el-table-column label="下单时间" prop="create_time" width="200px">
          <template slot-scope="scope">
            <span>{{scope.row.create_time|dateFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140px">
          <template slot-scope="scope">
            <el-button icon="el-icon-edit" size="mini" type="primary" title="修改订单"></el-button>
            <el-button
              icon="el-icon-location"
              size="mini"
              type="success"
              title="查看物流信息"
              @click="showWuliuDialog"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--分页区域-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="5"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>

      <!--物流弹层区域-->
      <el-dialog title="物流信息" :visible.sync="wuliuDialogVisible" width="50%">
        <el-steps direction="vertical" :active="1">
          <el-step
            v-for="(item,i) in wuliuList"
            :key="i"
            :title="item.ftime"
            :description="item.context"
          ></el-step>
        </el-steps>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 订单列表数据
      orderList: [],
      // 获取订单列表条件对象
      queryInfo: {
        query: '', // 搜索名称
        pagenum: 1, // 当前页码
        pagesize: 5 // 每页显示条数
      },
      total: 0, // 订单总记录数目
      wuliuDialogVisible: false, // 默认不显示物流弹框
      wuliuList: [] // 物流列表对象
    }
  },
  created() {
    this.getOrderList()
  },
  // filters: {
  //   // 时间过滤器
  //   dateFormat(val) {
  //     var dt = new Date(val)
  //     var yy = dt.getFullYear()
  //     var mm = (dt.getMonth() + 1 + '').padStart(2, 0)
  //     var dd = (dt.getDate() + '').padStart(2, 0)

  //     var hh = (dt.getHours() + '').padStart(2, 0)
  //     var ii = (dt.getMinutes() + '').padStart(2, 0)
  //     var ss = (dt.getSeconds() + '').padStart(2, 0)
  //     return `${yy}-${mm}-${dd} ${hh}:${ii}:${ss}`
  //   }
  // },
  methods: {
    // 查看订单物流
    async showWuliuDialog() {
      // axios调用接口获得物流信息
      const { data: res } = await this.$http.get('kuaidi/81337523816')

      if (res.meta.status !== 200) {
        return this.$message({
          message: '获得物流列表失败！',
          type: 'error',
          duration: 1000
        })
      }

      this.wuliuList = res.data
      this.wuliuDialogVisible = true
    },

    // 分页页码信息变化回调
    handleSizeChange(val) {
      this.queryInfo.pagesize = val
      this.getOrderList()
    },

    // 分页每页条数变化回调
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val
      this.getOrderList()
    },

    // 获取订单数据列表
    async getOrderList() {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo
      })

      if (res.meta.status !== 200) {
        return this.$message({
          message: '获得订单列表失败！',
          type: 'error',
          duration: 1000
        })
      }
      this.total = res.data.total
      this.orderList = res.data.goods
    }
  }
}
</script>

<style lang="less" scoped>
</style>
