import React, { Component } from 'react';
import { connect } from 'react-redux';
import '../../css/PopupMenu.css';

class PopupMenu extends Component {
    renderButtons() {
        const { paragraph, element, is_first_paragraph } = this.props;
        const { selections, ranges } = paragraph;
        const { id, index } = element;
        const buttons = [];
        let key = 0;
        if (paragraph.type !== 'End' && element.type !== 'Link') {
            buttons.push(<div key={key++} className="btn-item" onClick={() => this.props.insertNodeParagraph(id, index)}>插入段落</div>);
            buttons.push(<div key={key++} className="btn-item" onClick={() => this.props.insertBranchParagraph(id, index)}>插入分支</div>);
            buttons.push(<div key={key++} className="btn-item" onClick={() => this.props.insertLockParagraph(id, index)}>插入锁</div>);
        }

        if (element.type !== 'Link') {
            switch (paragraph.type) {
                case 'Node':
                    if (paragraph.next_id === -1) {
                        buttons.push(<div key={key++} className="btn-item" onClick={() => this.props.insertEndParagraph(id, index)}>插入结局</div>);
                    }
                    break;
                case 'Branch':
                    if (paragraph.selections[index].next_id === -1) {
                        buttons.push(<div key={key++} className="btn-item" onClick={() => this.props.insertEndParagraph(id, index)}>插入结局</div>);
                    }
                    break;
                case 'NumberBranch':
                    if (paragraph.ranges[index].next_id === -1) {
                        buttons.push(<div key={key++} className="btn-item" onClick={() => this.props.insertEndParagraph(id, index)}>插入结局</div>);
                    }
                    break;

                default:
                    break;
            }
        }

        if (element.type !== 'Link' && paragraph.type === 'Branch' && selections.length < 5) {
            buttons.push(<div key={key++} className="btn-item" onClick={() => this.props.addBranchIndex(id)}>增加分支</div>);
        }

        if (element.type !== 'Link' && paragraph.type === 'NumberBranch' && ranges.length < 5) {
            buttons.push(<div key={key++} className="btn-item" onClick={() => this.props.addBranchIndex(id)}>增加分支</div>);
        }

        if (element.type !== 'Link' && (paragraph.type === 'Branch' || paragraph.type === 'NumberBranch')) {
            buttons.push(<div key={key++} className="btn-item" onClick={() => {
                this.props.resetOperation(null);
                this.props.deleteBranchIndex(element.id, element.index);
            }}>删除分支</div>);
        }

        if (element.type !== 'Link') {
            switch (paragraph.type) {
                case 'Node':
                case 'Lock':
                    if (paragraph.next_id === -1) {
                        buttons.push(<div key={key++} className="btn-item" onClick={() => this.props.setLinkingElement(element)}>  连接  </div>);
                    }
                    break;
                case 'Branch':
                    if (paragraph.selections[index].next_id === -1) {
                        buttons.push(<div key={key++} className="btn-item" onClick={() => this.props.setLinkingElement(element)}>  连接  </div>);
                    }
                    break;
                case 'NumberBranch':
                    if (paragraph.ranges[index].next_id === -1) {
                        buttons.push(<div key={key++} className="btn-item" onClick={() => this.props.setLinkingElement(element)}>  连接  </div>);
                    }
                    break;

                default:
                    break;
            }
        }

        if (!is_first_paragraph && paragraph.type !== 'Branch' && paragraph.type !== 'NumberBranch' && element.type !== 'Link') {
            switch (paragraph.type) {
                case 'Node':
                    buttons.push(<div key={key++} className="btn-item" onClick={() => {
                        this.props.resetOperation(null);
                        this.props.deleteParagraph(id);
                    }}>删除段落</div>);
                    break;
                case 'End':
                    buttons.push(<div key={key++} className="btn-item" onClick={() => {
                        this.props.resetOperation(null);
                        this.props.deleteParagraph(id);
                    }}>删除结局</div>);
                    break;
                case 'Lock':
                    buttons.push(<div key={key++} className="btn-item" onClick={() => {
                        this.props.resetOperation(null);
                        this.props.deleteParagraph(id);
                    }}>删除锁</div>);
                    break;
                default:
                    break;
            }
        }

        if (paragraph.type !== 'Branch' && paragraph.type !== 'NumberBranch' && !is_first_paragraph && element.type !== 'Link') {
            switch (paragraph.type) {
                case 'Node':
                    buttons.push(<div key={key++} className="btn-item" onClick={() => this.props.setMovingElement(element)}>移动段落</div>);
                    break;
                case 'End':
                    buttons.push(<div key={key++} className="btn-item" onClick={() => this.props.setMovingElement(element)}>移动结局</div>);
                    break;
                case 'Lock':
                    buttons.push(<div key={key++} className="btn-item" onClick={() => this.props.setMovingElement(element)}>移动锁</div>);
                    break;
                default:
                    break;
            }
        }

        if (element.type === 'Link') {
            buttons.push(<div key={key++} className="btn-item" onClick={() => {
                this.props.resetOperation(null);
                this.props.disconnectParagraph(element.parent.id, element.parent.index);
            }}>取消连接</div>);
        }

        // if (paragraph.type === 'Branch' && !is_first_paragraph) {
        //     buttons.push(<button key={8} className="btn-item" onClick={() => this.props.setMovingElement(element)}>移动分支</button>);
        // }

        return buttons;
    }

    render() {
        const buttons = this.renderButtons();
        const x = parseInt(this.props.x, 10) - buttons.length * 80 / 2 + 'px';
        return (
            <div className="menu" style={{ left: x, top: this.props.y }}>
                <div className="menu-btns">
                    {buttons}
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state, props) => ({
    paragraph: state.editor.content.paragraphs.find(p => p.id === props.element.id),
    is_first_paragraph: state.editor.content.paragraphs[0].id === props.element.id,
});

const mapDispatchToProps = (dispatch) => ({
    insertNodeParagraph: (parent_id, branch_index) => dispatch({ type: 'INSERT_NODE_PARAGRAPH', parent_id, branch_index }),
    insertBranchParagraph: (parent_id, branch_index) => dispatch({ type: 'INSERT_BRANCH_PARAGRAPH', parent_id, branch_index }),
    insertEndParagraph: (parent_id, branch_index) => dispatch({ type: 'INSERT_END_PARAGRAPH', parent_id, branch_index }),
    insertLockParagraph: (parent_id, branch_index) => dispatch({ type: 'INSERT_LOCK_PARAGRAPH', parent_id, branch_index }),
    deleteParagraph: (paragraph_id) => dispatch({ type: 'DELETE_PARAGRAPH', paragraph_id: paragraph_id }),
    addBranchIndex: (paragraph_id) => dispatch({ type: 'ADD_BRANCH_INDEX', paragraph_id }),
    deleteBranchIndex: (paragraph_id, branch_index) => dispatch({ type: 'DELETE_BRANCH_INDEX', paragraph_id, branch_index }),
    disconnectParagraph: (paragraph_id, branch_index) => dispatch({ type: 'DISCONNECT_PARAGRAPHS', paragraph_id, branch_index }),
});

export default connect(mapStateToProps, mapDispatchToProps)(PopupMenu);