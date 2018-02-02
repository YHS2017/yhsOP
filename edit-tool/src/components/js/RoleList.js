import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import actiontypes from '../../actions/actiontype';
import actionCreater from '../../actions/index';
import '../css/RoleList.css';


class ScriptEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rolelistshow: true,
      editroletype: 0,
      currentrole: { "id": 1, "type": "NPC", "name": "", "profile": "../../nomal.gif", "galleries": [] },
      roleinfoshow: false,
      editgallerytype: 0,
      currentgallery: { id: 1, title: '图片', items: [] },
      gallerygroupinfoshow: false,
      defaultimg: '../../nomal.gif'
    }
  }

  newrole = () => {
    const id = this.props.project.content.roles.length > 0 ? (Math.max.apply(Math, this.props.project.content.roles.map((item) => { return item.id })) + 1) : 1;
    const newrole = { id: id, "type": "NPC", name: "", profile: "", galleries: [] };
    this.setState({ ...this, currentrole: newrole, roleinfoshow: true, editroletype: 0 });
  }

  newgallerygroup = () => {
    const id = this.props.project.content.galleries.length > 0 ? (Math.max.apply(Math, this.props.project.content.galleries.map((item) => { return item.id })) + 1) : 1;
    const newgallery = { id: id, title: '', items: [] };
    this.setState({ ...this, currentgallery: newgallery, gallerygroupinfoshow: true, editgallerytype: 0 });
  }

  toggleshow = () => {
    this.setState({ ...this, rolelistshow: this.state.rolelistshow ? false : true });
  }

  closeroleinfo = () => {
    this.setState({ ...this, roleinfoshow: this.state.roleinfoshow ? false : true });
  }

  closegallerygroupinfo = () => {
    this.setState({ ...this, gallerygroupinfoshow: this.state.gallerygroupinfoshow ? false : true });
  }

  changerolename = (e) => {
    let currentrole = this.state.currentrole;
    currentrole.name = e.target.value;
    this.setState({ ...this, currentrole: currentrole });
  }

  changegallerytitle = (e) => {
    let currentgallery = this.state.currentgallery;
    currentgallery.title = e.target.value;
    this.setState({ ...this, currentgallery: currentgallery });
  }

  editrole = (id) => {
    let currentrole = null;
    for (let i = 0; i < this.props.project.content.roles.length; i++) {
      if (this.props.project.content.roles[i].id === id) {
        currentrole = { ...this.props.project.content.roles[i] };
        this.setState({ ...this, currentrole: currentrole, roleinfoshow: true, editroletype: 1 });
        break;
      }
    }
  }

  saveroleinfo = () => {
    let project = { ...this.props.project };
    if (this.state.editroletype === 0) {
      project.content.roles.push(this.state.currentrole);
    } else {
      for (let i = 0; i < project.content.roles.length; i++) {
        if (project.content.roles[i].id === this.state.currentrole.id) {
          project.content.roles[i] = this.state.currentrole;
          break;
        }
      }
    }
    this.props.setproject(project);
    this.setState({ ...this, roleinfoshow: false });
  }

  savegallery = () => {
    let project = { ...this.props.project };
    if (this.state.editgallerytype === 0) {
      project.content.galleries.push(this.state.currentgallery);
    } else {
      for (let i = 0; i < project.content.galleries.length; i++) {
        if (project.content.galleries[i].id === this.state.currentgallery.id) {
          project.content.galleries[i] = this.state.currentgallery;
          break;
        }
      }
    }
    this.props.setproject(project);
    this.setState({ ...this, gallerygroupinfoshow: false });
  }

  deleterole = (id) => {
    let project = { ...this.props.project };
    for (let i = 0; i < project.content.roles.length; i++) {
      if (project.content.roles[i].id === id) {
        project.content.roles.splice(i, 1);
      }
    }
    this.props.setproject(project);
  }

  render() {
    const rolelist = this.props.project.content.roles.map((item) => {
      return <li className="role-item" key={item.id}><img className="role-photo" alt="头像" src={item.profile === '' ? this.state.defaultimg : item.profile} /><b>{item.name}</b><span className="glyphicon glyphicon-cog role-seting"><div className="role-item-menu"><div onClick={this.newgallerygroup}>添加回忆</div><div onClick={() => { this.editrole(item.id) }}>修改信息</div><div onClick={() => { this.deleterole(item.id) }}>删除角色</div></div></span></li>
    });

    return (
      <div className={"rolelist " + (this.state.rolelistshow ? 'on' : 'off')}>
        <div className={"roleinfo text-center " + (this.state.roleinfoshow ? 'show' : 'hide')}>
          <img className="role-photo-upload" src={this.state.currentrole.profile === '' ? this.state.defaultimg : this.state.currentrole.profile} alt="角色头像" />
          <div className="input-group">
            <span className="input-group-addon" >角色命名</span>
            <input type="text" className="form-control" placeholder="角色名称" value={this.state.currentrole.name} onChange={this.changerolename} />
          </div>
          <span className="glyphicon glyphicon-remove close-roleinfo" onClick={this.closeroleinfo}></span>
          <div className="btn btn-success save-roleinfo" onClick={this.saveroleinfo}>确定</div>
        </div>
        <div className={"gallerygroupinfo " + (this.state.gallerygroupinfoshow ? 'show' : 'hide')}>
          <h4>新增分组</h4>
          <input type="text" className="form-control" placeholder="分组名称" value={this.state.currentgallery.title} onChange={this.changegallerytitle} />
          <span className="glyphicon glyphicon-remove close-gallerygroupinfo" onClick={this.closegallerygroupinfo}></span>
          <div className="btn btn-success save-gallerygroupinfo" onClick={this.savegallery}>确定</div>
        </div>
        <div className="rolelist-alert">角色列表</div>
        <span className="glyphicon glyphicon-chevron-left switch" onClick={this.toggleshow}></span>
        <h3>角色列表</h3>
        <span className="glyphicon glyphicon-plus addrole" onClick={this.newrole}></span>
        <ul className="role-items">
          {rolelist}
        </ul>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { project: state.project };
}

const mapDispatchToProps = (dispatch) => {
  return {
    setproject: (project) => { dispatch(actionCreater(actiontypes.SET_PROJECT, { project: project })) }
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ScriptEditor));