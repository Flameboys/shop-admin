<template>
  <el-container class="index">
    <el-header>
      <div class="logo">
        <img src="../assets/logo1.png" alt />
      </div>
      <div class="title">
        <h1>后台管理系统</h1>
      </div>
      <div class="exit">
        欢迎光临
        <a @click="logout" href="javacript:;">退出</a>
      </div>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu
          :default-active="defaultActive"
          router
          unique-opened
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <el-submenu :index="item.path" v-for="item in menuList" :key="item.id">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{item.authName}}</span>
            </template>
            <!-- 展开的内容 -->
            <!-- 解析时, 会将配置的路径, 当成绝对路径使用, 写的是users => /users -->
            <el-menu-item :index="child.path" v-for="child in item.children" :key="child.id">
              <i class="el-icon-menu"></i>
              <span slot="title">{{child.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  async created () {
    const { meta, data } = await this.$axios.get('menus')
    if (meta.status === 200) {
      this.menuList = data
      // console.log(data)
    }
  },
  data () {
    return {
      menuList: []
    }
  },
  methods: {
    logout () {
      this.$confirm('亲您这边真的要走了吗?', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '退出成功!'
        })
        localStorage.removeItem('token')
        this.$router.push('./login')
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消退出'
        })
      })
    }
  },
  computed: {
    defaultActive () {
      // console.log(this.$route.path.slice(1))
      return this.$route.path.slice(1)
    }
  }
}
</script>

<style lang="scss" scoped>
.index {
  width: 100%;
  height: 100%;
}
.el-header,
.el-footer {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
  display: flex;
  .logo {
    width: 180px;
    height: 40px;
    margin-top: 10px;
    img {
      width: 180px;
      height: 40px;
    }
  }
  .title {
    flex: 1;
    h1 {
      margin: 0;
    }
  }
  .exit {
    width: 180px;
    height: 40px;
    line-height: 40px;
    margin: 10px 0px;
    a {
      color: orange;
      margin-left: 5px;
    }
  }
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
  text-align: center;
  line-height: 200px;
  .el-menu{
    border:none;
  }
}

.el-main {
  background-color: #e9eef3;
  color: #333;
}

</style>
