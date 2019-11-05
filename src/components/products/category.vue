<template>
  <div class="category">
     <el-button type="success" @click="showAdd" round>添加分类</el-button>
      <el-table
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255, 255,255, 0.7)"
        :data="tableData"
         row-key="cat_id"
        style="width: 100%">
        <el-table-column
          prop="cat_name"
          label="分类名称">
        </el-table-column>
        <el-table-column
          prop="cat_deleted"
          label="是否有效">
          <template v-slot:default="{ row }">
              {{ row.cat_deleted ? '否' : '是' }}
            </template>
        </el-table-column>
        <el-table-column
          prop="cat_level"
          label="层级">
        </el-table-column>
        <el-table-column
          label="操作">
            <el-button type="primary" icon="el-icon-edit" circle></el-button>
            <el-button type="danger" icon="el-icon-delete" circle></el-button>
        </el-table-column>
    </el-table>

     <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

    <el-dialog
      title="提示"
      @closed="closeDialog"
      :visible.sync="dialogVisible"
      width="40%">
      <el-form ref="form" :rules="rules" :model="form" label-width="80px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="form.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级名称" prop="cat_pid">
          <el-cascader
          :options="options"
          :props="props"
          v-model="form.cat_pid"
          clearable></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCatrgory">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created () {
    this.getCategory()
  },
  data () {
    return {
      tableData: [{
        cat_name: '',
        cat_deleted: '',
        cat_level: ''

      }],
      form: {
        cat_name: '', // 分类名称
        cat_pid: [], // 分类父级的 id
        cat_level: '' // 添加的分类的层级
      },
      pagenum: 1,
      pagesize: 2,
      total: 0,
      loading: true,
      dialogVisible: false,
      options: [],
      props: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: true
      },
      rules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: ['blur', 'change'] }
        ]
      }

    }
  },
  methods: {
    async getCategory () {
      const { meta, data } = await this.$axios.get('categories', {
        params: {
          type: 3,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      })
      if (meta.status === 200) {
        this.tableData = data.result
        this.total = data.total
        this.loading = false
      } else {
        this.$message.error(meta.msg)
      }
    },
    handleSizeChange (val) {
      this.pagesize = val
      this.pagenum = 1
      this.getCategory()
    },
    handleCurrentChange (val) {
      this.pagenum = val
      this.getCategory()
    },
    async showAdd () {
      this.dialogVisible = true
      const { meta, data } = await this.$axios.get('categories?type=2')
      if (meta.status === 200) {
        this.options = data
      }
    },
    async addCatrgory () {
      try {
        await this.$refs.form.validate()

        const { meta } = await this.$axios.post('categories', {
          cat_pid: this.form.cat_pid[this.form.cat_pid.length - 1] || 0,
          cat_name: this.form.cat_name,
          cat_level: this.form.cat_pid.length
        })
        if (meta.status === 201) {
          this.$message.success(meta.msg)
          this.dialogVisible = false
          this.getCategory()
        }
      } catch (e) {
        console.log(e)
      }
    },
    closeDialog () {
      this.$refs.form.resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-table{
    margin-top:10px;
  }
</style>
