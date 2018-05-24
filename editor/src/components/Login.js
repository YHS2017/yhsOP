import React, { Component } from 'react';
import { connect } from 'react-redux';
import '../css/Login.css';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      AppID: 'wxa8db9d8cb328d179',
      redirect_uri: 'http%3a%2f%2fweixin.91smart.net',
      phone: '',
      code: '',
      code_btntxt: '获 取',
      codeerror: '',
      phoneerror: '',
    };
  }

  componentWillMount() {
    if (sessionStorage.getItem('user') !== null && sessionStorage.getItem('user') !== undefined && sessionStorage.getItem('user') !== '') {
      this.props.sessionLogged(JSON.parse(sessionStorage.user));
    } else {
      let code = this.getparses(window.location.search).code;
      let state = this.getparses(window.location.search).state;
      if (code) {
        if (state === 'weixin') {
          this.props.wxLogin(code);
        } else {
          this.props.qqLogin(code);
        }
      }
    }
  }

  componentWillUnmount() {
    clearInterval(this.timer);
    this.timer = null;
  }

  getparses = (str) => {
    var obj = {};
    var reg = /[?&][^?&]+=[^?&]+/g;
    var arr = str.match(reg);
    if (arr) {
      arr.forEach(function (item) {
        var tempArr = item.substring(1).split('=');
        var key = decodeURIComponent(tempArr[0]);
        var val = decodeURIComponent(tempArr[1]);
        obj[key] = val;
      });
    }
    return obj;
  };

  getcode_login = () => {
    if (this.state.phone === '') {
      this.setState({ ...this, phoneerror: '请输入手机号！' });
    } else if (this.state.phone.match(/^[1][3,4,5,7,8][0-9]{9}$/) === null) {
      this.setState({ ...this, phoneerror: '请输入有效的手机号！' });
    } else {
      this.setState({ ...this, phoneerror: '' });
      if (this.state.code_btntxt === '获 取') {
        this.props.sendPhoneMsgLogin(this.state.phone);
        this.setState({ ...this, code_btntxt: '60s重新获取' });
        this.timer = setInterval(() => {
          if (isNaN(parseInt(this.state.code_btntxt, 10))) {
            this.setState({ ...this, code_btntxt: '60s重新获取' });
          } else if (parseInt(this.state.code_btntxt, 10) - 1 !== 0) {
            this.setState({ ...this, code_btntxt: parseInt(this.state.code_btntxt, 10) - 1 + 's重新获取' });
          } else {
            this.setState({ ...this, code_btntxt: '获 取' });
            clearInterval(this.timer);
            this.timer = null;
          }
        }, 1000);
      }
    }
  }

  getcode_bind = () => {
    if (this.state.phone === '') {
      this.setState({ ...this, phoneerror: '请输入手机号！' });
    } else if (this.state.phone.match(/^[1][3,4,5,7,8][0-9]{9}$/) === null) {
      this.setState({ ...this, phoneerror: '请输入有效的手机号！' });
    } else {
      this.setState({ ...this, phoneerror: '' });
      if (this.state.code_btntxt === '获 取') {
        this.props.sendPhoneMsgBind(this.state.phone);
        this.setState({ ...this, code_btntxt: '60s重新获取' });
        this.timer = setInterval(() => {
          if (isNaN(parseInt(this.state.code_btntxt, 10))) {
            this.setState({ ...this, code_btntxt: '60s重新获取' });
          } else if (parseInt(this.state.code_btntxt, 10) - 1 !== 0) {
            this.setState({ ...this, code_btntxt: parseInt(this.state.code_btntxt, 10) - 1 + 's重新获取' });
          } else {
            this.setState({ ...this, code_btntxt: '获 取' });
            clearInterval(this.timer);
            this.timer = null;
          }
        }, 1000);
      }
    }
  }

  login = () => {
    let phone = this.state.phone;
    let code = this.state.code;
    if (phone === '') {
      this.setState({ ...this, phoneerror: '请输入手机号！' });
    } else if (phone.match(/^[1][3,4,5,7,8][0-9]{9}$/) === null) {
      this.setState({ ...this, phoneerror: '请输入有效的手机号！' });
    } else {
      if (code === '') {
        this.setState({ ...this, codeerror: '请输入验证码！' });
      } else {
        this.props.phoneLogin(code);
      }
    }
  }

  phonebind = () => {
    let phone = this.state.phone;
    let code = this.state.code;
    if (phone === '' || code === '' || phone.match(/^[1][3,4,5,7,8][0-9]{9}$/) === null) {
      return;
    } else {
      this.props.phoneBind(phone, code);
    }
  }

  phonechange = (e) => {
    this.setState({ phone: e.target.value });
  }

  codechange = (e) => {
    this.setState({ code: e.target.value });
  }

  logintabchange = (way) => {
    this.props.setRouter('Login-' + way);
  }

  backlogin = () => {
    sessionStorage.setItem('user', '');
    window.location.href = 'http://weixin.91smart.net';
  }

  randerloginbox = () => {
    let temp = null;
    switch (this.props.router.split('-')[1]) {
      case 'Phone':
        temp =
          <div className="with-phone">
            <div className="login-way">
              <span className="current" onClick={() => this.logintabchange('Phone')}>手机登录</span>
              <span onClick={() => this.logintabchange('WeiXin')}>微信登录</span>
              <span onClick={() => this.logintabchange('QQ')}>QQ登录</span>
            </div>
            <div className="phone-group">
              <input type="text" placeholder="手机号" value={this.state.phone} onChange={this.phonechange} />
            </div>
            <div className="code-group">
              <input type="text" placeholder="验证码" value={this.state.code} onChange={this.codechange} />
              <div className={'code-btn ' + (this.state.code_btntxt === '获 取' ? '' : 'disabled')} onClick={this.getcode_login}>{this.state.code_btntxt}</div>
            </div>
            <div className="login-btn" onClick={this.login}>登 录</div>
            {this.state.phoneerror === '' ? (this.state.codeerror === '' ? null : <p className="error">{this.state.codeerror}</p>) : <p className="error">{this.state.phoneerror}</p>}
          </div>;
        break;
      case 'PhoneBind':
        temp =
          <div className="with-phone">
            <div className="back-login" onClick={this.backlogin}>{'<返回'}</div>
            <h3>手机绑定</h3>
            <div className="phone-group">
              <input type="text" placeholder="手机号" value={this.state.phone} onChange={this.phonechange} />
            </div>
            <div className="code-group">
              <input type="text" placeholder="验证码" value={this.state.code} onChange={this.codechange} />
              <div className={'code-btn ' + (this.state.code_btntxt === '获 取' ? '' : 'disabled')} onClick={this.getcode_bind}>{this.state.code_btntxt}</div>
            </div>
            <div className="login-btn" onClick={this.phonebind}>确认绑定</div>
            {this.state.phoneerror === '' ? (this.state.codeerror === '' ? null : <p className="error">{this.state.codeerror}</p>) : <p className="error">{this.state.phoneerror}</p>}
          </div>;
        break;
      case 'WeiXin':
        temp = <div className="with-weixin">
          <div className="login-way">
            <span onClick={() => this.logintabchange('Phone')}>手机登录</span>
            <span className="current" onClick={() => this.logintabchange('WeiXin')}>微信登录</span>
            <span onClick={() => this.logintabchange('QQ')}>QQ登录</span>
          </div>
          <iframe title="微信登录" src={'https://open.weixin.qq.com/connect/qrconnect?appid=' + this.state.AppID + '&redirect_uri=' + this.state.redirect_uri + '&response_type=code&href=https://web-1251001942.cossh.myqcloud.com/css/wxcode.css&scope=snsapi_login&state=weixin#wechat_redirect'}></iframe>
        </div>;
        break;
      case 'QQ':
        temp = <div className="with-qq">
          <div className="login-way">
            <span onClick={() => this.logintabchange('Phone')}>手机登录</span>
            <span onClick={() => this.logintabchange('WeiXin')}>微信登录</span>
            <span className="current" onClick={() => this.logintabchange('QQ')}>QQ登录</span>
          </div>
          <a href='https://graph.qq.com/oauth2.0/authorize?response_type=code&client_id=101461919&redirect_uri=http%3a%2f%2fweixin.91smart.net%2flogin&state=qq'>前往QQ登录</a>
          {/* <iframe width="370" height="322" id="ptlogin_iframe" name="ptlogin_iframe" src="https://xui.ptlogin2.qq.com/cgi-bin/xlogin?appid=716027609&amp;daid=383&amp;style=33&amp;login_text=%E6%8E%88%E6%9D%83%E5%B9%B6%E7%99%BB%E5%BD%95&amp;hide_title_bar=1&amp;hide_border=1&amp;target=self&amp;s_url=https%3A%2F%2Fgraph.qq.com%2Foauth2.0%2Flogin_jump&amp;pt_3rd_aid=101461919&amp;pt_feedback_link=http%3A%2F%2Fsupport.qq.com%2Fwrite.shtml%3Ffid%3D780%26SSTAG%3Dweixin.91smart.net.appid101461919"></iframe> */}
        </div>;
        break;
      default:
        break;
    }
    return temp;
  }

  render() {
    return (
      <div className="login">
        <div className="loginbox">
          <div className="login-logo">PutongPutong · <b>作者专区</b></div>
          {this.randerloginbox()}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  router: state.app.router,
});

const mapDispatchToProps = (dispatch) => ({
  setRouter: (router) => dispatch({ type: 'NAVIGATE_TO_ROUTER', router }),
  sessionLogged: (user) => dispatch({ type: 'LOGIN_WITH_SESSION', user }),
  sendPhoneMsgLogin: (phone) => dispatch({ type: 'SEND_PHONEMSG_LOGIN', phone }),
  sendPhoneMsgBind: (phone) => dispatch({ type: 'SEND_PHONEMSG_BIND', phone }),
  phoneBind: (code) => dispatch({ type: 'PHONE_BIND', code }),
  phoneLogin: (code) => dispatch({ type: 'LOGIN_WITH_PHONE', code }),
  wxLogin: (wxcode) => dispatch({ type: 'LOGIN_WITH_WEIXIN', wxcode }),
  qqLogin: (qqcode) => dispatch({ type: 'LOGIN_WITH_QQ', qqcode })
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
