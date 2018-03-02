import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import '../css/SVGtest.css';

class SVGTEST extends Component {
  constructor(props) {
    super(props);
    this.state = {
      top: '0px',
      left: '-4500px',
      stop: '0px',
      sleft: '-4500px',
      sx: 0,
      xy: 0,
      candrag: false,
      scale: 1
    };
  }

  ondown = (e) => {
    this.setState({ ...this, sx: e.screenX, sy: e.screenY, candrag: true });
  }

  onmove = (e) => {
    if (this.state.candrag) {
      let nowleft = e.screenX - this.state.sx + parseInt(this.state.sleft, 10) + 'px';
      let nowtop = Math.min(e.screenY - this.state.sy + parseInt(this.state.stop, 10), 0) + 'px';
      this.setState({ ...this, top: nowtop, left: nowleft });
    }
  }

  onup = (e) => {
    this.setState({ ...this, candrag: false ,sleft: this.state.left, stop: this.state.top});
  }

  onscorll = (e) => {
    let scale = this.state.scale;
    if (e.deltaY < 0) {
      scale = Math.min(1.8, scale + 0.1);
    } else {
      scale = Math.max(0.2, scale - 0.1);
    }
    this.setState({ ...this, scale: scale });
  }

  render() {
    return (
      <div className="treewrap" >
        <div className="treecontent" style={{ top: this.state.top, left: this.state.left, transform: 'scale(' + this.state.scale + ')' }} onMouseMove={this.onmove} onWheel={this.onscorll} onMouseDown={this.ondown} onMouseUp={this.onup}>
          <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
            <polyline points="5000,100 5000,150 5150,150 5150,200" stroke="#E0E1E1" fill="none" strokeWidth="2" />
            <polyline points="5000,100 5000,150 4850,150 4850,200" stroke="#E0E1E1" fill="none" strokeWidth="2" />
          </svg>
        </div>
      </div >
    );
  }
}

const mapStateToProps = (state) => {
  return { user: state.user };
}

const mapDispatchToProps = (dispatch) => {
  return {
    // setscriptinfo: (scriptinfo) => { dispatch(actionCreater(actiontypes.SET_SCRIPTINFO, { scriptinfo: scriptinfo })) },
    // setscriptinfoedittype: (scriptinfoedittype) => { dispatch(actionCreater(actiontypes.SET_SCRIPTINFO_EDITTYPE, { scriptinfoedittype: scriptinfoedittype })) },
    // setscriptinfoshow: (scriptinfoshow) => { dispatch(actionCreater(actiontypes.SET_SCRIPTINFO_SHOW, { scriptinfoshow: scriptinfoshow })) }
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SVGTEST));