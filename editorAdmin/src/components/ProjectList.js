import React, { Component } from 'react';
import { connect } from 'react-redux';
import Project from './Project';
import '../css/ProjectList.css';

class ProjectList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageIndex: 0,
      pageCapacity: 5,
      wantPage: "",
    };
  }

  componentWillUpdate() {
    const pageCapacity = this.state.pageCapacity;
    const total = Math.ceil(this.props.list.length / pageCapacity);
    if (this.state.pageIndex > (total - 1)) {
      this.setState({ pageIndex: total - 1 });
    }
  }

  calculatePageIndex(index) {
    const pageCapacity = this.state.pageCapacity;
    const total = Math.ceil(this.props.list.length / pageCapacity);

    if (index < 0) {
      return 0;
    }
    else if (index >= total) {
      return total - 1;
    }
    else {
      return index;
    }
  }

  changewantpage = (e) => {
    this.setState({ wantPage: e.target.value });
  }

  pageUp = () => {
    this.setState(prev => ({
      ...prev,
      pageIndex: this.calculatePageIndex(this.state.pageIndex - 1),
    }));
  };

  pageDown = () => {
    this.setState(prev => ({
      ...prev,
      pageIndex: this.calculatePageIndex(this.state.pageIndex + 1),
    }));
  };

  pageTo = (index) => {
    this.setState(prev => ({
      ...prev,
      pageIndex: this.calculatePageIndex(index),
    }));
  };

  pageTowantpage = () => {
    if (this.state.wantPage !== '') {
      this.setState({ pageIndex: parseInt(this.state.wantPage, 10) - 1, wantPage: '' });
    }
  }

  renderList() {
    const { list } = this.props;
    const { pageIndex, pageCapacity } = this.state;

    if (list.length === 0) {
      return <div className='isnull'>暂无剧本</div>;
    }
    else {
      return list.slice(pageIndex * pageCapacity, (pageIndex + 1) * pageCapacity).map((item, index) => {
        return <Project projectitem={item} key={item.id} />;
      });
    }
  }

  renderPageButtons() {
    const { pageIndex, pageCapacity } = this.state;
    const { list } = this.props;
    const total = Math.ceil(list.length / pageCapacity);
    let first = 0;
    let last = 0;

    if (total <= 7) {
      first = 0;
      last = total - 1;
    } else {
      if (pageIndex < 4) {
        first = 0;
        last = 6;
      } else if (pageIndex > total - 5) {
        last = total - 1;
        first = last - 6;
      } else {
        first = pageIndex - 3;
        last = pageIndex + 3;
      }
    }
    const buttons = [];
    for (let i = first; i <= last; i++) {
      buttons.push(<div className={i === pageIndex ? 'btn-pagination current' : 'btn-pagination'}
        key={i}
        onClick={() => this.pageTo(i)}>{i + 1}</div>);
    }

    return buttons;
  }

  renderPageMenu() {
    return (
      <div className='pagination'>
        <div className='fa fa-arrow-left pageup' onClick={this.pageUp}></div>
        {this.renderPageButtons()}
        <div className='fa fa-arrow-right pagedown' onClick={this.pageDown}></div>
        <div className="pageto"><span>跳转到</span><input type="text" value={this.state.wantPage} onChange={this.changewantpage} /><div className="btn-blue-s" onClick={this.pageTowantpage}>确定</div></div>
      </div>
    );
  }

  render() {
    return (
      <div className='list'>
        <div className='list-title'>
          <div className='flex-2'>封面</div>
          <div className='flex-1'>作品ID</div>
          <div className='flex-2'>作品名</div>
          <div className='flex-1'>作者ID</div>
          <div className='flex-1'>作者</div>
          <div className='flex-2'>时间</div>
          <div className='flex-1'>签约</div>
          <div className='flex-1'>上架</div>
          <div className='flex-1'>审核</div>
          <div className='flex-1'>责编</div>
          <div className='flex-2'>操作</div>
        </div>
        {this.renderList()}
        {this.renderPageMenu()}
      </div>

    );
  }
}

const mapStateToProps = (state) => ({ list: state.projects.list });

const mapDispatchToProps = (dispatch) => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(ProjectList);
