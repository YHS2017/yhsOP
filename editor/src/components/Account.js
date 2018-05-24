import React, { Component } from 'react';
import { connect } from 'react-redux';
import '../css/Account.css';

class Account extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phone: '',
      code: '',
      codetext: '获取验证码',
    };
  }

  changphone = (e) => {
    this.setState({ phone: e.target.value });
  }

  changecode = (e) => {
    this.setState({ code: e.target.value });
  }

  getcode = () => {
    this.setState({ codetext: '60s后可重新获取' });
    if (this.state.phone !== '') {
      this.props.sendPhoneMsgBind(this.state.phone);
      this.timer = setInterval(() => {
        const time = parseInt(this.state.codetext, 10);
        if (time > 0) {
          this.setState({ codetext: (time - 1) + 's后可重新获取' });
        } else {
          this.setState({ codetext: '获取验证码' });
        }
      }, 1000);
    }
  }

  checkoldphone = () => {
    const { phone, code } = this.state;
    if (phone !== '' && code !== '') {
      this.props.checkOldPhone(code);
    }
  }

  newphonebind = () => {
    const { phone, code } = this.state;
    if (phone !== '' && code !== '') {
      this.props.phoneBind(code);
    }
  }

  render() {
    const { router, user } = this.props;
    if (router.split('-')[2] === 'OldPhone') {
      return (
        <div className="account">
          <table>
            <tbody>
              <tr>
                <td className="table-txt">旧手机：</td>
                <td className="table-content">
                  <input type="text" className="form-control" value={this.state.phone} onChange={this.changphone} placeholder={user.phone.substr(0, 3) + '****' + user.phone.substr(8, 4)} />
                </td>
              </tr>
              <tr>
                <td className="table-txt">验证码：</td>
                <td className="table-content">
                  <input type="text" className="form-control" value={this.state.code} onChange={this.changecode} />
                  <div className={this.state.codetext === '获取验证码' ? 'getcode-btn' : 'getcode-btn disabled'} onClick={this.getcode}>{this.state.codetext}</div>
                </td>
              </tr>
            </tbody>
          </table>
          <div className="btn-green-m step-btn" onClick={this.checkoldphone}>下一步</div>
        </div>
      );
    } else {
      return (
        <div className="account">
          <table>
            <tbody>
              <tr>
                <td className="table-txt">新手机：</td>
                <td className="table-content">
                  <input type="text" className="form-control" value={this.state.phone} onChange={this.changphone} placeholder={user.phone.substr(0, 3) + '****' + user.phone.substr(8, 4)} />
                </td>
              </tr>
              <tr>
                <td className="table-txt">验证码：</td>
                <td className="table-content">
                  <input type="text" className="form-control" value={this.state.code} onChange={this.changecode} />
                  <div className={this.state.codetext === '获取验证码' ? 'getcode-btn' : 'getcode-btn disabled'} onClick={this.getcode}>{this.state.codetext}</div>
                </td>
              </tr>
            </tbody>
          </table>
          <div className="btn-green-m step-btn" onClick={this.newphonebind}>绑定</div>
        </div>
      );
    }
  }
}

const mapStateToProps = (state) => {
  return { user: state.user, router: state.app.router };
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateUserInfo: (user) => dispatch({ type: 'UPDATE_USER', user }),
    setRouter: (router) => dispatch({ type: 'NAVIGATE_TO_ROUTER', router }),
    checkOldPhone: (code) => dispatch({ type: 'CHECK_OLDPHONE', code }),
    sendPhoneMsgBind: (phone) => dispatch({ type: 'SEND_PHONEMSG_BIND', phone }),
    phoneBind: (code) => dispatch({ type: 'PHONE_BIND', code }),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Account);
