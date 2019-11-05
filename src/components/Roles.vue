<template>
  <div class="roles">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-button type="success" @click="showDialogVisible">添加角色</el-button>

    <el-dialog
      :title="dialogTitle"
      @closed="resetUser"
      :visible.sync="dialogVisible"
      width="40%">

      <el-form ref="form" :rules="rules" :model="form" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="form.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="form.roleDesc"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <el-table
      class="rolesTable"
      :data="rolesList"
      style="width: 100%">
       <el-table-column type="expand">
        <template v-slot:default="{row}">
          <p v-if="row.children.length === 0">暂无权限</p>
          <el-row class="item" v-for="item in row.children" :key="item.id">
            <el-col :span="4">
              <el-tag  closable @close="delRoles(row,item.id)" >{{item.authName}}</el-tag>
              <i class="el-icon-right"></i>
            </el-col>
            <el-col :span="20">
              <el-row class="l2" v-for="l2 in item.children" :key="l2.id">
                <el-col :span="4">
                  <el-tag  closable @close="delRoles(row,l2.id)" >{{l2.authName}}</el-tag>
                   <i class="el-icon-right"></i>
                  </el-col>
                <el-col :span="20">
                  <el-tag  closable  @close="delRoles(row,l3.id)" class="l3" v-for="l3 in l2.children" :key="l3.id">{{l3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column
      type="index">
      </el-table-column>
      <el-table-column
        prop="roleName"
        label="角色名称"
       >
      </el-table-column>
      <el-table-column
        prop="roleDesc"
        label="描述"
       >
      </el-table-column>
      <el-table-column
        label="操作">
        <template v-slot:default="{ row }">
          <el-button size="small" type="success" icon="el-icon-edit" @click="showEditUser(row)"></el-button>
          <el-button size="small" type="danger" icon="el-icon-delete" @click="delUser(row.id)"></el-button>
          <el-button size="small" type="primary" @click="showAssignDialog(row)" icon="el-icon-s-opportunity">分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      title="提示"
      :visible.sync="assignDialog"
      width="40%">

     <el-tree
        ref="tree"
        node-key="id"
        default-expand-all
        show-checkbox
        :data="data"
        :props="defaultProps">
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="assignDialog = false">取 消</el-button>
        <el-button type="primary" @click="assignRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created () {
    this.getRolesList()
  },
  data () {
    return {
      data: [],
      roleId: '',
      dialogVisible: false,
      rolesList: [
        {
          id: '',
          roleDesc: '',
          roleName: ''
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      assignDialog: false,
      form: {
        id: '',
        roleName: '',
        roleDesc: ''
      },
      rules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: ['blur', 'change'] }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: ['blur', 'change'] }
        ]
      },
      dialogTitle: '添加角色'
    }
  },
  methods: {
    async getRolesList () {
      const { data, meta } = await this.$axios.get('roles')
      // console.log(data, meta)
      if (meta.status === 200) {
        this.rolesList = data
      } else {
        this.$message.error(meta.msg)
      }
    },
    async delUser (id) {
      const { meta } = await this.$axios.delete(`roles/${id}`)
      if (meta.status === 200) {
        this.$message.success(meta.msg)
        this.getRolesList()
      } else {
        this.$message.success(meta.msg)
      }
    },
    async delRoles (row, rid) {
      const { meta, data } = await this.$axios.delete(`roles/${row.id}/rights/${rid}`)
      if (meta.status === 200) {
        row.children = data
        this.$message.success(meta.msg)
      } else {
        this.$message.error(meta.msg)
      }
    },
    async  showAssignDialog (row) {
      this.assignDialog = true
      this.roleId = row.id
      const { data, meta } = await this.$axios.get('rights/tree')
      if (meta.status === 200) {
        // 成功了, 将数据存起来
        this.data = data
        const ids = []
        row.children.forEach(l1 => {
          l1.children.forEach(l2 => {
            l2.children.forEach(l3 => {
              ids.push(l3.id)
            })
          })
        })
        this.$refs.tree.setCheckedKeys(ids)
        // console.log(data)
      } else {
        this.$message.error(meta.msg)
      }
    },
    async assignRights () {
      const ids = this.$refs.tree.getCheckedKeys()
      const hids = this.$refs.tree.getHalfCheckedKeys()
      const rids = [...ids, ...hids].join(',')
      const { meta } = await this.$axios.post(`roles/${this.roleId}/rights`, { rids })
      if (meta.status === 200) {
        this.assignDialog = false
        this.getRolesList()
        this.$message.success(meta.msg)
      } else {
        this.$message.success(meta.msg)
      }
    },
    showDialogVisible () {
      this.dialogVisible = true
      this.dialogTitle = '添加角色'
    },
    async addUser () {
      const isAdd = this.dialogTitle === '添加角色'
      const url = isAdd ? 'roles' : `roles/${this.form.id}`
      const method = isAdd ? 'post' : 'put'
      const { meta } = await this.$axios[method](url, this.form)
      if (meta.status === 201 || meta.status === 200) {
        this.$message.success(meta.msg)
        this.dialogVisible = false
        this.getRolesList()
      } else {
        this.$message.success(meta.msg)
      }
    },
    resetUser () {
      this.$refs.form.resetFields()
    },
    async showEditUser (row) {
      this.dialogTitle = '修改角色'
      this.dialogVisible = true
      this.$nextTick(() => {
        this.form.id = row.id
        this.form.roleName = row.roleName
        this.form.roleDesc = row.roleDesc
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .rolesTable{
    margin-top:10px;
  }
  .el-breadcrumb{
    height:40px;
    line-height: 40px;
    border-bottom:1px solid #ccc;
    margin-bottom:10px;
  }
  .item{
    padding:10px 0px;
    border-bottom:1px dashed #ccc;
    &:last-child{
      border-bottom:none;
    }
  }
  .l2{
    margin-bottom:5px;
  }
  .l3{
    margin-bottom:5px;
    margin-right:5px;
  }
</style>
