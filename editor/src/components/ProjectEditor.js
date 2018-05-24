import React, { Component } from 'react';
import { connect } from 'react-redux';
import Roles from './Roles';
import '../css/ProjectEditor.css';
import ParagraphEditor from './ParagraphEditor';
import ProjectInfo from './ProjectInfo';
import Galleries from './Galleries';
import Numbers from './Numbers';
import ParagraphTree from './paragraph/ParagraphTree';


class ProjectEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorshow: true,
    };
  }

  componentWillUnmount() {
    this.props.clearEditor();
  }

  rendertab = () => {
    const { router } = this.props;
    switch (router.split('-')[2]) {
      case 'Outline':
        return <ProjectInfo></ProjectInfo>
      case 'Roles':
        return <Roles></Roles>
      case 'Galleries':
        return <Galleries></Galleries>
      case 'Numbers':
        return <Numbers></Numbers>
      default:
        return <ProjectInfo></ProjectInfo>
    }
  }

  rendererrors = () => {
    const errors = this.props.errors;
    if (errors.length === 0) {
      return null
    } else {
      const errorlist = errors.map((error, key) => {
        return <pre key={key}><span className="fa fa-exclamation-circle error-icon"></span>{(key + 1) + '  ' + error.getContext() + error.getMessage()}</pre>
      });
      return (
        <div className="errorbox">
          <div className="error-title" onClick={() => this.setState({ errorshow: !this.state.errorshow })}>错误列表<span className="error-total"><span className="fa fa-exclamation-circle error-icon"></span>{errorlist.length + "个错误"} </span><span className="warning-total"><span className="fa fa-exclamation-triangle warning-icon"></span>{0 + "个警告"}</span>
            <div className={"fa fa-sort-desc toggle " + (this.state.errorshow ? '' : 'off')} ></div>
          </div>
          <div className={"error-content " + (this.state.errorshow ? '' : 'off')}>
            {errorlist}
          </div>
        </div>)
    }
  }

  renderCrumbs() {
    const { router, setRouter } = this.props;
    if (router.split('-')[1] === 'Editor') {
      return null;
    } else {
      return (
        <ul className="crumbs">
          <li onClick={() => setRouter('ProjectEditor-Editor')}>剧本编辑器</li>
          <li onClick={() => setRouter('ProjectEditor-Setings-Outline')}>作品设置</li>
        </ul>
      )
    }
  }

  rendercontent = () => {
    const { selected_paragraph_id, router, setRouter } = this.props;
    if (router.split('-')[1] === 'Editor') {
      return (
        <div className="editor">
          <ParagraphTree />
          <ParagraphEditor editorshow={selected_paragraph_id !== null} ></ParagraphEditor>
          {this.rendererrors()}
        </div>
      )
    } else {
      return (
        <div className="setings">
          <div className="tab">
            <div className="controls">
              <ul className="tabs">
                <li className={router.split('-')[2] === 'Outline' ? 'current' : ''} onClick={() => setRouter('ProjectEditor-Setings-Outline')}>详情</li>
                <li className={router.split('-')[2] === 'Roles' ? 'current' : ''} onClick={() => setRouter('ProjectEditor-Setings-Roles')}>角色</li>
                <li className={router.split('-')[2] === 'Galleries' ? 'current' : ''} onClick={() => setRouter('ProjectEditor-Setings-Galleries')}>回忆</li>
                <li className={router.split('-')[2] === 'Numbers' ? 'current' : ''} onClick={() => setRouter('ProjectEditor-Setings-Numbers')}>数值</li>
              </ul>
            </div>
            {this.rendertab()}
          </div>
        </div>
      )
    }
  }

  render() {
    const { outline, setRouter, saveProject, commitProject } = this.props;
    return (
      <div className="projecteditor">
        <div className="header">
          <div className="back" onClick={() => setRouter('Home-List')}><span className="fa fa-arrow-left"></span></div>
          <div className="projecttitle">{outline.title}</div>
          <div className="toolbar">
            <div className="icon-btn" onClick={() => { window.open('https://www.baidu.com') }}><span className="fa fa-question-circle-o"></span>帮助</div>
            <div className="icon-btn" onClick={() => { this.props.showTotalAlert('字数总计：' + this.props.outline.character_count) }}><span className="fa fa-bar-chart-o"></span>字数统计</div>
            <div className="icon-btn" onClick={() => setRouter('ProjectEditor-Setings-Outline-o')}><span className="fa fa-sliders seting-icon" ></span>作品设置</div>
            <div className="icon-btn" onClick={() => commitProject()}><span className="fa fa-file-text-o"></span>投稿</div>
            <div className="icon-btn" onClick={saveProject}><span className="fa fa-floppy-o"></span>保存</div>
          </div>
        </div>
        {this.renderCrumbs()}
        {this.rendercontent()}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { outline: state.editor.outline, content: state.editor.content, errors: state.editor.errors, selected_paragraph_id: state.editor.selected_paragraph_id, router: state.app.router };
}

const mapDispatchToProps = (dispatch) => {
  return {
    saveProject: () => dispatch({ type: 'SAVE_PROJECT' }),
    setRouter: (router) => dispatch({ type: 'NAVIGATE_TO_ROUTER', router }),
    commitProject: () => dispatch({ type: 'COMMIT_PROJECT' }),
    clearEditor: () => dispatch({ type: 'CLEAR_EDITOR' }),
    showTotalAlert: (content) => dispatch({ type: 'SET_APP_ALERT', alert: { content: content, cback: null } }),
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectEditor);