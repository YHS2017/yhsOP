<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import SearchBox from '../components/SearchBox.vue'

</script>

<template>
  <div class="home">
    <SearchBox id="search-box" />
    <div id="box-content"></div>
  </div>
</template>

<style scoped>
.home {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding-top: 180px;
  --accent: #5f19dd;
  --accent-light: #6b20f1;
  background: linear-gradient(to right bottom, var(--accent-light), var(--accent));
}

#search-box {
  margin: 0 auto;
}

#box-content {
  width: 1080px;
  margin: 0 auto;
}
</style>
