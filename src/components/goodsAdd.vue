
<template>
  <div>
    <!-- 面包屑 -->
    <!-- <com-crumb nm="商品"></com-crumb> -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 容器el-card -->
    <el-card class="card">
      <!-- 消息提示 -->
      <el-alert title="添加商品" type="info" center show-icon></el-alert>

      <!-- 步骤条 -->
      <!--
        基本信息
        商品参数
        商品属性
        商品图片
        商品内容

      -->
      <el-steps :active="activeName-1" align-center class="step">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <el-form :model="formGoodsAdd" label-width="80px" :rules="addFormRules">
        <!-- tabs+表单
        商品名称
        商品价格
        商品重量
        商品数量
        商品分类

        -->
        <el-tabs
          tab-position="left"
          v-model="activeName"
         
          @tab-click="handleClick"
        >
          <el-tab-pane name="1" label="基本信息">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="formGoodsAdd.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input type="number" v-model="formGoodsAdd.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input type="number" v-model="formGoodsAdd.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input type="number" v-model="formGoodsAdd.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              {{seleOption}}
              <el-cascader
                expand-trigger="hover"
                :options="catList"
                v-model="seleOption"
                :props="catProps"
                @change="catChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane name="2" label="商品参数">
            <el-form-item :label="item1.attr_name" v-for="(item1,i) in manyParams" :key="i">
              <el-checkbox-group v-model="item1.attr_vals">
                <el-checkbox border :label="item2" v-for="(item2,j) in item1.attr_vals" :key="j"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane name="3" label="商品属性">
            <el-form-item
              :label="item.attr_name"
              v-for="(item,i) in onlyParams"
              :key="i"
              label-width="150px"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane name="4" label="商品图片">
            <!--

              1. 之前axios发送请求->配置axios里面的baseUrl
            图片上传的请求不是axios发送的,所以action的值需要写全路径
            2. 之前axios的请求拦截器设置请求头->进行token授权
            图片上传的请求不是axios,所以需要设置图片上传请求的请求头
            -->
            <el-upload
              action="http://127.0.0.1:11333/api/private/v1/upload"
              :headers="headers"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane name="5" label="商品内容">
            <!-- 富文本 -->
            <quill-editor class="editor" v-model="formGoodsAdd.goods_introduce"></quill-editor>

            <!-- 按钮 -->
            <el-button type="primary" @click="addGoods">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'

export default {
  components: {
    //  <quill-editor>
    quillEditor
  },

  data() {
    return {
      activeName: '1',

      /*
         goods_name     	商品名称                    	不能为空
         goods_price    	价格                      	不能为空
         goods_weight   	重量                      	不能为空
         goods_number   	数量                      	不能为空
         goods_cat      	以为','分割的分类列表            	不能为空

         goods_introduce	介绍                      	可以为空
         pics           	上传的图片临时路径（对象）           	可以为空
         attrs          	商品的参数（数组），包含 动态参数 和 静态属性	可以为空

      */
      formGoodsAdd: {
        goods_name: '',
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        goods_introduce: '',

        goods_cat: '',
        pics: [],
        attrs: []
      },
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选取商品分类', trigger: 'blur' }
        ]
      },
      // 级联的相关数据
      catList: [],
      // 级联三级分类项目参数
      catProps: {
        value: 'cat_id',
        label: 'cat_name'
      },
      seleOption: [],
      // 动态参数数据
      manyParams: [],
      // 静态参数数据
      onlyParams: [],
      threeCatId: '',
      headers: {
        // var token = window.sessionStorage.getItem('token')
        // config.headers.Authorization = token
        Authorization: window.sessionStorage.getItem('token')
      }
    }
  },
  created() {
    this.getCatList()
  },
  methods: {
    // 添加商品
    async addGoods() {
      // 1. 准备请求体数据formGoodsAdd
      // goods_cat 商品分类 -> 商品分类的id所在的数组->字符串
      this.formGoodsAdd.goods_cat = this.seleOption.join(',')

      // pics: '',商品图片 -> [{pic:临时路径}]

      // attrs: '' 商品参数 -> [{attr_id:?,attr_value:?}]

      // 动态数组
      this.manyParams.forEach((item, i) => {
        if (item.attr_vals.length > 0) {
          let obj = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(',')
          }
          this.formGoodsAdd.attrs.push(obj)
        }
      })

      // 静态数组

      this.onlyParams.forEach((item, i) => {
        if (item.attr_vals.length > 0) {
          let obj = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.formGoodsAdd.attrs.push(obj)
        }
      })

      // console.log(this.formGoodsAdd.attrs)

      // 2. 发送post请求 -> 请求体
      const { data } = await this.$http.post(`goods`, this.formGoodsAdd)
      if (data.meta.status !== 201) {
        // 提示
        return this.$message({
          message: res.meta.msg,
          type: 'error',
          duration: 1500
        })
      }
      // 回到列表->改变页面的内容->改变组件->1.router-link 2.js编程式导航
      this.$router.push('/goods')
    },
    // 图片上传的三个方法
    handlePreview(file) {},

    handleRemove(file) {
      const tmp_path = file.response.data.tmp_path
      const index = this.formGoodsAdd.pics.findIndex((item, i) => {
        return item.pic === tmp_path
      })
      this.formGoodsAdd.pics.splice(index, 1)
    },

    handleSuccess(response) {
      const tmp_path = response.data.tmp_path
      this.formGoodsAdd.pics.push({
        pic: tmp_path
      })
    },

    // tab选中
    async handleClick() {
      // 获取动态参数数据
      if (this.activeName === '2') {
        const { data: res } = await this.$http.get(
          `categories/${this.threeCatId}/attributes`,
          {
            params: {
              sel: 'many'
            }
          }
        )

        if (res.meta.status !== 200) {
          return this.$message({
            message: '获取商品参数失败',
            type: 'error',
            duration: 1500
          })
        }

        // 处理动态参数数组中的attr_vals
        res.data.forEach((item, i) => {
          item.attr_vals = item.attr_vals.split(',')
          // console.log(item.attr_vals)
        })
        this.manyParams = res.data
        console.log(this.manyParams)
      }

      // 获取静态参数的数据
      if (this.activeName === '3') {
        // 判断点击了“商品属性”标签，就获取对应的属性信息
        const { data: res } = await this.$http.get(
          `categories/${this.threeCatId}/attributes`,
          {
            params: {
              sel: 'only'
            }
          }
        )

        if (res.meta.status !== 200) {
          return this.$message({
            message: '获取商品属性失败',
            type: 'error',
            duration: 1500
          })
        }
        // console.log(res)
        this.onlyParams = res.data
        console.log(this.onlyParams)
      }
    },
    // tab生效之前的函数
    beforeTab(activeName, oldActiveName) {
      // console.log(activeName, oldActiveName)

      if (oldActiveName === '1' && this.seleOption.length !== 3) {
        // 提示框:提示选择三级分类
        this.$message({
          message: '请选取第三级商品分类',
          type: 'error',
          duration: 1500
        })
        return false
      }
    },
    // 获取三级分类的数据
    async getCatList() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 3 }
      })

      if (res.meta.status !== 200) {
        return this.$message({
          message: '三级商品分类获取失败',
          type: 'error',
          duration: 1500
        })
      }

      this.catList = res.data
      // console.log(this.catList)
    },
    catChange() {
      // console.log('选项改变啦!好开心!')
      this.threeCatId = this.seleOption[2]
    }
  }
}
</script>

<style>
.card {
  margin-top: 15px;
}
.step {
  margin-top: 15px;
}
.ql-editor,
.ql-blank {
  min-height: 200px;
}
</style>
