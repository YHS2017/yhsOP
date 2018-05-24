import React, { Component } from 'react';
import { connect } from 'react-redux';
import FileUpload from './FileUpload';
import '../css/ParagraphEditor.css';
import Preview from './Preview';

class ParagraphEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: '35%',
      preview: false,
      placeholder: '@我\n#图片#\nhttp://aaa.bbb.com/img/abc.jpg\n\n@我\n#视频#\n美美哒~\nhttp://aaa.bbb.com/video/abc.mp4\n\n@角色1\n你今天真漂亮\n\n@我\n那你是说我以前都很丑咯？',
      toolbox: 'none',
      addtxt: null
    };
  }

  //切换聊天对象
  changechatid = (e, paragraph) => {
    paragraph.chat_id = parseInt(e.target.value, 10);
    this.props.updateParagraph(paragraph);
  }

  changetitle = (e, paragraph) => {
    paragraph.title = e.target.value;
    this.props.updateParagraph(paragraph);
  }

  inittitle = (paragraph) => {
    if (paragraph.title === '未命名段落' || paragraph.title === '未命名选项' || paragraph.title === '未命名结局' || paragraph.title === '未命名锁') {
      paragraph.title = '';
    } else if (paragraph.title === '') {
      if (paragraph.type === 'Node') {
        paragraph.title = '未命名段落';
      } else if (paragraph.type === 'End') {
        paragraph.title = '未命名结局';
      } else if (paragraph.type === 'Lock') {
        paragraph.title = '未命名锁';
      }
    }
    this.props.updateParagraph(paragraph);
  }

  changetext = (e, paragraph) => {
    paragraph.text = e.target.value;
    this.props.updateParagraph(paragraph);
  }

  changebranchtype = (paragraph) => {
    let newparagraph = null;
    if (paragraph.type === 'Branch') {
      newparagraph = {
        id: paragraph.id,
        chat_id: paragraph.chat_id,
        type: 'NumberBranch',
        key: this.props.content.numbers[0].title,
        expanded: paragraph.expanded,
        ranges: []
      };
      for (let i = 0; i < paragraph.selections.length; i++) {
        if (i !== paragraph.selections.length - 1) {
          newparagraph.ranges.push({
            value: (i + 1) * 50,
            next_id: paragraph.selections[i].next_id
          });
        } else {
          newparagraph.ranges.push({
            value: null,
            next_id: paragraph.selections[i].next_id
          });
        }
      }
    } else {
      newparagraph = {
        id: paragraph.id,
        type: 'Branch',
        chat_id: paragraph.chat_id,
        expanded: paragraph.expanded,
        selections: []
      };
      for (let i = 0; i < paragraph.ranges.length; i++) {
        newparagraph.selections.push({
          title: '未命名选项',
          next_id: paragraph.ranges[i].next_id
        });
      }
    }
    this.props.updateParagraph(newparagraph);
  }

  changenumber = (e, paragraph) => {
    paragraph.key = e.target.value;
    this.props.updateParagraph(paragraph);
  }

  rangevaluechange = (e, paragraph, range_index) => {
    if (e.target.value) {
      paragraph.ranges[range_index].value = parseInt(e.target.value, 10);
    } else {
      paragraph.ranges[range_index].value = 0;
    }
    this.props.updateParagraph(paragraph);
  }

  selectiontitlechange = (e, paragraph, branch_index) => {
    paragraph.selections[branch_index].title = e.target.value;
    this.props.updateParagraph(paragraph);
  }

  initselectiontitle = (paragraph, branch_index) => {
    if (paragraph.selections[branch_index].title === '未命名选项') {
      paragraph.selections[branch_index].title = '';
    } else if (paragraph.selections[branch_index].title === '') {
      paragraph.selections[branch_index].title = '未命名选项';
    }
    this.props.updateParagraph(paragraph);
  }

  changeendgalleryid = (e, paragraph) => {
    paragraph.gallery_id = parseInt(e.target.value, 10);
    this.props.updateParagraph(paragraph);
  }

  changecoin = (e, paragraph) => {
    paragraph.coin = parseInt(e.target.value, 10);
    if (e.target.value === 'WaitOrPay') {
      paragraph.title = '币/时 ' + paragraph.coin;
    } else {
      paragraph.title = '币 ' + paragraph.coin;
    }
    this.props.updateParagraph(paragraph);
  }

  changepaytype = (e, paragraph) => {
    paragraph.pay_type = e.target.value;
    if (e.target.value === 'WaitOrPay') {
      paragraph.title = '币/时 ' + paragraph.coin;
    } else {
      paragraph.title = '币 ' + paragraph.coin;
    }
    this.props.updateParagraph(paragraph);
  }

  changeendimg = (url) => {
    let selected_paragraph_id = this.props.selected_paragraph_id;
    let paragraphs = [...this.props.content.paragraphs];
    for (let i = 0; i < paragraphs.length; i++) {
      if (paragraphs[i].id === selected_paragraph_id) {
        paragraphs[i].image = url;
        this.props.updateParagraph(paragraphs[i]);
        break;
      }
    }
  }

  addparagraphfile = (url, filename, paragraph) => {
    paragraph.text = paragraph.text.replace(filename, url);
    this.props.updateParagraph(paragraph);
  }

  dropFile = (e, paragraph) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    let texteditor = this.refs.texteditor;
    console.log(texteditor.attributes);
    var startPos = texteditor.selectionStart;
    var endPos = texteditor.selectionEnd;

    // 保存滚动条  
    var restoreTop = texteditor.scrollTop;
    paragraph.text = paragraph.text.substring(0, startPos) + file.name + paragraph.text.substring(endPos, paragraph.text.length);

    if (restoreTop > 0) {
      texteditor.scrollTop = restoreTop;
    }

    texteditor.focus();
    texteditor.selectionStart = startPos + texteditor.length;
    texteditor.selectionEnd = startPos + texteditor.length;

    this.props.updateParagraph(paragraph);
    this.props.uploadFile(file, 'both', (path) => { this.addparagraphfile(path, file.name, paragraph) });
  };

  togglepreview = () => {
    this.setState({ preview: !this.state.preview });
  }

  //小白模式工具栏控制
  changetoolbox = (toolbox, chat_id) => {
    let role = '我';
    if (toolbox === 'addbusy') {
      for (let i = 0; i < this.props.content.roles.length; i++) {
        if (this.props.content.roles[i].id === chat_id) {
          role = this.props.content.roles[i].name;
          break;
        }
      }
    }
    this.setState({
      toolbox,
      addtxt: {
        role,
        title: '',
        url: '',
        img: '',
        video: '',
        text: '',
        gallery: '不收集'
      }
    });
  }

  //小白模式表单控制
  changewidth = () => {
    if (parseInt(this.state.width, 10) < 50) {
      this.setState({ width: '50%' });
    } else if (parseInt(this.state.width, 10) > 50) {
      this.setState({ width: '35%' });
    } else {
      this.setState({ width: '60%' });
    }
  }

  changeaddtxtrole = (e) => {
    this.setState({ addtxt: { ...this.state.addtxt, role: e.target.value } });
  }

  changeaddtxtgallery = (e) => {
    this.setState({ addtxt: { ...this.state.addtxt, gallery: e.target.value } });
  }

  changeaddtxttext = (e) => {
    this.setState({ addtxt: { ...this.state.addtxt, text: e.target.value } });
  }

  changeaddtxttitle = (e) => {
    this.setState({ addtxt: { ...this.state.addtxt, title: e.target.value } });
  }

  changeaddtxturl = (e) => {
    this.setState({ addtxt: { ...this.state.addtxt, url: e.target.value } });
  }

  changeaddtxtimg = (img) => {
    this.setState({ addtxt: { ...this.state.addtxt, img } });
  }

  changeaddtxtvideo = (video) => {
    this.setState({ addtxt: { ...this.state.addtxt, video } });
  }

  toaddtxt = (currentparagraph) => {
    const addtxt = this.state.addtxt;
    let paragraph = { ...currentparagraph };
    switch (this.state.toolbox) {
      case 'addtext':
        if (addtxt.role === '旁白') {
          paragraph.text += '\n\n';
        } else {
          paragraph.text += '\n\n@' + addtxt.role + '\n';
        }
        paragraph.text += addtxt.text;
        this.props.updateParagraph(paragraph);
        break;

      case 'addimg':
        if (addtxt.role === '旁白') {
          paragraph.text += '\n\n';
        } else {
          paragraph.text += '\n\n@' + addtxt.role + '\n';
        }
        paragraph.text += '#图片#\n' + addtxt.img;
        if (addtxt.gallery !== '不收录') {
          paragraph.text += '\n>' + addtxt.gallery;
        }
        this.props.updateParagraph(paragraph);
        break;

      case 'addaudio':
        if (addtxt.role === '旁白') {
          paragraph.text += '\n\n';
        } else {
          paragraph.text += '\n\n@' + addtxt.role + '\n';
        }
        paragraph.text += '#音频#\n' + addtxt.img;
        if (addtxt.gallery !== '不收录') {
          paragraph.text += '\n>' + addtxt.gallery;
        }
        this.props.updateParagraph(paragraph);
        break;

      case 'addvideo':
        if (addtxt.role === '旁白') {
          paragraph.text += '\n\n';
        } else {
          paragraph.text += '\n\n@' + addtxt.role + '\n';
        }
        paragraph.text += '#视频#\n';
        paragraph.text += addtxt.text + '\n';
        paragraph.text += addtxt.video;
        if (addtxt.gallery !== '不收录') {
          paragraph.text += '\n>' + addtxt.gallery;
        }
        this.props.updateParagraph(paragraph);
        break;

      case 'addlink':
        if (addtxt.role === '旁白') {
          paragraph.text += '\n\n';
        } else {
          paragraph.text += '\n\n@' + addtxt.role + '\n';
        }
        paragraph.text += '#链接#\n';
        paragraph.text += addtxt.title + '\n';
        paragraph.text += addtxt.text + '\n';
        paragraph.text += addtxt.url + '\n';
        paragraph.text += addtxt.img + '\n';
        this.props.updateParagraph(paragraph);
        break;

      case 'addbusy':
        if (addtxt.role === '旁白') {
          paragraph.text += '\n\n';
        } else {
          paragraph.text += '\n\n@' + addtxt.role + '\n';
        }
        paragraph.text += '#忙碌#\n' + addtxt.text;
        this.props.updateParagraph(paragraph);
        break;


      default:
        break;
    }
    this.setState({ toolbox: 'none' });
  }

  renderlinno = (paragraph) => {
    const line = paragraph.text.split('\n').length;
    const errorlines = this.props.errors.map(error => {
      if (error.extra.paragraph_id === paragraph.id) {
        return error.extra.line_number;
      } else {
        return null;
      }
    });
    let lineno = [];
    for (let i = 0; i < line; i++) {
      let haserror = false;
      for (let j = 0; j < errorlines.length; j++) {
        if (errorlines[j] === (i + 1)) {
          haserror = true;
          break;
        }
      }
      if (haserror) {
        lineno.push(<div className="error-line" key={i + 1}><b>{i + 1}</b></div>);
      } else {
        lineno.push(<div key={i + 1}><b>{i + 1}</b></div>);
      }
    }
    return { lineno: lineno, h: line * 24 };
  }

  rendertoolbox = (currentparagraph) => {
    const rolelist = this.props.content.roles.map((item) => {
      return <option key={item.name} value={item.name}>{item.name}</option>
    })
    const gallarylist = this.props.content.galleries.map((item) => {
      return <option key={item.id} value={item.title}>{item.title}</option>
    })
    switch (this.state.toolbox) {
      case 'addtext':
        return (
          <div className="toolbox">
            <div className="toolbox-content">
              <div className="toolbox-title">插入对白</div>
              <table>
                <tbody>
                  <tr>
                    <td>角色：</td>
                    <td>
                      <select className="form-control" value={this.state.addtxt.role} onChange={this.changeaddtxtrole}>
                        <option value="旁白">旁白</option>
                        <option value="我">我</option>
                        {rolelist}
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <td>对白内容：</td>
                    <td>
                      <textarea className="form-control" cols="30" rows="10" maxLength="200" value={this.state.addtxt.text} onChange={this.changeaddtxttext}></textarea>
                      <p className="table-alert">对白内容不得超过200字</p>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="toolbox-footer">
                <div className="btn-green-s" onClick={() => this.toaddtxt(currentparagraph)}>确定</div>
                <div className="btn-blue-s" onClick={() => this.changetoolbox('none')}>取消</div>
              </div>
            </div>
          </div>
        );

      case 'addimg':
        return (
          <div className="toolbox">
            <div className="toolbox-content">
              <div className="toolbox-title">插入图片</div>
              <table>
                <tbody>
                  <tr>
                    <td>角色：</td>
                    <td>
                      <select className="form-control" value={this.state.addtxt.role} onChange={this.changeaddtxtrole}>
                        <option value="旁白">旁白</option>
                        <option value="我">我</option>
                        {rolelist}
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <td>图片：</td>
                    <td>
                      <FileUpload getuploadurl={this.changeaddtxtimg.bind(this)} src={this.state.addtxt.img} filetype="img"></FileUpload>
                    </td>
                  </tr>
                  <tr>
                    <td>收录回忆：</td>
                    <td>
                      <select className="form-control" value={this.state.addtxt.galleries} onChange={this.changeaddtxtgallery}>
                        <option value="不收录">不收录</option>
                        {gallarylist}
                      </select>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="toolbox-footer">
                <div className="btn-green-s" onClick={() => this.toaddtxt(currentparagraph)}>确定</div>
                <div className="btn-blue-s" onClick={() => this.changetoolbox('none')}>取消</div>
              </div>
            </div>
          </div>
        );

      case 'addaudio':
        return (
          <div className="toolbox">
            <div className="toolbox-content">
              <div className="toolbox-title">插入语音</div>
              <table>
                <tbody>
                  <tr>
                    <td>角色：</td>
                    <td>
                      <select className="form-control" value={this.state.addtxt.role} onChange={this.changeaddtxtrole}>
                        <option value="旁白">旁白</option>
                        <option value="我">我</option>
                        {rolelist}
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <td>语音：</td>
                    <td>
                      <FileUpload getuploadurl={this.changeaddtxtimg.bind(this)} src={this.state.addtxt.img} filetype="audio"></FileUpload>
                    </td>
                  </tr>
                  <tr>
                    <td>收录回忆：</td>
                    <td>
                      <select className="form-control" value={this.state.addtxt.galleries} onChange={this.changeaddtxtgallery}>
                        <option value="不收录">不收录</option>
                        {gallarylist}
                      </select>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="toolbox-footer">
                <div className="btn-green-s" onClick={() => this.toaddtxt(currentparagraph)}>确定</div>
                <div className="btn-blue-s" onClick={() => this.changetoolbox('none')}>取消</div>
              </div>
            </div>
          </div>
        );

      case 'addvideo':
        return (
          <div className="toolbox">
            <div className="toolbox-content">
              <div className="toolbox-title">插入视频</div>
              <table>
                <tbody>
                  <tr>
                    <td>角色：</td>
                    <td>
                      <select className="form-control" value={this.state.addtxt.role} onChange={this.changeaddtxtrole}>
                        <option value="旁白">旁白</option>
                        <option value="我">我</option>
                        {rolelist}
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <td>描述：</td>
                    <td>
                      <input className="form-control" type="text" value={this.state.addtxt.text} onChange={this.changeaddtxttext} />
                    </td>
                  </tr>
                  <tr>
                    <td>视频：</td>
                    <td>
                      <FileUpload getuploadurl={this.changeaddtxtvideo.bind(this)} src={this.state.addtxt.video} filetype="video"></FileUpload>
                    </td>
                  </tr>
                  <tr>
                    <td>收录回忆：</td>
                    <td>
                      <select className="form-control" value={this.state.addtxt.galleries} onChange={this.changeaddtxtgallery}>
                        <option value="不收录">不收录</option>
                        {gallarylist}
                      </select>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="toolbox-footer">
                <div className="btn-green-s" onClick={() => this.toaddtxt(currentparagraph)}>确定</div>
                <div className="btn-blue-s" onClick={() => this.changetoolbox('none')}>取消</div>
              </div>
            </div>
          </div>
        );

      case 'addlink':
        return (
          <div className="toolbox">
            <div className="toolbox-content">
              <div className="toolbox-title">插入链接</div>
              <table>
                <tbody>
                  <tr>
                    <td>角色：</td>
                    <td>
                      <select className="form-control" value={this.state.addtxt.role} onChange={this.changeaddtxtrole}>
                        <option value="我">我</option>
                        {rolelist}
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <td>标题：</td>
                    <td>
                      <input className="form-control" type="text" value={this.state.addtxt.title} onChange={this.changeaddtxttitle} />
                    </td>
                  </tr>
                  <tr>
                    <td>描述：</td>
                    <td>
                      <input className="form-control" type="text" value={this.state.addtxt.text} onChange={this.changeaddtxttext} />
                    </td>
                  </tr>
                  <tr>
                    <td>链接：</td>
                    <td>
                      <input className="form-control" type="text" value={this.state.addtxt.url} onChange={this.changeaddtxturl} />
                    </td>
                  </tr>
                  <tr>
                    <td>图片：</td>
                    <td>
                      <FileUpload getuploadurl={this.changeaddtxtimg.bind(this)} src={this.state.addtxt.img} filetype="img"></FileUpload>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="toolbox-footer">
                <div className="btn-green-s" onClick={() => this.toaddtxt(currentparagraph)}>确定</div>
                <div className="btn-blue-s" onClick={() => this.changetoolbox('none')}>取消</div>
              </div>
            </div>
          </div>
        );

      case 'addbusy':
        return (
          <div className="toolbox">
            <div className="toolbox-content">
              <div className="toolbox-title">插入忙碌</div>
              <table>
                <tbody>
                  <tr>
                    <td>角色：</td>
                    <td>
                      <select className="form-control" value={this.state.addtxt.role} onChange={this.changeaddtxtrole}>
                        {rolelist}
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <td>提示内容：</td>
                    <td>
                      <textarea className="form-control" cols="24" rows="2" maxLength="15" value={this.state.addtxt.text} onChange={this.changeaddtxttext} ></textarea>
                      <p className="table-alert">不得超过15字</p>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="toolbox-footer">
                <div className="btn-green-s" onClick={() => this.toaddtxt(currentparagraph)}>确定</div>
                <div className="btn-blue-s" onClick={() => this.changetoolbox('none')}>取消</div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  }

  render() {
    let currentparagraph = null;
    const content = this.props.content;
    for (let i = 0; i < content.paragraphs.length; i++) {
      if (content.paragraphs[i].id === this.props.selected_paragraph_id) {
        currentparagraph = content.paragraphs[i];
        break;
      }
    }
    const rolelist = this.props.content.roles.map((item) => {
      return <option key={item.name} value={item.id}>{item.name}</option>
    });
    if (!currentparagraph) {
      return null;
    } else {
      let lineno = null;
      switch (currentparagraph.type) {
        case 'Node':
          lineno = this.renderlinno(currentparagraph);
          return (
            <div className="paragrapheditor" style={{ width: this.state.width }} >
              <table>
                <tbody>
                  <tr>
                    <td>联系人：</td>
                    <td>
                      <select className="form-control" value={currentparagraph.chat_id} onChange={(e) => this.changechatid(e, currentparagraph)}>
                        <option value="-1">请选聊天对象</option>
                        {rolelist}
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <td>段落备注：</td>
                    <td><input className="form-control" maxLength="10" value={currentparagraph.title} onBlur={() => this.inittitle(currentparagraph)} onFocus={() => this.inittitle(currentparagraph)} onChange={(e) => this.changetitle(e, currentparagraph)} /></td>
                  </tr>
                </tbody>
              </table>
              <div className="toolicons">
                <span className="toolicon fa fa-arrows-h" title="扩展" onClick={this.changewidth}></span>
                <span className="toolicon fa fa-commenting" title="插入对白" onClick={() => this.changetoolbox('addtext')}></span>
                <span className="toolicon fa fa-image" title="插入图片" onClick={() => this.changetoolbox('addimg')}></span>
                <span className="toolicon fa fa-microphone" title="插入语音" onClick={() => this.changetoolbox('addaudio')}></span>
                <span className="toolicon fa fa-film" title="插入视频" onClick={() => this.changetoolbox('addvideo')}></span>
                <span className="toolicon fa fa-link" title="插入链接" onClick={() => this.changetoolbox('addlink')}></span>
                <span className="toolicon fa fa-clock-o" title="插入忙碌" onClick={() => this.changetoolbox('addbusy', currentparagraph.chat_id)}></span>
                <span className="toolicon fa fa-eye" title="预览" onClick={this.togglepreview}></span>
              </div>
              <div className="txteditor">
                <div style={{ height: lineno.h + 'px' }} className="lineno">{lineno.lineno}</div>
                <pre className="placeholder">{currentparagraph.text === '' ? this.state.placeholder : ''}</pre>
                <textarea ref="texteditor" onDrop={(e) => this.dropFile(e, currentparagraph)} style={{ height: lineno.h + 'px' }} value={currentparagraph.text} onChange={(e) => this.changetext(e, currentparagraph)}></textarea>
              </div>
              {this.state.preview ? <Preview currentparagraph={currentparagraph}></Preview> : null}
              {this.rendertoolbox(currentparagraph)}
            </div>
          );
        case 'Branch':
          const branchs = currentparagraph.selections.map((item, key) => {
            return (
              <tr key={key}>
                <td>选项{key + 1}</td>
                <td><input className="form-control" maxLength="10" type="text" value={item.title} onBlur={() => this.initselectiontitle(currentparagraph, key)} onFocus={() => this.initselectiontitle(currentparagraph, key)} onChange={(e) => this.selectiontitlechange(e, currentparagraph, key)} /></td>
              </tr>
            )
          });
          return (
            <div className="paragrapheditor-selection">
              <table>
                <tbody>
                  <tr>
                    <td>联系人：</td>
                    <td>
                      <select className="form-control " value={currentparagraph.chat_id} onChange={(e) => this.changechatid(e, currentparagraph)}>
                        <option value="-2">请选聊天对象</option>
                        {rolelist}
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <td>分支类型：</td>
                    <td>
                      <select className="form-control" value={currentparagraph.type} onChange={(e) => this.changebranchtype(currentparagraph)}>
                        <option value="Branch">普通分支</option>
                        <option value="NumberBranch">数值分支</option>
                      </select>
                    </td>
                  </tr>
                  {branchs}
                </tbody>
              </table>
            </div>
          )
        case 'NumberBranch':
          const numberlist = this.props.content.numbers.map((item) => {
            return <option key={item.id} value={item.title}>{item.title}</option>
          });
          let numberbranchs = [];
          for (let i = 0; i < currentparagraph.ranges.length; i++) {
            if (i === 0) {
              numberbranchs.push(
                <tr key={i}>
                  <td>{'数值条件' + (i + 1) + ':'}</td>
                  <td>{currentparagraph.key + ' < '}<input className="form-control" value={currentparagraph.ranges[i].value} onChange={(e) => this.rangevaluechange(e, currentparagraph, i)} /></td>
                </tr>
              )
            } else if (i === currentparagraph.ranges.length - 1) {
              numberbranchs.push(
                <tr key={i}>
                  <td>{'数值条件' + (i + 1) + ':'}</td>
                  <td>{currentparagraph.key + ' > ' + currentparagraph.ranges[i - 1].value}</td>
                </tr>
              )
            } else {
              numberbranchs.push(
                <tr key={i}>
                  <td>{'数值条件' + (i + 1) + ':'}</td>
                  <td>{currentparagraph.ranges[i - 1].value + ' < ' + currentparagraph.key + ' < '}<input className="form-control" type="number" value={currentparagraph.ranges[i].value} onChange={(e) => this.rangevaluechange(e, currentparagraph, i)} /></td>
                </tr>
              )
            }
          }
          return (
            <div className="paragrapheditor-selection">
              <table>
                <tbody>
                  <tr>
                    <td>联系人：</td>
                    <td>
                      <select className="form-control " value={currentparagraph.chat_id} onChange={(e) => this.changechatid(e, currentparagraph)}>
                        <option value="-2">请选聊天对象</option>
                        {rolelist}
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <td>分支类型：</td>
                    <td>
                      <select className="form-control" value={currentparagraph.type} onChange={(e) => this.changebranchtype(currentparagraph)}>
                        <option value="Branch">普通分支</option>
                        <option value="NumberBranch">数值分支</option>
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <td>数值选择：</td>
                    <td>
                      <select className="form-control " value={currentparagraph.key} onChange={(e) => this.changenumber(e, currentparagraph)}>
                        {numberlist}
                      </select>
                    </td>
                  </tr>
                  {numberbranchs}
                </tbody>
              </table>
            </div>
          )
        case 'End':
          const gallerylist = this.props.content.galleries.map((item) => {
            return <option key={item.id} value={item.id}>{"收藏到" + item.title}</option>
          });
          return (
            <div className="paragrapheditor-end">
              <table>
                <tbody>
                  <tr>
                    <td>联系人：</td>
                    <td>
                      <select className="form-control " value={currentparagraph.chat_id} onChange={(e) => this.changechatid(e, currentparagraph)}>
                        <option value="-2">请选聊天对象</option>
                        {rolelist}
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <td>结局名称：</td>
                    <td>
                      <input className="form-control" type="text" maxLength="10" value={currentparagraph.title} onBlur={() => this.inittitle(currentparagraph)} onFocus={() => this.inittitle(currentparagraph)} onChange={(e) => this.changetitle(e, currentparagraph)} />
                    </td>
                  </tr>
                  <tr>
                    <td>收集回忆：</td>
                    <td>
                      <select className="form-control " value={currentparagraph.gallery_id} onChange={(e) => this.changeendgalleryid(e, currentparagraph)}>
                        <option value="-1">不收集</option>
                        {gallerylist}
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <td>结局描述：</td>
                    <td>
                      <textarea className="form-control" cols="40" rows="10" value={currentparagraph.text} onChange={(e) => this.changetext(e, currentparagraph)}></textarea>
                      <p>不超过150字</p>
                    </td>
                  </tr>
                  <tr>
                    <td>背景图片：</td>
                    <td>
                      <FileUpload getuploadurl={this.changeendimg.bind(this)} src={currentparagraph.image} filetype="img"></FileUpload>
                      <p>不上传则使用默认背景图</p>
                    </td>
                  </tr>
                  <tr>
                    <td></td>
                    <td><div className="btn-blue-m" onClick={this.togglepreview}>结局预览</div></td>
                  </tr>
                </tbody>
              </table>
              {this.state.preview ? <Preview currentparagraph={currentparagraph}></Preview> : null}
            </div>
          )
        case 'Lock':
          return (
            <div className="paragrapheditor-lock">
              <table>
                <tbody>
                  <tr>
                    <td>联系人：</td>
                    <td>
                      <select className="form-control" value={currentparagraph.chat_id} onChange={(e) => this.changechatid(e, currentparagraph)}>
                        <option value="-2">请选聊天对象</option>
                        {rolelist}
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <td>锁名称：</td>
                    <td><input className="form-control" maxLength="10" value={currentparagraph.title} onBlur={() => this.inittitle(currentparagraph)} onFocus={() => this.inittitle(currentparagraph)} onChange={(e) => this.changetitle(e, currentparagraph)} /></td>
                  </tr>
                  <tr>
                    <td>解锁方式：</td>
                    <td>
                      <select className="form-control" value={currentparagraph.pay_type} onChange={(e) => this.changepaytype(e, currentparagraph)}>
                        <option value="WaitOrPay">付费或等待</option>
                        <option value="Payonly">仅付费</option>
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <td>消耗扑通币：</td>
                    <td><input className="form-control " type="number" value={currentparagraph.coin} onChange={(e) => this.changecoin(e, currentparagraph)} /></td>
                  </tr>
                  <tr>
                    <td>锁描述：</td>
                    <td>
                      <textarea className="form-control" cols="30" rows="5" value={currentparagraph.text} onChange={(e) => this.changetext(e, currentparagraph)}></textarea>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )
        default:
          break;
      }
    }
  }
}

const mapStateToProps = (state) => {
  return { content: state.editor.content, selected_paragraph_id: state.editor.selected_paragraph_id, errors: state.editor.errors };
};

const mapDispatchToProps = (dispatch) => {
  return {
    uploadFile: (file, filetype, callback) => dispatch({ type: 'UPLOAD_FILE', file, filetype, callback }),
    updateParagraph: (paragraph) => dispatch({ type: 'UPDATE_PARAGRAPH', paragraph }),
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(ParagraphEditor);