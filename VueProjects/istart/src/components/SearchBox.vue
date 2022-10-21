<script setup lang="ts">
import { ref } from 'vue'
import 'css.gg/icons/css/search.css'
import 'css.gg/icons/css/chevron-up.css'
import 'css.gg/icons/css/chevron-down.css'

const options = ref([
  {
    key: 'Baidu',
    icon: '',
    url: 'https://www.baidu.com/s?word='
  },
  {
    key: 'Bing',
    icon: '',
    url: 'https://cn.bing.com/search?q='
  },
  {
    key: 'Google',
    icon: '',
    url: 'https://www.google.com.hk/search?q='
  },
  {
    key: '360',
    icon: '',
    url: 'https://www.so.com/s?q='
  },
  {
    key: 'Sougou',
    icon: '',
    url: 'https://www.sogou.com/web?query='
  },
  {
    key: 'Quark',
    icon: '',
    url: 'https://quark.sm.cn/s?q='
  }
]);
const current = ref(options.value[0]);
const keywords = ref('');
const selecting = ref(false);

const toggleSelect = () => {
  selecting.value = !selecting.value;
}

const changeCurrent = (option: any) => {
  current.value = option;
}

const search = () => {
  keywords.value && window.open(current.value.url + keywords.value, '_blank')
}

</script>

<template>
  <div class="search-box">
    <div tabindex="1" class="search-select" @focus="toggleSelect" @blur="toggleSelect">
      <div class="search-current">
        <img v-if="current.icon" :src="current.icon" :alt="current.key" />
        <b v-else>{{current.key}}</b>
      </div>
      <div v-if="selecting" class="drop-icon gg-chevron-up"></div>
      <div v-else class="drop-icon gg-chevron-down"></div>
      <div v-show="selecting" class="search-options">
        <div v-for="option in options" class="search-option" @click="changeCurrent(option)">
          <img v-if="option.icon" :src="option.icon" :alt="option.key" />
          <b v-else>{{option.key}}</b>
        </div>
      </div>
    </div>
    <input type="text" class="search-input" v-model="keywords" @keyup.enter="search" />
    <div class="search-btn gg-search" @click="search"></div>
  </div>
</template>

<style scoped>
.search-box {
  --bg1: transparent;
  --bg2: #fff;
  --bg3: #5f19dd;
  --face1: #fff;
  --face2: #5f19dd;
  --face3: #ccc;
  position: relative;
  width: 500px;
  background-color: var(--bg1);
  border: 1px solid var(--bg2);
  border-radius: 4px;
}

.search-select {
  position: relative;
  display: inline-block;
  width: 100px;
  height: 40px;
  vertical-align: middle;
  background-color: var(--bg2);
  cursor: pointer;
  border-radius: 2px 0 0 2px;
  user-select: none;
}

.drop-icon {
  position: absolute;
  color: var(--face3);
  top: 10px;
  right: 0px;
}

.search-options {
  position: absolute;
  top: 55px;
  left: 0;
  width: 100px;
  border-radius: 4px;
  background-color: var(--bg2);
}

.search-current,
.search-option {
  width: 100px;
  height: 40px;
  text-align: center;
  line-height: 40px;
}

.search-current b,
.search-option b {
  color: var(--face2);
}

.search-option:hover b {
  padding: 4px;
  border-radius: 100%;
  background-color: var(--bg3);
  color: var(--face1);
}

.search-input {
  display: inline-block;
  margin: 0;
  padding: 0 5px;
  width: 370px;
  height: 40px;
  line-height: 40px;
  border: none;
  background: transparent;
  outline: none;
  color: var(--face1);
}

.search-btn {
  display: inline-block;
  color: var(--face3);
  cursor: pointer;
  vertical-align: middle;
}

.search-btn:hover {
  color: var(--face1);
}
</style>
