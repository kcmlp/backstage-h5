<template>
  <div
    v-loading="listLoading"
    style="width: 800px;margin: 12px">
    <json-editor
      ref="jsonEditor"
      v-model="value"/>
    <el-button
      type="primary"
      style="margin: 12px;float: right"
      @click="saveVersion()">
      提交
    </el-button>
  </div>

</template>

<script>
  import JsonEditor from '@/components/JsonEditor'
  import { getAppVersion, saveVersion } from '@/api/version'

  export default {
    name: 'JsonEditorDemo',
    components: { JsonEditor },
    data() {
      return {
        value: {},
        listLoading: true,
      }
    },
    created() {
      this.getAppVersion()
    },
    methods: {
      getAppVersion() {
        this.listLoading = true
        getAppVersion().then(response => {
          this.value = JSON.parse(response.datas)
          this.listLoading = false
        })
      },
      saveVersion() {
        saveVersion(this.$refs['jsonEditor'].getValue()).then(() => {
          this.$notify({
            title: '成功',
            message: '更新成功',
            type: 'success',
            duration: 2000
          })
        })
      }
    }
  }
</script>

<style scoped>

</style>
