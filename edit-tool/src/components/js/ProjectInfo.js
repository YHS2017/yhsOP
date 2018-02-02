import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import actiontypes from '../../actions/actiontype';
import actionCreater from '../../actions/index';
import FileUpload from './FileUpload';
import '../css/ProjectInfo.css';

class ProjectInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: this.props.user,
      projects: this.props.projects
    };
  }

  tagschange = (e) => {
    let project = { ...this.props.project };
    if (project.tags.indexOf(e.target.value) < 0) {
      project.tags = project.tags.replace('&', e.target.value + ',&');
      this.props.setproject(project);
    } else {
      project.tags = project.tags.replace(e.target.value + ',', '');
      this.props.setproject(project);
    }
  }

  othertags = (e) => {
    let project = { ...this.props.project };
    const nowother = project.tags.split('&')[1];
    project.tags = project.tags.replace('&' + nowother, '&' + e.target.value);
    this.props.setproject(project);
  }

  textchange = (e) => {
    let project = { ...this.props.project };
    project.text = e.target.value;
    this.props.setproject(project);
  }

  titlechange = (e) => {
    let project = { ...this.props.project };
    project.title = e.target.value;
    this.props.setproject(project);
  }

  saveinfo = () => {
    //异步更新剧本列表
    let projects = [...this.props.projects];
    if (this.props.projectedittype === 0) {
      projects.push(this.props.project);
      this.props.setprojects(projects);
      this.props.setprojectinfoshow(false);
      const path = '/Author/' + this.state.user.username + '/projecteditor';
      this.props.history.push(path);
    } else {
      for (let i = 0; i < projects.length; i++) {
        if (projects[i].id === this.props.project.id) {
          projects[i] = this.props.project;
        }
      }
      this.props.setprojects(projects);
      this.props.setprojectinfoshow(false);
    }
  }

  render() {
    const { project, projectinfoshow, setprojectinfoshow } = this.props;
    return (
      <div className={"container projectinfo " + (projectinfoshow ? 'show' : 'hide')}>
        <div className="row">
          <div className="col-xs-12"><h3 className="text-center title">作品详情</h3><span className="glyphicon glyphicon-remove close" onClick={() => { setprojectinfoshow(false) }}></span></div>
        </div>
        <div className="row">
          <div className="col-xs-3">作品标题</div>
          <div className={'col-xs-9 ' + (project.title === '' ? 'has-error' : 'has-success')}><input type="text" className="form-control" placeholder="请输入标题" value={project.title} onChange={this.titlechange} /></div>
        </div>
        <div className="row">
          <div className="col-xs-3">男主人设</div>
          <div className="col-xs-9">
            <div className="row tags">
              <div className="col-xs-4 tip">
                <div className="checkbox">
                  <label><input type="checkbox" value="暖男" checked={project.tags.indexOf('暖男') !== -1} onChange={this.tagschange} /><i>暖男</i></label>
                </div>
              </div>
              <div className="col-xs-4 tip">
                <div className="checkbox">
                  <label><input type="checkbox" value="霸道" checked={project.tags.indexOf('霸道') !== -1} onChange={this.tagschange} /><i>霸道</i></label>
                </div>
              </div>
              <div className="col-xs-4 tip">
                <div className="checkbox">
                  <label><input type="checkbox" value="忠犬" checked={project.tags.indexOf('忠犬') !== -1} onChange={this.tagschange} /><i>忠犬</i></label>
                </div>
              </div>
            </div>
            <div className="row tags">
              <div className="col-xs-4 tip">
                <div className="checkbox">
                  <label><input type="checkbox" value="活力" checked={project.tags.indexOf('活力') !== -1} onChange={this.tagschange} /><i>活力</i></label>
                </div>
              </div>
              <div className="col-xs-4 tip">
                <div className="checkbox">
                  <label><input type="checkbox" value="二次元" checked={project.tags.indexOf('二次元') !== -1} onChange={this.tagschange} /><i>二次元</i></label>
                </div>
              </div>
              <div className="col-xs-4 tip">
                <div className="checkbox">
                  <label><input type="checkbox" value="高冷" checked={project.tags.indexOf('高冷') !== -1} onChange={this.tagschange} /><i>高冷</i></label>
                </div>
              </div>
            </div>
            <div className="row tags">
              <div className="col-xs-4 tip">
                <div className="checkbox">
                  <label><input type="checkbox" value="腹黑" checked={project.tags.indexOf('腹黑') !== -1} onChange={this.tagschange} /><i>腹黑</i></label>
                </div>
              </div>
              <div className="col-xs-4 tip">
                <div className="checkbox">
                  <label><input type="checkbox" value="痞气糙汉" checked={project.tags.indexOf('痞气糙汉') !== -1} onChange={this.tagschange} /><i>痞气糙汉</i></label>
                </div>
              </div>
              <div className="col-xs-4 tip">
                <div className="checkbox">
                  <label><input type="checkbox" value="妖艳邪魅" checked={project.tags.indexOf('妖艳邪魅') !== -1} onChange={this.tagschange} /><i>妖艳邪魅</i></label>
                </div>
              </div>
            </div>
            <div className="row tags">
              <div className="col-xs-4 tip">
                <div className="checkbox">
                  <label><input type="checkbox" value="暗黑鬼畜" checked={project.tags.indexOf('暗黑鬼畜') !== -1} onChange={this.tagschange} /><i>暗黑鬼畜</i></label>
                </div>
              </div>
              <div className="col-xs-8 tip">
                <div className="input-group input-group-sm">
                  <span className="input-group-addon">其他</span>
                  <input type="text" className="form-control" value={project.tags.split('&')[1]} onChange={this.othertags} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-3">作品简介</div>
          <div className={"col-xs-9 " + (project.text === '' ? 'has-error' : 'has-success')}><textarea className="form-control noresize" rows="5" maxLength="200" placeholder="(不得超过200字)" value={project.text} onChange={this.textchange}></textarea></div>
        </div>
        <div className="row">
          <div className="col-xs-3">封面配图</div>
          <div className="col-xs-9"><label className="lab_upload"><FileUpload></FileUpload>140X140</label></div>
        </div>
        <div className="row">
          <div className="col-xs-12 text-center"><div className="btn btn-success" onClick={this.saveinfo}>确 定</div></div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { user: state.user, projects: state.projects, project: state.project, projectedittype: state.projectedittype, projectinfoshow: state.projectinfoshow };
}

const mapDispatchToProps = (dispatch) => {
  return {
    setprojects: (projects) => { dispatch(actionCreater(actiontypes.SET_PROJECTS, { projects: projects })) },
    setproject: (project) => { dispatch(actionCreater(actiontypes.SET_PROJECT, { project: project })) },
    setprojectedittype: (projectedittype) => { dispatch(actionCreater(actiontypes.SET_PROJECT_EDITTYPE, { projectedittype: projectedittype })) },
    setprojectinfoshow: (projectinfoshow) => { dispatch(actionCreater(actiontypes.SET_PROJECTINFO_SHOW, { projectinfoshow: projectinfoshow })) },
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ProjectInfo));