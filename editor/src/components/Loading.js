import React, { Component } from 'react';
import { connect } from 'react-redux';
import loadingimg from '../images/loading.gif';
import '../css/Loading.css';

class Loading extends Component {

  renderLoading() {
    if (this.props.loading.content) {
      return <div className="loading"><img src={loadingimg} alt="" /><p>{this.props.loading.content}</p></div>
    } else {
      return null
    }
  }

  render() {
    return this.renderLoading()
  }
}

const mapStateToProps = (state) => {
  return { loading: state.app.loading };
};

const mapDispatchToProps = (dispatch) => {
  return {
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Loading);
