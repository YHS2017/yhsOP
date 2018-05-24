import React, { Component } from 'react';
import { connect } from 'react-redux';
import defaultimg from '../images/icon_default_profile@3x.png';
import defaultendbg from '../images/endbg.jpg';
import play from '../images/play.png';
import '../css/Preview.css';

class Preview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      video: '',
      videoplay: false,
    };
  }

  componentDidUpdate() {
    const chatbox = this.refs.chatbox;
    if (chatbox) {
      chatbox.scrollTo(0, 100000);
    }
  }

  stopplay = () => {
    this.setState({ videoplay: false });
  }
  toplay = (video) => {
    this.setState({ video, videoplay: true });
  }

  trimParagraphText = (text) => {
    // 移除首尾的多余空行和空格
    return text.replace(/^[\s\n]+|[\s\n]+$/g, '');
  }

  getRoleByName(name) {
    const out_roles = this.props.roles;
    if (name === '我') {
      return 0;
    } else {
      return out_roles.find(r => r.name === name);
    }
  }

  getRoleById(id) {
    const out_roles = this.props.roles;
    return out_roles.find(r => r.id === id);
  }

  buildParagraphNodes = (text) => {
    const nodes = [];
    const trimmed_text = this.trimParagraphText(text);
    const blocks = trimmed_text.split(/\n[\s\n]*\n/);
    for (let i = 0; i < blocks.length; i++) {
      const lines = blocks[i].split(/\n/);
      if (lines[0].startsWith('@')) {
        // 有角色的内容，例如@我、@旁白、@角色名
        const role = this.getRoleByName(lines[0].substring(1).trim());
        if (role !== undefined) {
          if (lines[1] && lines[1].startsWith('#图片#')) {                                // 图片
            const image = lines[2] ? lines[2].trim() : '';
            if (image !== '') {
              nodes.push({ type: 'Image', role, image });
            }
          } else if (lines[1] && lines[1].startsWith('#音频#')) {                                // 音频
            const audio = lines[2] ? lines[2].trim() : '';
            const time = parseInt(audio.match(/\d+\.mp3$/), 10);
            if (audio !== '') {
              nodes.push({ type: 'Audio', role, audio, time });
            }
          } else if (lines[1] && lines[1].startsWith('#视频#')) {                           // 视频
            const text = lines[2] ? lines[2].trim() : '';
            const video = lines[3] ? lines[3].trim() : '';
            if (video !== '') {
              nodes.push({ type: 'Video', role, text, video });
            }
          } else if (lines[1] && lines[1].startsWith('#链接#')) {                           // 链接
            const title = lines[2] ? lines[2].trim() : '';
            const text = lines[3] ? lines[3].trim() : '';
            const link = lines[4] ? lines[4].trim() : '';
            const image = lines[5] ? lines[5].trim() : '';
            if (image !== '') {
              nodes.push({ type: 'Link', title, text, link, image, role });
            }
          } else if (lines[1] && lines[1].startsWith('#忙碌#')) {                           // 忙碌
            const text = lines[2] ? lines[2].trim() : '';
            nodes.push({ type: 'Busy', text, role });
          } else {
            const text = blocks[i].substring(lines[0].length + 1).trim();
            if (text !== '') {
              nodes.push({ type: 'Text', text, role });                      // 文本
            }
          }
        }
      } else {
        // 不需要@角色的内容
        if (lines[0].startsWith('#图片#')) {                            // 旁白图片
          const image = lines[1] ? lines[1].trim() : '';
          if (image !== '') {
            nodes.push({ type: 'Image', role: -1, image });
          }
        } else if (lines[0].startsWith('#视频#')) {                           // 旁白视频
          const text = lines[1] ? lines[1].trim() : '';
          const video = lines[2] ? lines[2].trim() : '';
          if (video !== '') {
            nodes.push({ type: 'Video', role: -1, text, video });
          }
        } else if (lines[0].startsWith('==')) {                               // 延迟
          const time = parseFloat(lines[0].substring(2).trim()) * 60000;
          nodes.push({ type: 'Delay', time });
        } else if (lines[0].startsWith('#数值#')) {                          // 数值
          const line = lines[1].trim();
          const key = line.split(/[=\-+*/]/g)[0];
          const value = parseInt(line.split(/[=\-+*/]/g)[1], 10);
          const operator = line.match(/[=\-+*/]/g)[0];
          nodes.push({ type: 'Number', key: key, value: value, operator: operator });
        } else if (lines[0].length > 0) {
          nodes.push({ type: 'Text', role: -1, text: blocks[i].trim() });       // 旁白文本
        }
      }
    }
    return nodes;
  }

  getroleinfoByid = (id) => {
    return this.props.roles.find(item => item.id === id);
  }

  getroleinfoByname = (name) => {
    return this.props.roles.find(item => item.name === name);
  }

  render() {
    const currentparagraph = this.props.currentparagraph;
    const user = this.props.user;
    const chatrole = this.getRoleById(currentparagraph.chat_id);
    const nodes = this.buildParagraphNodes(currentparagraph.text);
    if (currentparagraph.type === 'Node') {
      const chatlist = nodes.map((node, key) => {
        if (node.type === 'Text') {
          if (node.role === 0) {
            return (
              <pre key={key} className="msg-right">
                <img className="profile" alt="" src={user.profile === '' ? defaultimg : user.profile} />
                <div className="rolename">{user.name}</div>
                <div className="msg-pop"><span>{node.text}</span></div>
              </pre>
            )
          } else if (node.role === -1) {
            return (
              <div key={key} className="aside"><span>{node.text}</span></div>
            )
          } else {
            return (
              <pre key={key} className="msg-left">
                <img className="profile" alt="" src={node.role.profile === '' ? defaultimg : node.role.profile} />
                <div className="rolename">{node.role.name}</div>
                <div className="msg-pop"><span>{node.text}</span></div>
              </pre>
            )
          }
        } else if (node.type === 'Image') {
          if (node.role === 0) {
            return (
              <div key={key} className="msg-right">
                <img className="profile" alt="" src={user.profile === '' ? defaultimg : user.profile} />
                <div className="rolename">{user.name}</div>
                <div className="img-pop">
                  <img className="img" alt="" src={node.image} />
                </div>
              </div>
            )
          } else if (node.role === -1) {
            return (
              <div key={key} className="aside"><img alt="" className="img" src={node.image} /></div>
            )
          } else {
            return (
              <div key={key} className="msg-left">
                <img className="profile" alt="" src={node.role.profile === '' ? defaultimg : node.role.profile} />
                <div className="rolename">{node.role.name}</div>
                <div className="img-pop">
                  <img className="img" alt="" src={node.image} />
                </div>
              </div>
            )
          }
        } else if (node.type === 'Audio') {
          if (node.role === 0) {
            return (
              <div key={key} className="msg-right">
                <img className="profile" alt="" src={user.profile === '' ? defaultimg : user.profile} />
                <div className="rolename">{user.name}</div>
                <div className="audio-pop" style={{ width: Math.min(node.time / 60 * 220, 220) + 'px' }}>
                  <span className="audio-icon fa fa-wifi"></span>
                  <div className="audio-time">{node.time + '"'}</div>
                </div>
              </div>
            )
          } else {
            return (
              <div key={key} className="msg-left">
                <img className="profile" alt="" src={node.role.profile === '' ? defaultimg : node.role.profile} />
                <div className="rolename">{node.role.name}</div>
                <div className="audio-pop" style={{ width: Math.min(node.time / 60 * 220, 220) + 'px' }}>
                  <span className="audio-icon fa fa-wifi"></span>
                  <div className="audio-time">{node.time + '"'}</div>
                </div>
              </div>
            )
          }
        } else if (node.type === 'Video') {
          if (node.role === 0) {
            return (
              <div key={key} className="msg-right">
                <img className="profile" alt="" src={user.profile === '' ? defaultimg : user.profile} />
                <div className="rolename">{user.name}</div>
                <div className="video-pop" onClick={() => this.toplay(node.video)}>
                  <img className="img" alt="" src={node.video + '.0_0.p0.jpg'} />
                  <img className="play-btn" alt="" src={play} />
                </div>
              </div>
            )
          } else if (node.role === -1) {
            console.log(chatrole);
            return (
              <div key={key} className="aside-box">
                <img className="profile" alt="" src={chatrole.profile === '' ? defaultimg : chatrole.profile} />
                <div className="meettype">事件</div>
                <div className="meettitle">{node.text}</div>
                <div className="meetbtn" onClick={() => this.toplay(node.video)}>会面</div>
              </div>
            )
          } else {
            return (
              <div key={key} className="msg-left">
                <img className="profile" alt="" src={node.role.profile === '' ? defaultimg : node.role.profile} />
                <div className="rolename">{node.role.name}</div>
                <div className="video-pop" onClick={() => this.toplay(node.video)}>
                  <img className="img" alt="" src={node.video + '.0_0.p0.jpg'} />
                  <img className="play-btn" alt="" src={play} />
                </div>
              </div>
            )
          }
        }
      });
      return (
        <div className="preview" >
          <div className="preview-box">
            {this.state.videoplay ? <video className="videoplayer" autoPlay="true" src={this.state.video} onClick={this.stopplay}></video> : null}
            <div className="preview-title">{this.getroleinfoByid(currentparagraph.chat_id) === undefined ? '匿名' : this.getroleinfoByid(currentparagraph.chat_id).name}</div>
            <div className="chat-box" ref="chatbox">
              {chatlist}
            </div>
          </div>
        </div>
      );
    } else if (currentparagraph.type === 'End') {
      return (
        <div className="preview" >
          <div className="preview-box">
            <img src={currentparagraph.image === '' ? defaultendbg : currentparagraph.image} alt="" className="endbg" />
            <div className="endbox">
              <div className="endtitle">{currentparagraph.title}</div>
              <pre className="endtext">{currentparagraph.text}</pre>
            </div>
            <div className="endbackbtn">返回</div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
}

const mapStateToProps = (state) => {
  return { roles: state.editor.content.roles, user: state.user };
};

const mapDispatchToProps = (dispatch) => {
  return {

  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Preview);