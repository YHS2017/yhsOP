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

  renderCrumbs = () => {
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

  rendericonbtn = () => {
    let iconbtns = [];
    const { setRouter, signProject, passProject, notpassProject, outlineProject, onlineProject, saveProject, router } = this.props;
    if (router.split('-')[2] === 'Review') {
      iconbtns.push(<div className="icon-btn" key="0" onClick={() => setRouter('ProjectEditor-Setings-Outline')}><span className="fa fa-sliders sting-icon"></span>作品设置</div>);
      iconbtns.push(<div className="icon-btn" key="1" onClick={signProject}><span className="fa fa-pencil"></span>签约</div>);
      iconbtns.push(<div className="icon-btn" key="2" onClick={notpassProject}><span className="fa fa-times-circle-o"></span>不通过</div>);
      iconbtns.push(<div className="icon-btn" key="3" onClick={passProject}><span className="fa fa-check-circle-o"></span>通过</div>);
      iconbtns.push(<div className="icon-btn" key="4" onClick={outlineProject}><span className="fa fa-cloud-download"></span>下架</div>);
      iconbtns.push(<div className="icon-btn" key="5" onClick={onlineProject}><span className="fa fa-cloud-upload"></span>上架</div>);
      iconbtns.push(<div className="icon-btn" key="6" onClick={saveProject}><span className="fa fa-floppy-o"></span>保存</div>);
    }
    return iconbtns;
  }

  rendercontent = () => {
    const { selected_paragraph_id, router, setRouter } = this.props;
    if (router.split('-')[1] === 'Editor') {
      return (
        <div className="editor">
          <ParagraphTree />
          <ParagraphEditor editorshow={selected_paragraph_id !== null} scrolltop={this.state.scrolltop}></ParagraphEditor>
          {this.rendererrors()}
        </div>
      )
    } else {
      return (
        <div className="setings">
          <div className="tab">
            <div className="controls">
              <ul className="tabs">
                <li className={router.split('-')[2] === 'Outline' ? 'current' : ''} onClick={() => setRouter('ProjectEditor-Setings-Outline')}>作品详情</li>
                <li className={router.split('-')[2] === 'Roles' ? 'current' : ''} onClick={() => setRouter('ProjectEditor-Setings-Roles')}>作品角色</li>
                <li className={router.split('-')[2] === 'Galleries' ? 'current' : ''} onClick={() => setRouter('ProjectEditor-Setings-Galleries')}>回忆分组</li>
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
    const { outline, setRouter } = this.props;
    return (
      <div className="projecteditor">
        <div className="header">
          <div className="back" onClick={() => setRouter('Home-List')}><span className="fa fa-arrow-left"></span></div>
          <div className="projecttitle">{outline.title}</div>
          <div className="toolbar">
            <div className="icon-btn" onClick={() => { window.open('https://www.baidu.com') }}><span className="fa fa-question-circle"></span>帮助</div>
            <div className="icon-btn" onClick={() => { this.props.showTotalAlert('字数总计：' + this.props.outline.character_count) }}><span className="fa fa-bar-chart"></span>字数统计</div>
            {this.rendericonbtn()}
          </div>
        </div>
        {this.renderCrumbs()}
        {this.rendercontent()}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { user: state.user, outline: state.editor.outline, content: state.editor.content, errors: state.editor.errors, selected_paragraph_id: state.editor.selected_paragraph_id, router: state.app.router };
}

const mapDispatchToProps = (dispatch) => {
  return {
    saveProject: () => dispatch({ type: 'SAVE_PROJECT' }),
    setRouter: (router) => dispatch({ type: 'NAVIGATE_TO_ROUTER', router }),
    signProject: () => dispatch({ type: 'SIGN_PROJECT' }),
    passProject: () => dispatch({ type: 'PASS_PROJECT' }),
    notpassProject: () => dispatch({ type: 'NOTPASS_PROJECT' }),
    onlineProject: () => dispatch({ type: 'ONLINE_PROJECT' }),
    outlineProject: () => dispatch({ type: 'OUTLINE_PROJECT' }),
    clearEditor: () => dispatch({ type: 'CLEAR_EDITOR' }),
    showTotalAlert: (content) => dispatch({ type: 'SET_APP_ALERT', alert: { content: content, cback: null } }),
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectEditor);