import React, { Component } from 'react';
import { connect } from 'react-redux';
import '../css/Confirm.css';

class Confirm extends Component {

  renderConfirm() {
    if (this.props.confirm.content) {
      return (
        <div className="appconfirm">
          <div className="confirm-box">
            <h3>操作确认</h3>
            <p>{this.props.confirm.content}</p>
            <div className="confirm-footer">
              <div className="confirm-yes" onClick={() => { this.props.toDoCback(this.props.confirm.cback); this.props.cleanConfirm(); }}>确认</div>
              <div className="confirm-no" onClick={this.props.cleanConfirm}>取消</div>
            </div>
          </div>
        </div>
      )
    } else {
      return null
    }
  }

  render() {
    return this.renderConfirm()
  }
}

const mapStateToProps = (state) => {
  return { confirm: state.app.confirm };
};

const mapDispatchToProps = (dispatch) => {
  return {
    cleanConfirm: () => dispatch({ type: 'SET_APP_CONFIRM', confirm: { content: null, cback: null } }),
    toDoCback: (cback) => dispatch(cback),
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Confirm);
