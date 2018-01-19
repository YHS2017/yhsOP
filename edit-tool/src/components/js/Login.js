import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import '../css/App.css';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: this.props.user
    };
  }

  render() {
    return (
      <div className="container">
        <div className="btn btn-success">
          <Link to={"/Author/" + this.state.user.username + "/home"}>首页</Link>
        </div>
      </div>

    );
  }
}

const mapStateToProps = (state) => {
  return {  user: state.user }
}

const mapDispatchToProps = (dispatch) => {
  return {
    // upcount: () => { dispatch({ type: 'UP_COUNT' }) },
    // downcount: () => { dispatch({ type: 'DOWN_COUNT' }) }
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));
