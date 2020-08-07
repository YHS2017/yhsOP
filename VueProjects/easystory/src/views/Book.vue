<template>
  <div class="layout">
    <div class="header">
      <div class="back" @click="back">返回</div>
    </div>
    <div v-if="book" class="content">
      <div class="bookhead">
        <img class="bookcover" :src="getrealeurl(book.cover)" alt />
        <div class="bookinfo">
          <div class="bookname">{{book.title}}</div>
          <div class="bookauthor">{{book.author}}</div>
          <div class="wordcount">{{NumtoFixed(book.wordCount)}}万字</div>
        </div>
      </div>
      <div class="panel">
        <div class="paneltitle">简介</div>
        <div class="booktags">
          <div v-for="(tag,index) in book.tags" :key="index" class="tag">{{tag}}</div>
        </div>
        <div class="intro">{{book.longIntro}}</div>
      </div>
      <div class="panel">
        <div class="paneltitle">章节列表</div>
        <div class="chapter"></div>
      </div>
    </div>
    <div v-if="book" class="menubar">
      <div v-if="isadded" class="bar added" @click="removebook()">-不追了</div>
      <div v-else class="bar" @click="addbook()">+追更新</div>
      <div class="bar">开始阅读</div>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
export default {
  props: {
    bookid: String
  },
  data () {
    return {
      book: null,
      isadded: false,
      chapters: []
    }
  },
  methods: {
    addbook () {
      const book = {
        _id: this.$data.book._id,
        title: this.$data.book.title,
        cover: this.$data.book.cover,
        author: this.$data.book.author,
        isMakeMoneyLimit: this.$data.book.isMakeMoneyLimit,
        isFineBook: this.$data.book.isFineBook,
        allowMonthly: this.$data.book.allowMonthly,
        referenceSource: this.$data.book.referenceSource,
        updated: this.$data.book.updated,
        chaptersCount: this.$data.book.chaptersCount,
        lastChapter: this.$data.book.lastChapter,
      }
      this.$store.commit('ADD_BOOK', book);
      this.$data.isadded = true;
    },
    removebook () {
      this.$store.commit('REMOVE_BOOK', this.$data.book._id);
      this.$data.isadded = false;
    },
    back () {
      this.$router.back();
    },
    NumtoFixed (num) {
      return (num / 10000).toFixed(1);
    },
    getrealeurl (url) {
      return '//statics.zhuishushenqi.com/agent/' + encodeURIComponent(url.replace('/agent/', ''));
    }
  },
  beforeMount () {
    axios.get('http://bookapi01.zhuishushenqi.com/book/' + this.bookid).then((res) => {
      this.$data.book = res.data;
      const book = this.$store.state.mybooks.find(item => item._id === res.data._id);
      this.$data.isadded = !!book;
    })
    axios.get('http://api.zhuishushenqi.com/btoc?view=summary&book=' + this.bookid).then((res) => {
      console.log(res);
    });
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
.back {
  position: absolute;
  box-sizing: border-box;
  line-height: 30px;
  padding: 0px 10px 0px 30px;
  background-image: url("../../imgs/back.png");
  background-repeat: no-repeat;
  background-position: 3px 3px;
  background-size: 24px 24px;
  color: #fff;
  top: 15px;
  left: 10px;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 20px;
}
.content {
  width: 100%;
  height: calc(100% - 110px);
  overflow-y: auto;
}
.bookhead {
  position: relative;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  width: 100%;
  height: 200px;
  background-color: #19be6b;
}
.bookcover {
  height: 140px;
}
.bookinfo {
  width: 45%;
  text-align: left;
  box-sizing: border-box;
  padding: 0 20px;
}
.bookname {
  padding-bottom: 20px;
  font-size: 14px;
  font-weight: bold;
  line-height: 14px;
}
.bookauthor {
  padding-bottom: 20px;
  font-size: 14px;
  line-height: 14px;
  display: inline-block;
  color: salmon;
  font-weight: bold;
}
.wordcount {
  padding-bottom: 20px;
  line-height: 12px;
  font-size: 12px;
}
.panel {
  text-align: left;
  box-sizing: border-box;
  width: 100%;
  margin-bottom: 15px;
  background-color: #e7ecf3;
  padding: 20px;
}
.paneltitle {
  font-size: 16px;
  font-weight: bold;
  padding: 5px 0;
}
.booktags {
  padding: 5px 0;
}
.tag {
  display: inline-block;
  padding: 4px 8px;
  background-color: #fff;
  color: #555;
  font-size: 12px;
  line-height: 12px;
  margin: 0 0 10px 5px;
  border-radius: 10px;
}
.intro {
  font-size: 14px;
  line-height: 20px;
}
.menubar {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 50px;
  line-height: 50px;
  color: #fff;
}
.bar {
  flex: 1;
  background-color: #19be6b;
}
.bar.added {
  background-color: #ccc;
}
.bar:first-child {
  border-right: 1px solid #fff;
}
</style>
