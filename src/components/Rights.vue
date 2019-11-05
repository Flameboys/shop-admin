<template>
  <div class="rights">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

     <el-table
      :data="rightsList"
      style="width: 100%">
      <el-table-column
         type="index"
      >
      </el-table-column>
      <el-table-column
        prop="authName"
        label="权限名称">
      </el-table-column>
      <el-table-column
        prop="path"
        label="路径">
      </el-table-column>
      <el-table-column
         prop="level"
        label="层级">
        <template v-slot:default="{row}">
        <p v-if="row.level === '0'">一级</p>
        <p v-if="row.level === '1'">二级</p>
        <p v-if="row.level === '2'">三级</p>
      </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
export default {
  created () {
    this.getRightsList()
  },
  data () {
    return {
      rightsList: [
        {
          id: '',
          authName: '',
          level: '',
          path: ''
        }
      ]
    }
  },
  methods: {
    async getRightsList () {
      const { data, meta } = await this.$axios.get('rights/list')
      // console.log(data, meta)
      if (meta.status === 200) {
        this.rightsList = data
      } else {
        this.$message.error(meta.msg)
      }
    }

  }
}
</script>

<style lang="scss" scoped>
   .el-breadcrumb{
      height:40px;
      line-height: 40px;
      border-bottom:1px solid #ccc;
      margin-bottom:10px;
    }
</style>
