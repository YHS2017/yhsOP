import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import actiontypes from '../../actions/actiontype';
import actionCreater from '../../actions/index';
import '../css/Project.css';

class Project extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: this.props.user,
      defaultimg: '../../nomal.gif'
    };
  }

  toprojectedit = (id) => {
    //异步获取剧本内容
    for (let i = 0; i < this.props.projects.length; i++) {
      if (this.props.projects[i].id === id) {
        this.props.setproject({ ...this.props.projects[i] });
      }
    }
    this.props.history.push("/Author/" + this.state.user.username + "/projecteditor");
  }

  editprojectinfo = (projectinfo) => {
    this.props.setproject(projectinfo);
    this.props.setprojectedittype(1);
    this.props.setprojectinfoshow(true);
  }

  render() {
    const project = this.props.project;
    return (
      <div className="container project">
        <div className="row">
          <div className="col-xs-2"><img className="project_pic" src={project.image === '' ? this.state.defaultimg : project.image} alt="封面" /></div>
          <div className="col-xs-3"><h3>{project.title}</h3><p>{(project.character_count / 10000).toFixed(1)}万字</p><p>{project.tags.replace('&','')}</p></div>
          <div className="col-xs-2"><p>阅读：0</p><p>点赞：0</p><p>评论：0</p><p>打赏：0</p></div>
          <div className="col-xs-2 status">{project.status}</div>
          <div className="col-xs-3">
            <div><div className="btn btn-info" onClick={() => { this.editprojectinfo(project) }} >详情</div><div className="btn btn-primary" onClick={() => { this.toprojectedit(project.id) }}>编辑</div></div>
            <div><div className="btn btn-success">投稿</div><div className="btn btn-danger">删除</div></div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { user: state.user, projects: state.projects };
}

const mapDispatchToProps = (dispatch) => {
  return {
    setproject: (project) => { dispatch(actionCreater(actiontypes.SET_PROJECT, { project: project })) },
    setprojectedittype: (projectinfoedittype) => { dispatch(actionCreater(actiontypes.SET_PROJECT_EDITTYPE, { projectedittype: projectinfoedittype })) },
    setprojectinfoshow: (projectinfoshow) => { dispatch(actionCreater(actiontypes.SET_PROJECTINFO_SHOW, { projectinfoshow: projectinfoshow })) }
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Project));