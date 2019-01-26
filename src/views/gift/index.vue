<template>
  <div class="app-container">
    <!--创建类别-->
    <div class="filter-container">
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate">创建礼物
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
        width="100"
        align="center">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
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
        label="图片"
        align="center" >
        <template slot-scope="scope">
          <img
            :src="scope.row.photoUrl"
            height="72">
        </template>
      </el-table-column>
      <el-table-column
        :label="'价格'"
        align="center">
        <template slot-scope="scope">
          {{ scope.row.price }}
        </template>
      </el-table-column>
      <el-table-column
        :label="'单位'"
        align="center">
        <template slot-scope="scope">
          {{ scope.row.unit }}
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
        <template
          slot-scope="scope">
          {{ scope.row.giftType === 1 ? '金币': scope.row.giftType === 2 ? '钻石': '' }}
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
          :label="'名称'"
          prop="name">
          <el-input v-model="temp.name"/>
        </el-form-item>
        <el-form-item
          :label="'图片'"
          prop="photoUrl">
          <el-input v-model="temp.photoUrl" />
        </el-form-item>
        <el-form-item
          :label="'价格'"
          prop="price">
          <el-input
            v-model="temp.price"
            type="number" />
        </el-form-item>
        <el-form-item
          :label="'排序'"
          prop="sort">
          <el-input
            v-model="temp.sort"
            type="number"/>
        </el-form-item>
        <el-form-item
          :label="'单位'"
          prop="unit">
          <el-input
            v-model="temp.unit"/>
        </el-form-item>
        <el-form-item
          :label="'类型'"
          prop="giftType">
          <el-select
            v-model="temp.giftType"
            placeholder="请选择">
            <el-option
              v-for="item in giftTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
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
  import { getDatas, addData, updateData, deleteData } from '@/api/gift'
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
          giftType: undefined,
          id: undefined,
          name: undefined,
          photoUrl: undefined,
          price: undefined,
          sort: undefined,
          unit: undefined,
          deleted:false
        },
        rules: {
          giftType: [{ required: true, message: 'giftType is required', trigger: 'blur' }],
          id: [{ required: true, message: 'id is required', trigger: 'blur' }],
          name: [{ required: true, message: 'name is required', trigger: 'blur' }],
          photoUrl: [{ required: true, message: 'photoUrl is required', trigger: 'blur' }],
          price: [{ required: true, message: 'price is required', trigger: 'blur' }],
          sort: [{ required: true, message: 'sort is required', trigger: 'blur' }],
          unit: [{ required: true, message: 'unit is required', trigger: 'blur' }]
        },
        giftTypes: [{
          value: 1,
          label: '金币'
        }, {
          value: 2,
          label: '钻石'
        }]
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
          giftType: undefined,
          id: undefined,
          name: undefined,
          photoUrl: undefined,
          price: undefined,
          sort: undefined,
          unit: undefined,
          deleted:false
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
                if (v.id === this.temp.id) {
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
          deleteData(row.id).then(() => {
            for (let i = 0; i < this.list.length; i++) {
              if (this.list[i].id === row.id) {
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
