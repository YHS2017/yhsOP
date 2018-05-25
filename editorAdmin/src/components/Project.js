import React, { Component } from 'react';
import { connect } from 'react-redux';
import defaultimg from '../images/default.png';
import '../css/Project.css';

class Project extends Component {
  constructor(props) {
    super(props);
    this.state = {
      defaultimg: defaultimg
    };
  }

  getstatus = (status) => {
    switch (status) {
      case 0:
        return '未投稿';

      case 1:
        return '待审核';

      case 5:
        return '审核中';

      case 2:
        return '审核通过';

      case 3:
        return '审核未通过';

      default:
        return '编辑中'

    }
  }

  getdate = (inputTime) => {
    let date = new Date(inputTime);
    let y = date.getFullYear();
    let m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    let d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    let h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    let minute = date.getMinutes();
    let second = date.getSeconds();
    minute = minute < 10 ? ('0' + minute) : minute;
    second = second < 10 ? ('0' + second) : second;
    return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
  }

  renderbtn = (outline) => {
    let btns = [];
    switch (outline.status) {
      case 1:
        return <div className="btn-green-s btn-editor" key="0" onClick={() => this.props.reviewProject(outline.id)}>认领审核</div>;

      case 2:
        btns.push(<div className="btn-green-s btn-editor" key="0" onClick={() => this.props.readProject(outline.id)}>审阅</div>);
        return btns;

      case 3:
        btns.push(<div className="btn-green-s btn-editor" key="0" onClick={() => this.props.readProject(outline.id)}>审阅</div>);
        return btns;

      case 4:
        btns.push(<div className="btn-green-s btn-editor" key="0" onClick={() => this.props.readProject(outline.id)}>审阅</div>);
        return btns;

      case 5:
        if (outline.admin_name === this.props.user.name) {
          btns.push(<div className="btn-green-s btn-editor" key="0" onClick={() => this.props.reviewProject(outline.id)}>审核</div>);
        } else {
          if (this.props.user.level === 0) {
            btns.push(<div className="btn-green-s btn-editor" key="1" onClick={() => this.props.reviewProject(outline.id)}>审核</div>);
          } else {
            btns.push(<div className="btn-green-s btn-editor" key="0" onClick={() => this.props.readProject(outline.id)}>审阅</div>);
          }
        }
        return btns;

      default:
        break;
    }
  }

  render() {
    const outline = this.props.projectitem;
    return (
      <div className="list-row">
        <div className="flex-2">
          <img className="project_pic" src={outline.image === '' ? this.state.defaultimg : outline.image + '?imageView2/1/w/400/q/85!'} alt="封面" />
        </div>
        <div className="flex-1">{outline.id}</div>
        <div className="projcte-title flex-2">{outline.title}</div>
        <div className="flex-1">{outline.author_id}</div>
        <div className="flex-1">{outline.author_name}</div>
        <div className="flex-2">{this.getdate(outline.update_time)}</div>
        <div className="flex-1">{outline.sign_status === 0 ? '未签约' : '已签约'}</div>
        <div className="flex-1">{outline.online_status === 0 ? '未上架' : '已上架'}</div>
        <div className="flex-1">{this.getstatus(outline.status)}</div>
        <div className="flex-1">{outline.admin_name === '' ? '无责编' : outline.admin_name}</div>
        <div className="flex-2">
          {this.renderbtn(outline)}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { user: state.user, listtype: state.projects.listtype };
};

const mapDispatchToProps = (dispatch) => {
  return {
    reviewProject: (id) => dispatch({ type: 'REVIEW_PROJECT', id }),
    readProject: (id) => dispatch({ type: 'REQUEST_PROJECT', id }),
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Project);