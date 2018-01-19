import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import ParagraphEditor from './ParagraphEditor';
//import actiontypes from '../../actions/actiontype';
//import actionCreater from '../../actions/index';
import '../css/ScriptEditor.css';


class ScriptEditor extends Component {

  componentWillMount() {
    
  }

  render() {
    
    return (
      <div className="container">
        <h1>ParagraphEditor</h1>
          <ParagraphEditor></ParagraphEditor>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { index: state.index, pagenationbtns: state.pagenationbtns, scripts: state.scripts, pages: state.pages };
}

const mapDispatchToProps = (dispatch) => {
  return {
    // pageup: () => { dispatch(actionCreater(actiontypes.PAGE_UP, null)) },
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ScriptEditor));