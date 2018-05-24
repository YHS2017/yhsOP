import React, { Component } from 'react';
import { connect } from 'react-redux';
import '../css/Account.css';

class Account extends Component {
  constructor(props) {
    super(props);
    this.state = {
      oldpwd: '',
      newpwd: '',
      renewpwd: '',
    };
  }

  changeoldpwd = (e) => {
    this.setState({ oldpwd: e.target.value });
  }

  changenewpwd = (e) => {
    this.setState({ newpwd: e.target.value });
  }

  changerenewpwd = (e) => {
    this.setState({ renewpwd: e.target.value });
  }

  updatepwd = () => {
    const { oldpwd, newpwd } = this.state;
    this.props.updatePwd(oldpwd, newpwd);
  }

  render() {
    const { oldpwd, newpwd, renewpwd } = this.state;
    return (
      <div className="author">
        <table>
          <tbody>
            <tr>
              <td className="table-txt">旧密码：</td>
              <td className="table-content"><input className="form-control" type="password" value={oldpwd} onChange={this.changeoldpwd} /></td>
            </tr>
            <tr>
              <td className="table-txt">新密码：</td>
              <td className="table-content">
                <input className="form-control" type="password" value={newpwd} onChange={this.changeoldpwd}/>
                <p className="table-alert">长度6~18个字符</p>
              </td>
            </tr>
            <tr>
              <td className="table-txt">确认新密码：</td>
              <td className="table-content">
                <input className="form-control" type="password" value={renewpwd} />
              </td>
            </tr>
          </tbody>
        </table>
        <div className="btn-green-m" onClick={this.toedit}>修改密码</div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { user: state.user };
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateUserInfo: (user) => dispatch({ type: 'UPDATE_USER', user }),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Account);
