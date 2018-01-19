import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
//import actiontypes from '../../actions/actiontype';
//import actionCreater from '../../actions/index';
import '../css/ParagraphEditor.css';


class ParagraphEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roles: [
        { "id": 1, "type": "NPC", "name": "AAA", "profile": "http://a.b.c/d.jpg", "galleries": [] },
        { "id": 2, "type": "NPC", "name": "BBB", "profile": "http://a.b.c/d.jpg", "galleries": [] },
        { "id": 3, "type": "NPC", "name": "CCC", "profile": "http://a.b.c/d.jpg", "galleries": [] }
      ],
      galleries: [
        { id: '1', title: '图片', items: [] },
        { id: '2', title: '视频', items: [] },
        { id: '3', title: '结局', items: [] }
      ],
      paragraph: {

      },
      paragraphtxt: '',
      errortxt: '',
    };
  }

  componentWillMount() {

  }

  paragraphchange = (e) => {
    this.setState({ ...this, paragraphtxt: e.target.value });
  }

  formatparagraphtxt = () => {
    const txt = this.state.paragraphtxt;
    let paragraph = { ...this.state.paragraph, nodes: [] };
    if (txt !== '') {
      let txtarr = txt.split('\n\n');
      let nodes = [];
      let galleryitems = [];
      for (let i = 0; i < txtarr.length; i++) {
        let temparr = txtarr[i].split('\n');
        if (temparr[0].match(/\@\S+/) !== null) {
          //文本
          const text = temparr[1];
          const role_id = this.matchroleid(temparr[0].replace('@', ''))
          nodes.push({ type: 'Text', text: temparr[1], role_id: role_id });
        } else if (temparr[0].match(/\#img\#\S+/) !== null) {
          //图片
          const image = temparr[1];
          const text = temparr[1];
          const title = temparr[2].replace('=>', '');
          const role_id = this.matchroleid(temparr[0].replace('#img#', ''));
          const gallery_id = this.matchgalleryid(temparr[2].replace('=>', ''));
          nodes.push({ type: 'Image', image: image, role_id: role_id, gallery_id: gallery_id });
          if (temparr.length > 2) {
            galleryitems.push({ title: title, item: { type: 'GalleryItemImage', image: image } });
          }
        } else if (temparr[0].match(/\#video\#\S+/) !== null) {
          //会面
          const video = temparr[2];
          const text = temparr[1];
          const title = temparr[3].replace('=>', '');
          const role_id = this.matchroleid(temparr[0].replace('#video#', ''));
          const gallery_id = this.matchgalleryid(temparr[3].replace('=>', ''));
          nodes.push({ type: 'Video', video: video, text: text, role_id: role_id, gallery_id: gallery_id });
          if (temparr.length > 3) {
            galleryitems.push({ title: title, item: { type: 'GalleryItemVideo', video: video } });
          }
        } else if (temparr[0].match(/\#end\#/) !== null) {
          //结局
          const nodetitle = temparr[1];
          const text = temparr[2];
          const image = temparr[3];
          const gallery_id = this.matchgalleryid(temparr[4].replace('=>', ''));
          const gallerytitle = temparr[4].replace('=>', '');
          nodes.push({ type: 'Ending', title: nodetitle, text: text, image: image, gallery_id: gallery_id });
          if (temparr.length > 4) {
            galleryitems.push({ title: gallerytitle, item: { type: 'GalleryItemEnding', title: nodetitle, image: image } });
          }
        } else if (temparr[0].match(/\#link\#/) !== null) {
          //链接
          const title = temparr[1];
          const text = temparr[2];
          const link = temparr[3];
          const image = temparr[4];
          const role_id = this.matchroleid(temparr[0].replace('#link#', ''));
          nodes.push({ type: 'Link', title: title, text: text, link: link, image: image, role_id: role_id });
        } else {
          this.setState({ ...this.state, errortxt: '【' + txtarr[i] + '】，无法格式化请检查！' });
        }
      }
      paragraph.nodes = nodes;
      this.setState({ ...this, paragraph: paragraph, galleries: this.newgalaries(galleryitems) });
    }
  }

  matchroleid = (name) => {
    console.log(name);
    for (let i = 0; i < this.state.roles.length; i++) {
      if (this.state.roles[i].name === name) {
        return this.state.roles[i].id;
      }
    }
  }

  matchgalleryid = (title) => {
    for (let i = 0; i < this.state.galleries.length; i++) {
      if (this.state.galleries[i].title === title) {
        return this.state.galleries[i].id;
      }
    }
  }

  newgalaries = (items) => {
    let galleries = this.state.galleries;
    for (let i = 0; i < items.length; i++) {
      for (let j = 0; j < galleries.length; j++) {
        if (items[i].title === galleries[j].title) {
          galleries[j].items.push(items[i].item);
        }
      }
    }
    return galleries;
  }

  render() {
    return (
      <div className="container">
        <textarea className="form-control noresize" rows="18" value={this.state.paragraphtxt} onChange={this.paragraphchange}></textarea>
        <div className="btn btn-info" onClick={this.formatparagraphtxt}>格式化</div>
        <div className="well">{JSON.stringify(this.state.paragraph)}</div>
        <div className="well">{JSON.stringify(this.state.galleries)}</div>
        <div className="alert alert-danger">{this.state.errortxt}</div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
}

const mapDispatchToProps = (dispatch) => {
  return {
    // pageup: () => { dispatch(actionCreater(actiontypes.PAGE_UP, null)) },
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ParagraphEditor));