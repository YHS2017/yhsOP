//index.js
//获取应用实例
const app = getApp();

Page({
  data: {
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 500,
    loadmore: false,
    imgUrls: [
      'http://pic0.iqiyipic.com/common/lego/20190117/bfffa0464eaf48b0bdbcfbdb85bc7259.jpg',
      'http://pic0.iqiyipic.com/common/lego/20190117/bfffa0464eaf48b0bdbcfbdb85bc7259.jpg',
      'http://pic0.iqiyipic.com/common/lego/20190117/bfffa0464eaf48b0bdbcfbdb85bc7259.jpg'
    ],
    list: []
  },
  getMore: function () {
    if (!this.data.loadmore) {
      var _this = this;
      setTimeout(function () {
        _this.setData({
          loadmore: true
        });
        var listdata = _this.data.list;
        for (var i = 0; i < 10; i++) {
          listdata.push({
            id: 1,
            goods_img: 'https://img.alicdn.com/bao/uploaded/i1/1097280647/O1CN01RnB87l1GeMkSyMInS_!!1097280647.jpg',
            goods_name: '攀升 i7 8700/GTX1060台式电脑主机全套高配吃鸡游戏水冷组装整机',
            goods_price: 8.00,
            goods_vip_price: 7.20,
            goods_unit: '天'
          });
        }
        _this.setData({
          list: listdata,
          loadmore: false
        });
      }, 1000);
    }
  },
  onLoad: function () {
    this.getMore();
  }
})