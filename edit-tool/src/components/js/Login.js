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
      AppID: 'wxa8db9d8cb328d179',
      AppSecret: '92e660432d2d877693d7511f53cb3928',
      redirect_uri: 'http%3a%2f%2fweixin.91smart.net'
    };
  }

  componentWillMount() {
    const setuser = this.props.setuser;
    const settoken = this.props.settoken;

    //test--------------------------
    if (sessionStorage.getItem('user') !== null && sessionStorage.getItem('user') !== '') {
      setuser(JSON.parse(sessionStorage.getItem('user')));
      settoken(JSON.parse(sessionStorage.getItem('token')));
      fetch('http://weixin.91smart.net/v1/project/all', {
        method: "GET",
        headers: { "Content-Type": "application/json" }
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
    } else 
    {
      const user = { id: 0, name: '作者', profile: 'https://avatars0.githubusercontent.com/u/24862812?s=40&v=4' };
      const token = 'token';
      sessionStorage.setItem('user', JSON.stringify(user));
      sessionStorage.setItem('token', JSON.stringify(token));
      setuser(user);
      settoken(token);
      fetch('http://weixin.91smart.net/v1/project/all', {
        method: "GET",
        headers: { "Content-Type": "application/json" }
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
    }
    //---------------------------


    // if (sessionStorage.getItem('user') !== null && sessionStorage.getItem('user') !== '') {
    //   setuser(JSON.parse(sessionStorage.getItem('user')));
    //   settoken(JSON.parse(sessionStorage.getItem('token')));
    //   fetch('http://weixin.91smart.net/v1/project/all', {
    //     method: "GET",
    //     headers: { "Content-Type": "application/json" }
    //   }).then(data => {
    //     data.text().then(datastr => {
    //       this.props.setloadingshow(0);
    //       const projects = JSON.parse(datastr);
    //       if (projects.length === 0) {
    //         return
    //       } else {
    //         this.props.setprojects(projects);
    //         const path = "/Author/" + this.props.user.name + "/home";
    //         this.props.history.push(path);
    //       }
    //     })
    //   });
    // } else {
    //   let parsestr = window.location.search;
    //   if (parsestr === undefined || parsestr.indexOf('code=') === -1) {
    //     const path = 'https://open.weixin.qq.com/connect/qrconnect?appid=' + this.state.AppID + '&redirect_uri=' + this.state.redirect_uri + '&response_type=code&scope=snsapi_login&state=STATE#wechat_redirect'
    //     window.location = path;
    //   } else {
    //     let code = this.getparses(window.location.search).code;
    //     fetch('http://weixin.91smart.net/v1/auth/login?code=' + code, {
    //       method: "POST",
    //       headers: { "Content-Type": "application/json" },
    //       body: ''
    //     }).then(data => {
    //       data.text().then(datastr => {
    //         const data = JSON.parse(datastr);
    //         const user = { id: 0, name: '作者', profile: 'https://avatars0.githubusercontent.com/u/24862812?s=40&v=4' };
    //         //const user = { id: data.user_id, name: data.user_name, profile: data.user_profile };
    //         const token = data.token;
    //         sessionStorage.setItem('user', JSON.stringify(user));
    //         sessionStorage.setItem('token', JSON.stringify(token));
    //         setuser(user);
    //         settoken(token);
    //         fetch('http://weixin.91smart.net/v1/project/all', {
    //           method: "GET",
    //           headers: { "Content-Type": "application/json" }
    //         }).then(data => {
    //           data.text().then(datastr => {
    //             this.props.setloadingshow(0);
    //             const projects = JSON.parse(datastr);
    //             if (projects.length === 0) {
    //               return
    //             } else {
    //               this.props.setprojects(projects);
    //               const path = "/Author/" + this.props.user.name + "/home";
    //               this.props.history.push(path);
    //             }
    //           })
    //         });
    //       })
    //     });
    //   }
    // }
  }

  getparses = (str) => {
    var url = window.location.search;
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
  }

  render() {
    return (
      <div className="loginbox">Loding.........</div>
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
