<template>
  <el-form 
    ref="ruleForm" 
    :model="ruleForm" 
    :rules="rules" 
    label-width="130px" 
    class="ruleForm">
    <div class="clearfix" >
      <div style="float:left;width:600px;">
        <el-form-item 
          label="昵称" 
          prop="title">
          <el-input 
            v-model="ruleForm.title" 
            placeholder="请输入昵称"/>
        </el-form-item>
        <el-form-item 
          label="手机" 
          prop="phone">
          <el-input 
            v-model="ruleForm.phone" 
            placeholder="请输入手机号"/>
        </el-form-item>
      </div>
      <div style="float:left;">
        <el-form-item 
          class="coverFormItem" 
          label="头像" 
          prop="cover">
          <croppa
            v-model="croppa"
            :show-remove-button="true"
            :width="100"
            :height="100"
            :placeholder-font-size="14"
            :prevent-white-space="true"
            placeholder="点击上传"/>
        </el-form-item>
      </div> 
    </div>   
    <!-- <el-form-item label="文章内容" >
      <vue-editor
        id="editor"
        v-model="content"
        :editor-toolbar="customVueEditor"
        use-custom-image-handler
        @imageAdded="handleImageAdded" />
    </el-form-item> -->
    <el-form-item>
      <el-button 
        type="success" 
        @click="addImageBtn">搜索</el-button>
      <el-button 
        type="primary" 
        @click="submitForm('ruleForm')">立即创建</el-button>
      <el-button 
        type="danger" 
        @click="resetForm('ruleForm')">重置</el-button>
      <input
        id="addImageInput"
        type="file"
        accept="image/png,image/jpeg,image/gif,image/jpg"
        style="filter:alpha(opacity=0);opacity:0;width: 1px;height: 1px;"
        @change="addImageInputClick">
    </el-form-item>
  </el-form>
</template>
<script>
// import store from '@/store'
// import router from '@/router/index'
import OSS from 'ali-oss'
import { getOssBulkInfo, addArticle } from '@/api/article'
import { getOssKey } from '@/utils/index'
import { Message } from 'element-ui'
// import { VueEditor } from 'vue2-editor'
import 'vue-croppa/dist/vue-croppa.css'
import Vue from 'vue'
import Croppa from 'vue-croppa'

