import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import RoleList from './RoleList';
import actiontypes from '../../actions/actiontype';
import actionCreater from '../../actions/index';
import '../css/ProjectEditor.css';
import ParagraphEditor from './ParagraphEditor';


class ProjectEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pid: 0,
      waitlink: false,
      selections: 2,
      selectionnumshow: false
    };
  }

  addparagraph = (item) => {
    let project = { ...this.props.project };
    let paragraphtree = [...this.props.project.content.paragraphtree];
    const newid = Math.max.apply(Math, paragraphtree.map((item) => { return item.id })) + 1;
    let nextid = 0;
    for (let i = 0; i < paragraphtree.length; i++) {
      if (paragraphtree[i].id === item.id) {
        if (paragraphtree[i].type === 'text') {
          if (paragraphtree[i].nextid !== 0) {
            nextid = paragraphtree[i].nextid;
          }
          paragraphtree[i].nextid = newid;
          break;
        } else if (paragraphtree[i].optionid === item.optionid) {
          if (paragraphtree[i].next_paragraph_id !== 0) {
            nextid = paragraphtree[i].next_paragraph_id
          }
          paragraphtree[i].next_paragraph_id = newid;
          break;
        }
      }
    }
    paragraphtree.push({ id: newid, type: 'text', title: '未命名段落', chat_id: 0, paragraphtxt: '', nextid: nextid });
    project.content.paragraphtree = paragraphtree;
    this.props.setproject(project);
    console.log(this.props.project.content.paragraphtree);
  }

  addlink = (id) => {
    this.setState({ ...this, waitlink: true, pid: id });
  }

  toaddlink = (item) => {
    if (this.state.waitlink) {
      let project = { ...this.props.project };
      let paragraphtree = [...this.props.project.content.paragraphtree];
      const newid = Math.max.apply(Math, paragraphtree.map((item) => { return item.id })) + 1;
      for (let i = 0; i < paragraphtree.length; i++) {
        if (paragraphtree[i].id === this.state.pid) {
          if (paragraphtree[i].type === 'text') {
            paragraphtree[i].nextid = newid;
            break;
          } else if (paragraphtree[i].optionid === item.optionid) {
            paragraphtree[i].next_paragraph_id = newid;
            break;
          }
        }
      }
      paragraphtree.push({ ...item, id: newid, type: 'link', linkid: item.id });
      project.content.paragraphtree = paragraphtree;
      this.setState({ ...this, waitlink: false });
      this.props.setproject(project);
      console.log(this.props.project.content.paragraphtree);
    } else {
      if (item.type === 'select') {
        this.props.setcurrentparagraphid(item.id);
        this.props.setcurrentoptionid(item.optionid);
      } else {
        this.props.setcurrentparagraphid(item.id);
      }
    }
  }

  addselect = (id) => {
    this.setState({ ...this, pid: id, selectionnumshow: true });
  }

  toaddselect = () => {
    const num = this.state.selections;
    const id = this.state.pid;
    let project = { ...this.props.project };
    let paragraphtree = [...this.props.project.content.paragraphtree];
    let nextid = 0;
    const newid = Math.max.apply(Math, paragraphtree.map((item) => { return item.id })) + 1;
    for (let i = 0; i < paragraphtree.length; i++) {
      if (paragraphtree[i].id === id) {
        if (paragraphtree[i].nextid !== 0) {
          nextid = paragraphtree[i].nextid;
        }
        paragraphtree[i].nextid = newid;
        break;
      }
    }
    for (let j = 0; j < num; j++) {
      if (j === 0) {
        paragraphtree.push({ id: newid, type: 'select', title: '未命名', chat_id: 0, paragraphtxt: '', optionid: j, next_paragraph_id: nextid });
      } else {
        paragraphtree.push({ id: newid, type: 'select', title: '未命名', chat_id: 0, paragraphtxt: '', optionid: j, next_paragraph_id: 0 });
      }
    }
    project.content.paragraphtree = paragraphtree;
    this.props.setproject(project);
    this.setState({ ...this, selectionnumshow: false });
    console.log(this.props.project.content.paragraphtree);
  }

  addending = (item) => {
    let project = { ...this.props.project };
    let paragraphtree = [...this.props.project.content.paragraphtree];
    const newid = Math.max.apply(Math, paragraphtree.map((item) => { return item.id })) + 1;
    for (let i = 0; i < paragraphtree.length; i++) {
      if (paragraphtree[i].id === item.id) {
        if (paragraphtree[i].type === 'text') {
          paragraphtree[i].nextid = newid;
          break;
        } else if (paragraphtree[i].optionid === item.optionid) {
          paragraphtree[i].next_paragraph_id = newid;
          break;
        }
      }
    }
    paragraphtree.push({ id: newid, type: 'ending', title: '未命名结局', chat_id: 0, paragraphtxt: '', nextid: 0 });
    project.content.paragraphtree = paragraphtree;
    this.props.setproject(project);
    console.log(this.props.project.content.paragraphtree);
  }

  todelete = (item) => {
    let options = 0;
    let project = { ...this.props.project };
    let paragraphtree = [...this.props.project.content.paragraphtree];
    if (item.type === 'text') {
      for (let i = 0; i < paragraphtree.length; i++) {
        if (paragraphtree[i].type === 'select' && paragraphtree[i].next_paragraph_id === item.id) {
          paragraphtree[i].next_paragraph_id = item.nextid;
        } else if (paragraphtree[i].type === 'text' && paragraphtree[i].nextid === item.id) {
          paragraphtree[i].nextid = item.nextid;
        }
      }
      for (let i = 0; i < paragraphtree.length; i++) {
        if (paragraphtree[i].id === item.id && paragraphtree[i].type === 'text') {
          paragraphtree[i].delete = true;
          break;
        }
      }
      for (let i = 0; i < paragraphtree.length; i++) {
        if (paragraphtree[i].nextid === item.id && paragraphtree[i].type === 'link') {
          paragraphtree[i].nextid = 0;
        }
      }
      for (let i = 0; i < paragraphtree.length; i++) {
        if (paragraphtree[i].type === 'link' && paragraphtree[i].linkid === item.id) {
          for (let j = 0; j < paragraphtree.length; j++) {
            if (paragraphtree[j].type === 'text' && paragraphtree[j].nextid === paragraphtree[i].id) {
              paragraphtree[j].nextid = 0;
              break;
            } else if (paragraphtree[j].type === 'select' && paragraphtree[j].next_paragraph_id === paragraphtree[i].id) {
              paragraphtree[j].next_paragraph_id = 0;
              break;
            }
          }
          paragraphtree[i].delete = true;
        }
      }
    } else if (item.type === 'link' || item.type === 'ending') {
      for (let i = 0; i < paragraphtree.length; i++) {
        if (paragraphtree[i].nextid === item.id) {
          paragraphtree[i].nextid = 0;
        }
      }
      for (let j = 0; j < paragraphtree.length; j++) {
        if (paragraphtree[j].id === item.id) {
          paragraphtree[j].delete = true;
          break;
        }
      }
    } else {
      for (let i = 0; i < paragraphtree.length; i++) {
        if (paragraphtree[i].id === item.id) {
          options++;
        }
      }
      if (options > 2) {
        for (let i = 0; i < paragraphtree.length; i++) {
          if (paragraphtree[i].id === item.id && paragraphtree[i].optionid === item.optionid) {
            for (let j = 0; j < paragraphtree.length; j++) {
              if (paragraphtree[j].id === item.next_paragraph_id) {
                this.deletechilds(paragraphtree[j]);
                break;
              }
            }
            paragraphtree[i].delete = true;
            break;
          }
        }
      } else {
        for (let i = 0; i < paragraphtree.length; i++) {
          if (paragraphtree[i].id === item.id) {
            if (paragraphtree[i].optionid === item.optionid) {
              for (let j = 0; j < paragraphtree.length; j++) {
                if (paragraphtree[j].id === item.next_paragraph_id) {
                  this.deletechilds(paragraphtree[j]);
                  break;
                }
              }
            } else {
              for (let j = 0; j < paragraphtree.length; j++) {
                if (paragraphtree[j].nextid === item.id) {
                  paragraphtree[j].nextid = paragraphtree[i].next_paragraph_id;
                  break;
                }
              }
            }
            paragraphtree[i].delete = true;
          }
        }
      }
    }
    for (let i = 0; i < paragraphtree.length; i++) {
      if (paragraphtree[i].delete) {
        if (paragraphtree[i].id === this.props.currentparagraphid) {
          this.props.setcurrentparagraphid(1);
        }
        paragraphtree.splice(i, 1);
        i--;
      }
    }
    project.content.paragraphtree = paragraphtree;
    this.props.setproject(project);
    console.log(this.props.project.content.paragraphtree);
  }

  deletechilds = (item) => {
    console.log(item);
    let project = { ...this.props.project };
    let paragraphtree = [...this.props.project.content.paragraphtree];
    if (item.type === 'text') {
      for (let i = 0; i < paragraphtree.length; i++) {
        if (paragraphtree[i].type === 'select' && paragraphtree[i].next_paragraph_id === item.id) {
          paragraphtree[i].next_paragraph_id = item.nextid;
        } else if (paragraphtree[i].type === 'text' && paragraphtree[i].nextid === item.id) {
          paragraphtree[i].nextid = item.nextid;
        }
      }
      for (let i = 0; i < paragraphtree.length; i++) {
        if (paragraphtree[i].id === item.id && paragraphtree[i].type === 'text') {
          paragraphtree[i].delete = true;
          break;
        }
      }
      for (let i = 0; i < paragraphtree.length; i++) {
        if (paragraphtree[i].nextid === item.id && paragraphtree[i].type === 'link') {
          paragraphtree[i].nextid = 0;
        }
      }
      for (let i = 0; i < paragraphtree.length; i++) {
        if (paragraphtree[i].type === 'link' && paragraphtree[i].linkid === item.id) {
          for (let j = 0; j < paragraphtree.length; j++) {
            if (paragraphtree[j].type === 'text' && paragraphtree[j].nextid === paragraphtree[i].id) {
              paragraphtree[j].nextid = 0;
              break;
            } else if (paragraphtree[j].type === 'select' && paragraphtree[j].next_paragraph_id === paragraphtree[i].id) {
              paragraphtree[j].next_paragraph_id = 0;
              break;
            }
          }
          paragraphtree[i].delete = true;
        }
      }
      if (item.nextid !== 0) {
        for (let i = 0; i < paragraphtree.length; i++) {
          if (paragraphtree[i].id === item.nextid) {
            this.deletechilds(paragraphtree[i]);
          }
        }
      }
    } else if (item.type === 'link' || item.type === 'ending') {
      for (let i = 0; i < paragraphtree.length; i++) {
        if (paragraphtree[i].nextid === item.id) {
          paragraphtree[i].nextid = 0;
        }
      }
      for (let j = 0; j < paragraphtree.length; j++) {
        if (paragraphtree[j].id === item.id) {
          paragraphtree[j].delete = true;
          break;
        }
      }
      if (item.nextid !== 0) {
        for (let i = 0; i < paragraphtree.length; i++) {
          if (paragraphtree[i].id === item.nextid) {
            this.deletechilds(paragraphtree[i]);
          }
        }
      }
    } else {
      for (let i = 0; i < paragraphtree.length; i++) {
        if (paragraphtree[i].id === item.id) {
          for (let j = 0; j < paragraphtree.length; j++) {
            if (paragraphtree[j].id === paragraphtree[i].next_paragraph_id) {
              this.deletechilds(paragraphtree[j]);
              break;
            }
          }
          paragraphtree[i].delete = true;
        }
      }
    }
    project.content.paragraphtree = paragraphtree;
    this.props.setproject(project);
  }

  changeoptiontext = (e, item) => {
    let project = { ...this.props.project };
    let paragraphtree = [...this.props.project.content.paragraphtree];
    for (let i = 0; i < paragraphtree.length; i++) {
      if (paragraphtree[i].id === item.id && paragraphtree[i].optionid === item.optionid) {
        paragraphtree[i].title = e.target.value;
        project.content.paragraphtree = paragraphtree;
        this.props.setproject(project);
        break;
      }
    }
  }

  hideselectionnum = () => {
    this.setState({ ...this, selectionnumshow: false });
  }

  add = () => {
    this.setState({ ...this, selections: this.state.selections + 1 });
  }

  remove = () => {
    this.setState({ ...this, selections: this.state.selections === 2 ? 2 : this.state.selections - 1 });
  }

  render() {
    const currentid = this.props.currentparagraphid;
    const tree = this.props.project.content.paragraphtree.map((item, key) => {
      let temp = null;
      if (item.type === 'text') {
        if (item.nextid === 0) {
          if (item.id === 1) {
            temp =
              <div className={"type-text " + (item.id === currentid ? 'current' : '')} key={item.id + '' + key}>
                <div className="text-title" onClick={() => { this.toaddlink(item) }}>{item.title}</div>
                <div className="tools">
                  <div className="btn btn-default" onClick={() => { this.addparagraph(item) }}>段落</div>
                  <div className="btn btn-default" onClick={() => { this.addselect(item.id) }}>选项</div>
                  <div className="btn btn-default" onClick={() => { this.addlink(item) }}>连接</div>
                  <div className="btn btn-default" onClick={() => { this.addending(item) }}>结局</div>
                </div>
              </div>
          } else {
            temp =
              <div className={"type-text " + (item.id === currentid ? 'current' : '')} key={item.id + '' + key}>
                <div className="text-title" onClick={() => { this.toaddlink(item) }}>{item.title}</div>
                <div className="tools">
                  <div className="btn btn-default" onClick={() => { this.addparagraph(item) }}>段落</div>
                  <div className="btn btn-default" onClick={() => { this.addselect(item.id) }}>选项</div>
                  <div className="btn btn-default" onClick={() => { this.addlink(item) }}>连接</div>
                  <div className="btn btn-default" onClick={() => { this.addending(item) }}>结局</div>
                  <div className="btn btn-default" title="删除会删除段落所有内容" onClick={() => { this.todelete(item) }}>删除</div>
                </div>
              </div>
          }
        } else {
          if (item.id === 1) {
            temp =
              <div className={"type-text " + (item.id === currentid ? 'current' : '')} key={item.id + '' + key}>
                <div className="text-title" onClick={() => { this.toaddlink(item) }}>{item.title}</div>
                <div className="tools">
                  <div className="btn btn-default" onClick={() => { this.addparagraph(item) }}>段落</div>
                  <div className="btn btn-default" onClick={() => { this.addselect(item.id) }}>选项</div>
                </div>
              </div>
          } else {
            temp =
              <div className={"type-text " + (item.id === currentid ? 'current' : '')} key={item.id + '' + key}>
                <div className="text-title" onClick={() => { this.toaddlink(item) }}>{item.title}</div>
                <div className="tools">
                  <div className="btn btn-default" onClick={() => { this.addparagraph(item) }}>段落</div>
                  <div className="btn btn-default" onClick={() => { this.addselect(item.id) }}>选项</div>
                  <div className="btn btn-default" title="删除会删除段落所有内容" onClick={() => { this.todelete(item) }}>删除</div>
                </div>
              </div>
          }
        }
      } else if (item.type === 'link') {
        temp =
          <div className="type-link" key={item.id + '' + key}>{item.title}
            <div className="tools">
              <div className="btn btn-default" title="删除会删除段落所有内容" onClick={() => { this.todelete(item) }}>删除</div>
            </div>
          </div>
      } else if (item.type === 'ending') {
        temp =
          <div className={"type-ending " + (item.id === currentid ? 'current' : '')} key={item.id + '' + key}>
            <div className="text-title" onClick={() => { this.toaddlink(item) }}>{item.title}</div>
            <div className="tools">
              <div className="btn btn-default" title="删除会删除段落所有内容" onClick={() => { this.todelete(item) }}>删除</div>
            </div>
          </div>
      } else if (item.type === 'select') {
        temp =
          <div className="type-selection" key={item.id + '' + key}>
            <div className="selection-title" onClick={() => { this.toaddlink(item) }}>{item.title}</div>
            <div className="tools">
              <div className="btn btn-default" onClick={() => { this.addparagraph(item) }}>段落</div>
              <div className="btn btn-default" title="删除选项会删除选项下的所有内容" onClick={() => { this.todelete(item) }}>删除</div>
            </div>
          </div>
      }
      return temp;
    });
    return (
      <div className="container" >
        <div className="header">
          <div className="back" onClick={() => { this.props.history.goBack() }}>返回主页</div>
          <div className="projecttitle">{this.state.title}</div>
          <div className="toolbar">
            <div className="btn btn-default">数值</div>
            <div className="btn btn-default">回忆</div>
            <div className="btn btn-default">预览</div>
            <div className="btn btn-default">保存</div>
          </div>
        </div>
        <RoleList></RoleList>
        <div className="paragraphtree">
          <div className={"selecttionnum " + (this.state.selectionnumshow ? 'show' : 'hide')}>
            <span className="glyphicon glyphicon-remove close" onClick={this.hideselectionnum}></span>
            <h4>选项个数</h4>
            <div className="input-group">
              <span className="input-group-btn"><div className="btn btn-default" onClick={this.remove}>-</div></span>
              <input type="text" className="form-control" value={this.state.selections} onChange={() => { }} />
              <span className="input-group-btn"><div className="btn btn-default" onClick={this.add}>+</div></span>
            </div>
            <div className="btn btn-success" onClick={this.toaddselect}>确定</div>
          </div>
          {tree}
        </div>
        <ParagraphEditor></ParagraphEditor>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { project: state.project, currentparagraphid: state.currentparagraphid, currentoptionid: state.currentoptionid };
}

const mapDispatchToProps = (dispatch) => {
  return {
    setproject: (project) => { dispatch(actionCreater(actiontypes.SET_PROJECT, { project: project })) },
    setcurrentparagraphid: (currentparagraphid) => { dispatch(actionCreater(actiontypes.SET_CURRENT_PARAGRAPHID, { currentparagraphid: currentparagraphid })) },
    setcurrentoptionid: (currentoptionid) => { dispatch(actionCreater(actiontypes.SET_CURRENT_OPTIONID, { currentoptionid: currentoptionid })) }
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ProjectEditor));