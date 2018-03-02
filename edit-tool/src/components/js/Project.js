import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import actiontypes from '../../actions/actiontype';
import actionCreater from '../../actions/index';
import '../css/Project.css';

class Project extends Component {
  constructor(props) {
    super(props);
    this.state = {
      defaultimg: '../../nomal.gif'
    };
  }

  toprojectedit = (id) => {
    //异步获取剧本内容
    this.props.setloadingshow(1);
    fetch('http://weixin.91smart.net/v1/project/' + id, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    }).then(data => {
      data.text().then(datastr => {
        this.props.setloadingshow(0);
        let project = JSON.parse(datastr);
        project.content = JSON.parse(project.content);
        this.props.setproject(project);
        const path = '/Author/' + this.props.user.name + '/projecteditor';
        this.props.history.push(path);
      })
    });
  }

  editprojectinfo = (projectinfo) => {
    this.props.setproject(projectinfo);
    this.props.setprojectedittype(1);
    this.props.setprojectinfoshow(true);
  }

  //根据角色name找id
  matchroleid = (name) => {
    if (name === '旁白') {
      return -1;
    } else if (name === '我') {
      return 0;
    } else {
      const roles = this.props.project.content.roles;
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === name) {
          return roles[i].id;
        }
      }
    }
  }

  //根据回忆title找id
  matchgalleryid = (title) => {
    const galleries = this.props.project.content.galleries;
    for (let i = 0; i < galleries.length; i++) {
      if (galleries[i].title === title) {
        return galleries[i].id;
      }
    }
  }

  //根据段落title找id
  matchparagrahids = (titles) => {
    const paragraphs = this.props.project.content.paragraphs;
    let ids = [];
    for (let i = 0; i < titles.length; i++) {
      for (let j = 0; j < paragraphs.length; j++) {
        if (titles[i] === paragraphs[j].title) {
          ids[i] = paragraphs[j].id;
          break;
        }
      }
    }
    return ids;
  }

  formatparagraphtxt = (txt) => {
    let formatdata = null;
    if (txt !== '') {
      let txtarr = txt.split(/\n\n+/);
      let nodes = [];
      let galleryitems = [];
      for (let i = 0; i < txtarr.length; i++) {
        let temparr = txtarr[i].split('\n');
        if (temparr[0].match(/@\S+/) !== null && temparr[1].match(/#图片#\S+/) !== null) {
          //图片
          const image = temparr[1].replace('#图片#', '');
          const role_id = this.matchroleid(temparr[0].replace('@', ''));
          nodes.push({ type: 'Image', image: image, role_id: role_id });
          if (temparr.length > 2) {
            const gallery_id = this.matchgalleryid(temparr[2].replace('>', ''));
            galleryitems.push({ gallery_id: gallery_id, item: { type: 'GalleryItemImage', image: image } });
          }
        } else if (temparr[0].match(/@\S+/) !== null && temparr[1].match(/#视频#\S+/) !== null) {
          //视频
          const video = temparr[1].replace('#视频#', '');
          const role_id = this.matchroleid(temparr[0].replace('@', ''));
          nodes.push({ type: 'Video', video: video, role_id: role_id });
          if (temparr.length > 2) {
            const gallery_id = this.matchgalleryid(temparr[2].replace('>', ''));
            galleryitems.push({ gallery_id: gallery_id, item: { type: 'GalleryItemVideo', video: video } });
          }
        } else if (temparr[0].match(/@\S+/) !== null && temparr[1].match(/#链接#\S+/) !== null) {
          //链接
          const title = temparr[2];
          const text = temparr[3];
          const image = temparr[4];
          const link = temparr[5];
          const role_id = this.matchroleid(temparr[0].replace('@', ''));
          nodes.push({ type: 'Link', title: title, text: text, link: link, image: image, role_id: role_id });
        } else if (temparr[0].match(/@\S+/) !== null && temparr[1].match(/#忙碌#\S+/) !== null) {
          //忙碌中
          const target_role_id = this.matchroleid(temparr[0].replace('@', ''));
          const text = temparr[1].replace('#忙碌#', '');
          nodes.push({ type: 'Busy', text: text, target_role_id: target_role_id });
        } else if (temparr[0].match(/@\S+/) !== null && temparr[1].match(/#忙碌#\S+/) === null && temparr[1].match(/#图片#\S+/) === null && temparr[1].match(/#视频#\S+/) === null && temparr[1].match(/#链接#\S+/) === null) {
          //文本
          const text = txtarr[i].replace(temparr[0] + '\n', '');
          const role_id = this.matchroleid(temparr[0].replace('@', ''));
          nodes.push({ type: 'Text', text: text, role_id: role_id });
        } else if (temparr[0].match(/#结局#/) !== null) {
          //结局
          const title = temparr[1];
          const text = temparr[2];
          const image = temparr[3];
          nodes.push({ type: 'Ending', title: title, text: text, image: image });
          if (temparr.length > 4) {
            const gallery_id = this.matchgalleryid(temparr[4].replace('>', ''));
            galleryitems.push({ gallery_id: gallery_id, item: { type: 'GalleryItemEnding', title: title, text: text, image: image } });
          }
        } else if (temparr[0].match(/==\d+/) !== null) {
          //延迟
          const time = parseFloat(temparr[0].replace('==', '')) * 60000;
          nodes.push({ type: 'Delay', time: time });
        } else if (temparr[0].match(/#数值#/) !== null) {
          //数值
          const key = temparr[1].split(/[=+*/]/g)[0];
          const value = parseInt(temparr[1].split(/[=+*/]/g)[1], 10);
          const operator = temparr[1].match(/[=+*/]/g)[0];
          nodes.push({ type: 'Number', key: key, value: value, operator: operator });
        }
      }
      formatdata = { nodes: nodes, galleryitems: galleryitems };
    }
    // console.log(formatdata);
    return formatdata;
  }

  releasescript = (id) => {
    let script = {};
    let project = null;
    let paragraphs = [];
    let tempseletion = null;
    this.props.setloadingshow(1);
    fetch('http://weixin.91smart.net/v1/project/' + id, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    }).then(data => {
      data.text().then(datastr => {
        project = JSON.parse(datastr);
        project.content = JSON.parse(project.content);
        this.props.setproject(project);
        this.props.setprojectedittype(1);
        //清空galleries的items
        for (let i = 0; i < project.content.galleries.length; i++) {
          project.content.galleries[i].items = [];
        }
        //生成script
        for (let i = 0; i < project.content.paragraphtree.length; i++) {
          if (project.content.paragraphtree[i].type === 'select') {
            if (tempseletion === null) {
              tempseletion = {};
              tempseletion.id = project.content.paragraphtree[i].id;
              tempseletion.title = '';
              tempseletion.chat_id = parseInt(project.content.paragraphtree[i].chat_id, 10);
              tempseletion.nodes = [{ type: 'Selection', selections: [] }];
              tempseletion.nodes[0].selections.push({ text: project.content.paragraphtree[i].title, next_paragraph_id: project.content.paragraphtree[i].nextid });
            } else if (tempseletion.id === project.content.paragraphtree[i].id) {
              tempseletion.nodes[0].selections.push({ text: project.content.paragraphtree[i].title, next_paragraph_id: project.content.paragraphtree[i].nextid });
            }
          } else {
            //选项结束
            if (tempseletion !== null) {
              paragraphs.push({ ...tempseletion });
              tempseletion = null;
            }
            let paragraph = {};
            const formatdata = this.formatparagraphtxt(project.content.paragraphtree[i].paragraphtxt);
            if (formatdata === null) {
              console.log('有空段落[' + project.content.paragraphtree[i].title + ']存在，请先前往编辑！');
              return;
            }
            //添加items
            for (let j = 0; j < formatdata.galleryitems.length; j++) {
              for (let t = 0; t < project.content.galleries.length; t++) {
                if (formatdata.galleryitems[j].gallery_id === project.content.galleries[t].id) {
                  let existed = false;
                  for (let r = 0; r < project.content.galleries[t].items.length; r++) {
                    if (project.content.galleries[t].items[r].type === 'GalleryItemImage') {
                      if (project.content.galleries[t].items[r].image === formatdata.galleryitems[j].item.image) {
                        existed = true;
                        break;
                      }
                    } else if (project.content.galleries[t].items[r].type === 'GalleryItemVideo') {
                      if (project.content.galleries[t].items[r].video === formatdata.galleryitems[j].item.video) {
                        existed = true;
                        break;
                      }
                    } else {
                      if (project.content.galleries[t].items[r].title === formatdata.galleryitems[j].item.title) {
                        existed = true;
                        break;
                      }
                    }
                  }
                  if (!existed) {
                    project.content.galleries[t].items.push({ ...formatdata.galleryitems[j].item });
                    break;
                  }
                }
              }
            }
            paragraph.id = project.content.paragraphtree[i].id;
            paragraph.title = project.content.paragraphtree[i].title;
            paragraph.chat_id = parseInt(project.content.paragraphtree[i].chat_id, 10);
            if (project.content.paragraphtree[i].type === 'text') {
              paragraph.nodes = [...formatdata.nodes];
              for (let j = 0; j < project.content.paragraphtree.length; j++) {
                if (project.content.paragraphtree[j].id === project.content.paragraphtree[i].nextid) {
                  if (project.content.paragraphtree[j].type === 'link') {
                    paragraph.nodes[paragraph.nodes.length - 1].next_paragraph_id = project.content.paragraphtree[j].linkid;
                  } else {
                    paragraph.nodes[paragraph.nodes.length - 1].next_paragraph_id = project.content.paragraphtree[j].id;
                  }
                }
              }
            } else {
              paragraph.nodes = [...formatdata.nodes];
              paragraph.nodes[paragraph.nodes.length - 1].next_paragraph_id = project.content.paragraphtree[i].nextid;
            }
            paragraphs.push(paragraph);
          }
        }
        for (let i = 0; i < project.content.roles.length; i++) {
          let gallery_ids = [];
          for (let j = 0; j < project.content.galleries.length; j++) {
            gallery_ids.push(project.content.galleries[j].id);
          }
          project.content.roles[i].gallery_ids = gallery_ids;
        }
        script.paragraphs = paragraphs;
        script.id = project.id;
        script.game_id = project.id;
        script.title = project.title;
        script.roles = project.content.roles;
        script.galleries = project.content.galleries;
        script.numbers = { "好感度": 100 };
        console.log(script);
        project.script = JSON.stringify(script);
        project.content = JSON.stringify(project.content);
        console.log(project);
        //更新生成script的project
        fetch('http://weixin.91smart.net/v1/project/', {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(project)
        }).then(data => {
          data.text().then(datastr => {
            console.log('更新生成script的project[' + project.title + ']成功');
            fetch('http://weixin.91smart.net/v1/project/commit/' + id, {
              method: "GET",
              headers: { "Content-Type": "application/json" }
            }).then(data => {
              data.text().then(datastr => {
                this.props.setloadingshow(0);
                console.log('发布了project[' + project.title + ']');
              });
            });
          });
        });
      });
    });
  }

  render() {
    const project = this.props.projectitem;
    return (
      <div className="container project">
        <div className="row">
          <div className="col-xs-2"><img className="project_pic" src={project.image === '' ? this.state.defaultimg : project.image + '?imageView2/2/w/400/q/85!'} alt="封面" /></div>
          <div className="col-xs-3"><h3>{project.title}</h3><p>{(project.character_count / 10000).toFixed(1)}万字</p><p>{project.tags.replace('&', '')}</p></div>
          <div className="col-xs-2"><p>阅读：0</p><p>点赞：0</p><p>评论：0</p><p>打赏：0</p></div>
          <div className="col-xs-2 status">{project.status}</div>
          <div className="col-xs-3">
            <div><div className="btn btn-info" onClick={() => { this.editprojectinfo(project) }} >详情</div><div className="btn btn-primary" onClick={() => { this.toprojectedit(project.id) }}>编辑</div></div>
            <div><div className="btn btn-success" onClick={() => { this.releasescript(project.id) }}>投稿</div><div className="btn btn-danger">删除</div></div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { user: state.user, projects: state.projects, project: state.project };
}

const mapDispatchToProps = (dispatch) => {
  return {
    setloadingshow: (loadingshow) => { dispatch(actionCreater(actiontypes.SET_LOADINGSHOW, { loadingshow: loadingshow })) },
    setproject: (project) => { dispatch(actionCreater(actiontypes.SET_PROJECT, { project: project })) },
    setprojectedittype: (projectinfoedittype) => { dispatch(actionCreater(actiontypes.SET_PROJECT_EDITTYPE, { projectedittype: projectinfoedittype })) },
    setprojectinfoshow: (projectinfoshow) => { dispatch(actionCreater(actiontypes.SET_PROJECTINFO_SHOW, { projectinfoshow: projectinfoshow })) }
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Project));