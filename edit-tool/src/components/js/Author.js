import React, { Component } from 'react';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import { Route, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import ScriptEditor from './ScriptEditor';
import ScriptList from './ScriptList';
import ScriptInfo from './ScriptInfo';
import '../css/Author.css';

class Author extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: this.props.user
    };
  }
  
  render() {
    return (
      <div className="main">
        <div className="header">
          <div className="container-fluid">
            <div className="row">
              <div className="col-xs-2"><h3 className="text-center">剧本编辑器</h3></div>
              <div className="col-xs-6"></div>
              <div className="col-xs-1"><div className="btn btn-info">新建剧本</div></div>
              <div className="col-xs-3 text-center">
                <img className="userphoto" alt="头像" src={this.state.user.userphoto} />
                <DropdownButton className="user" title={this.state.user.username} pullRight id="dropdown-size-medium">
                  <MenuItem className="text-center">个人信息</MenuItem>
                  <MenuItem className="text-center">申请签约</MenuItem>
                  <MenuItem className="text-center">投稿须知</MenuItem>
                  <MenuItem className="text-center">退出登录</MenuItem>
                </DropdownButton>
              </div>
            </div>
          </div>
        </div>
        <ScriptInfo></ScriptInfo>
        <div className="content">
          <Route path={"/Author/" + this.state.user.username + "/home"} render={() => <ScriptList></ScriptList>} />
          <Route path={"/Author/" + this.state.user.username + "/scripteditor"} render={() => <ScriptEditor></ScriptEditor>} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { user: state.user };
}

const mapDispatchToProps = (dispatch) => {
  return {
    // pageup: () => { dispatch(actionCreater(actiontypes.PAGE_UP, null)) },
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Author));
