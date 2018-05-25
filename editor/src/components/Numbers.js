import React, { Component } from 'react';
import { connect } from 'react-redux';
import noneimg from '../images/none.jpg';
import '../css/Numbers.css';

class Numbers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      numbers: this.props.content.numbers.map(n => ({ ...n }))
    };
  }

  newnumber = () => {
    let numbers = [...this.state.numbers];
    const id = numbers.length > 0 ? (Math.max.apply(Math, numbers.map((item) => { return item.id })) + 1) : 1;
    const newnumber = { id: id, title: '数值' + id, number: 0 };
    numbers.push(newnumber);
    this.setState({ numbers });
  }

  changetitle = (e, id) => {
    let numbers = [...this.state.numbers];
    for (let i = 0; i < numbers.length; i++) {
      if (numbers[i].id === id) {
        numbers[i].title = e.target.value;
      }
    }
    this.setState({ numbers });
  }

  changenumber = (e, id) => {
    let numbers = [...this.state.numbers];
    for (let i = 0; i < numbers.length; i++) {
      if (numbers[i].id === id) {
        numbers[i].number = parseInt(e.target.value, 10);
      }
    }
    this.setState({ numbers });
  }

  deletenumber = (id) => {
    let numbers = [...this.state.numbers];
    for (let i = 0; i < numbers.length; i++) {
      if (numbers[i].id === id) {
        numbers.splice(i, 1);
        break;
      }
    }
    this.setState({ numbers });
  }

  savechange = () => {
    let content = { ...this.props.content };
    content.numbers = [...this.state.numbers];
    this.props.updateGalleryConfirm('修改数值将可能导致剧本中数值引用错误，确定修改吗？', { type: 'UPDATE_PROJECT_CONTENT', content: content });
  }

  render() {
    if (this.state.numbers.length === 0) {
      return (
        <div className="numbers-none">
          <img className="none-img" src={noneimg} alt="" />
          <p className="none-txt">作品暂无任何数值</p>
          <div className="btn-green-s" onClick={this.newnumber}>新建回忆分组</div>
        </div>
      );
    } else {
      const numberlist = this.state.numbers.map((item) => {
        return (
          <tr key={item.id}>
            <td>{"数值" + item.id}</td>
            <td><input className="form-control" type="text" value={item.title} onChange={(e) => this.changetitle(e, item.id)} /></td>
            <td>{"初始值"}</td>
            <td><input className="form-control" type="text" value={item.number} onChange={(e) => this.changenumber(e, item.id)} /></td>
            <td><span className="fa fa-minus-square delete-item" onClick={() => this.deletenumber(item.id)}></span></td>
          </tr>
        );
      });
      return (
        <div className="numbers">
          <table>
            <tbody>
              {numberlist}
              <tr>
                <td></td>
                <td><span className="fa fa-plus-square add-item" onClick={this.newnumber}></span></td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td><p className="table-alert">数值名称最多7个字</p></td>
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
    updateGalleryConfirm: (content, cback) => dispatch({ type: 'SET_APP_CONFIRM', confirm: { content, cback } }),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Numbers);