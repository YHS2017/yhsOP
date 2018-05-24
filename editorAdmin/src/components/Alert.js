import React, { Component } from 'react';
import { connect } from 'react-redux';
import '../css/Alert.css';

class Alert extends Component {

  cleanalert = () => {
    if (this.props.alert.cback !== null) {
      this.props.toDoCback(this.props.alert.cback);
    }
    this.props.cleanAlert();
  }

  renderLoading() {
    if (this.props.alert.content) {
      return (
        <div className="appalert">
          <div className="alert-box">
            <h3>消息提示</h3>
            <p>{this.props.alert.content}</p>
            <div className="alert-footer">
              <div className="cleanalert" onClick={this.cleanalert}>确认</div>
            </div>
          </div>
        </div>
      )
    } else {
      return null
    }
  }

  render() {
    return this.renderLoading()
  }
}

const mapStateToProps = (state) => {
  return { alert: state.app.alert };
};

const mapDispatchToProps = (dispatch) => {
  return {
    toDoCback: (cback) => dispatch(cback),
    cleanAlert: () => dispatch({ type: 'SET_APP_ALERT', alert: { content: null } })
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Alert);
