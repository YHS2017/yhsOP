import COS from 'cos-js-sdk-v5';

const config = {
  url: 'http://weixin.91smart.net',
  // url: 'http://172.168.11.124:8060',
  // url: 'http://172.168.11.133:8060',
  cos: new COS({
    getAuthorization: (options, callback) => {
      // 异步获取签名
      let method = options.Method;
      let key = options.Key || '';
      let pathname = key;

      let url = 'http://weixin.91smart.net/api/server/auth/?method=' + method + '&pathname=' + encodeURIComponent(pathname);
      var xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.onload = function (e) {
        callback(e.target.responseText);
      };
      xhr.send();

      // var authorization = COS.getAuthorization({
      //   SecretId: 'AKIDHRQFxtMSFwTuAHCyd9UksreMwKWmvreJ',
      //   SecretKey: 'dLi3GPNAlANPFzYvBkAhK3lKtPtKi6Of',
      //   Method: options.Method,
      //   Key: options.Key,
      // });
      // console.log(authorization);
      // callback(authorization);
    }
  }),
  projectstatus: {
    isCommited: 2,
    isDefault: 0,
  }
}

export default config;