<template>
  <div class="layout">
    <div class="header">
      <div class="home"></div>
      <div class="search" @click="tosearch">
        <img src="../../imgs/search.png" alt class="searchicon" />
      </div>
    </div>
    <div class="content">
      <div class="panel">
        <div class="panel-title">我的书架</div>
        <div v-if="books.length>0" class="panel-content">
          <div v-for="item in books" :key="item._id" class="book">
            <img :src="getrealeurl(item.cover)" class="bookcover" />
            <div class="bookinfo">
              <div class="bookname">{{item.title}}</div>
              <div class="lastchapter">{{item.lastChapter}}</div>
              <div class="updated">{{getupdatetimespan(item.updated)}}</div>
            </div>
          </div>
        </div>
        <div v-else class="none">你的书架空空如也~快去搜索添加吧~</div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
export default {
  data () {
    return {
      books: []
    }
  },
  methods: {
    NumtoFixed (num) {
      return (num / 10000).toFixed(1);
    },
    getrealeurl (url) {
      return '//statics.zhuishushenqi.com/agent/' + encodeURIComponent(url.replace('/agent/', ''));
    },
    getupdatetimespan (timestr) {
      const now = new Date();
      const update = new Date(timestr);
      const span = now.getTime() - update.getTime();
      const minutes = Math.floor(span / 1000 / 60) % 60;
      const hours = Math.floor(span / 1000 / 60 / 60) % 24;
      const days = Math.floor(span / 1000 / 60 / 60 / 24) % 30;
      const mouths = Math.floor(span / 1000 / 60 / 60 / 24 / 30) % 12;
      const years = Math.floor(span / 1000 / 60 / 60 / 24 / 30 / 12);
      console.log(span, minutes, hours, days, mouths, years);
      if (years > 0) {
        return years + '年前更新';
      }
      if (years === 0 && mouths > 0) {
        return mouths + '月前更新';
      }
      if (years === 0 && mouths === 0 && days > 0) {
        return days + '日前更新';
      }
      if (years === 0 && mouths === 0 && days === 0 && hours > 0) {
        return hours + '小时前更新';
      }
      if (years === 0 && mouths === 0 && days === 0 && hours === 0 && minutes > 0) {
        return minutes + '分钟前更新';
      }
      if (years === 0 && mouths === 0 && days === 0 && hours === 0 && minutes < 0) {
        return '刚刚更新';
      }
    },
    tosearch () {
      this.$router.push({ path: '/Search' });
    }
  },
  beforeMount () {
    if (this.$store.state.mybooks.length > 0) {
      const bookids = this.$store.state.mybooks.map(book => book._id);
      axios.post('http://bookapi01.zhuishushenqi.com/book/updated', { id: bookids.join(',') }).then((res) => {
        this.$data.books = this.$store.state.mybooks.map(book => {
          const update = res.data.find(b => b._id === book._id);
          return { ...book, ...update }
        });
      });
    }
  }
}
</script>
<style lang="css" scoped>
.layout {
  position: relative;
  width: 100vw;
  height: 100vh;
}
.header {
  position: relative;
  background-color: #19be6b;
  width: 100%;
  height: 60px;
  line-height: 60px;
  box-shadow: 0 0 10px 3px rgba(0, 0, 0, 0.2);
  z-index: 10;
}
.home {
  position: absolute;
  width: 30px;
  height: 30px;
  background-image: url("../../imgs/home.png");
  background-repeat: no-repeat;
  background-size: 30px 30px;
  top: 15px;
  left: 30px;
}
.search {
  position: absolute;
  width: 200px;
  height: 30px;
  top: 15px;
  right: 10px;
  background-color: rgba(255, 255, 255, 0.4);
  border-radius: 20px;
}
.searchicon {
  position: absolute;
  width: 20px;
  height: 20px;
  top: 5px;
  left: 15px;
}
.content {
  width: 100%;
  height: calc(100% - 60px);
  overflow-y: auto;
}
.panel {
  box-sizing: border-box;
  width: 100%;
}
.panel-title {
  padding: 20px 20px 0 20px;
  line-height: 30px;
  text-align: left;
  font-weight: bold;
}
.panel-content {
  box-sizing: border-box;
  padding: 0 10px;
  width: 100%;
  overflow: hidden;
}
.book {
  display: inline-flex;
  box-sizing: border-box;
  padding: 10px;
  width: 100%;
  margin-top: 10px;
  background-color: #eee;
}
.bookcover {
  width: 30%;
}
.bookinfo {
  position: relative;
  text-align: left;
  box-sizing: border-box;
  padding: 0 5px;
  width: 70%;
}
.bookname {
  font-size: 14px;
  font-weight: bold;
  line-height: 14px;
}
.lastchapter {
  position: absolute;
  bottom: 45px;
  display: inline-block;
  line-height: 12px;
  font-size: 12px;
  padding: 2px 4px;
  border-radius: 2px;
  color: #999;
}
.updated {
  font-size: 14px;
  line-height: 14px;
  position: absolute;
  bottom: 10px;
}
</style>
