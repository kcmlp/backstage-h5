<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select
        v-model="selectParentUid"
        class="filter-item"
        filterable
        placeholder="请选择一个手机号码"
        @change="changeSelectParent">
        <el-option
          v-for="item in parentUserList"
          :key="item.uid"
          :label="item.mobile"
          :value="item.uid"/>
      </el-select>

      <el-select
        v-model="associatedSccounts"
        class="filter-item"
        multiple
        filterable
        allow-create
        style="width: 500px"
        placeholder="请选择要关联的子账号">
        <el-option
          v-for="item in sonUserList"
          :key="item.uid"
          :label="item.mobile"
          :value="item.uid"/>
      </el-select>

      <el-button
        type="primary"
        class="filter-item"
        @click="doUserSon"> 绑定
      </el-button>
    </div>
    <!--列表-->
    <el-table
      v-loading="listLoading"
      :data="parentSonUserList"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row>
      <el-table-column
        :label="'序号'"
        width="100px"
        align="center">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column
        :label="'UID'"
        align="center">
        <template slot-scope="scope">
          {{ scope.row.uid }}
        </template>
      </el-table-column>
      <el-table-column
        :label="'手机号'"
        align="center">
        <template slot-scope="scope">
          {{ scope.row.mobile }}
        </template>
      </el-table-column>
      <el-table-column
        :label="'昵称'"
        align="center">
        <template slot-scope="scope">
          {{ scope.row.nickName }}
        </template>
      </el-table-column>
      <el-table-column
        :label="'简介'"
        align="center">
        <template slot-scope="scope">
          {{ scope.row.userDesc }}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="150px"
        class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            type="danger"
            size="mini"
            @click="deleteSonUser(scope.row)"> 删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import { getParentUser, getParentSonUser, getSonUser, doUserSon, deleteSonUser } from '@/api/binding.js'

  export default {
    data() {
      return {
        listLoading: false,
        selectParentUid: null,
        associatedSccounts: [],
        parentUserList: [],
        parentSonUserList: [],
        sonUserList: []
      }
    },
    created() {
      this.getParentUser()
    },
    methods: {
      getParentUser() {
        getParentUser().then(response => {
          this.parentUserList = response.datas
          this.getSonUser()
        })
      },
      getSonUser() {
        getSonUser().then(response => {
          this.sonUserList = response.datas
        })
      },
      changeSelectParent() {
        this.listLoading = true
        getParentSonUser(this.selectParentUid).then(response => {
          this.parentSonUserList = response.datas
          this.listLoading = false
        })
      },
      doUserSon() {
        const data = {}
        data.parentId = this.selectParentUid
        data.uids = ''
        for (let i = 0; i < this.associatedSccounts.length; i++) {
          if (i == 0) {
            data.uids = this.associatedSccounts[i]
          } else {
            data.uids = data.uids + ',' + this.associatedSccounts[i]
          }
        }
        doUserSon(data).then(response => {
          if (response.datas > 0) {
            this.associatedSccounts = []
            getParentSonUser(this.selectParentUid).then(response => {
              this.parentSonUserList = response.datas
              this.$notify({
                title: '成功',
                message: '绑定成功',
                type: 'success',
                duration: 2000
              })
            })
          }
        })
      },
      deleteSonUser(row) {
        deleteSonUser(row.uid).then(response => {
          if (response.datas > 0) {
            getParentSonUser(this.selectParentUid).then(response => {
              this.parentSonUserList = response.datas
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success',
                duration: 2000
              })
            })
          }
        })
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
</style>
