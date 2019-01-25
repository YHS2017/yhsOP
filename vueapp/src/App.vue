<template>
  <el-container id="app">
    <el-header
      id="header"
      height="80px"
    ></el-header>
    <el-container id="body">
      <el-aside
        id="menu"
        width="200px"
      >
        <el-menu
          id="menu-ul"
          default-active="/home/1"
          router="true"
        >
          <el-submenu index="/home">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>Home</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/home/1">选项1</el-menu-item>
              <el-menu-item index="/home/2">选项2</el-menu-item>
              <el-menu-item index="/home/3">选项3</el-menu-item>
              <el-menu-item index="/home/4">选项4</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-menu-item index="/about">
            <i class="el-icon-menu"></i>
            <span slot="title">About</span>
          </el-menu-item>
          <el-menu-item index="3">
            <i class="el-icon-document"></i>
            <span slot="title">导航三</span>
          </el-menu-item>
          <el-menu-item index="4">
            <i class="el-icon-setting"></i>
            <span slot="title">导航四</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main id="main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  methods: {}
};
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
  height: 100%;
  min-width: 1024px;
  min-width: 768px;
}

#body {
  width: 100%;
  height: calc(100% - 80px);
}

#header {
  height: 100px;
  background-color: #eee;
}

#menu {
  overflow-x: hidden;
  border-right: 1px solid #eee;
}

#menu-ul {
  border: none;
}

#main {
  height: 100%;
  margin: 0;
  padding: 0;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
