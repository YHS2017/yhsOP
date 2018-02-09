import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Author from './Author';
import Login from './Login';
import '../css/App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: this.props.user
    };
  }

  render() {
    return (
      <Router>
        <div>
          <Route path="/login" component={Login} />
          <Route path="/Author" component={Author} />
          <div className={"mo " + (this.props.loadingshow === 0 ? '' : 'show')}>
            <img src="../../loading.gif" />
          </div>
        </div>
      </Router >
    );
  }
}

const mapStateToProps = (state) => {
  return { loadingshow: state.loadingshow }
}

const mapDispatchToProps = (dispatch) => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
