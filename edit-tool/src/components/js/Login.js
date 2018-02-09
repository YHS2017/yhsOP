import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import actiontypes from '../../actions/actiontype';
import actionCreater from '../../actions/index';
import '../css/Login.css';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      pwd: ''
    };
  }

  login = () => {
    const setuser = this.props.setuser;
    const settoken = this.props.settoken;
    this.props.setloadingshow(1);
    fetch('/source/api.php', {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: 'apipoint=login&apidata='
    }).then(data => {
      data.text().then(datastr => {
        const data = JSON.parse(datastr);
        //setuser({ id: data.UserId, name: data.UserName, profile: data.UserProfile });
        setuser({ id: 0, name: '作者', profile: 'https://avatars0.githubusercontent.com/u/24862812?s=40&v=4' });
        settoken(data.Token);
        fetch('/source/api.php', {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: 'apipoint=getlist&apidata='
        }).then(data => {
          data.text().then(datastr => {
            this.props.setloadingshow(0);
            const projects = JSON.parse(datastr);
            if (projects.length === 0) {
              return
            } else {
              this.props.setprojects(projects);
              const path = "/Author/" + this.props.user.name + "/home";
              this.props.history.push(path);
            }
          })
        });
      })
    });

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
  return {
    setloadingshow: (loadingshow) => { dispatch(actionCreater(actiontypes.SET_LOADINGSHOW, { loadingshow: loadingshow })) },
    setprojects: (projects) => { dispatch(actionCreater(actiontypes.SET_PROJECTS, { projects: projects })) },
    setuser: (user) => { dispatch(actionCreater(actiontypes.SET_USER, { user: user })) },
    settoken: (token) => { dispatch(actionCreater(actiontypes.SET_TOKEN, { token: token })) }
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));
