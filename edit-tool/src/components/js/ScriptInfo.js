import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
//import COS from 'cos-js-sdk-v5';
import '../css/ScriptInfo.css';

class ScriptInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scriptinfo: this.props.scriptinfo,
      scriptinfostatus: this.props.scriptinfostatus,
      titleisnull: this.props.scriptinfo.title === '',
      introductionisnull: this.props.scriptinfo.introduction === '',
    };
  }

  tipschange = (e) => {
    let newstate = { ...this.state };
    if (this.state.scriptinfo.tips.indexOf(e.target.value) < 0) {
      newstate.scriptinfo.tips = this.state.scriptinfo.tips.replace('&', e.target.value + ',&');
      this.setState(newstate);
      console.log(newstate);
    } else {
      newstate.scriptinfo.tips = this.state.scriptinfo.tips.replace(e.target.value + ',', '');
      this.setState(newstate);
      console.log(newstate);
    }
  }

  typechange = (e) => {
    let newstate = { ...this.state };
    newstate.scriptinfo.type = e.target.value;
    this.setState(newstate);
    console.log(newstate);
  }

  othertips = (e) => {
    let newstate = { ...this.state };
    const nowother = newstate.scriptinfo.tips.split('&')[1];
    newstate.scriptinfo.tips = this.state.scriptinfo.tips.replace('&' + nowother, '&' + e.target.value);
    this.setState(newstate);
    console.log(newstate);
  }

  introductionchange = (e) => {
    let newstate = { ...this.state };
    newstate.scriptinfo.introduction = e.target.value;
    this.setState(newstate);
    console.log(newstate);
    if (e.target.value !== '') {
      this.setState({ ...this, introductionisnull: false });
    } else {
      this.setState({ ...this, introductionisnull: true });
    }
  }

  titlechange = (e) => {
    let newstate = { ...this.state };
    newstate.scriptinfo.title = e.target.value;
    this.setState(newstate);
    console.log(newstate);
    if (e.target.value !== '') {
      this.setState({ ...this, titleisnull: false });
    } else {
      this.setState({ ...this, titleisnull: true });
    }
  }

  saveinfo=()=>{
    const path='/author/scrpiteditor';
    console.log(this.props.history);
    this.props.history.push(path);
  }
  render() {
    return (
      <div className="container scriptinfo">
        <div className="row">
          <div className="col-xs-12"><h3 className="text-center title">作品详情</h3><span className="glyphicon glyphicon-remove close" aria-hidden="true"></span></div>
        </div>
        <div className="row">
          <div className="col-xs-3">作品标题</div>
          <div className={'col-xs-9 ' + (this.state.titleisnull ? 'has-error' : 'has-success')}><input type="text" className="form-control" placeholder="请输入标题" value={this.state.scriptinfo.title} onChange={this.titlechange} /></div>
        </div>
        <div className="row">
          <div className="col-xs-3">作品类型</div>
          <div className="col-xs-9">
            <select className="form-control" value={this.state.scriptinfo.type} onChange={this.typechange}>
              <option value="连载">连载</option>
              <option value="短篇">短篇</option>
            </select>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-3">男主人设</div>
          <div className="col-xs-9">
            <div className="row tips">
              <div className="col-xs-4 tip">
                <div className="checkbox">
                  <label><input type="checkbox" value="暖男" checked={this.state.scriptinfo.tips.indexOf('暖男') !== -1} onChange={this.tipschange} /><i>暖男</i></label>
                </div>
              </div>
              <div className="col-xs-4 tip">
                <div className="checkbox">
                  <label><input type="checkbox" value="霸道" checked={this.state.scriptinfo.tips.indexOf('霸道') !== -1} onChange={this.tipschange} /><i>霸道</i></label>
                </div>
              </div>
              <div className="col-xs-4 tip">
                <div className="checkbox">
                  <label><input type="checkbox" value="忠犬" checked={this.state.scriptinfo.tips.indexOf('忠犬') !== -1} onChange={this.tipschange} /><i>忠犬</i></label>
                </div>
              </div>
            </div>
            <div className="row tips">
              <div className="col-xs-4 tip">
                <div className="checkbox">
                  <label><input type="checkbox" value="活力" checked={this.state.scriptinfo.tips.indexOf('活力') !== -1} onChange={this.tipschange} /><i>活力</i></label>
                </div>
              </div>
              <div className="col-xs-4 tip">
                <div className="checkbox">
                  <label><input type="checkbox" value="二次元" checked={this.state.scriptinfo.tips.indexOf('二次元') !== -1} onChange={this.tipschange} /><i>二次元</i></label>
                </div>
              </div>
              <div className="col-xs-4 tip">
                <div className="checkbox">
                  <label><input type="checkbox" value="高冷" checked={this.state.scriptinfo.tips.indexOf('高冷') !== -1} onChange={this.tipschange} /><i>高冷</i></label>
                </div>
              </div>
            </div>
            <div className="row tips">
              <div className="col-xs-4 tip">
                <div className="checkbox">
                  <label><input type="checkbox" value="腹黑" checked={this.state.scriptinfo.tips.indexOf('腹黑') !== -1} onChange={this.tipschange} /><i>腹黑</i></label>
                </div>
              </div>
              <div className="col-xs-4 tip">
                <div className="checkbox">
                  <label><input type="checkbox" value="痞气糙汉" checked={this.state.scriptinfo.tips.indexOf('痞气糙汉') !== -1} onChange={this.tipschange} /><i>痞气糙汉</i></label>
                </div>
              </div>
              <div className="col-xs-4 tip">
                <div className="checkbox">
                  <label><input type="checkbox" value="妖艳邪魅" checked={this.state.scriptinfo.tips.indexOf('妖艳邪魅') !== -1} onChange={this.tipschange} /><i>妖艳邪魅</i></label>
                </div>
              </div>
            </div>
            <div className="row tips">
              <div className="col-xs-4 tip">
                <div className="checkbox">
                  <label><input type="checkbox" value="暗黑鬼畜" checked={this.state.scriptinfo.tips.indexOf('暗黑鬼畜') !== -1} onChange={this.tipschange} /><i>暗黑鬼畜</i></label>
                </div>
              </div>
              <div className="col-xs-8 tip">
                <div className="input-group input-group-sm">
                  <span className="input-group-addon">其他</span>
                  <input type="text" className="form-control" value={this.state.scriptinfo.tips.split('&')[1]} onChange={this.othertips} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-3">作品简介</div>
          <div className={"col-xs-9 " + (this.state.introductionisnull ? 'has-error' : 'has-success')}><textarea className="form-control noresize" rows="5" maxLength="200" placeholder="(不得超过200字)" value={this.state.scriptinfo.introduction} onChange={this.introductionchange}></textarea></div>
        </div>
        <div className="row">
          <div className="col-xs-3">封面配图</div>
          <div className="col-xs-9"><label className="lab_upload"><input type="file" className="upload" />140X140</label></div>
        </div>
        <div className="row">
          <div className="col-xs-12 text-center"><div className="btn btn-success" onClick={this.saveinfo}>确 定</div></div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { scriptinfo: state.scriptinfo, scriptinfoshow: state.scriptinfoshow };
}

const mapDispatchToProps = (dispatch) => {
  return {
    // pageup: () => { dispatch(actionCreater(actiontypes.PAGE_UP, null)) },
    // pagedown: () => { dispatch(actionCreater(actiontypes.PAGE_DOWN, null)) },
    // pageto: (index) => { dispatch(actionCreater(actiontypes.PAGE_TO, { index: index })) },
    // pageinit: (scripts) => { dispatch(actionCreater(actiontypes.PAGE_INIT, { scripts: scripts })) }
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ScriptInfo));