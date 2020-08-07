<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  beforeMount () {
    const mybooksstr = localStorage.getItem("mybooks");
    if (mybooksstr) {
      const books = JSON.parse(mybooksstr);
      this.$store.commit('INIT_MYBOOKS', books)
    }
  }
}
</script>

<style lang="css">
html,
body {
  margin: 0;
  padding: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
