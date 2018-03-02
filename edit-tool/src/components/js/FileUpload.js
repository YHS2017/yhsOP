import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import COS from 'cos-js-sdk-v5';
import uuid from 'uuid-js';
//import actiontypes from '../../actions/actiontype';
// import actionCreater from '../../actions/index';
import '../css/FileUpload.css';

let cos = new COS({
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
});

class FileUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      img: '',
      defaultimg: '../../nomal.gif',
    };
  }

  fileupload = (e) => {
    const file = e.target.files[0];
    let Bucket = '';
    let Region = 'ap-shanghai';
    if (!file) return;
    let filetype = file.name.slice(file.name.indexOf('.')).toLowerCase();
    let filename = uuid.create(4) + filetype;
    if (filetype === '.jpg' || filetype === '.jpeg' || filetype === '.png' || filetype === '.gif') {
      Bucket = 'image-1251001942';
    } else if (filetype === '.mp4') {
      Bucket = 'video-1251001942';
    } else {
      return;
    }

    // 上传文件
    cos.putObject({
      Bucket: Bucket,
      Region: Region,
      Key: '/script/' + filename,
      Body: file,
    }, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        console.log(data);
        this.props.getuploadurl('http://' + Bucket + '.picsh.myqcloud.com' + '/script/' + filename);
      }
    });
  }

  render() {
    return (
      <div className="uploadbox">
        <label>
          <img src={this.state.img === '' ? (this.props.src === '' ? this.state.defaultimg : this.props.src + '?imageView2/2/w/400/q/85!') : this.state.img} alt="" />
          <input className="upload" type="file" onChange={this.fileupload} />
        </label>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { user: state.user };
}

const mapDispatchToProps = (dispatch) => {
  return {
    // setscriptinfo: (scriptinfo) => { dispatch(actionCreater(actiontypes.SET_SCRIPTINFO, { scriptinfo: scriptinfo })) },
    // setscriptinfoedittype: (scriptinfoedittype) => { dispatch(actionCreater(actiontypes.SET_SCRIPTINFO_EDITTYPE, { scriptinfoedittype: scriptinfoedittype })) },
    // setscriptinfoshow: (scriptinfoshow) => { dispatch(actionCreater(actiontypes.SET_SCRIPTINFO_SHOW, { scriptinfoshow: scriptinfoshow })) }
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FileUpload));