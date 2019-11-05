<template>
  <div class="users">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-input placeholder="请输入内容" v-model="query" class="input-with-select">
      <el-button slot="append" @click="findUser" icon="el-icon-search"></el-button>
    </el-input>

    <el-button type="success" @click="dialogVisible = true">添加用户</el-button>
    <el-dialog
      title="添加用户"
      :visible.sync="dialogVisible"
      @closed="closeDialog"
      width="40%">

      <el-form :rules="rules" ref="form" :model="form" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input placeholder="请输入用户名" v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" placeholder="请输入密码" v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input placeholder="请输入邮箱" v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input placeholder="请输入手机" v-model="form.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <el-table
      :data="userList"
      style="width: 100%">
      <el-table-column
        prop="username"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱"
        width="230">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="电话"
        width="230">
      </el-table-column>
      <el-table-column label="用户状态">
        <!-- 通过 作用域插槽 可以获取到 row, column, $index 和 store 的数据 -->
        <!-- row指的是一行的数据 -->
        <template v-slot:default="obj">
          <!-- {{obj.row}} -->
          <el-switch
            @change="changeStatus(obj.row.id,obj.row.mg_state)"
            v-model="obj.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        prop="set"
        label="操作">
        <template v-slot:default="{ row }">
          <el-button plain size="small" icon="el-icon-edit" type="primary" @click="editFormdialog(row)"></el-button>
          <el-button plain size="small" icon="el-icon-delete" type="danger" @click="delItem
          (row.id)"></el-button>
          <el-button plain size="small" icon="el-icon-check" type="success" @click="showAssignUser(row)">分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      title="分配角色"
      :visible.sync="assignUser"
      width="40%">
      <el-form ref="addform" :model="addform" label-width="80px">
        <el-form-item label="用户名">
          <el-tag type="info">{{addform.username}}</el-tag>
        </el-form-item>
        <el-form-item label="角色列表">
          <el-select v-model="addform.rid" placeholder="请选择">
              <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="assignUser = false">取 消</el-button>
        <el-button type="primary" @click="assignTrue">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="修改用户" :visible.sync="editDialog">
      <el-form ref="editform" :model="editform" label-width="80px">
        <el-form-item label="用户名">
          <el-tag type="info">{{editform.username}}</el-tag>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="editform.email"></el-input>
        </el-form-item>
        <el-form-item label="手机">
           <el-input v-model="editform.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialog = false">取 消</el-button>
        <el-button type="primary" @click="finishEdit">确 定</el-button>
      </div>
    </el-dialog>

     <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
export default {
  created () {
    this.getList()
  },
  data () {
    return {
      dialogVisible: false,
      userList: [],
      query: '',
      pagenum: 1,
      pagesize: 2,
      total: 0,
      assignUser: false,
      editDialog: false,
      editform: {
        username: '',
        email: '',
        mobile: ''
      },
      form: {
        id: '',
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      options: [],
      addform: {
        id: '',
        rid: '',
        username: ''
      },

      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: ['blur', 'change'] },
          { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: ['blur', 'change'] }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: ['blur', 'change'] },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: ['blur', 'change'] }
        ],
        email: [
          { type: 'email', message: '请输入正确的邮箱', trigger: ['blur', 'change'] }
        ],
        mobile: [
          { pattern: /^1[3-9]\d{9}/, message: '请输入正确的手机号码', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    async getList () {
      const { data, meta } = await this.$axios.get('users', {
        params: {
          query: this.query,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      })
      if (meta.status === 200) {
        this.total = data.total
        this.userList = data.users
      } else {
        this.$message.error(meta.msg)
      }
    },
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
      this.pagesize = val
      this.pagenum = 1
      this.getList()
    },
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.pagenum = val
      this.getList()
    },
    async delItem (id) {
      try {
        await this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          type: 'warning'
        })
        const { meta } = await this.$axios.delete(`users/${id}`, {
          headers: {
            Authorization: localStorage.getItem('token')
          }
        })
        if (meta.status === 200) {
          this.$message.success(meta.msg)
          if (this.userList.length === 1 && this.pagenum > 1) {
            this.pagenum--
          }
          this.getList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }

      // console.log(id)
      // await this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
      //   type: 'warning'
      // }).then(() => {
      // axios.delete(`users/${id}`, {
      //   headers: {
      //     Authorization: localStorage.getItem('token')
      //   }
      // }).then(res => {
      //     const { meta } = res
      // if (meta.status === 200) {
      //   this.$message.success(meta.msg)
      //   if (this.userList.length === 1 && this.pagenum > 1) {
      //     this.pagenum--
      //   }
      //   this.getList()
      // } else {
      //   this.$message.error(meta.msg)
      // }
      //   })
      // }).catch(() => {
      // })
    },
    findUser () {
      this.pagenum = 1
      this.getList()
    },
    async changeStatus (id, status) {
      try {
        const { meta } = await this.$axios.put(`users/${id}/state/${status}`)
        if (meta.status === 200) {
          this.$message.success(meta.msg)
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    async addUser () {
      const { meta } = await this.$axios.post('users', this.form)
      console.log(meta)
      if (meta.status === 201) {
        this.$message.success(meta.msg)
        this.dialogVisible = false
        this.pagenum = Math.ceil(++this.total / this.pagesize)
        this.getList()
      } else {
        this.$message.error(meta.msg)
      }
    },
    closeDialog () {
      this.$refs.form.resetFields()
    },
    editFormdialog (row) {
      this.editDialog = true
      this.editform.username = row.username
      this.editform.email = row.email
      this.editform.mobile = row.mobile
      this.editform.id = row.id
    },
    async finishEdit () {
      const { email, mobile } = this.editform
      const { meta } = await this.$axios.put(`users/${this.editform.id}`, { email, mobile })
      if (meta.status === 200) {
        this.$message.success(meta.msg)
        this.editDialog = false
        this.getList()
      } else {
        this.$message.error(meta.msg)
      }
    },
    async showAssignUser (row) {
      this.assignUser = true
      this.addform.id = row.id
      this.addform.username = row.username
      const resUser = await this.$axios.get(`users/${row.id}`)
      if (resUser.meta.status === 200) {
        const rid = resUser.data.rid
        this.addform.rid = rid === -1 ? '' : rid
      } else {
        this.$message.error(resUser.meta.msg)
      }
      const { meta, data } = await this.$axios.get('roles')
      if (meta.status === 200) {
        this.options = data
      } else {
        this.$message.error(meta.msg)
      }
    },
    async assignTrue () {
      if (this.addform.rid === '') {
        this.$message.error('请选择角色')
        return
      }
      const { meta } = await this.$axios.put(`users/${this.addform.id}/role`, this.addform)
      if (meta.status === 200) {
        this.$message.success(meta.msg)
        this.assignUser = false
        this.getList()
      } else {
        this.$message.success(meta.msg)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .users{
    .el-breadcrumb{
      height:40px;
      line-height: 40px;
      border-bottom:1px solid #ccc;
      margin-bottom:10px;
    }
    .input-with-select{
      width:300px;
      margin-right:10px;
    }
    .el-table{
      margin-top:10px;
    }
  }
</style>
