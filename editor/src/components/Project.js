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
                return '未投稿'

        }
    }

    deleteProject = (id) => {
        this.props.deleteProjectConfirm('删除剧本将彻底销毁剧本所有内容且无法恢复，你确定要这么做吗？', { type: 'DELETE_PROJECT', id: id });
    }

    render() {
        const outline = this.props.projectitem;
        return (
            <div className="list-row">
                <div className="flex-2">
                    <img className="project_pic" src={outline.image === '' ? this.state.defaultimg : outline.image + '?imageView2/1/w/400/q/85!'} alt="封面" />
                </div>
                <div className="projcte-title flex-3"><p>{outline.title}</p></div>
                <div className="flex-3">{outline.tags.replace(/,/g, '，')}</div>
                <div className="flex-1">{outline.character_count.toLocaleString()}</div>
                <div className="flex-1">{outline.sign_status === 0 ? '未签约' : '已签约'}</div>
                <div className="flex-1">{outline.online_status === 0 ? '未上架' : '已上架'}</div>
                <div className="flex-1">{this.getstatus(outline.status)}</div>
                <div className="flex-3">
                    <div className="btn-blue-s btn-editor" onClick={() => this.props.navigateToProjectEditor(outline.id)}>编辑</div>
                    <div className="btn-green-s btn-delete" onClick={() => this.deleteProject(outline.id)}>删除</div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return { user: state.user };
};

const mapDispatchToProps = (dispatch) => {
    return {
        navigateToProjectEditor: (id) => dispatch({ type: 'REQUEST_PROJECT', id: id }),
        deleteProjectConfirm: (content, cback) => dispatch({ type: 'SET_APP_CONFIRM', confirm: { content, cback } }),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Project);