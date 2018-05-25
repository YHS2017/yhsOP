import React, { Component } from 'react';
import { connect } from 'react-redux';
import defaultimg from '../images/upload_default.png';
import '../css/FileUpload.css';

class FileUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      defaultimg: defaultimg,
      imgerror: false,
      file: '',
    };
  }

  uploadFile = (e) => {
    if (e.target.value !== '') {
      this.props.uploadFile(e.target.files[0], this.props.filetype, (path) => { this.props.getuploadurl(path) });
    }
    this.setState({ file: '' });
  }

  reloadimg = (e) => {
    let img = e.target;
    let url = this.props.src + '.0_0.p0.jpg?';
    setTimeout(() => {
      img.src = url + Math.random();
    }, 1000);
  }

  render() {
    if (this.props.filetype === 'img') {
      return (
        <label id="uploadbox">
          <img src={this.props.src ? this.props.src + '?imageView2/1/w/400/q/85!' : this.state.defaultimg} alt="" />
          <input className="upload" type="file" value={this.state.file} onChange={this.uploadFile} />
        </label>
      )
    } else if (this.props.filetype === 'video') {
      return (
        <label id="uploadbox">
          <div className="uploadinfo"><span className="fa fa-check icon-ok"></span><p>预览图生成中...</p></div>
          <img src={this.props.src ? this.props.src + '.0_0.p0.jpg' : this.state.defaultimg} alt="" onError={this.reloadimg} />
          <input className="upload" type="file" value={this.state.file} onChange={this.uploadFile} />
        </label>
      )
    } else {
      return (
        <label id="uploadbox">
          {this.props.src ? <div className="uploadinfo"><span className="fa fa-check icon-ok"></span><p>上传成功</p></div> : <div className="audioinfo"></div>}
          <input className="upload" type="file" onChange={this.uploadFile} />
        </label>
      )
    }
  }
}

const mapStateToProps = (state) => {
  return { user: state.user };
}

const mapDispatchToProps = (dispatch) => {
  return {
    uploadFile: (file, filetype, callback) => dispatch({ type: 'UPLOAD_FILE', file, filetype, callback })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FileUpload);