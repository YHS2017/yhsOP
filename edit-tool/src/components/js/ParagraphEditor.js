import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import actiontypes from '../../actions/actiontype';
import actionCreater from '../../actions/index';
import '../css/ParagraphEditor.css';


class ParagraphEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  formatparagraphtxt = () => {
    const txt = this.props.currentparagraph.paragraphtxt;
    let project = { ...this.props.project };
    if (txt !== '') {
      let txtarr = txt.split('\n\n');
      let nodes = [];
      let galleryitems = [];
      for (let i = 0; i < txtarr.length; i++) {
        let temparr = txtarr[i].split('\n');
        if (temparr[0].match(/@\S+/) !== null) {
          //文本
          const text = temparr[1];
          const role_id = this.matchroleid(temparr[0].replace('@', ''))
          nodes.push({ type: 'Text', text: text, role_id: role_id });
        } else if (temparr[0].match(/#img#\S+/) !== null) {
          //图片
          const image = temparr[1];
          const title = temparr[2].replace('=>', '');
          const role_id = this.matchroleid(temparr[0].replace('#img#', ''));
          const gallery_id = this.matchgalleryid(temparr[2].replace('=>', ''));
          nodes.push({ type: 'Image', image: image, role_id: role_id, gallery_id: gallery_id });
          if (temparr.length > 2) {
            galleryitems.push({ title: title, item: { type: 'GalleryItemImage', image: image } });
          }
        } else if (temparr[0].match(/#video#\S+/) !== null) {
          //会面
          const video = temparr[2];
          const text = temparr[1];
          const title = temparr[3].replace('=>', '');
          const role_id = this.matchroleid(temparr[0].replace('#video#', ''));
          const gallery_id = this.matchgalleryid(temparr[3].replace('=>', ''));
          nodes.push({ type: 'Video', video: video, text: text, role_id: role_id, gallery_id: gallery_id });
          if (temparr.length > 3) {
            galleryitems.push({ title: title, item: { type: 'GalleryItemVideo', video: video } });
          }
        } else if (temparr[0].match(/#end#/) !== null) {
          //结局
          const nodetitle = temparr[1];
          const text = temparr[2];
          const image = temparr[3];
          const gallery_id = this.matchgalleryid(temparr[4].replace('=>', ''));
          const gallerytitle = temparr[4].replace('=>', '');
          nodes.push({ type: 'Ending', title: nodetitle, text: text, image: image, gallery_id: gallery_id });
          if (temparr.length > 4) {
            galleryitems.push({ title: gallerytitle, item: { type: 'GalleryItemEnding', title: nodetitle, image: image } });
          }
        } else if (temparr[0].match(/#link#/) !== null) {
          //链接
          const title = temparr[1];
          const text = temparr[2];
          const link = temparr[3];
          const image = temparr[4];
          const role_id = this.matchroleid(temparr[0].replace('#link#', ''));
          nodes.push({ type: 'Link', title: title, text: text, link: link, image: image, role_id: role_id });
        } else if (temparr[0].match(/==/) !== null) {
          //延迟
          const time = parseFloat(temparr[0].replace('==', '')) * 60000;
          nodes.push({ type: 'Delay', time: time });
        } else if (temparr[0].match(/&num&/) !== null) {
          //数值
          const key = temparr[1].split(/[=+*/]/g)[0];
          const value = parseInt(temparr[1].split(/[=+*/]/g)[1], 10);
          const operator = temparr[1].match(/[=+*/]/g)[0];
          nodes.push({ type: 'Number', key: key, value: value, operator: operator });
        } else if (temparr[0].match(/&range&/)) {
          //数值区间
          const key = temparr[1];
          const ranges = temparr[2].split(',').map((item) => { return parseInt(item, 10) });
          const next_paragraph_ids = this.matchparagrahids(temparr[3].split(','));
          nodes.push({ type: 'NumberBranch', key: key, ranges: ranges, next_paragraph_ids: next_paragraph_ids });
        } else if (temparr[0].match(/&busy&/)) {
          //忙碌中
          const target_role_id = this.matchroleid(temparr[0].replace('&busy&', ''));
          const text = temparr[1];
          nodes.push({ type: 'Busy', text: text, target_role_id: target_role_id });
        } else if (temparr[0].match(/&will&/)) {
          //延时开发
          const text = temparr[1];
          const time = parseFloat(temparr[2]) * 60000;
          nodes.push({ type: 'OpenDelay', text: text, time: time });
        } else {
          alert('【' + txtarr[i] + '】，无法格式化请检查！');
        }
      }
      for (let j = 0; j < project.script.paragraphs.length; j++) {
        if (project.script.paragraphs[j].id === this.props.currentparagraph.id) {
          project.script.paragraphs[j] = this.props.currentparagraph;
          break;
        }
      }
      project.script.galleries = this.newgalaries(galleryitems);
      this.setproject(project);
    }
  }

  //根据角色name找id
  matchroleid = (name) => {
    const roles = this.props.project.script.roles;
    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === name) {
        return roles[i].id;
      }
    }
  }

  //根据回忆title找id
  matchgalleryid = (title) => {
    const galleries = this.props.project.script.galleries;
    for (let i = 0; i < galleries.length; i++) {
      if (galleries[i].title === title) {
        return galleries[i].id;
      }
    }
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

  //根据段落title找id
  matchparagrahids = (titles) => {
    let ids = [];
    for (let i = 0; i < titles.length; i++) {
      for (let j = 0; j < this.props.project.script.paragraphs.length; j++) {
        if (titles[i] === this.props.project.script.paragraphs[j].title) {
          ids[i] = this.props.project.script.paragraphs[j].id;
          break;
        }
      }
    }
    return ids;
  }
  //切换聊天对象
  changechatid = (e) => {
    let currentparagraphid = this.props.currentparagraphid;
    let project = { ...this.props.project };
    for (let i = 0; i < project.content.paragraphtree.length; i++) {
      if (project.content.paragraphtree[i].id === currentparagraphid) {
        project.content.paragraphtree[i].chat_id = e.target.value;
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
    const rolelist = this.props.project.content.roles.map((item) => {
      return <option key={item.name} value={item.name}>{item.name}</option>
    })
    return (
      <div className="paragrapheditor">
        <div className="row roleselect">
          <div className="col-xs-4 roleselect">聊天窗口</div>
          <div className="col-xs-8"><select className="form-control " value={currentparagraph.chat_id} onChange={this.changechatid}><option value="0">请选聊天对象</option>{rolelist}</select></div>
        </div>
        <div className="row roleselect">
          <div className="col-xs-4 roleselect">标题</div>
          <div className="col-xs-8"><input className="form-control " value={currentparagraph.title} onChange={this.changetitle} /></div>
        </div>
        <textarea className="noresize" value={currentparagraph.paragraphtxt} onChange={this.paragraphchange} disabled={currentparagraph.type === 'select' ? 'disabled' : false}></textarea>
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