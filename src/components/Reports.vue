<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <!-- 图表 -->
      <!-- 为 ECharts 准备一个具备大小（宽高）的 DOM -->
      <div id="main" style="width: 600px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
import echarts from 'echarts'

export default {
  mounted() {
    this.initEcharts()
  },
  methods: {
    async initEcharts() {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById('main'))
      // 获取图表数据
      const res = await this.$http.get(`reports/type/1`)
      console.log(res)
      const option1 = res.data.data

      // 指定图表的配置项和数据
      var option2 = {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        }
      }
      //  ...
      // 1、es6语法
      // 2、展开操作运算符
      // 3、语法、容器
      // 4、...arr   ...obj
      // 5、...arr ->再该位置 把容器元素一一显示
      let options = { ...option1, ...option2 }
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(options)
    }
  },
  data() {
    return { }
  }
}
</script>

<style lang="less" scoped>
</style>
