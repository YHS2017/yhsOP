import React, { Component } from 'react';
import { Route, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import ProjectEditor from './ProjectEditor';
import Home from './Home';
import '../css/Author.css';

class Author extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: this.props.user
    };
  }
  render() {
    return (
      <div className="main">
        <Route path={"/Author/" + this.state.user.username + "/home"} render={() => <Home></Home>} />
        <Route path={"/Author/" + this.state.user.username + "/projecteditor"} render={() => <ProjectEditor></ProjectEditor>} />
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
