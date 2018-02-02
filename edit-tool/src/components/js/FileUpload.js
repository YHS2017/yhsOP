import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import COS from 'cos-js-sdk-v5';
// import actiontypes from '../../actions/actiontype';
// import actionCreater from '../../actions/index';
import '../css/FileUpload.css';

let cos = new COS({
  getAuthorization: (options, callback) => {
    // 异步获取签名
    let method = (options.Method || 'get').toLowerCase();
    let key = options.Key || '';
    let pathname = key.indexOf('/') === 0 ? key : '/' + key;

    let url = '../../auth.php?method=' + method + '&pathname=' + encodeURIComponent(pathname);
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onload = function (e) {
        callback(e.target.responseText);
    };
    xhr.send();
  }
});

class FileUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  filechange = (e) => {
    const Bucket='putong-1251001942';
    const Region='ap-shanghai';
    const file = e.target.files[0];
    if (!file) return;

    // 分片上传文件
    cos.sliceUploadFile({
      Bucket: Bucket,
      Region: Region,
      Key: file.name,
      Body: file,
    }, (err, data) => {
      console.log(err, data);
    });
  }

  render() {
    return (
      <input className="upload" type="file" onChange={this.filechange} />
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