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
        project.content.paragraphtree[i].chat_id = parseInt(e.target.value,10);
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
      return <option key={item.name} value={item.id}>{item.name}</option>
    })
    return (
      <div className="paragrapheditor">
        <div className="row roleselect">
          <div className="col-xs-4 roleselect">聊天窗口</div>
          <div className="col-xs-8"><select className="form-control " value={currentparagraph.chat_id} onChange={this.changechatid}><option value="-2">请选聊天对象</option>{rolelist}</select></div>
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