import React, { Component } from 'react';
import '../css/Script.css';

class Script extends Component {
  constructor(props) {
    super(props);
    this.state = {
      script: this.props.script
    };
  }
  render() {
    return (
      <div className="container script" id={this.state.script.id}>
        <div className="row">
          <div className="col-xs-2"><img className="script_pic" src={this.state.script.img} alt="封面" /></div>
          <div className="col-xs-3"><h3>{this.state.script.title}</h3><p>{this.state.script.type}/{this.state.script.number}万字</p><p>{this.state.script.tips}</p></div>
          <div className="col-xs-2"><p>阅读：{this.state.script.read}</p><p>点赞：{this.state.script.star}</p><p>评论：{this.state.script.comment}</p><p>打赏：{this.state.script.reward}</p></div>
          <div className="col-xs-2 status">{this.state.script.status}</div>
          <div className="col-xs-3">
            <div><div className="btn btn-info">详情</div><div className="btn btn-primary">编辑</div></div>
            <div><div className="btn btn-success">投稿</div><div className="btn btn-danger">删除</div></div>
          </div>
        </div>
      </div>
    );
  }
}

export default Script;