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
      screen: 'list',
      notice: null,
    };
  }

  calculatePageIndex(index) {
    const pageCapacity = this.state.pageCapacity;
    const { totalnotices } = this.props;
    let total = Math.ceil(totalnotices / pageCapacity);

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

  newnotice = () => {
    let notice = { id: 0, type: '', title: '', text: '' };
    this.setState({ notice, screen: 'editnotice' });
  }

  editnotice = (notice) => {
    this.setState({ notice, screen: 'editnotice' });
  }

  changeonline = (e) => {
    this.setState({ online: e.target.value });
  }

  changewantpage = (e) => {
    this.setState({ wantPage: e.target.value });
  }

  changetitle = (e) => {
    let notice = { ...this.state.notice };
    notice.title = e.target.value;
    this.setState({ notice });
  }

  changetext = (e) => {
    let notice = { ...this.state.notice };
    notice.text = e.target.value;
    this.setState({ notice });
  }

  savenotice = () => {
    this.props.saveNotice(this.state.notice);
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
    const { totalnotices } = this.props;
    let total = Math.ceil(totalnotices / pageCapacity);
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
    const { notices, totalnotices } = this.props;
    const { pageIndex, pageCapacity, screen } = this.state;
    const code = <div className="code"></div>;
    const table = <div className="table"></div>;
    const img = <div className="img"></div>
    console.log(screen);
    if (screen === 'list') {
      if (notices.length === 0) {
        return (
          <div className="msgnotice">
            <div className="controls">
              <div className="totalnotice">{'通知公告(共' + totalnotices + '条)'}</div>
              <div className="btn-green-m newnotice" onClick={this.newnotice}>新建公告</div>
            </div>
            <div className='isnull'>暂无公告</div>
          </div>
        )
      } else {
        const noticelist = notices.slice(pageIndex * pageCapacity, (pageIndex + 1) * pageCapacity).map((item, index) => {
          return (
            <div className="notice-row" key={index}>
              <div className="flex-1 notice-title">{item.title}</div>
              <div className="flex-1">{this.getdate(item.time)}</div>
              <div className="flex-1"><span className="fa fa-pencil notice-actionbtn" onClick={() => this.editnotice(item)}></span><span className="fa fa-trash notice-actionbtn"></span></div>
            </div>
          );
        });
        return (
          <div className="msgnotice">
            <div className="controls">
              <div className="totalnotice">{'通知公告(共' + totalnotices + '条)'}</div>
              <div className="btn-green-m newnotice" onClick={this.newnotice}>新建公告</div>
            </div>
            <div className="noticelist">
              <div className="noticelist-title">
                <div className='flex-1'>标题</div>
                <div className='flex-1'>时间</div>
                <div className='flex-1'>操作</div>
              </div>
              {noticelist}
            </div>
            {this.renderPageMenu()}
          </div>
        );
      }
    } else {
      return (
        <div className="noticeeditor">
          <div className="controls">
            公告标题：<input className="form-control" type="text" value={this.state.notice.title} onChange={this.changetitle} />
            <div className="btn-green-m newnotice" onClick={this.savenotice}>保存公告</div>
          </div>
          <textarea className="noticeedit" value={this.state.notice.text} onChange={this.changetext}></textarea>
          <ReactMarkdown className="noticepreview" source={this.state.notice.text} renderers={{ code, table, img }}></ReactMarkdown>
        </div >
      )
    }
  }
}

const mapStateToProps = (state) => ({ notices: state.app.notices, totalnotices: state.app.totalnotices });

const mapDispatchToProps = (dispatch) => ({
  saveNotice: (notice) => dispatch({ type: 'SAVE_NOTICE', notice }),
});

export default connect(mapStateToProps, mapDispatchToProps)(MsgNotice);
