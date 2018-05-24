import React, { Component } from 'react';
import { connect } from 'react-redux';
import ProjectList from './ProjectList';
import Account from './Account';
import MsgNotice from './MsgNotice';
import '../css/Home.css';

class Home extends Component {

  changelisttype = (e) => {
    this.props.enteredHome(e.target.value);
  }

  componentDidMount() {
    this.props.enteredHome('1', null);
  }

  logout = () => {
    this.props.logOut();
  }

  renderCrumbs() {
    const { router, setRouter } = this.props;
    if (router.split('-')[1] === 'List') {
      return (
        <ul className="crumbs-none"></ul>
      )
    } else if (router.split('-')[1] === 'Account') {
      return (
        <ul className="crumbs">
          <li onClick={() => setRouter('Home-List')}>主页</li>
          <li>账号管理</li>
        </ul>
      )
    } else if (router.split('-')[1] === 'MsgNotice') {
      return (
        <ul className="crumbs">
          <li onClick={() => setRouter('Home-List')}>主页</li>
          <li>通知公告</li>
        </ul>
      )
    }
  }

  renderContent() {
    const { listtype, router } = this.props;
    if (router.split('-')[1] === 'List') {
      if (this.props.projects.length > 0) {
        return (
          <div className="content">
            <div className="controls">
              <div className="total">{(listtype === '1' ? '待审核' : (listtype === '3' ? '审核不通过' : (listtype === '2' ? '已上架' : '已下架'))) + '作品总数'}<b>{this.props.projects.length}</b>本</div>
              <select className="form-control listtype" onChange={this.changelisttype}>
                <option value="1">待审核</option>
                <option value="5">审核中</option>
                <option value="3">审核未通过</option>
                <option value="2">审核通过</option>
              </select>
            </div>
            <ProjectList></ProjectList>
          </div>
        );
      } else {
        return (
          <div className="content">
            <div className="controls">
              <div className="total">{(listtype === '1' ? '待审核' : (listtype === '3' ? '审核不通过' : (listtype === '2' ? '已上架' : '已下架'))) + '作品总数'}<b>{this.props.projects.length}</b>本</div>
              <select className="form-control listtype" onChange={this.changelisttype}>
                <option value="1">待审核</option>
                <option value="5">审核中</option>
                <option value="3">审核未通过</option>
                <option value="2">审核通过</option>
              </select>
            </div>
            <p className="list-none">暂时无此类剧本</p>
          </div>
        );
      }
    } else if (router.split('-')[1] === 'Account') {
      return (
        <div className="content">
          <Account></Account>
        </div>
      )
    } else if (router.split('-')[1] === 'MsgNotice') {
      return (
        <div className="content">
          <MsgNotice></MsgNotice>
        </div>
      )
    }
  }

  render() {
    const { setRouter } = this.props;
    return (
      <div className="home">
        <div className="header">
          <div className="title">PutongPutong · <b>管理员专区</b></div>
          <div className="user">
            <ul className="user-menu">
              <li className="text-center" onClick={() => setRouter('Home-MsgNotice')}><span className="fa fa-envelope"></span>通知公告</li>
              <li className="text-center" onClick={() => setRouter('Home-Account')}><span className="fa fa-cog"></span>账号管理</li>
              <li className="text-center" onClick={this.logout}><span className="fa fa-sign-out"></span>退出登录</li>
            </ul>
            <div className="user-name">{this.props.user.name}</div>
          </div>
        </div>
        {this.renderCrumbs()}
        {this.renderContent()}
        <div className="footer">Copyright © 2018 All Right Reserverd    版权所有 上海扬讯计算机科技股份有限公司</div>
      </div >
    );
  }
}

const mapStateToProps = (state) => {
  return { projects: state.projects.list, user: state.user, listtype: state.projects.listtype, router: state.app.router };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logOut: () => dispatch({ type: 'LOGOUT' }),
    setRouter: (router) => dispatch({ type: 'NAVIGATE_TO_ROUTER', router }),
    enteredHome: (status, cback) => dispatch({ type: 'REQUEST_PROJECTS', status, cback }),
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);