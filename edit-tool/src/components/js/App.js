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
        </div>
      </Router>
    );
  }
}

const mapStateToProps = (state) => {
  return {  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    // upcount: () => { dispatch({ type: 'UP_COUNT' }) },
    // downcount: () => { dispatch({ type: 'DOWN_COUNT' }) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
