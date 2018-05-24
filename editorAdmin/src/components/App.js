import React, { Component } from 'react';
import { connect } from 'react-redux';
import Home from './Home';
import ProjectEditor from './ProjectEditor';
import Login from './Login';
import Message from './Message';
import Loading from './Loading';
import Alert from './Alert';
import Confirm from './Confirm';
import '../css/App.css';

class App extends Component {

  renderScreen() {
    const router = this.props.router.split('-');
    switch (router[0]) {
      case 'Home':
        return <Home></Home>;

      case 'ProjectEditor':
        return <ProjectEditor></ProjectEditor>;

      case 'Login':
        return <Login></Login>;

      default:
        break;
    }
  }

  render() {
    return (
      <div className="main">
        {this.renderScreen()}
        <Message></Message>
        <Loading></Loading>
        <Alert></Alert>
        <Confirm></Confirm>
      </div>
    )
  }
}

const mapStateToProps = state => ({ router: state.app.router });

const mapDispatchToProps = (dispatch) => {
  return {}
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
