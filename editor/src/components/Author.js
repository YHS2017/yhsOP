import React, { Component } from 'react';
import { connect } from 'react-redux';
import FileUpload from './FileUpload';
import '../css/Author.css';

class Author extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: 'show',
      user: null,
    };
  }

  componentWillMount() {
    if (!this.state.user) {
      this.setState({ user: this.props.user });
    }
  }

  toedit = () => {
    this.setState({ type: 'edit' });
  }

  changeqq = (e) => {
    this.setState({ user: { ...this.state.user, qq: e.target.value } });
  }

  changename = (e) => {
    this.setState({ user: { ...this.state.user, name: e.target.value } });
  }

  getuploadurl = (url) => {
    this.setState({ user: { ...this.state.user, profile: url } });
  }

  updateuserinfo = () => {
    const user = {
      profile: this.state.user.profile,
      name: this.state.user.name,
      qq: this.state.user.qq
    }
    this.props.updateUserInfo(user);
  }

  render() {
    if (this.state.type === 'show') {
      return (
        <div className="author">
          <table>
            <tbody>
              <tr>
                <td className="table-txt" style={{ verticalAlign: 'middle' }}>头像:</td>
                <td className="table-content"><img className="userprofile" src={this.state.user.profile} alt="" /></td>
              </tr>
              <tr>
                <td className="table-txt">作者ID:</td>
                <td className="table-content">{this.state.user.id}</td>
              </tr>
              <tr>
                <td className="table-txt">笔名:</td>
                <td className="table-content">{this.state.user.name}</td>
              </tr>
              <tr>
                <td className="table-txt">QQ:</td>
                <td className="table-content">{this.state.user.qq ? this.state.user.qq : '暂未填写'}</td>
              </tr>
            </tbody>
          </table>
          <div className="btn-green-m" onClick={this.toedit}>修改资料</div>
        </div>
      );
    } else {
      return (
        <div className="author">
          <table>
            <tbody>
              <tr>
                <td className="table-txt" style={{ verticalAlign: 'middle' }}>头像:</td>
                <td className="table-content"><FileUpload getuploadurl={this.getuploadurl.bind(this)} src={this.state.user.profile}></FileUpload></td>
              </tr>
              <tr>
                <td className="table-txt">作者ID:</td>
                <td className="table-content">{this.state.user.id}</td>
              </tr>
              <tr>
                <td className="table-txt">笔名:</td>
                <td className="table-content">
                  <input className="form-control" type="text" value={this.state.user.name} onChange={this.changename} />
                  <p className="table-alert">笔名最多十个字</p>
                </td>
              </tr>
              <tr>
                <td className="table-txt">QQ:</td>
                <td className="table-content">
                  <input className="form-control" type="text" value={this.state.user.qq ? this.state.user.qq : ''} onChange={this.changeqq} />
                </td>
              </tr>
            </tbody>
          </table>
          <div className="btn-green-m" onClick={this.updateuserinfo} >确认修改</div>
        </div>
      );
    }

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

export default connect(mapStateToProps, mapDispatchToProps)(Author);
