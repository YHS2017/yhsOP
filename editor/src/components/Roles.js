import React, { Component } from 'react';
import { connect } from 'react-redux';
import FileUpload from './FileUpload';
import defaultimg from '../images/user_default.jpg';
import '../css/Roles.css';

class ScriptEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentrole: null,
      editroletype: 0,
      defaultimg: defaultimg
    }
  }

  componentWillMount() {
    const roles = this.props.content.roles;
    const currentrole = this.state.currentrole;
    if (roles.length === 0 && currentrole === null) {
      this.newrole();
    } else {
      this.setState({ currentrole: roles[0], editroletype: 1 });
    }
  }

  newrole = () => {
    const id = this.props.content.roles.length > 0 ? (Math.max.apply(Math, this.props.content.roles.map((item) => { return item.id })) + 1) : 1;
    const newrole = { id: id, chat_id: id, "type": "NPC", name: "", profile: "", gallery_ids: [], has_memory: true, remark: '' };
    this.setState({ ...this, currentrole: newrole, editroletype: 0 });
  }

  changerolename = (e) => {
    let currentrole = this.state.currentrole;
    currentrole.name = e.target.value;
    this.setState({ ...this, currentrole: currentrole });
  }

  changeroleremark = (e) => {
    let currentrole = this.state.currentrole;
    currentrole.remark = e.target.value;
    this.setState({ ...this, currentrole: currentrole });
  }

  changehasmemory = () => {
    this.setState({ currentrole: { ...this.state.currentrole, has_memory: !this.state.currentrole.has_memory } });
  }

  getuploadurl = (url) => {
    let currentrole = this.state.currentrole;
    currentrole.profile = url;
    this.setState({ currentrole: currentrole });
  }

  editrole = (id) => {
    let currentrole = null;
    for (let i = 0; i < this.props.content.roles.length; i++) {
      if (this.props.content.roles[i].id === id) {
        currentrole = { ...this.props.content.roles[i] };
        this.setState({ currentrole: currentrole, editroletype: 1 });
        break;
      }
    }
  }

  saveroleinfo = () => {
    console.log(this.state.currentrole);
    if (this.state.currentrole.profile === '') {
      this.props.showMessage('未上传角色头像！');
    } else if (this.state.currentrole.name === '') {
      this.props.showMessage('角色名不能为空！');
    } else if (this.state.currentrole.name.length > 7) {
      this.props.showMessage('角色名称长度超出限制！');
    } else if (this.state.currentrole.remark.length > 200) {
      this.props.showMessage('人设备注字数不在限制范围内！');
    } else {
      let content = { ...this.props.content };
      if (this.state.editroletype === 0) {
        content.roles.push(this.state.currentrole);
      } else {
        for (let i = 0; i < content.roles.length; i++) {
          if (content.roles[i].id === this.state.currentrole.id) {
            content.roles[i] = this.state.currentrole;
            break;
          }
        }
      }
      this.setState({ editroletype: 1 });
      this.props.updateProjectContent(content);
    }
  }

  deleterole = (e, id) => {
    e.stopPropagation();
    let content = { ...this.props.content };
    let roles = [...content.roles];
    for (let i = 0; i < roles.length; i++) {
      if (roles[i].id === id) {
        roles.splice(i, 1);
        content.roles = roles;
        break;
      }
    }
    this.setState({ currentrole: null });
    this.props.deletroleConfirm({ type: 'UPDATE_PROJECT_CONTENT', content: content });
  }

  renderroleeditor = () => {
    if (this.state.currentrole === null) {
      return null
    } else {
      return (
        <table>
          <tbody>
            <tr>
              <td className="table-txt">头像</td>
              <td className="table-content">
                <FileUpload getuploadurl={this.getuploadurl.bind(this)} src={this.state.currentrole.profile} filetype="img"></FileUpload>
              </td>
            </tr>
            <tr>
              <td className="table-txt">角色名</td>
              <td className="table-content">
                <input className="form-control" value={this.state.currentrole.name} type="text" maxLength="7" onChange={this.changerolename} />
                <p className="table-alert">名字最多7个字</p>
              </td>
            </tr>
            <tr>
              <td className="table-txt">回忆按钮</td>
              <td className="table-content">
                <label className="radio"><input type="checkbox" checked={this.state.currentrole.has_memory} onChange={this.changehasmemory} />有</label>
                <label className="radio"><input type="checkbox" checked={!this.state.currentrole.has_memory} onChange={this.changehasmemory} />没有</label>
                <p className="table-alert">选择是否在该角色的聊天界面右上角出现回忆按钮</p>
              </td>
            </tr>
            <tr>
              <td className="table-txt">人设备注</td>
              <td className="table-content">
                <textarea className="form-control noresize" maxLength="200" rows="6" cols="40" value={this.state.currentrole.remark} onChange={this.changeroleremark}></textarea>
                <p className="table-alert">选填，供作者写作参考，长度不得超过200</p>
              </td>
            </tr>
          </tbody>
        </table>
      );
    }
  }

  render() {
    const roles = this.props.content.roles;
    const currentrole = this.state.currentrole;
    const rolelist = roles.map((item) => {
      return (
        <li className={"role-item " + (currentrole ? (currentrole.id === item.id ? 'current-role' : '') : '')} key={item.id} onClick={() => this.editrole(item.id)}>
          <img className="role-photo" alt="头像" src={item.profile === '' ? this.state.defaultimg : item.profile + '?imageView2/2/w/400/q/85!'} />
          <b>{item.name}</b>
          <span className="fa fa-trash-o role-delete" onClick={(e) => { this.deleterole(e, item.id) }}></span>
        </li>
      );
    });
    return (
      <div className="roles">
        <div className="rolelist ">
          <h3>角色列表</h3>
          <span className="fa fa-user-plus addrole" onClick={this.newrole} title="新建角色"></span>
          <ul className="role-items">
            {rolelist}
          </ul>
        </div>
        <div className="roleseditor">
          {this.renderroleeditor()}
        </div>
        <div className="btn-green-s savechange" onClick={this.saveroleinfo}>确 认</div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { content: state.editor.content };
}

const mapDispatchToProps = (dispatch) => {
  return {
    deletroleConfirm: (cback) => dispatch({ type: 'SET_APP_CONFIRM', confirm: { content: '删除角色将会导致剧本中角色引用错误，需要修改相应的剧本引用，确定删除该角色吗？', cback } }),
    updateProjectContent: (content) => dispatch({ type: 'UPDATE_PROJECT_CONTENT', content: content }),
    showMessage: (content) => dispatch({ type: 'SET_APP_MESSAGE', message: { content } })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ScriptEditor);