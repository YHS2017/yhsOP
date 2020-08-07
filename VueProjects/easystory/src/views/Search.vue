<template>
  <div class="layout">
    <div class="header">
      <div class="back" @click="back">返回</div>
      <div class="search">
        <img src="../../imgs/search.png" alt class="searchicon" />
      </div>
    </div>
    <div class="content">
      <div class="panel">
        <div class="panel-title">男生必看</div>
        <div class="panel-content">
          <div v-for="item in manlist" :key="item._id" class="book" @click="bookinfo(item._id)">
            <img :src="item.cover" class="bookcover" />
            <div class="bookinfo">
              <div class="bookname">{{item.title}}</div>
              <div class="booktag">{{item.majorCate}}</div>
              <div class="bookscore">{{item.rating.score}}分</div>
            </div>
          </div>
        </div>
      </div>
      <div class="panel">
        <div class="panel-title">女生热门</div>
        <div class="panel-content">
          <div v-for="item in womenlist" :key="item._id" class="book" @click="bookinfo(item._id)">
            <img :src="item.cover" class="bookcover" />
            <div class="bookinfo">
              <div class="bookname">{{item.title}}</div>
              <div class="booktag">{{item.majorCate}}</div>
              <div class="bookscore">{{NumtoFixed(item.latelyFollower)}}万热度</div>
            </div>
          </div>
        </div>
      </div>

      <div class="panel">
        <div class="panel-title">主编力荐</div>
        <div class="panel-content">
          <div v-for="item in otherlist" :key="item._id" class="book" @click="bookinfo(item._id)">
            <img :src="item.cover" class="bookcover" />
            <div class="bookinfo">
              <div class="bookname">{{item.title}}</div>
              <div class="booktag">{{item.majorCate}}</div>
              <div class="bookscore">{{NumtoFixed(item.latelyFollower)}}万热度</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
export default {
  data () {
    return {
      manlist: [],
      womenlist: [],
      otherlist: []
    }
  },
  methods: {
    NumtoFixed (num) {
      return (num / 10000).toFixed(1);
    },
    back () {
      this.$router.back();
    },
    bookinfo (bookid) {
      this.$router.push({ path: '/Book', query: { bookid } })
    }
  },
  mounted () {
    axios.get('https://b.zhuishushenqi.com/category/page?node=&sex=male&page=1&groupid=&pl=ios&tabType=jx').then((result) => {
      // console.log(result);
      this.$data.manlist = result.data.data[3].books.slice(0, 6);
      this.$data.womenlist = result.data.data[4].books.slice(0, 6);
      this.$data.otherlist = result.data.data[5].books.slice(0, 6);
      parseFloat()
    })
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
  padding: 20px;
  width: 100%;
}
.panel-title {
  line-height: 30px;
  text-align: left;
  font-weight: bold;
}
.panel-content {
  width: 100%;
  overflow: hidden;
}
.book {
  display: inline-flex;
  width: 50%;
  margin-top: 10px;
}
.bookcover {
  width: 50%;
}
.bookinfo {
  position: relative;
  text-align: left;
  box-sizing: border-box;
  padding: 0 5px;
  width: 50%;
}
.bookname {
  font-size: 14px;
  font-weight: bold;
  line-height: 14px;
}
.booktag {
  position: absolute;
  bottom: 30px;
  display: inline-block;
  line-height: 12px;
  font-size: 12px;
  padding: 2px 4px;
  border: 1px solid #ccc;
  border-radius: 2px;
  color: #999;
}
.bookscore {
  font-size: 14px;
  line-height: 14px;
  position: absolute;
  bottom: 0;
  color: salmon;
  font-weight: bold;
}
</style>
