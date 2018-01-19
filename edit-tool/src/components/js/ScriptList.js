import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import actiontypes from '../../actions/actiontype';
import actionCreater from '../../actions/index';
import Notice from './Notice';
import Script from './Script';
import '../css/ScriptList.css';


class ScriptList extends Component {

  componentWillMount() {
    const pageinit=this.props.pageinit;
    fetch('../../data.json').then(data => {
      data.text().then(listdata => {
        //console.log(listdata);
        if (listdata === '') {
          return
        } else {
          const list = JSON.parse(listdata);
          pageinit(list);
        }
      })
    });
  }

  render() {
    const { index, pagenationbtns, scripts, pages ,pageup ,pagedown ,pageto} = this.props;
    let scriptsview = null;
    let pagenationbtnsview = null;
    if (scripts === null) {
      scriptsview = <div className="isnull">暂无剧本</div>;
      pagenationbtnsview = <div className="isnull">没有更多数据了~</div>;
    } else {
      console.log(scripts.slice(index * 4 - 4, index * 4));
      scriptsview = scripts.slice(index * 4 - 4, index * 4).map((item, index) => {
        return <Script script={item} key={item.id}></Script>
      });

      if (pages > 1) {
        pagenationbtnsview = pagenationbtns.map((item, index) => {
          if (index === 0) {
            return <div className="btn btn-default" key={item.id} onClick={pageup}>{item.text}</div>
          } else if (index === pagenationbtns.length - 1) {
            return <div className="btn btn-default" key={item.id} onClick={pagedown}>{item.text}</div>
          } else if (item.active === 1) {
            return <div className="btn btn-info" key={item.id}>{item.text}</div>
          } else if (item.text === '...') {
            return <div className="btn btn-default" key={item.id}>{item.text}</div>
          } else {
            return <div className="btn btn-default" key={item.id} onClick={()=>{pageto(item.text)}}>{item.text}</div>
          }
        });
      } else {
        pagenationbtnsview = <div className="isnull">没有更多数据了~</div>;
      }
    }

    return (
      <div className="container">
        <Notice></Notice>
        <div className="container">
          <div className="row line">
            <div className="col-xs-2 text-center"><h2>作品封面</h2></div>
            <div className="col-xs-3 text-center"><h2>作品信息</h2></div>
            <div className="col-xs-2 text-center"><h2>作品成绩</h2></div>
            <div className="col-xs-2 text-center"><h2>当前状态</h2></div>
            <div className="col-xs-3 text-center"><h2>操作</h2></div>
          </div>
        </div>
        <div className="list">{scriptsview}</div>
        <div className="pagination"><div className="btn-group">{pagenationbtnsview}</div></div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { index: state.index, pagenationbtns: state.pagenationbtns, scripts: state.scripts, pages: state.pages };
}

const mapDispatchToProps = (dispatch) => {
  return {
    pageup: () => { dispatch(actionCreater(actiontypes.PAGE_UP, null)) },
    pagedown: () => { dispatch(actionCreater(actiontypes.PAGE_DOWN, null)) },
    pageto: (index) => { dispatch(actionCreater(actiontypes.PAGE_TO, { index: index })) },
    pageinit: (scripts) => { dispatch(actionCreater(actiontypes.PAGE_INIT, { scripts: scripts })) }
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ScriptList));