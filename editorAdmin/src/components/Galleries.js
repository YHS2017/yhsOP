import React, { Component } from 'react';
import { connect } from 'react-redux';
import noneimg from '../images/none.jpg';
import '../css/Galleries.css';

class Galleries extends Component {
  constructor(props) {
    super(props);
    this.state = {
      galleries: this.props.content.galleries.map(g => ({ ...g })),
    };
  }

  newgallerygroup = () => {
    let galleries = [...this.state.galleries];
    const id = galleries.length > 0 ? (Math.max.apply(Math, galleries.map((item) => { return item.id })) + 1) : 1;
    const newgallery = { id: id, title: '未命名分组', items: [] };
    galleries.push(newgallery);
    this.setState({ galleries });
  }

  changegallerytitle = (e, id) => {
    let galleries = [...this.state.galleries];
    for (let i = 0; i < galleries.length; i++) {
      if (galleries[i].id === id) {
        galleries[i].title = e.target.value;
      }
    }
    this.setState({ galleries });
  }

  deletegallery = (id) => {
    let galleries = [...this.state.galleries];
    for (let i = 0; i < galleries.length; i++) {
      if (galleries[i].id === id) {
        galleries.splice(i, 1);
        break;
      }
    }
    this.setState({ galleries });
  }

  savechange = () => {
    let content = { ...this.props.content };
    content.galleries = [...this.state.galleries];
    this.props.deleteGalleryConfirm('修改回忆分组可能会导致剧本中回忆分组引用错误，确定修改吗？', { type: 'UPDATE_PROJECT_CONTENT', content: content });
  }

  render() {
    if (this.state.galleries.length === 0) {
      return (
        <div className="galleries-none">
          <img className="none-img" src={noneimg} alt="" />
          <p className="none-txt">作品暂无任何回忆分组</p>
          <div className="btn-green-s" onClick={this.newgallerygroup}>新建回忆分组</div>
        </div>
      );
    } else {
      const gallerylist = this.state.galleries.map((item) => {
        return (
          <tr key={item.id}>
            <td>{"回忆分组" + item.id}</td>
            <td><input className="form-control" type="text" value={item.title} onChange={(e) => this.changegallerytitle(e, item.id)} /></td>
            <td><span className="fa fa-minus-square delete-item" onClick={() => this.deletegallery(item.id)}></span></td>
          </tr>
        );
      });
      return (
        <div className="galleries">
          <table>
            <tbody>
              {gallerylist}
              <tr>
                <td></td>
                <td><span className="fa fa-plus-square add-item" onClick={this.newgallerygroup}></span></td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td><p className="table-alert">回忆分组名最多7个字</p></td>
                <td></td>
              </tr>
            </tbody>
          </table>
          <div className="btn-green-s savechange" onClick={this.savechange}>确 认</div>
        </div>
      );
    }
  }
}

const mapStateToProps = (state) => {
  return { content: state.editor.content };
}

const mapDispatchToProps = (dispatch) => {
  return {
    deleteGalleryConfirm: (content, cback) => dispatch({ type: 'SET_APP_CONFIRM', confirm: { content, cback } }),
    updateProjectContent: (content) => dispatch({ type: 'UPDATE_PROJECT_CONTENT', content })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Galleries);