<template>
  <div style="width:100%;height:100%;background:#efefef;">
    <el-form 
      ref="ruleForm" 
      :model="ruleForm" 
      :rules="rules" 
      label-width="130px" 
      class="ruleForms">
      <el-form-item 
        label="昵称" >
        <el-input 
          v-model="ruleForm.title" 
          :placeholder="this.$route.query.nickName"
        />
      </el-form-item>
      <el-form-item 
        ref="imgruleForm" 
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
      <el-form-item 
        label="手机" 
        prop="phone">
        <el-input 
          v-model="ruleForm.phone" 
          :placeholder="this.$route.query.mobile"
          :disabled="true"/>
      </el-form-item>
      <el-form-item>
        <el-button 
          type="primary" 
          @click="submitForm('ruleForm', uid, photoUrl, nickName)">立即更新</el-button>
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
import { getOssBulkInfo, updateAddArticle } from '@/api/article'
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
      newtitle:'',
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
  watch:{
    newtitle(){
      // console.log(val)
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
    addArticle() {
      // console.log(999999999999,this.croppa.generateDataUrl())
      const ossPhotoArr = []

          const params = {}
          // title
          params.uid = this.uid
          params.photoUrl = this.photoUrl
          params.nickName = !this.ruleForm.title ? this.nickName : this.ruleForm.title
                // 上传图片给  params.photoUrl 重新赋值
      // this.$refs.imgruleForm.validate((valid) => {
      if(this.croppa.generateDataUrl()) {
        // console.log()
        // if (valid) {
                  // cover
          const photo = {}
          photo.key = getOssKey()
          this.newphotoKey = getOssKey()

          photo.blog = this.ruleForm.cover
          this.photoBlog = this.ruleForm.cover
          
          ossPhotoArr.push(photo)
          // console.log('photo.key',photo.key)
          // console.log('this.photoUrl',this.photoUrl)
          params.photoUrl = photo.key 
      }

          updateAddArticle(params).then( () => {
            // console.log(000,photo.key)
            // console.log(111,photo.blog)
            // uid: 用户id
            // nickName : 礼物id
            // photoUrl : 礼物数量
            // console.log('response success!')
            const client = new OSS({
              secure: true,
              endpoint: this.ossBulkInfo.region,
              accessKeyId: this.ossBulkInfo.accessKeyId,
              accessKeySecret: this.ossBulkInfo.accessKeySecret,
              stsToken: this.ossBulkInfo.securityToken,
              bucket: this.ossBulkInfo.bulkName
            })
            // 昵称是否输入 
            // if(this.ruleForm.title ==''){
            //     router.push({ path: '/article/list' })
            //     Message({
            //       message: '没有修改内容',
            //       type: 'success',
            //       duration: 5 * 1000
            //     })                
            // }          
            // async function putBlob() { 
              // console.log(0000000,photo.key)
              // try {
                client.put(this.newphotoKey , this.photoBlog)
                router.push({ path: '/article/list' })
                Message({
                  message: '修改用户信息成功',
                  type: 'success',
                  duration: 5 * 1000
                })
              // } catch (e) {
              //   // console.log(e)
              //   router.push({ path: '/article/list' })
              //   Message({
              //     message: '没有修改头像',
              //     type: 'success',
              //     duration: 5 * 1000
              //   })
              // }
             
            // }
            // putBlob()
          })
    },
    // 图片 验证是否有
    generateCoverBlob(formName) {
      this.croppa.generateBlob((blob) => {
        // console.log('generateBlob')
        this.ruleForm.cover = blob
        // console.log(this.ruleForm.cover)
        this.addArticle(formName)
      }, 'image/jpeg', 1)
      // this.$router.push({ path: '/article/list' })
    },
    submitForm(formName) {
      this.generateCoverBlob(formName)
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
.el-form-item.is-required .el-form-item__label:before {
    content: '';
    color: #f56c6c;
    margin-right: 4px;
}
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
.icon-remove{
  width:20px;
  height:20px;
}
</style>
