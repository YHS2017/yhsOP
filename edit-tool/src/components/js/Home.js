import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import ProjectInfo from './ProjectInfo';
import actiontypes from '../../actions/actiontype';
import actionCreater from '../../actions/index';
import Notice from './Notice';
import Project from './Project';
import '../css/Home.css';


class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: this.props.user,
      index: 1
    }
  }

  componentWillMount() {
    fetch('../../data.json').then(data => {
      data.text().then(listdata => {
        if (listdata === '') {
          return
        } else {
          const list = JSON.parse(listdata);
          this.props.setprojects(list);
        }
      })
    });
  }

  pageup = () => {
    const index = this.state.index - 1 < 1 ? 1 : this.state.index - 1;
    this.setState({ ...this, index: index });
  }

  pagedown = () => {
    const pages = Math.ceil(this.props.projects.length / 4);
    const index = this.state.index + 1 > pages ? pages : this.state.index + 1;
    this.setState({ ...this, index: index });
  }

  pageto = (index) => {
    this.setState({ ...this, index: index });
  }

  getpagenationbtns = (pages, index) => {
    let pagebtns = [];
    pagebtns.push({ id: '上一页', text: '上一页', active: 0 });
    if (pages <= 10) {
      for (let i = 1; i <= pages; i++) {
        if (i === index) {
          pagebtns.push({ id: i, text: i, active: 1 });
        } else {
          pagebtns.push({ id: i, text: i, active: 0 });
        }
      }
    } else {
      if (index <= 5) {
        for (let i = 1; i <= 8; i++) {
          if (i === index) {
            pagebtns.push({ id: i, text: i, active: 1 });
          } else {
            pagebtns.push({ id: i, text: i, active: 0 });
          }
        }
        pagebtns.push({ id: '...1', text: '...', active: 0 });
        pagebtns.push({ id: 10, text: pages, active: 0 });
      } else if (index > 5 && index < pages - 5) {
        pagebtns.push({ id: 1, text: 1, active: 0 });
        pagebtns.push({ id: '...0', text: '...', active: 0 });
        for (let i = index - 3; i <= index + 2; i++) {
          if (i === index) {
            pagebtns.push({ id: i, text: i, active: 1 });
          } else {
            pagebtns.push({ id: i, text: i, active: 0 });
          }
        }
        pagebtns.push({ id: '...1', text: '...', active: 0 });
        pagebtns.push({ id: 10, text: pages, active: 0 });
      } else {
        pagebtns.push({ id: 1, text: 1, active: 0 });
        pagebtns.push({ id: '...0', text: '...', active: 0 });
        for (let i = pages - 7; i <= pages; i++) {
          if (i === index) {
            pagebtns.push({ id: i, text: i, active: 1 });
          } else {
            pagebtns.push({ id: i, text: i, active: 0 });
          }
        }
      }
    }
    pagebtns.push({ id: '下一页', text: '下一页', active: 0 });
    return pagebtns;
  }

  newproject = () => {
    const projects = this.props.projects;
    const id = projects.length > 0 ? (Math.max.apply(Math, projects.map((item) => { return item.id })) + 1) : 1;
    const project = { id: id, title: '', text: '', image: '', tags: '&', author_id: 0, character_count: 0, update_time: '2018-01-31 18:20:20', status: 0, script: { roles: [], paragraphs: [{ id: 1, title: '段落标题', chat_id: 1, nodes: [], paragraphtxt: '' }], galleries: [] }, content: { projecttreedata: [{ id: 1, type: 'text', nextid: 0 }] } };
    this.props.setproject(project);
    this.props.setprojectedittype(0);
    this.props.setprojectinfoshow(true);
  }

  render() {
    const index = this.state.index;
    const projects = this.props.projects;
    const pages = Math.ceil(projects.length / 4);
    const pagenationbtns = this.getpagenationbtns(pages, index);
    let projectsview = null;
    let pagenationbtnsview = null;
    if (projects === null) {
      projectsview = <div className="isnull">暂无剧本</div>;
      pagenationbtnsview = <div className="isnull">没有更多数据了~</div>;
    } else {
      projectsview = projects.slice(index * 4 - 4, index * 4).map((item, index) => {
        return <Project project={item} key={item.id}></Project>
      });

      if (pages > 1) {
        pagenationbtnsview = pagenationbtns.map((item, index) => {
          if (index === 0) {
            return <div className="btn btn-default" key={item.id} onClick={this.pageup}>{item.text}</div>
          } else if (index === pagenationbtns.length - 1) {
            return <div className="btn btn-default" key={item.id} onClick={this.pagedown}>{item.text}</div>
          } else if (item.active === 1) {
            return <div className="btn btn-info" key={item.id}>{item.text}</div>
          } else if (item.text === '...') {
            return <div className="btn btn-default" key={item.id}>{item.text}</div>
          } else {
            return <div className="btn btn-default" key={item.id} onClick={() => { this.pageto(item.text) }}>{item.text}</div>
          }
        });
      } else {
        pagenationbtnsview = <div className="isnull">没有更多数据了~</div>;
      }
    }

    return (
      <div className="container">
        <div className="header">
          <div className="container-fluid">
            <div className="row">
              <div className="col-xs-2"><h3 className="text-center">剧本编辑器</h3></div>
              <div className="col-xs-6"></div>
              <div className="col-xs-4 text-center">
                <div className="btn btn-info" onClick={this.newproject}>新建剧本</div>
                <img className="userphoto" alt="头像" src={this.state.user.userphoto} />
                <DropdownButton className="user" title={this.state.user.username} pullRight id="dropdown-size-medium">
                  <MenuItem className="text-center">个人信息</MenuItem>
                  <MenuItem className="text-center">申请签约</MenuItem>
                  <MenuItem className="text-center">投稿须知</MenuItem>
                  <MenuItem className="text-center">退出登录</MenuItem>
                </DropdownButton>
              </div>
            </div>
          </div>
        </div>
        <ProjectInfo></ProjectInfo>
        <Notice></Notice>
        <div className="container">
          <div className="row line">
            <div className="col-xs-2 text-center"><h2>作品封面</h2></div>
            <div className="col-xs-3 text-center"><h2>作品信息</h2></div>
            <div className="col-xs-2 text-center"><h2>作品成绩</h2></div>
            <div className="col-xs-2 text-center"><h2>当前状态</h2></div>
            <div className="col-xs-3 text-center"><h2>操作</h2></div>
          </div>
        </div>
        <div className="list">{projectsview}</div>
        <div className="pagination"><div className="btn-group">{pagenationbtnsview}</div></div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { projects: state.projects, user: state.user, projectinfo: state.projectinfo };
}

const mapDispatchToProps = (dispatch) => {
  return {
    setprojects: (projects) => { dispatch(actionCreater(actiontypes.SET_PROJECTS, { projects: projects })) },
    setproject: (project) => { dispatch(actionCreater(actiontypes.SET_PROJECT, { project: project })) },
    setprojectedittype: (projectedittype) => { dispatch(actionCreater(actiontypes.SET_PROJECT_EDITTYPE, { projectedittype: projectedittype })) },
    setprojectinfoshow: (projectinfoshow) => { dispatch(actionCreater(actiontypes.SET_PROJECTINFO_SHOW, { projectinfoshow: projectinfoshow })) },
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Home));