import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import '../css/Login.css';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: this.props.user,
      username: '',
      pwd: ''
    };
  }

  login = () => {
    // fetch('../../data.json').then(data => {
    //   data.text().then(datastr => {
    //     if (datastr === '') {
    //       return
    //     } else {
    //       const data = JSON.parse(datastr);
    //     }
    //   })
    // });
    const path = "/Author/" + this.state.user.username + "/home";
    this.props.history.push(path);
  }

  changeusername = (e) => {
    this.setState({ ...this, username: e.target.value });
  }

  changepwd = (e) => {
    this.setState({ ...this, pwd: e.target.value });
  }

  render() {
    return (
      <div className="container">
        <div className="loginbox">
          <h3>用户登录</h3>
          <div className="form-group">
            <label className="col-xs-3 control-label">用户名</label>
            <div className="col-xs-9">
              <input type="text" className="form-control" placeholder="请输入用户名" onChange={this.changeusername} value={this.state.username} />
            </div>
          </div>
          <div className="form-group">
            <label className="col-xs-3 control-label">密码</label>
            <div className="col-xs-9">
              <input type="password" className="form-control" placeholder="请输入密码" onChange={this.changepwd} value={this.state.pwd} />
            </div>
          </div>
          <div className="btn btn-success loginbtn" onClick={this.login}>登录</div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { user: state.user }
}

const mapDispatchToProps = (dispatch) => {
  return {}
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));
