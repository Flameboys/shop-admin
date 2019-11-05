<template>
  <div class="login">
    <el-form ref="form" @keyup.enter.native="login" status-icon :rules="rules" :model="form" label-width="80px">
      <img class="logo" src="../assets/qaq.png" alt />
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="form.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="login" class="loginBtn" type="primary">登陆</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: ['change', 'blur']
          },
          { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: ['change', 'blur']
          },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    reset () {
      this.$refs.form.resetFields()
    },
    async login () {
      try {
        await this.$refs.form.validate()
        const { meta, data } = await this.$axios.post('login', this.form)
        if (meta.status === 200) {
          localStorage.setItem('token', data.token)
          this.$message({
            type: 'success',
            message: meta.msg,
            duration: 1000
          })
          this.$router.push('/index')
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.login {
  width: 100%;
  height: 100%;
  background-color: #2d434c;
  overflow: hidden;
  .el-form {
    width: 400px;
    padding: 70px 20px 20px 20px;
    border-radius: 20px;
    background-color: #fff;
    margin: 0 auto;
    margin-top: 200px;
    position: relative;
    .logo {
      position: absolute;
      width: 120px;
      height: 120px;
      border-radius: 50%;
      left: 50%;
      transform: translateX(-50%);
      top: -75px;
      border: 5px solid #fff;
    }
    .loginBtn {
      margin-right: 70px;
    }
  }
}
</style>
