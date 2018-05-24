import React, { Component } from 'react';
import { connect } from 'react-redux';
import '../css/Login.css';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      acc: '',
      pwd: '',
      accerror: '',
      pwderror: '',
    };
  }

  componentWillMount() {
    if (sessionStorage.getItem('admin') !== null && sessionStorage.getItem('admin') !== undefined && sessionStorage.getItem('admin') !== '') {
      this.props.sessionLogged(JSON.parse(sessionStorage.admin));
    }
  }

  login = () => {
    let acc = this.state.acc;
    let pwd = this.state.pwd;
    if (acc === '' || pwd === '') return;
    this.props.Login(acc, pwd);
  }

  accchange = (e) => {
    this.setState({ ...this, acc: e.target.value });
    if (e.target.value === '') {
      this.setState({ ...this, accerror: '请输入管理员账号！' });
    } else {
      this.setState({ ...this, accerror: '' });
    }
  }

  pwdchange = (e) => {
    this.setState({ ...this, pwd: e.target.value });
    if (e.target.value === '') {
      this.setState({ ...this, pwderror: '请输入密码！' });
    } else {
      this.setState({ ...this, pwderror: '' });
    }
  }

  randerloginbox = () => {
    return (
      <div className="form">
        <div className="group">
          <input type="text" placeholder="管理员账号" onChange={this.accchange} onBlur={this.accchange} />
        </div>
        <div className="group">
          <input type="password" placeholder="密码" onChange={this.pwdchange} onBlur={this.pwdchange} />
        </div>
        <div className="login-btn" onClick={this.login}>登 录</div>
        {this.state.accerror === '' ? (this.state.pwderror === '' ? null : <p className="error">{this.state.pwderror}</p>) : <p className="error">{this.state.accerror}</p>}
      </div>
    );
  }

  render() {
    return (
      <div className="login">
        <div className="loginbox">
          <div className="login-logo">PutongPutong · <b>审核专区</b></div>
          {this.randerloginbox()}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  login_tab: state.app.login_tab,
});

const mapDispatchToProps = (dispatch) => ({
  sessionLogged: (admin) => dispatch({ type: 'LOGIN_WITH_SESSION', admin }),
  Login: (acc, pwd) => dispatch({ type: 'LOGIN', acc, pwd }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
