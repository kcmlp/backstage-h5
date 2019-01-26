<template>
  <div class="app-container">
    <!--创建类别-->
    <div class="filter-container">
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate">创建任务
      </el-button>
    </div>
    <!--列表-->
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row>
      <el-table-column
        :label="'序号'"
        align="center">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column
        :label="'编码'"
        align="center">
        <template slot-scope="scope">
          {{ scope.row.code }}
        </template>
      </el-table-column>
      <el-table-column
        :label="'名称'"
        align="center">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column
        :label="'描述'"
        align="center">
        <template slot-scope="scope">
          {{ scope.row.description }}
        </template>
      </el-table-column>
      <el-table-column
        :label="'奖励'"
        align="center">
        <template slot-scope="scope">
          {{ scope.row.award }}
        </template>
      </el-table-column>
      <el-table-column
        :label="'次数'"
        align="center">
        <template slot-scope="scope">
          {{ scope.row.times===0 ? '无限次' : scope.row.times }}
        </template>
      </el-table-column>
      <el-table-column
        :label="'是否每天'"
        align="center">
        <template slot-scope="scope">
          {{ scope.row.daily }}
        </template>
      </el-table-column>
      <el-table-column
        :label="'排序'"
        align="center">
        <template slot-scope="scope">
          {{ scope.row.sort }}
        </template>
      </el-table-column>
      <el-table-column
        :label="'类型'"
        align="center">
        <template slot-scope="scope">
          {{ scope.row.buttonType }}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="200"
        class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="handleUpdate(scope.row)"> 编辑
          </el-button>
          <el-button
            type="danger"
            size="mini"
            @click="handleDelete(scope.row)"> 删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--Dialog-->
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width: 400px;
        margin-left:50px;">
        <el-form-item
          :label="'编码'"
          prop="code">
          <el-input
            :disabled="dialogStatus==='create'?false:true"
            v-model="temp.code"/>
        </el-form-item>
        <el-form-item
          :label="'名称'"
          prop="name">
          <el-input v-model="temp.name"/>
        </el-form-item>
        <el-form-item
          :label="'描述'"
          prop="description">
          <el-input v-model="temp.description" />
        </el-form-item>
        <el-form-item
          :label="'奖励'"
          prop="award">
          <el-input
            v-model="temp.award"
            type="number" />
        </el-form-item>
        <el-form-item
          :label="'次数'"
          prop="times">
          <el-input
            v-model="temp.times"
            type="number"/>
        </el-form-item>
        <el-form-item
          :label="'是否每天'"
          prop="daily">
          <el-switch
            v-model="temp.daily"/>
        </el-form-item>
        <el-form-item
          :label="'排序'"
          prop="sort">
          <el-input
            v-model="temp.sort"
            type="number"/>
        </el-form-item>
        <el-form-item
          :label="'类型'"
          prop="buttonType">
          <el-input
            v-model="temp.buttonType"
            type="number"/>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click="dialogStatus==='create'?createData():updateData()">确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { getDatas, addData, updateData, deleteData } from '@/api/task'
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  import { Message, MessageBox } from 'element-ui'

  export default {
    components: { Pagination },
    data() {
      return {
        list: null,
        listLoading: true,
        //dialog
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: '编辑',
          create: '创建'
        },
        temp: {
          code: undefined,
          name: undefined,
          description: undefined,
          award: undefined,
          times: undefined,
          daily: false,
          sort: undefined,
          buttonType: undefined
        },
        rules: {
          code: [{ required: true, message: 'code is required', trigger: 'blur' }],
          name: [{ required: true, message: 'name is required', trigger: 'blur' }],
          description: [{ required: true, message: 'description is required', trigger: 'blur' }],
          award: [{ required: true, message: 'award is required', trigger: 'blur' }],
          times: [{ required: true, message: 'times is required', trigger: 'blur' }],
          daily: [{ required: true, message: 'daily is required', trigger: 'blur' }],
          sort: [{ required: true, message: 'sort is required', trigger: 'blur' }],
          buttonType: [{ required: true, message: 'buttonType is required', trigger: 'blur' }]
        }
      }
    },
    created() {
      this.getDatas()
    },
    methods: {
      getDatas() {
        this.listLoading = true
        getDatas().then(response => {
          this.list = response.datas
          this.listLoading = false
        })
      },
      resetTemp() {
        this.temp = {
          code: undefined,
          name: undefined,
          description: undefined,
          award: undefined,
          times: undefined,
          daily: false,
          sort: undefined,
          buttonType: undefined
        }
      },
      handleCreate() {
        this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            addData(this.temp).then(() => {
              this.dialogFormVisible = false
              this.getDatas()
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
            })
          }
        })
      },
      handleUpdate(row) {
        this.temp = Object.assign({}, row)
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            updateData(this.temp).then(() => {
              for (const v of this.list) {
                if (v.code === this.temp.code) {
                  const index = this.list.indexOf(v)
                  this.list.splice(index, 1, this.temp)
                  break
                }
              }
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '更新成功',
                type: 'success',
                duration: 2000
              })
            })
          }
        })
      },
      handleDelete(row) {
        MessageBox.confirm(
          '是否删除',
          '提示',
          {
            confirmButtonText: '确认',
            cancelButtonText: '取消'
          }
        ).then(() => {
          deleteData(row.code).then(() => {
            for (let i = 0; i < this.list.length; i++) {
              if (this.list[i].code === row.code) {
                this.list.splice(i, 1)
                break
              }
            }
            Message({
              message: '删除成功',
              type: 'success',
              duration: 5 * 1000
            })
          })
        })
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
</style>
