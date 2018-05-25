import React, { Component } from 'react';
import { connect } from 'react-redux';
import FileUpload from './FileUpload';
import ptwximg from '../images/ptwx.jpg';
import Roles from './Roles';
import '../css/NewProject.css';

class ProjectInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inittags: ['暖男', '霸道总裁', '腹黑', '高冷', '傲娇', '温柔', '高智商', '忠犬', '妖孽', '小奶狗', '黑道', '渣男', '禁欲', '阳光', '校草', '痴汉', '正太', '黑化', '绅士', '毒舌'
      ],
      step: 'outline',
    };
  }

  addothertags = () => {
    let outline = { ...this.props.outline };
    let tagstxt = outline.tags;
    const zdy_arr = tagstxt.match(/自定义标签/g);
    if (tagstxt === '') {
      tagstxt = '自定义标签1';
    } else {
      if (tagstxt.split(',').length === 5) {
        return;
      }
      tagstxt = tagstxt + ',自定义标签' + (zdy_arr ? (zdy_arr.length + 1) : '1');
    }
    outline.tags = tagstxt;
    this.props.updateProjectOutline(outline);
  }

  deleteothertags = (index) => {
    let outline = { ...this.props.outline };
    let tagsarr = [];
    let arrothertags = [];
    if (outline.tags !== '') {
      arrothertags = outline.tags.split(',');
    }
    for (let i = 0; i < arrothertags.length; i++) {
      for (let j = 0; j < this.state.inittags.length; j++) {
        if (arrothertags[i] === this.state.inittags[j]) {
          tagsarr.push(this.state.inittags[j]);
          arrothertags.splice(i, 1);
          i--;
        }
      }
    }
    arrothertags.splice(index, 1);
    tagsarr = tagsarr.concat(arrothertags);
    outline.tags = tagsarr.join(',');
    this.props.updateProjectOutline(outline);
  }

  changeothertags = (e, index) => {
    let outline = { ...this.props.outline };
    let tagsarr = [];
    let arrothertags = [];
    if (outline.tags !== '') {
      arrothertags = outline.tags.split(',');
    }
    for (let i = 0; i < arrothertags.length; i++) {
      for (let j = 0; j < this.state.inittags.length; j++) {
        if (arrothertags[i] === this.state.inittags[j]) {
          tagsarr.push(this.state.inittags[j]);
          arrothertags.splice(i, 1);
          i--;
        }
      }
    }
    arrothertags[index] = e.target.value;
    tagsarr = tagsarr.concat(arrothertags);
    outline.tags = tagsarr.join(',');
    this.props.updateProjectOutline(outline);
  }

  initothertags = (e, index) => {
    let outline = { ...this.props.outline };
    let tagsarr = [];
    let arrothertags = [];
    if (outline.tags !== '') {
      arrothertags = outline.tags.split(',');
    }
    for (let i = 0; i < arrothertags.length; i++) {
      for (let j = 0; j < this.state.inittags.length; j++) {
        if (arrothertags[i] === this.state.inittags[j]) {
          tagsarr.push(this.state.inittags[j]);
          arrothertags.splice(i, 1);
          i--;
        }
      }
    }
    if (arrothertags[index] === '') {
      arrothertags[index] = '自定义标签' + (index + 1);
    } else if (arrothertags[index] === '自定义标签' + (index + 1)) {
      arrothertags[index] = '';
    }
    tagsarr = tagsarr.concat(arrothertags);
    outline.tags = tagsarr.join(',');
    this.props.updateProjectOutline(outline);
  }

  tagschange = (e) => {
    let outline = { ...this.props.outline };
    let tagstxt = outline.tags;
    let tagsarr = [];
    if (tagstxt === '') {
      tagstxt = e.target.value;
    } else {
      tagsarr = tagstxt.split(',');
      let has = false;
      for (let i = 0; i < tagsarr.length; i++) {
        if (tagsarr[i] === e.target.value) {
          tagsarr.splice(i, 1);
          i--;
          has = true;
          break;
        }
      }
      if (!has) {
        if (tagsarr.length === 5) {
          return;
        }
        tagsarr.push(e.target.value);
      }
      tagstxt = tagsarr.join(',');
    }
    outline.tags = tagstxt;
    this.props.updateProjectOutline(outline);
  }

  textchange = (e) => {
    let outline = { ...this.props.outline };
    outline.text = e.target.value;
    this.props.updateProjectOutline(outline);
  }

  titlechange = (e) => {
    let outline = { ...this.props.outline };
    outline.title = e.target.value;
    this.props.updateProjectOutline(outline);
  }

  changeprojectimage = (url) => {
    let outline = { ...this.props.outline };
    outline.image = url;
    this.props.updateProjectOutline(outline);
  }

  changeprojectvideo = (url) => {
    let outline = { ...this.props.outline };
    outline.video = url;
    this.props.updateProjectOutline(outline);
  }

  tosteproles = () => {
    if (this.props.outline.image === '') {
      this.props.showMessage('必须上传作品图片！');
    } else if (this.props.outline.title === '') {
      this.props.showMessage('作品名称不能为空！');
    } else if (this.props.outline.tags === '') {
      this.props.showMessage('至少要有1个作品标签！');
    } else if (this.props.outline.title.length > 15) {
      this.props.showMessage('作品名称字数不在限制范围内！');
    } else if (this.props.outline.text.length < 20) {
      this.props.showMessage('作品简介字数不在限制范围内！');
    } else if (this.props.outline.text.length > 200) {
      this.props.showMessage('作品简介字数不在限制范围内！');
    } else {
      this.setState({ step: 'roles' });
    }
  }

  tostepdone = () => {
    this.props.newProject(() => {
      this.setState({ step: 'done' });
    });
  }

  renderothertags = () => {
    let arrothertags = [];
    if (this.props.outline.tags !== '') {
      arrothertags = this.props.outline.tags.split(',');
    }
    for (let i = 0; i < arrothertags.length; i++) {
      for (let j = 0; j < this.state.inittags.length; j++) {
        if (arrothertags[i] === this.state.inittags[j]) {
          arrothertags.splice(i, 1);
          i--;
        }
      }
    }
    let othertags = arrothertags.map((tag, key) => {
      return <div key={key}><input className="form-control" type="text" value={tag} maxLength="7" onBlur={(e) => this.initothertags(e, key)} onFocus={(e) => this.initothertags(e, key)} onChange={(e) => this.changeothertags(e, key)} /><div className="fa fa-minus-square delete-tag-item" onClick={(e) => this.deleteothertags(key)}></div></div>
    });
    return (
      <tr>
        <td className="table-txt"></td>
        <td className="table-content">
          {othertags}
          <div className="fa fa-plus-square add-tag-item" onClick={this.addothertags}></div>
          <p className="table-alert">点击添加自定义标签，最多7个字；标签总数最多5个</p>
        </td>
      </tr>
    )
  }

  render() {
    const outline = this.props.outline;
    if (this.state.step === 'outline') {
      const tags = this.state.inittags.map((tag, key) => {
        return (
          <label className="checkbox" key={key}><input type="checkbox" value={tag} checked={outline.tags.indexOf(tag) !== -1} onChange={this.tagschange} /><i>{tag}</i></label>
        );
      });
      return (
        <div className="step">
          <div className="steps">
            <div className="step-outline current"><span className="fa fa-dot-circle-o"></span></div>
            <div className="step-roles"><span className="fa fa-circle-thin"></span></div>
            <div className="step-done"><span className="fa fa-circle-thin"></span></div>
          </div>
          <div className="newproject">
            <div className="project-preview">
              <FileUpload getuploadurl={this.changeprojectimage.bind(this)} src={outline.image} filetype="img"></FileUpload>
              <p>作品封面</p>
              <FileUpload getuploadurl={this.changeprojectvideo.bind(this)} src={outline.video} filetype="video"></FileUpload>
              <p>预览视频</p>
            </div>
            <table>
              <tbody>
                <tr>
                  <td className="table-txt">作品名称：</td>
                  <td className="table-content">
                    <input className="form-control" value={outline.title} type="text" maxLength="15" onChange={this.titlechange} />
                    <p className="table-alert">15字以内，请勿添加书名号符号</p>
                  </td>
                </tr>
                <tr>
                  <td className="table-txt">作品标签：</td>
                  <td className="table-content tag-items">
                    {tags}
                  </td>
                </tr>
                {this.renderothertags()}
                <tr>
                  <td className="table-txt">作品简介：</td>
                  <td className="table-content">
                    <textarea className="form-control" rows="6" cols="60" value={outline.text} onChange={this.textchange}></textarea>
                    <p className="table-alert">20~200字之内，简要介绍作品概述</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="btn-green-m btn-step" onClick={this.tosteproles}>下一步</div>
        </div>
      );
    } else if (this.state.step === 'roles') {
      return (
        <div className="step">
          <div className="steps">
            <div className="step-outline done"><span className="fa fa-check-circle"></span></div>
            <div className="step-roles current"><span className="fa fa-dot-circle-o"></span></div>
            <div className="step-done"><span className="fa fa-circle-thin"></span></div>
          </div>
          <Roles></Roles>
          <div className="btn-green-m btn-step" onClick={this.tostepdone}>下一步</div>
        </div>
      );
    } else {
      return (
        <div className="step">
          <div className="steps">
            <div className="step-outline done"><span className="fa fa-check-circle"></span></div>
            <div className="step-roles done"><span className="fa fa-check-circle"></span></div>
            <div className="step-done current"><span className="fa fa-dot-circle-o"></span></div>
          </div>
          <div className="projectdone">
            <div className="projectdone-title">作品创建成功！</div>
            <div className="projectdone-text">
              <p>新建作品后，请尽快编辑内容。投稿作品满2000字之后将会进入编辑审核后台，编辑将会在3个工作日内进行审核。</p>
              <p>请注意：根据国家相关法律法规要求，请勿上传任何色情、低俗、涉政等违法违规内容，我们将会根据法规进行审核处理和上报。</p>
            </div>
            <div className="btn-green-m" onClick={this.props.navigateToProjectEditor}>编辑作品</div>
            <div className="projectdone-notice">
              <p>关注官方微信服务号，提供行业分析、写作指南、问题咨询等服务。</p>
              <div className="ptwx-box">
                <img src={ptwximg} alt="" />
                <div className="ptwx-title">扑通扑通服务号</div>
                <p>真实感爆棚的互动短信情景剧、超级治愈的恋爱体验平台——《扑通扑通》。和真人恋爱，约会，聊天，打电话、人人都成为恋爱制作人。欢迎加入扑通扑通官方群303880585。</p>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}

const mapStateToProps = (state) => {
  return { user: state.user, projects: state.projects.list, outline: state.editor.outline, content: state.editor.content };
}

const mapDispatchToProps = (dispatch) => {
  return {
    newProject: (cback) => dispatch({ type: 'NEW_PROJECT', cback }),
    updateProjectOutline: (outline) => dispatch({ type: 'UPDATE_PROJECT_OUTLINE', outline }),
    navigateToProjectEditor: () => dispatch({ type: 'NAVIGATE_TO_ROUTER', router: 'ProjectEditor-Editor' }),
    showMessage: (content) => dispatch({ type: 'SET_APP_MESSAGE', message: { content } })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectInfo);