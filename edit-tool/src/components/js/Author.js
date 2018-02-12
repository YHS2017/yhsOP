import React, { Component } from 'react';
import { Route, withRouter, Redirect, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import ProjectEditor from './ProjectEditor';
import Home from './Home';
import '../css/Author.css';

class Author extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <div className="main">
        <Switch>
          <Route path={"/Author/" + this.props.user.name + "/home"} component={Home} />
          <Route path={"/Author/" + this.props.user.name + "/projecteditor"} component={ProjectEditor} />
          <Redirect to='/' />
        </Switch>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { user: state.user };
}

const mapDispatchToProps = (dispatch) => {
  return {
    // pageup: () => { dispatch(actionCreater(actiontypes.PAGE_UP, null)) },
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Author));
