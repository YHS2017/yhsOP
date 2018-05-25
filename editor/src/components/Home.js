import React, { Component } from 'react';
import { connect } from 'react-redux';
import ProjectList from './ProjectList';
import NewProject from './NewProject';
import Author from './Author';
import Account from './Account';
import MsgNotice from './MsgNotice';
import defaultimg from '../images/user_default.jpg';
import noneimg from '../images/none.jpg';
import '../css/Home.css';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 1,
      defaultimg: defaultimg,
    };
  }

  componentDidMount() {
    this.props.enteredHome();
  }

  logout = () => {
    this.props.logOut();
  }

  tonewproject = () => {
    const update_time = new Date().getTime();
    const outline = {
      id: 0,
      title: '',
      text: '',
      image: '',
      video: '',
      tags: '',
      character_count: 0,
      update_time: update_time,
      status: 0
    };
    const content = {
      galleries: [
        { id: 1, title: '图片', items: [] },
        { id: 2, title: '视频', items: [] },
        { id: 3, title: '结局', items: [] }
      ],
      roles: [],
      paragraphs: [{
        id: 1,
        type: 'Node',
        title: '未命名段落',
        chat_id: 1,
        text: '',
        next_id: -1
      }],
      numbers: [
        {
          id: 1,
          title: '好感度',
          number: 0,
        }
      ]
    };
    this.props.updateProjectOutline(outline);
    this.props.updateProjectContent(content);
    this.props.setRouter('Home-Newproject');
  };

  changerouter = (router) => {
    this.props.setRouter(router);
  }

  showdetail = (router, item) => {
    if (router.split('-')[2] === 'MsgDetail' && !item.is_read) {
      this.props.readMsg(item.id);
    }
    this.props.setRouter(router);
  }

  renderCrumbs() {
    const screen = this.props.router.split('-')[1];
    const { setRouter, notices } = this.props;
    if (screen === 'List') {
      if (notices.length > 0) {
        return (
          <div className="notice-banner">
            <p onClick={() => setRouter('Home-MsgNotice-NoticeDetail-' + notices[0].id)}>系统公告：{notices[0].title}</p>
            <span className="notice-more" onClick={() => setRouter('Home-MsgNotice-Notice')}>查看更多</span>
          </div>
        )
      } else {
        return null;
      }
    } else if (screen === 'Newproject') {
      return (
        <ul className="crumbs">
          <li onClick={() => setRouter('Home-List')}>主页</li>
          <li onClick={() => setRouter('Home-Newproject')}>创建作品</li>
        </ul>
      )
    } else if (screen === 'MsgNotice') {
      return (
        <ul className="crumbs">
          <li onClick={() => setRouter('Home-List')}>主页</li>
          <li onClick={() => setRouter('Home-MsgNotice-Msg')}>消息中心</li>
        </ul>
      )
    } else if (screen === 'Author') {
      return (
        <ul className="crumbs">
          <li onClick={() => setRouter('Home-List')}>主页</li>
          <li onClick={() => setRouter('Home-Author')}>作者资料</li>
        </ul>
      )
    } else if (screen === "Account") {
      return (
        <ul className="crumbs">
          <li onClick={() => setRouter('Home-List')}>主页</li>
          <li onClick={() => setRouter('Home-Account')}>账号管理</li>
        </ul>
      )
    }
  }

  renderContent() {
    const screen = this.props.router.split('-')[1];
    if (screen === 'List') {
      if (this.props.projects.length > 0) {
        return (
          <div className="container">
            <div className="controls">
              <div className="total">当前作品总数<b>{this.props.projects.length}</b>本</div>
              <div className="btn-green-m tonewproject" onClick={this.tonewproject}>创建作品</div>
            </div>
            <ProjectList></ProjectList>
          </div>
        );
      } else {
        return (
          <div className="container-none">
            <img className="none-img" src={noneimg} alt="" />
            <p className="none-txt">你还没有任何作品</p>
            <div className="btn-green-m tonewproject-none" onClick={this.tonewproject}>创建作品</div>
          </div>
        );
      }
    } else if (screen === 'Newproject') {
      return (
        <div className="content">
          <NewProject></NewProject>
        </div>
      )
    } else if (screen === 'Author') {
      return (
        <div className="content">
          <div className="controls"></div>
          <Author></Author>
        </div>
      )
    } else if (screen === 'MsgNotice') {
      return (
        <div className="content">
          <MsgNotice></MsgNotice>
        </div>
      )
    } else if (screen === "Account") {
      return (
        <div className="content">
          <div className="controls"></div>
          <Account></Account>
        </div>
      )
    }
  }

  render() {
    const { msgs, notread, setRouter, readAllMsgs } = this.props;
    const msgslist = msgs.map((item, key) => {
      if (key < 3) {
        return <div className="notice-pop-item" key={key} onClick={() => this.showdetail('Home-MsgNotice-MsgDetail-' + item.id, item)}>{item.title}</div>
      } else {
        return null
      }
    });
    return (
      <div className="home">
        <div className="header">
          <div className="title">PutongPutong · <b>作者专区</b></div>
          <div className="user">
            <img className="user-photo" alt="头像" src={this.props.user.profile === '' ? this.state.defaultimg : this.props.user.profile} />
            <ul className="user-menu">
              <li className="text-center" onClick={() => setRouter('Home-Author-Show')}><span className="fa fa-user-circle"></span>作者资料</li>
              <li className="text-center" onClick={() => setRouter('Home-Account-OldPhone')}><span className="fa fa-cog"></span>账号管理</li>
              <li className="text-center" onClick={this.logout}><span className="fa fa-sign-out"></span>退出登录</li>
            </ul>
            <div className="user-name">{this.props.user.name}</div>
          </div>
          <div className="notice">
            <span className="fa  fa-bell notice-icon">{notread > 0 ? <b></b> : null}</span>
            <div className="notice-pop">
              <div className="notice-pop-title">
                <span className="notice-pop-text">新消息</span>
                <span className="all-read" onClick={readAllMsgs}>全部标记为已读</span>
              </div>
              {msgslist.length > 0 ? msgslist : <div className="notnewmsg">暂无新消息</div>}
              <div className="more-notice" onClick={() => setRouter('Home-MsgNotice-Msg')}>查看全部消息</div>
            </div>
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
  return { outline: state.outline, projects: state.projects.list, user: state.user, router: state.app.router, msgs: state.app.msgs, notices: state.app.notices, notread: state.app.notread };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logOut: () => dispatch({ type: 'LOGOUT' }),
    setRouter: (router) => dispatch({ type: 'NAVIGATE_TO_ROUTER', router }),
    enteredHome: () => dispatch({ type: 'ENTERED_HOME' }),
    updateProjectOutline: (outline) => dispatch({ type: 'UPDATE_PROJECT_OUTLINE', outline: outline }),
    updateProjectContent: (content) => dispatch({ type: 'UPDATE_PROJECT_CONTENT', content }),
    readMsg: (id) => dispatch({ type: 'READ_MSG', id }),
    readAllMsgs: () => dispatch({ type: 'READ_ALL_MSGs' }),
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);