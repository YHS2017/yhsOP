import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import actiontypes from '../../actions/actiontype';
import actionCreater from '../../actions/index';
import COS from 'cos-js-sdk-v5';
import uuid from 'uuid-js';
import '../css/ParagraphEditor.css';

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

class ParagraphEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uploadurl: '',
      Bucket: '',
      Region: 'ap-shanghai',
      noww: '500px',
      sw: '500px',
      sx: 0,
      canresize: false,
      cursor: 'default',
    };
  }

  //整理新回忆
  newgalaries = (items) => {
    let galleries = [...this.props.project.script.galleries];
    for (let i = 0; i < items.length; i++) {
      for (let j = 0; j < galleries.length; j++) {
        if (items[i].title === galleries[j].title) {
          galleries[j].items = [];
          galleries[j].items.push(items[i].item);
        }
      }
    }
    return galleries;
  }

  //切换聊天对象
  changechatid = (e) => {
    let currentparagraphid = this.props.currentparagraphid;
    let project = { ...this.props.project };
    for (let i = 0; i < project.content.paragraphtree.length; i++) {
      if (project.content.paragraphtree[i].id === currentparagraphid) {
        project.content.paragraphtree[i].chat_id = parseInt(e.target.value, 10);
        this.props.setproject(project);
      }
    }
  }

  changetitle = (e) => {
    let currentparagraphid = this.props.currentparagraphid;
    let project = { ...this.props.project };
    for (let i = 0; i < project.content.paragraphtree.length; i++) {
      if (project.content.paragraphtree[i].id === currentparagraphid) {
        if (project.content.paragraphtree[i].type === 'select') {
          if (project.content.paragraphtree[i].optionid === this.props.currentoptionid) {
            project.content.paragraphtree[i].title = e.target.value;
            this.props.setproject(project);
            break;
          }
        } else {
          project.content.paragraphtree[i].title = e.target.value;
          this.props.setproject(project);
          break;
        }
      }
    }
  }

  paragraphchange = (e) => {
    let currentparagraphid = this.props.currentparagraphid;
    let project = { ...this.props.project };
    for (let i = 0; i < project.content.paragraphtree.length; i++) {
      if (project.content.paragraphtree[i].id === currentparagraphid) {
        project.content.paragraphtree[i].paragraphtxt = e.target.value;
        this.props.setproject(project);
        break;
      }
    }
  }

  addlineno = (txt) => {
    let txtarr = txt.split('\n');
    let lineno = 1;
    for (let i = 0; i < txtarr.length; i++) {
      if (txtarr[i].search(/(\d+\.\s)?@/) === 0) {
        txtarr[i] = lineno + ". @" + txtarr[i].replace(/(\d+\.\s)?@/, '');
        lineno++;
      }
    }
    return txtarr.join('\n');
  }

  ondown = (e) => {
    this.setState({ ...this, sx: e.screenX, canresize: true });
  }

  onmove = (e) => {
    if (this.state.canresize) {
      let temp = this.state.sx - e.screenX;
      temp = temp > 0 ? temp * 1.8 : temp * 0.5;
      temp = temp + parseInt(this.state.sw, 10);
      temp = Math.max(Math.min(temp, 1000), 500) + 'px';
      this.setState({ ...this, noww: temp });
    }
  }

  onup = (e) => {
    this.setState({ ...this, canresize: false, sw: this.state.noww });
  }

  dropfile = (e) => {
    e.preventDefault();
    let file = e.dataTransfer.files[0];
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
        this.setState({ ...this, uploadurl: 'http://' + Bucket + '.picsh.myqcloud.com' + '/script/' + filename });
        let currentparagraphid = this.props.currentparagraphid;
        let project = { ...this.props.project };
        for (let i = 0; i < project.content.paragraphtree.length; i++) {
          if (project.content.paragraphtree[i].id === currentparagraphid) {
            if (Bucket.indexOf('image') !== -1) {
              project.content.paragraphtree[i].paragraphtxt = project.content.paragraphtree[i].paragraphtxt + '#图片#' + this.state.uploadurl;
            } else {
              project.content.paragraphtree[i].paragraphtxt = project.content.paragraphtree[i].paragraphtxt + '#视频#' + this.state.uploadurl;
            }
            this.props.setproject(project);
            break;
          }
        }
      }
    });
  }

  render() {
    let currentparagraph = null;
    const project = this.props.project;
    for (let i = 0; i < project.content.paragraphtree.length; i++) {
      if (project.content.paragraphtree[i].type !== 'select') {
        if (project.content.paragraphtree[i].id === this.props.currentparagraphid) {
          currentparagraph = project.content.paragraphtree[i];
        }
      } else {
        if (project.content.paragraphtree[i].id === this.props.currentparagraphid && project.content.paragraphtree[i].optionid === this.props.currentoptionid) {
          currentparagraph = project.content.paragraphtree[i];
        }
      }
    }
    currentparagraph.paragraphtxt = this.addlineno(currentparagraph.paragraphtxt);
    const rolelist = this.props.project.content.roles.map((item) => {
      return <option key={item.name} value={item.id}>{item.name}</option>
    })
    return (
      <div className="paragrapheditor" style={{ width: this.state.noww, display: (this.props.editorshow ? 'block' : 'none') }} onMouseMove={this.onmove} onMouseUp={this.onup} onMouseOut={this.onout}>
        <span className="resize glyphicon glyphicon-resize-horizontal" onMouseDown={this.ondown} ></span>
        <div className="row roleselect">
          <div className="col-xs-1 roleselect"></div>
          <div className="col-xs-3 roleselect">聊天窗口</div>
          <div className="col-xs-8"><select className="form-control " value={currentparagraph.chat_id} onChange={this.changechatid}><option value="-2">请选聊天对象</option>{rolelist}</select></div>
        </div>
        <div className="row roleselect">
          <div className="col-xs-1 roleselect"></div>
          <div className="col-xs-3 roleselect">标题</div>
          <div className="col-xs-8"><input className="form-control " value={currentparagraph.title} onChange={this.changetitle} /></div>
        </div>
        <textarea className="editor" draggable="true" value={currentparagraph.paragraphtxt} onChange={this.paragraphchange} disabled={currentparagraph.type === 'select' ? 'disabled' : false} onDrop={this.dropfile}></textarea>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { project: state.project, currentparagraphid: state.currentparagraphid, currentoptionid: state.currentoptionid };
}

const mapDispatchToProps = (dispatch) => {
  return {
    setproject: (project) => { dispatch(actionCreater(actiontypes.SET_PROJECT, { project: project })) },
    setcurrentparagraphid: (currentparagraphid) => { dispatch(actionCreater(actiontypes.SET_CURRENT_PARAGRAPHID, { currentparagraphid: currentparagraphid })) }
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ParagraphEditor));