Vue.component('croppa', Croppa.component)
let vm
export default {
  // components: {
  //   VueEditor
  // },
  data() {
    return {
      ruleForm: {
        title: '',
        cover: '',
        phone: ''
      },
      rules: {
        title: [
          { required: true, message: '请输入昵称', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在1 到 20 个字符', trigger: 'blur' }
        ],
        cover: [
          { required: true, message: '请选择图片', trigger: 'blur' }
        ]
      },
      ossBulkInfo: null,
      content: '',
      customVueEditor: [
        ['image']
      ],
      croppa: {}
    }
  },
  created() {
    vm = this
    this.getOssBulkInfo()
  },
  methods: {
    getOssBulkInfo() {
      getOssBulkInfo().then(response => {
        this.ossBulkInfo = response.datas.ossBulkInfo
      })
    },
    addArticle(formName) {
      const ossPhotoArr = []
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {}
          // title
          // params.title = this.ruleForm.title
          params.nickName = this.ruleForm.title
          params.mobile = this.ruleForm.phone
          // cover
          const photo = {}
          photo.key = getOssKey()
          photo.blog = this.ruleForm.cover
          ossPhotoArr.push(photo)
          params.photoUrl = photo.key
          // contentList
          // params.contentList = []
          // if (this.content !== null || this.content !== undefined || this.content !== '') {
          //   const con = {}
          //   con.t = 0
          //   con.v = '[MQL_RichMedia]' + this.content
          //   params.contentList.push(con)
          // }
          // addArticle response
          addArticle(params).then(response => {
            // console.log('response success!')
            const client = new OSS({
              secure: true,
              endpoint: this.ossBulkInfo.region,
              accessKeyId: this.ossBulkInfo.accessKeyId,
              accessKeySecret: this.ossBulkInfo.accessKeySecret,
              stsToken: this.ossBulkInfo.securityToken,
              bucket: this.ossBulkInfo.bulkName
            })
            async function putBlob() {
              try {
                await client.put(photo.key, photo.blog)
                // console.log(result)
                // const params = {}
                // params.artKey = response.datas.artKey
                // params.artId = response.datas.id
                // updateArticleStatus(params).then(response => {
                // router.push({ path: '/article/list' })
                Message({
                  message: '创建用户成功',
                  type: 'success',
                  duration: 2 * 1000
                })
                // this.resetForm()
                // this.$refs.ruleForm.resetFields()
                // this.croppa.remove()
                // this.ruleForm.phone = ''               
                // })
              } catch (e) {
                // console.log(e)
              }
            }
            putBlob()
            this.$emit('pagination', { page: 0, limit: 10 })
            this.$refs[formName].resetFields()
            this.croppa.remove()
            this.ruleForm.phone = ''
          })
        } else {
          // console.log('error submit!!')
          return false
        }
      })
    },
    generateCoverBlob(formName) {
      this.croppa.generateBlob((blob) => {
        // console.log('generateBlob')
        this.ruleForm.cover = blob
        // console.log(this.ruleForm.cover)
        this.addArticle(formName)
      }, 'image/jpeg', 1)
    },
    submitForm(formName) {
      console.log('formName', formName)
      // cover
      this.generateCoverBlob(formName)
    },
    resetForm(formName) {
      console.log('formName', formName)
      this.$refs[formName].resetFields()
      this.croppa.remove()
      this.ruleForm.phone = ''
    },
    handleImageAdded: function(file, Editor, cursorLocation, resetUploader) {
      // console.log('handleImageAdded')
      // console.log(this.ossBulkInfo)
      const client = new OSS({
        secure: true,
        endpoint: this.ossBulkInfo.region,
        accessKeyId: this.ossBulkInfo.accessKeyId,
        accessKeySecret: this.ossBulkInfo.accessKeySecret,
        stsToken: this.ossBulkInfo.securityToken,
        bucket: this.ossBulkInfo.bulkName
      })
      async function putBlob() {
        try {
          const key = getOssKey()
          const result = await client.put(key, file)
          // console.log(result)
          Editor.insertEmbed(cursorLocation, 'image', result.url)
          // console.log(vm.content)
        } catch (e) {
          // console.log(e)
          Message({
            message: '图片添加失败',
            type: 'error',
            duration: 5 * 1000
          })
        }
      }
      putBlob()
    },
    addImageInputClick() {
      const imageFile = document.getElementById('addImageInput').files[0]
      // console.log(imageFile)
      const client = new OSS({
        secure: true,
        endpoint: this.ossBulkInfo.region,
        accessKeyId: this.ossBulkInfo.accessKeyId,
        accessKeySecret: this.ossBulkInfo.accessKeySecret,
        stsToken: this.ossBulkInfo.securityToken,
        bucket: this.ossBulkInfo.bulkName
      })
      async function putBlob() {
        try {
          const key = getOssKey()
          const result = await client.put(key, imageFile)
          // console.log(result)
          vm.content = vm.content + '<p><img src= "' + result.url + '"></p>'
          // console.log(vm.content)
        } catch (e) {
          // console.log(e)
          Message({
            message: '图片添加失败',
            type: 'error',
            duration: 5 * 1000
          })
        }
      }
      putBlob()
    },
    addImageBtn() {
      this.$emit('test1', {paga:123})
      // this.$emit('pagination', { page: 0, limit: 10 })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.ruleForm{
  width: 840px;
}
.clearfix:after {
    visibility: hidden;
    display: block;
    font-size: 0;
    content: " ";
    clear: both;
    height: 0;
}
.coverFormItem .el-form-item__content {
  line-height: 0px;
  position: relative;
  font-size: 14px;
}
.croppa-container{
  background-color: #ffffff;
  border:1px solid #dcdcdc;
}
.icon-remove{
  width:20px;
  height:20px;
}
</style>
