import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactMarkdown from 'react-markdown';
import '../css/MsgNotice.css';

class MsgNotice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageIndex: 0,
      pageCapacity: 10,
      wantPage: '',
    };
  }

  calculatePageIndex(index) {
    const pageCapacity = this.state.pageCapacity;
    const { totalmsgs, totalnotices } = this.props;
    let total = null;
    if (this.state.tab === 'msg') {
      total = Math.ceil(totalmsgs / pageCapacity);
    } else {
      total = Math.ceil(totalnotices / pageCapacity);
    }

    if (index < 0) {
      return 0;
    }
    else if (index >= total) {
      return total - 1;
    }
    else {
      return index;
    }
  }

  changewantpage = (e) => {
    this.setState({ wantPage: e.target.value });
  }

  changetab = (tab) => {
    this.setState({ tab });
  }

  pageUp = () => {
    this.setState(prev => ({
      ...prev,
      pageIndex: this.calculatePageIndex(this.state.pageIndex - 1),
    }));
  };

  pageDown = () => {
    this.setState(prev => ({
      ...prev,
      pageIndex: this.calculatePageIndex(this.state.pageIndex + 1),
    }));
  };

  pageTo = (index) => {
    this.setState(prev => ({
      ...prev,
      pageIndex: this.calculatePageIndex(index),
    }));
  };

  pageTowantpage = () => {
    if (this.state.wantPage !== '') {
      this.setState({ pageIndex: parseInt(this.state.wantPage, 10) - 1, wantPage: '' });
    }
  }

  showdetail = (router, item) => {
    if (router.split('-')[2] === 'MsgDetail' && !item.is_read) {
      this.props.readMsg(item.id);
    }
    this.props.setRouter(router);
  }

  getdate = (inputTime) => {
    let date = new Date(inputTime);
    let y = date.getFullYear();
    let m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    let d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    let h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    let minute = date.getMinutes();
    let second = date.getSeconds();
    minute = minute < 10 ? ('0' + minute) : minute;
    second = second < 10 ? ('0' + second) : second;
    return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
  }

  renderPageMenu() {
    const { pageIndex, pageCapacity } = this.state;
    const { totalmsgs, totalnotices, router } = this.props;
    let total = null;
    if (router.split('-')[2] === 'Msg') {
      total = Math.ceil(totalmsgs / pageCapacity);
    } else {
      total = Math.ceil(totalnotices / pageCapacity);
    }
    if (total === 0) {
      return null;
    }

    let first = 0;
    let last = 0;

    if (total <= 7) {
      first = 0;
      last = total - 1;
    } else {
      if (pageIndex < 4) {
        first = 0;
        last = 6;
      } else if (pageIndex > total - 5) {
        last = total - 1;
        first = last - 6;
      } else {
        first = pageIndex - 3;
        last = pageIndex + 3;
      }
    }
    const buttons = [];
    for (let i = first; i <= last; i++) {
      buttons.push(<div className={i === pageIndex ? 'btn-pagination current' : 'btn-pagination'}
        key={i}
        onClick={() => this.pageTo(i)}>{i + 1}</div>);
    }
    return (
      <div className='pagination'>
        <div className='fa fa-arrow-left pageup' onClick={this.pageUp}></div>
        {buttons}
        <div className='fa fa-arrow-right pagedown' onClick={this.pageDown}></div>
        <div className="pageto"><span>跳转到</span><input type="text" value={this.state.wantPage} onChange={this.changewantpage} /><div className="btn-blue-s" onClick={this.pageTowantpage}>确定</div></div>
      </div>
    );
  }

  render() {
    const { msgs, notices, router, setRouter, readAllMsgs } = this.props;
    const { pageIndex, pageCapacity } = this.state;
    if (router.split('-')[2] === 'Msg') {
      let msglist = null;
      if (msgs.length === 0) {
        msglist = <div className='isnull'>暂无消息</div>;
      } else {
        msglist = msgs.slice(pageIndex * pageCapacity, (pageIndex + 1) * pageCapacity).map((item, index) => {
          return (
            <div className="msg-row" key={index} onClick={() => this.showdetail('Home-MsgNotice-MsgDetail-' + item.id, item)}>
              <div className="flex-8 msg-title"><span className={item.is_read ? 'isread' : 'notread'}></span>{item.title}</div>
              <div className="flex-2 msg-time">{this.getdate(item.time)}</div>
            </div>
          );
        });
      }
      return (
        <div className="tab">
          <div className="controls">
            <ul className="tabs">
              <li className={router.split('-')[2] === 'Msg' ? 'current' : ''} onClick={() => setRouter('Home-MsgNotice-Msg')}>消息列表</li>
              <li className={router.split('-')[2] === 'Notice' ? 'current' : ''} onClick={() => setRouter('Home-MsgNotice-Notice')}>公告列表</li>
            </ul>
            {router.split('-')[2] === 'Msg' ? <div className="btn-green-m allreaded" onClick={() => readAllMsgs()}>全部标记为已读</div> : null}
          </div>
          <div className='msglist'>
            {msglist}
          </div>
          {this.renderPageMenu()}
        </div>
      );
    } else if (router.split('-')[2] === 'Notice') {
      let noticelist = null;
      if (notices.length === 0) {
        noticelist = <div className='isnull'>暂无公告</div>;
      } else {
        noticelist = notices.slice(pageIndex * pageCapacity, (pageIndex + 1) * pageCapacity).map((item, index) => {
          return (
            <div className="msg-row" key={index} onClick={() => this.showdetail('Home-MsgNotice-NoticeDetail-' + item.id, item)}>
              <div className="flex-8 msg-title">{item.title}</div>
              <div className="flex-2 msg-time">{this.getdate(item.time)}</div>
            </div>
          );
        });
      }
      return (
        <div className="tab">
          <div className="controls">
            <ul className="tabs">
              <li className={router.split('-')[2] === 'Msg' ? 'current' : ''} onClick={() => setRouter('Home-MsgNotice-Msg')}>消息列表</li>
              <li className={router.split('-')[2] === 'Notice' ? 'current' : ''} onClick={() => setRouter('Home-MsgNotice-Notice')}>公告列表</li>
            </ul>
            {router.split('-')[2] === 'Msg' ? <div className="btn-green-m allreaded" onClick={() => readAllMsgs}>全部标记为已读</div> : null}
          </div>
          <div className='msglist'>
            {noticelist}
          </div>
          {this.renderPageMenu()}
        </div>
      );
    } else {
      let detail = null;
      if (router.split('-')[2] === 'MsgDetail') {
        for (let i = 0; i < msgs.length; i++) {
          if (msgs[i].id === parseInt(router.split('-')[3], 10)) {
            detail = msgs[i];
            break;
          }
        }
      } else {
        for (let i = 0; i < notices.length; i++) {
          if (notices[i].id === parseInt(router.split('-')[3], 10)) {
            detail = notices[i];
            break;
          }
        }
      }
      
      return (
        <div className="detail">
          <div className="detailtitle">{detail.title}</div>
          <div className="detailtime">{this.getdate(detail.time)}</div>
          <div className="detailtext"><ReactMarkdown source={detail.text} /></div>
        </div>
      )
    }
  }
}

const mapStateToProps = (state) => ({ msgs: state.app.msgs, notices: state.app.notices, totalmsgs: state.app.totalmsgs, totalnotices: state.app.totalnotices, router: state.app.router });

const mapDispatchToProps = (dispatch) => ({
  updateMsgsNotices: () => dispatch({ type: 'UPDATE_MSGSNOTICES' }),
  setRouter: (router) => dispatch({ type: 'NAVIGATE_TO_ROUTER', router }),
  readMsg: (id) => dispatch({ type: 'READ_MSG', id }),
  readAllMsgs: (id) => dispatch({ type: 'READ_ALL_MSGS' }),
});

export default connect(mapStateToProps, mapDispatchToProps)(MsgNotice);
