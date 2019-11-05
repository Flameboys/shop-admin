<template>
  <div class="goodsadd">
    <el-steps :active="active" finish-status="success">
      <el-step title="步骤 1"></el-step>
      <el-step title="步骤 2"></el-step>
      <el-step title="步骤 3"></el-step>
    </el-steps>

    <el-tabs tab-position="left" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="基本信息" name="0">
       <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="商品名称">
            <el-input v-model="form.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="form.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="form.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="form.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <el-cascader
              clearable
              v-model="form.goods_cat"
              :options="options"
              :props="props">
            </el-cascader>
          </el-form-item>
       </el-form>
       <el-button type="primary" @click="nextSteps">下一步</el-button>
      </el-tab-pane>
      <el-tab-pane label="商品图片" name="1">
        <el-upload
          action="http://localhost:8888/api/private/v1/upload"
          list-type="picture-card"
          multiple
          name="file"
          :headers="headers"
          :on-success="handleSuccess"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove">
          <i class="el-icon-plus"></i>
        </el-upload>
      </el-tab-pane>
      <el-tab-pane label="商品内容" name="2">
         <quill-editor v-model="form.goods_introduce"></quill-editor>
         <el-button type="success" @click="addGood">添加</el-button>
      </el-tab-pane>
    </el-tabs>

    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      active: 0,
      activeName: '0',
      dialogImageUrl: '',
      dialogVisible: false,
      form: {
        goods_name: '',
        goods_cat: [],
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        goods_introduce: '',
        pics: []
      },
      options: [],
      props: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      headers: {
        Authorization: localStorage.getItem('token')
      }
    }
  },
  async created () {
    const { meta, data } = await this.$axios.get('categories?type=3')
    if (meta.status === 200) {
      this.options = data
    } else {
      this.$message.error(meta.msg)
    }
  },
  methods: {
    handleClick (tab) {
      this.active = +tab.index
    },
    nextSteps () {
      this.active++
      this.activeName = this.active + ''
    },
    handleRemove (file, fileList) {
      const path = file.response.data.tmp_path
      this.form.pics = this.form.pics.filter(item => item.pic !== path)
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleSuccess (response, file, fileList) {
      const { meta, data } = response
      if (meta.status === 200) {
        this.form.pics.push({
          pic: data.tmp_path
        })
      } else {
        this.$axios.error(meta.msg)
      }
    },
    async addGood () {
      const { meta } = await this.$axios.post('goods', {
        ...this.form,
        goods_cat: this.form.goods_cat.join(',')
      })
      console.log(meta)

      if (meta.status === 201) {
        this.$message.success(meta.msg)
        this.$router.push('/goods')
      } else {
        this.$message.error(meta.msg)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
// 只要添加了scoped, 样式只会作用于当前模板中的内容, 不会往下渗透到子组件中的
.quill-editor {
  background-color: #fff;
  ::v-deep .ql-editor {
    min-height: 300px;
  }
}
</style>
