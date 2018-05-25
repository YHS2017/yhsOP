import React, { Component } from 'react';
import { connect } from 'react-redux';
import '../../css/PopupMenu.css';

class ToolsMenu extends Component {
    render() {
        return (
            <div className="toolmenu">
                <div className="toolitem" title="撤销" onClick={() => this.props.undo()}><span className="fa fa-mail-reply"></span></div>
                <div className="toolitem" title="恢复" onClick={() => this.props.redo()}><span className="fa fa-mail-forward"></span></div>
                <div className="toolitem" title="放大" onClick={() => this.props.scaleUp()}><span className="fa fa-plus"></span></div>
                <div className="toolitem" title="缩小" onClick={() => this.props.scaleDown()}><span className="fa fa-minus"></span></div>
                <div className="toolitem" title="定位" onClick={() => this.props.aim()}><span className="fa fa-crosshairs"></span></div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    operations: state.editor.operations,
    operation_index: state.editor.operation_index,
});

const mapDispatchToProps = (dispatch) => ({
    undo: () => dispatch({ type: 'UNDO_OPERATION'}),
    redo: () => dispatch({ type: 'REDO_OPERATION' }),
});

export default connect(mapStateToProps, mapDispatchToProps)(ToolsMenu);