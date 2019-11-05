<template>
  <div class="goods">
    <el-button type="success" @click="goGoodsadd">添加商品</el-button>

    <el-table
      :data="goodsList"
      style="width: 100%">
      <el-table-column
        type="index"
        :index="indexMethod"
        width="50">
      </el-table-column>
      <el-table-column
        prop="goods_name"
        label="商品名称">
      </el-table-column>
      <el-table-column
        prop="goods_price"
        label="商品价格">
      </el-table-column>
      <el-table-column
        prop="goods_weight"
        label="商品重量">
      </el-table-column>
      <el-table-column
        label="创建时间">
        <template v-slot:default="{ row }">
          {{ row.upd_time | time }}
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
          <el-button type="primary" size="small" plain icon="el-icon-edit"></el-button>
          <el-button type="danger" size="small" plain icon="el-icon-delete"></el-button>
      </el-table-column>
    </el-table>

    <el-pagination
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page="pagenum"
    :page-sizes="[5, 10, 20, 30]"
    :page-size="pagesize"
    layout="total, sizes, prev, pager, next, jumper"
    :total="total">
    </el-pagination>
  </div>
</template>

<script>
export default {
  created () {
    this.getGoodsList()
  },
  data () {
    return {
      goodsList: [],
      total: 0,
      pagenum: 1,
      pagesize: 5
    }
  },
  methods: {
    async getGoodsList () {
      const { meta, data } = await this.$axios.get('goods', {
        params: {
          Pnp: '',
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      })
      console.log(data)
      if (meta.status === 200) {
        this.goodsList = data.goods
        this.total = data.total
      } else {
        this.$message.error(meta.msg)
      }
    },
    handleSizeChange (val) {
      this.pagesize = val
      this.pagenum = 1
      this.getGoodsList()
    },
    handleCurrentChange (val) {
      this.pagenum = val
      this.getGoodsList()
    },
    indexMethod (index) {
      return index + 1 + (this.pagenum - 1) * this.pagesize
    },
    goGoodsadd () {
      this.$router.push('/goods-add')
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-table{
    margin-top:10px;
  }
</style>
