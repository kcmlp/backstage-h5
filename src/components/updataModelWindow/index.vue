<template>
<div style='width:100%;height:100%;background:#efefef;'>
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="130px" class="ruleForms">
      <el-form-item label="昵称" prop="title">
        <el-input v-model="ruleForm.title" :placeholder="this.$route.query.nickName"/>
      </el-form-item>
      <el-form-item class="coverFormItem" label="头像" prop="cover">
        <croppa
          v-model="croppa"
          :show-remove-button="true"
          :width="100"
          :height="100"
          :placeholder-font-size="14"
          :prevent-white-space="true"
          placeholder="点击上传"/>
      </el-form-item>
      <el-form-item label="手机" prop="phone">
        <el-input v-model="ruleForm.phone" :placeholder="this.$route.query.mobile"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm', uid, photoUrl, nickName)">立即更新</el-button>
        <!-- <el-button @click="resetForm('ruleForm')">重置</el-button> -->
        <!-- <el-button @click="addImageBtn">添加图片</el-button>-->
        <input
          id="addImageInput"
          type="file"
          accept="image/png,image/jpeg,image/gif,image/jpg"
          style="filter:alpha(opacity=0);opacity:0;width: 1px;height: 1px;"
          @change="addImageInputClick">
      </el-form-item>
    </el-form>
</div>  
</template>
<script>
// import store from '@/store'
import router from '@/router/index'
import OSS from 'ali-oss'
import { getOssBulkInfo, addArticle, updateAddArticle } from '@/api/article'
import { getOssKey } from '@/utils/index'
import { Message } from 'element-ui'
// import { VueEditor } from 'vue2-editor'this.$route.query.uid, this.$route.query.photoUrl, this.$route.query.nickName
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
      uid: this.$route.query.uid,
      photoUrl: this.$route.query.photoUrl,
      nickName: this.$route.query.nickName,
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
          params.uid = this.uid
          params.photoUrl = this.photoUrl
          params.nickName = this.nickName
          // cover
          const photo = {}
          photo.key = getOssKey()
          photo.blog = this.ruleForm.cover
          ossPhotoArr.push(photo)
          params.photoUrl = photo.key
          // this.generateCoverBlob(formName)
          // console.log(uid, photoUrl, nickName)
          // const params = {}
          // params.uid = uid
          // params.photoUrl = photoUrl
          // params.nickName = nickName
          // updateAddArticle(params).then(response => {
          // })   
          // contentList
          // params.contentList = []
          // if (this.content !== null || this.content !== undefined || this.content !== '') {
          //   const con = {}
          //   con.t = 0
          //   con.v = '[MQL_RichMedia]' + this.content
          //   params.contentList.push(con)
          // }
          // addArticle response
          updateAddArticle(params).then(response => {
            // console.log('response success!')
            // const client = new OSS({
            //   secure: true,
            //   endpoint: this.ossBulkInfo.region,
            //   accessKeyId: this.ossBulkInfo.accessKeyId,
            //   accessKeySecret: this.ossBulkInfo.accessKeySecret,
            //   stsToken: this.ossBulkInfo.securityToken,
            //   bucket: this.ossBulkInfo.bulkName
            // })
            // async function putBlob() {
            //   try {
            //     await client.put(photo.key, photo.blog)
            //     // console.log(result)
            //     const params = {}
            //     params.artKey = response.datas.artKey
            //     params.artId = response.datas.id
            //     updateArticleStatus(params).then(response => {
            router.push({ path: '/article/list' })
            Message({
              message: '修改用户信息成功',
              type: 'success',
              duration: 5 * 1000
            })
          // })
            //   } catch (e) {
            //     // console.log(e)
            //   }
            // }
            // putBlob()
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
      // this.$router.push({ path: '/article/list' })
    },
    submitForm(formName, uid, photoUrl, nickName) {
      this.generateCoverBlob(formName)
    },
    // resetForm(formName) {
    //   this.$refs[formName].resetFields()
    //   this.croppa.remove()
    //   this.content = ''
    // },
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
      document.getElementById('addImageInput').click()
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.ruleForms{
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
  width: 800px;
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
</style>
