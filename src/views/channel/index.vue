<template>
  <div class="app-container">
    <!--创建类别-->
    <div class="filter-container">
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate">创建频道
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
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column
        :label="'显示顺序'"
        align="center">
        <template slot-scope="scope">
          {{ scope.row.showIndex }}
        </template>
      </el-table-column>
      <el-table-column
        :label="'显示名称'"
        align="center">
        <template slot-scope="scope">
          {{ scope.row.caption }}
        </template>
      </el-table-column>
      <el-table-column
        :label="'类别'"
        align="center">
        <template slot-scope="scope">
          {{ scope.row.category }}
        </template>
      </el-table-column>
      <el-table-column
        :label="'是否显示'"
        align="center">
        <template slot-scope="scope">
          {{ scope.row.status }}
        </template>
      </el-table-column>
      <el-table-column
        :label="'创建人'"
        align="center">
        <template slot-scope="scope">
          {{ scope.row.createBy }}
        </template>
      </el-table-column>
      <el-table-column
        :label="'创建时间'"
        align="center">
        <template slot-scope="scope">
          {{ scope.row.createdAt }}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="handleUpdate(scope.row)"> 编辑
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
          :label="'显示顺序'"
          prop="showIndex">
          <el-input v-model="temp.showIndex"/>
        </el-form-item>
        <el-form-item
          :label="'显示名称'"
          prop="caption">
          <el-input v-model="temp.caption"/>
        </el-form-item>
        <el-form-item
          :label="'类别'"
          prop="category">
          <el-input
            :disabled="dialogStatus==='create'?false:true"
            v-model="temp.category" />
        </el-form-item>
        <el-form-item
          :label="'是否显示'">
          <el-switch
            v-model="temp.status"/>
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
  import { getChannel, saveChannel } from '@/api/channel'
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

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
          id: undefined,
          caption: '',
          showIndex: undefined,
          category: '',
          status: false
        },
        rules: {
          caption: [{ required: true, message: 'title is required', trigger: 'blur' }],
          category: [{ required: true, message: 'title is required', trigger: 'blur' }],
          showIndex: [{ required: true, message: 'title is required', trigger: 'blur' }]
        }
      }
    },
    created() {
      this.getChannel()
    },
    methods: {
      getChannel() {
        this.listLoading = true
        getChannel().then(response => {
          this.list = response.datas.list
          this.listLoading = false
        })
      },
      resetTemp() {
        this.temp = {
          id: undefined,
          caption: '',
          showIndex: undefined,
          category: '',
          status: false
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
            saveChannel(this.temp).then(() => {
              this.dialogFormVisible = false
              this.getChannel()
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
            saveChannel(this.temp).then(() => {
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
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
</style>
