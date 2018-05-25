import React, { Component } from 'react';
import { connect } from 'react-redux';
import '../../css/Paragraph.css';
import {
    drawNode,
    drawBranch,
    drawJoint,
    drawWire,
    initialize, drawEnd, drawLink, drawLock,
} from './draw';
import {
    nodeWidth,
    nodeHeight,
    elementHorizontalInterval,
    elementVerticalInterval, elementHalfVerticalStep,
} from './styles';
import PopupMenu from './PopupMenu';
import ToolsMenu from './ToolsMenu';
import { put, take } from "redux-saga/effects";

// import data from './data';

// const test_paragraphs = data;

const getParagraph = (paragraphs, id) => {
    for (let i = 0; i < paragraphs.length; i++) {
        const paragraph = paragraphs[i];
        if (paragraph.id === id) {
            return paragraph;
        }
    }
};

const minWidth = 1024;
const minHeight = 708;

class ParagraphTree extends Component {
    constructor(props) {
        super(props);
        const width = window.innerWidth;
        const height = window.innerHeight - 60;
        this.state = {
            operation: 'None',
            settings: {
                offsetX: 0,
                offsetY: 0,
                scale: 1,
                width: width < minWidth ? minWidth : width,
                height: height < minHeight ? minHeight : height,
            },

            selectedElement: null,
            highlightedElement: null,
            drag: null,

            menu: {
                x: 0,
                y: 0,
                visible: false,
            },

            cursor: 'default',
        };

        this._clickShapes = [];
        this._isMouseDown = false;
        this._mouseStartX = null;
        this._mouseStartY = null;
        this._clickDisabled = false;
        this._imagePatterns = {};
    }

    componentDidMount() {
        // 为了看日志所以延迟绘制
        // setTimeout(() => this.draw(), 1000);

        this.draw();

        window.onresize = this.updateCanvasSize;
    }

    componentDidUpdate() {
        this.draw();
    }

    componentWillUnmount() {
        window.onresize = null;

        Object.values(this._imagePatterns).forEach(i => {
            const { loader } = i;
            if (loader) {
                loader.onload = null;
            }
        });
    }

    updateCanvasSize = () => {
        const { innerWidth: width, innerHeight: height } = window;

        this.setState(prev => ({
            ...prev,
            settings: {
                ...prev.settings,
                width: width < minWidth ? minWidth : width,
                height: height < minHeight ? minHeight : height,
            }
        }));
    };

    clearClickShapes() {
        this._clickShapes = [];
    }

    measure(paragraphs) {
        const branchPositions = {};
        const visited = {};

        const _calculateCollision = (a, b) => {
            let max = 0;
            let i = 0;
            while (i < a.length && i < b.length) {
                const diff = a[i].right - b[i].left + 1;
                // console.log('diff', a[i].right, b[i].left, diff);
                if (diff >= 0 && diff > max) {
                    max = diff;
                }

                i++;
            }

            // console.log('collision', max, a, b);
            return max;
        };

        const _merge2 = (a, b) => {
            const collision = _calculateCollision(a, b);
            if (collision > 0) {
                for (let i = 0; i < b.length; i++) {
                    b[i].left += collision;
                    b[i].right += collision;
                }
            }

            const merged = a;
            for (let i = 0; i < b.length; i++) {
                const position_a = merged[i];
                const position_b = b[i];
                if (!position_a) {
                    merged.push(position_b);
                }
                else {
                    if (position_b.left < position_a.left) {
                        position_a.left = position_b.left;
                    }

                    if (position_b.right > position_a.right) {
                        position_a.right = position_b.right;
                    }
                }
            }

            return {
                collision,
                merged,
            };
        };

        const _merge = (paragraph, children) => {
            const steps = [];
            let merged = children[0];
            for (let i = 1; i < children.length; i++) {
                const result = _merge2(merged, children[i]);
                merged = result.merged;
                const collision = result.collision;
                steps.push(collision);
            }

            const width = steps[steps.length - 1];
            const dx = -width / 2;
            for (let i = 0; i < merged.length; i++) {
                merged[i].left += dx;
                merged[i].right += dx;
            }

            // console.log('steps:', steps);
            const positions = [0];
            for (let i = 0; i < steps.length; i++) {
                positions.push(steps[i]);
            }
            branchPositions[paragraph.id] = positions;


            // console.log('merged', merged, width);
            return merged;
        };

        const _measure = (paragraph, x) => {
            // console.log('measure', paragraph);

            const isVisited = visited[paragraph.id];
            visited[paragraph.id] = true;
            if (isVisited) {
                // 该节点已经被遍历过
                return [{ left: x, right: x }];
            }

            switch (paragraph.type) {
                case 'Node':
                case 'Lock': {
                    const next_paragraph = getParagraph(paragraphs, paragraph.next_id);
                    if (next_paragraph) {
                        return [{ left: x, right: x }, ..._measure(next_paragraph, x)];
                    }
                    else {
                        return [{ left: x, right: x }];
                    }
                }

                case 'Branch': {
                    if (paragraph.expanded) {
                        const { selections } = paragraph;
                        const children = [];
                        const length = selections.length;
                        for (let i = 0; i < length; i++) {
                            const selection = selections[i];
                            const next_paragraph = getParagraph(paragraphs, selection.next_id);
                            if (next_paragraph) {
                                children[i] = [{ left: x, right: x }, ..._measure(next_paragraph, x)];
                            }
                            else {
                                // console.log('child', {left: center, right: center});
                                children[i] = [{ left: x, right: x }];
                            }
                        }

                        return _merge(paragraph, children);
                    }
                    else {
                        return [];
                    }
                }

                case 'NumberBranch': {
                    if (paragraph.expanded) {
                        const { ranges } = paragraph;
                        const children = [];
                        const length = ranges.length;
                        for (let i = 0; i < length; i++) {
                            const range = ranges[i];
                            const next_paragraph = getParagraph(paragraphs, range.next_id);
                            if (next_paragraph) {
                                children[i] = [{ left: x, right: x }, ..._measure(next_paragraph, x)];
                            }
                            else {
                                // console.log('child', {left: center, right: center});
                                children[i] = [{ left: x, right: x }];
                            }
                        }

                        return _merge(paragraph, children);
                    }
                    else {
                        return [];
                    }
                }

                case 'End': {
                    return [{ left: x, right: x }];
                }

                default:
                    break;
            }
        };

        const first_paragraph = paragraphs[0];
        // console.log('measure', _measure(first_paragraph, 0));
        _measure(first_paragraph, 0);
        return branchPositions;
    }

    getBranchTitle(branch) {
        const { selections } = branch;
        return `①${selections[0].title}\n②${selections[1].title}${selections.length > 2 ? '\n' : ''}`
    }

    getNumberBranchTitle(branch) {
        const { key, ranges } = branch;
        return `${key}\n[${ranges.slice(0, -1).map(r => typeof (r.value) === 'number' ? r.value.toString() : '').join()}]`;
    }

    visit(paragraphs) {
        const { roles } = this.props.content;
        const branchPositions = this.measure(paragraphs);
        const images = {};  // 通过paragraph.chat_id获取角色头像
        roles.forEach(r => images[r.chat_id] = r.profile);
        // console.log(branchPositions);
        const visited = {};
        const _visit = (paragraph, x, y, parent) => {
            // console.log('visit', paragraph);

            const isVisited = visited[paragraph.id];
            visited[paragraph.id] = true;

            if (isVisited) {
                // const title = paragraph.type === 'Branch' ? this.getBranchTitle(paragraph) : paragraph.title;
                let title = '';
                switch (paragraph.type) {
                    case 'Branch':
                        title = this.getBranchTitle(paragraph);
                        break;

                    case 'NumberBranch':
                        title = this.getNumberBranchTitle(paragraph);
                        break;

                    default:
                        title = paragraph.title || '';
                        break;
                }
                const link = { id: paragraph.id, type: 'Link', title: title, x: x, y: y, parent: parent };

                if (parent) {
                    const wire = { type: 'Wire', a: parent, b: link };
                    this.drawElement(wire);
                    parent.child = link;
                }

                this.drawElement(link);
            }
            else {
                switch (paragraph.type) {
                    case 'Node': {
                        const node = {
                            id: paragraph.id,
                            type: isVisited ? 'Link' : 'Node',
                            title: paragraph.title,
                            image: images[paragraph.chat_id],
                            x: x,
                            y: y,
                            parent: parent,
                        };
                        if (parent) {
                            const wire = { type: 'Wire', a: parent, b: node };
                            this.drawElement(wire);
                            parent.child = node;
                        }

                        this.drawElement(node);

                        const next_paragraph = getParagraph(paragraphs, paragraph.next_id);
                        if (next_paragraph) {
                            const xx = x;
                            const yy = y + nodeHeight + elementVerticalInterval;
                            _visit(next_paragraph, xx, yy, node);
                        }

                        break;
                    }

                    case 'Lock': {
                        const lock = {
                            id: paragraph.id,
                            type: isVisited ? 'Link' : 'Lock',
                            title: paragraph.title,
                            x: x,
                            y: y,
                            parent: parent,
                        };
                        if (parent) {
                            const wire = { type: 'Wire', a: parent, b: lock };
                            this.drawElement(wire);
                            parent.child = lock;
                        }

                        this.drawElement(lock);

                        const next_paragraph = getParagraph(paragraphs, paragraph.next_id);
                        if (next_paragraph) {
                            const xx = x;
                            const yy = y + nodeHeight + elementVerticalInterval;
                            _visit(next_paragraph, xx, yy, lock);
                        }

                        break;
                    }

                    case 'Branch': {
                        if (paragraph.expanded) {
                            const { id, selections } = paragraph;
                            const positions = branchPositions[id];
                            const first = positions[0];
                            const last = positions[positions.length - 1];
                            const width = (last - first) * (nodeWidth + elementHorizontalInterval);
                            const step = nodeWidth + elementHorizontalInterval;
                            const start = x - width / 2;
                            for (let i = 0, n = selections.length; i < n; i++) {
                                const selection = selections[i];
                                const xx = start + (positions[i] - first) * step;
                                const yy = y;
                                const branch = {
                                    id: id,
                                    index: i,
                                    type: 'Branch',
                                    title: selection.title,
                                    x: xx,
                                    y: yy,
                                    parent: parent,
                                };

                                if (parent) {
                                    const wire = { type: 'Wire', a: parent, b: branch };
                                    this.drawElement(wire);
                                    parent.child = branch;
                                }

                                this.drawElement(branch);

                                const next_paragraph = getParagraph(paragraphs, selection.next_id);
                                if (next_paragraph) {
                                    _visit(next_paragraph, xx, y + nodeHeight + elementVerticalInterval, branch);
                                }
                            }
                        }

                        const joint = {
                            id: paragraph.id,
                            type: 'Joint',
                            expanded: paragraph.expanded,
                            x: x,
                            y: y - elementHalfVerticalStep
                        };
                        this.drawElement(joint);

                        break;
                    }

                    case 'NumberBranch': {
                        if (paragraph.expanded) {
                            const { id, key, ranges } = paragraph;
                            const positions = branchPositions[id];
                            const first = positions[0];
                            const last = positions[positions.length - 1];
                            const width = (last - first) * (nodeWidth + elementHorizontalInterval);
                            const step = nodeWidth + elementHorizontalInterval;
                            const start = x - width / 2;
                            for (let i = 0, n = ranges.length; i < n; i++) {
                                const range = ranges[i];
                                const xx = start + (positions[i] - first) * step;
                                const yy = y;
                                let title = '';
                                if (i === 0) {
                                    title = `${key} < ${range.value}`;
                                }
                                else if (i === n - 1) {
                                    title = `${ranges[i - 1].value} < ${key}`;
                                }
                                else {
                                    title = `${ranges[i - 1].value} ≤ ${key} < ${range.value}`;
                                }

                                const branch = {
                                    id: id,
                                    index: i,
                                    type: 'Branch',
                                    title,
                                    x: xx,
                                    y: yy,
                                    parent: parent,
                                };

                                if (parent) {
                                    const wire = { type: 'Wire', a: parent, b: branch };
                                    this.drawElement(wire);
                                    parent.child = branch;
                                }

                                this.drawElement(branch);

                                const next_paragraph = getParagraph(paragraphs, range.next_id);
                                if (next_paragraph) {
                                    _visit(next_paragraph, xx, y + nodeHeight + elementVerticalInterval, branch);
                                }
                            }
                        }

                        const joint = {
                            id: paragraph.id,
                            type: 'Joint',
                            expanded: paragraph.expanded,
                            x: x,
                            y: y - elementHalfVerticalStep
                        };
                        this.drawElement(joint);

                        break;
                    }

                    case 'End': {
                        const end = {
                            id: paragraph.id,
                            type: 'End',
                            title: paragraph.title,
                            x: x,
                            y: y,
                            parent: parent,
                        };
                        this.drawElement(end);

                        if (parent) {
                            const wire = { type: 'Wire', a: parent, b: end };
                            this.drawElement(wire);
                            parent.child = end;
                        }

                        break;
                    }

                    default:
                        break;
                }
            }
        };

        const first_paragraph = paragraphs[0];
        _visit(first_paragraph, this.state.settings.width / 2, 100);
    }

    updateReachableParagraphs() {
        const { selectedElement } = this.state;
        const { paragraphs } = this.props.content;
        const reachable = {};
        if (selectedElement) {
            const paragraph = paragraphs.find(p => p.id === selectedElement.id);
            if (paragraph) {
                const searched = {};
                const searching = [paragraph];
                while (searching.length > 0) {
                    const current = searching.shift();
                    if (!searched[current.id]) {
                        searched[current.id] = true;
                        reachable[current.id] = true;
                        switch (current.type) {
                            case 'Node': {
                                if (current.next_id !== -1) {
                                    const next = paragraphs.find(p => p.id === current.next_id);
                                    next && searching.push(next);
                                }
                                break;
                            }

                            case 'Branch': {
                                const { selections } = current;
                                selections.forEach(s => {
                                    if (s.next_id !== -1) {
                                        const next = paragraphs.find(p => p.id === s.next_id);
                                        next && searching.push(next);
                                    }
                                });
                                break;
                            }

                            case 'NumberBranch': {
                                const { ranges } = current;
                                ranges.forEach(r => {
                                    if (r.next_id !== -1) {
                                        const next = paragraphs.find(p => p.id === r.next_id);
                                        next && searching.push(next);
                                    }
                                });
                                break;
                            }

                            default:
                                break;
                        }
                    }
                }
            }
        }
        this._reachableParagraphs = reachable;
    }

    loadImagePatterns() {
        const { roles } = this.props.content;
        roles.forEach(r => {
            const { profile } = r;
            if (!this._imagePatterns[profile]) {
                const loader = new Image();
                loader.src = profile + '/crop64';  // 使用/crop64让云服务器进行裁剪
                loader.onload = () => {
                    // console.log('Image loaded', profile);
                    this._imagePatterns[profile] = {
                        image: loader,
                        loader: null,
                    };
                    this.draw();
                };

                this._imagePatterns[profile] = {
                    image: null,
                    loader: loader,
                };
            }
        });
    }

    draw() {
        const { content } = this.props;
        this.updateReachableParagraphs();
        this.loadImagePatterns();
        if (content) {
            const { canvas } = this.refs;
            const context = canvas.getContext('2d');

            initialize(context, this.state.settings, this._imagePatterns);

            this.clearClickShapes();
            // const paragraphs = test_paragraphs;
            // this.visit(paragraphs);
            this.visit(content.paragraphs);
        }
    }

    transformToCanvas(x, y) {
        const { scale, offsetX, offsetY } = this.state.settings;
        return {
            x: (x - offsetX) / scale,
            y: (y - offsetY) / scale,
        };
    }

    transformToComponent(x, y) {
        const { scale, offsetX, offsetY } = this.state.settings;
        return {
            x: x * scale + offsetX,
            y: y * scale + offsetY
        };
    }

    drawElement(element) {
        let shape;
        switch (element.type) {
            case 'Node': {
                shape = drawNode(element, {
                    selected: this.isSelected(element),
                    highlighted: this.isHighlighted(element),
                    hasError: this.hasError(element),
                    disabled: this.isDisabled(element),
                });
                break;
            }

            case 'Lock': {
                shape = drawLock(element, {
                    selected: this.isSelected(element),
                    highlighted: this.isHighlighted(element),
                    hasError: this.hasError(element),
                    disabled: this.isDisabled(element),
                });
                break;
            }

            case 'Branch': {
                shape = drawBranch(element, {
                    selected: this.isSelected(element),
                    highlighted: this.isHighlighted(element),
                    hasError: this.hasError(element),
                    disabled: this.isDisabled(element),
                });
                break;
            }

            case 'Joint': {
                shape = drawJoint(element, {
                    highlighted: this.isHighlighted(element),
                    disabled: this.isDisabled(element),
                });
                break;
            }

            case 'Wire': {
                shape = drawWire(element, {});
                break;
            }

            case 'End': {
                shape = drawEnd(element, {
                    selected: this.isSelected(element),
                    highlighted: this.isHighlighted(element),
                    disabled: this.isDisabled(element),
                });
                break;
            }

            case 'Link': {
                shape = drawLink(element, {
                    selected: this.isSelected(element),
                    highlighted: this.isHighlighted(element),
                    disabled: this.isDisabled(element),
                });
                break;
            }

            default:
                break;
        }

        if (shape && !this.isDisabled(element)) {
            shape.element = element;
            this.addClickShape(shape);
        }
    }

    isSelected(element) {
        const { selectedElement } = this.state;
        if (selectedElement) {
            switch (element.type) {
                case 'Node':
                case 'End':
                case 'Lock':
                case 'Link':
                    return element.id === selectedElement.id;

                case 'Branch':
                    return element.id === selectedElement.id;

                case 'Joint':
                default:
                    return false;
            }
        }
    }

    isDisabled(element) {
        const { selectedElement, operation } = this.state;
        const { content } = this.props;
        switch (operation) {
            case 'Linking':
                switch (element.type) {
                    case 'Node':
                    case 'Link':
                    case 'Branch':
                    case 'Lock':
                        return selectedElement.id === element.id;

                    case 'End':
                    case 'Joint':
                    default:
                        return false;
                }

            case 'Moving':
                switch (element.type) {
                    case 'Node':
                    case 'Lock': {
                        if (!this._reachableParagraphs[element.id]) {
                            const paragraph = content.paragraphs.find(p => p.id === element.id);
                            return paragraph && paragraph.next_id !== -1;
                        }
                        else {
                            return true;
                        }
                    }

                    case 'Branch': {
                        if (!this._reachableParagraphs[element.id]) {
                            const paragraph = content.paragraphs.find(p => p.id === element.id);
                            switch (paragraph.type) {
                                case 'Branch':
                                    const selection = paragraph.selections[element.index];
                                    return selection && selection.next_id !== -1;
                                case 'NumberBranch':
                                    const range = paragraph.ranges[element.index];
                                    return range && range.next_id !== -1;
                                    break;
                                default:
                                    return false;
                            }
                        }
                        else {
                            return true;
                        }
                    }

                    case 'End':
                    case 'Link':
                        return true;

                    case 'Joint':
                    default:
                        return false;
                }

            default:
                return false;
        }
    }

    isHighlighted(element) {
        const { highlightedElement } = this.state;
        if (highlightedElement && highlightedElement.type === element.type) {
            switch (element.type) {
                case 'Node':
                case 'Joint':
                case 'End':
                case 'Lock':
                case 'Link':
                    return element.id === highlightedElement.id;

                case 'Branch':
                    return element.id === highlightedElement.id && element.index === highlightedElement.index;

                default:
                    return false;
            }
        }
    }

    hasError(element) {
        const { errors } = this.props;
        switch (element.type) {
            case 'Node':
            case 'End':
            case 'Link':
            case 'Lock':
            case 'Branch':
                return errors.find(e => e.extra && e.extra.paragraph_id === element.id);

            case 'Joint':
            default:
                return false;
        }
    }

    onClickNode = (element) => {
        console.log('Node is clicked', element.id);
        const { selectedElement, operation } = this.state;
        switch (operation) {
            case 'Linking':
                this.props.linkParagraphs(
                    {
                        id: selectedElement.id,
                        index: selectedElement.index,
                    },
                    {
                        id: element.id,
                    });
                this.resetOperation();
                break;

            case 'Moving':
                this.props.moveParagraph(
                    {
                        id: selectedElement.parent.id,
                        index: selectedElement.parent.index,
                    },
                    {
                        id: element.id,
                        index: element.index,
                    },
                    {
                        id: selectedElement.id,
                    });
                this.resetOperation();
                break;

            default:
                this.setSelectedElement(element);
                break;
        }
    };

    onClickBranch = (element) => {
        console.log('Branch is clicked', element.id);
        const { selectedElement, operation } = this.state;
        switch (operation) {
            case 'Linking':
                this.props.linkParagraphs(
                    {
                        id: selectedElement.id,
                        index: selectedElement.index,
                    },
                    {
                        id: element.id,
                    });
                this.resetOperation();
                break;

            case 'Moving':
                this.props.moveParagraph(
                    {
                        id: selectedElement.parent.id,
                        index: selectedElement.parent.index,
                    },
                    {
                        id: element.id,
                        index: element.index,
                    },
                    {
                        id: selectedElement.id,
                    });
                this.resetOperation();
                break;

            default:
                this.setSelectedElement(element);
                break;
        }
    };

    onClickEnd = (element) => {
        console.log('End is clicked', element.id);
        const { selectedElement, operation } = this.state;
        switch (operation) {
            case 'Linking':
                this.props.linkParagraphs(
                    {
                        id: selectedElement.id,
                        index: selectedElement.index,
                    },
                    {
                        id: element.id,
                    });
                this.resetOperation();
                break;

            case 'Moving':
                this.props.moveParagraph(
                    {
                        id: selectedElement.parent.id,
                        index: selectedElement.parent.index,
                    },
                    {
                        id: element.id,
                        index: element.index,
                    },
                    {
                        id: selectedElement.id,
                    });
                this.resetOperation();
                break;

            default:
                this.setSelectedElement(element);
                break;
        }
    };

    onClickLock = (element) => {
        console.log('Lock is clicked', element.id);
        const { selectedElement, operation } = this.state;
        switch (operation) {
            case 'Linking':
                this.props.linkParagraphs(
                    {
                        id: selectedElement.id,
                        index: selectedElement.index,
                    },
                    {
                        id: element.id,
                    });
                this.resetOperation();
                break;

            case 'Moving':
                this.props.moveParagraph(
                    {
                        id: selectedElement.parent.id,
                        index: selectedElement.parent.index,
                    },
                    {
                        id: element.id,
                        index: element.index,
                    },
                    {
                        id: selectedElement.id,
                    });
                this.resetOperation();
                break;

            default:
                this.setSelectedElement(element);
                break;
        }
    };

    onClickLink = (element) => {
        console.log('Link is clicked', element.id);
        const { selectedElement, operation } = this.state;
        switch (operation) {
            case 'Linking':
                this.props.linkParagraphs(
                    {
                        id: selectedElement.id,
                        index: selectedElement.index,
                    },
                    {
                        id: element.id,
                    });
                this.resetOperation();
                break;

            case 'Moving':
                this.props.moveParagraph(
                    {
                        id: selectedElement.parent.id,
                        index: selectedElement.parent.index,
                    },
                    {
                        id: element.id,
                        index: element.index,
                    },
                    {
                        id: selectedElement.id,
                    });
                this.resetOperation();
                break;

            default:
                this.setSelectedElement(element);
                break;
        }
    };

    onClickJoint = (element) => {
        console.log('Joint is clicked', element.id);
        this.props.expandBranch(element.id, !element.expanded);
    };

    addClickShape(shape) {
        this._clickShapes.push(shape);
    }

    getShape(x, y) {
        for (let i = 0; i < this._clickShapes.length; i++) {
            const shape = this._clickShapes[i];
            switch (shape.type) {
                case 'Rect':
                    if (x >= shape.left && x <= shape.right && y >= shape.top && y <= shape.bottom) {
                        return shape;
                    }
                    break;

                case 'Circle':
                    if (Math.pow(x - shape.x, 2) + Math.pow(y - shape.y, 2) <= Math.pow(shape.radius, 2)) {
                        return shape;
                    }
                    break;

                default:
                    break;
            }
        }
    }

    onClickShape(shape) {
        const { element } = shape;
        switch (element.type) {
            case 'Node':
                this.onClickNode(element);
                break;

            case 'Branch':
                this.onClickBranch(element);
                break;

            case 'Lock':
                this.onClickLock(element);
                break;

            case 'Joint':
                this.onClickJoint(element);
                break;

            case 'Link':
                this.onClickLink(element);
                break;

            case 'End':
                this.onClickEnd(element);
                break;

            default:
                break;
        }
    }

    isEventFromCanvas(event) {
        return event.target.getAttribute('tag') === 'canvas';
    }

    getMousePositionInCanvas(event) {
        const { canvas } = this.refs;
        const rect = canvas.getBoundingClientRect();
        return {
            mouseX: event.clientX - rect.left,
            mouseY: event.clientY - rect.top,
        }
    }

    onClick = (event) => {
        if (this.isEventFromCanvas(event)) {
            // console.log('On click');

            event.stopPropagation();
            if (!this._clickDisabled) {
                const { mouseX, mouseY } = this.getMousePositionInCanvas(event);
                const { x, y } = this.transformToCanvas(mouseX, mouseY);
                const shape = this.getShape(x, y);
                if (shape) {
                    this.onClickShape(shape);
                }
                else {
                    const { operation } = this.state;
                    switch (operation) {
                        case 'Linking':
                        case 'Moving':
                            break;
                        default:
                            this.setSelectedElement(null);
                    }
                }
            }
        }
    };

    onMouseEnter = (event) => {
        if (this.isEventFromCanvas(event)) {
            event.stopPropagation();
        }
    };

    onMouseLeave = (event) => {
        if (this.isEventFromCanvas(event)) {
            event.stopPropagation();
            this.setState(prev => ({
                ...prev,
                drag: null,
                highlightedElement: null,
                cursor: 'default',
            }));
            this._isMouseDown = false;
        }
    };

    onMouseWheel = (event) => {
        // console.log('wheel', event.deltaY, event.deltaX);

        const factor = -0.5;
        const delta = event.deltaY;
        this.setState(prev => ({
            ...prev,
            settings: {
                ...prev.settings,
                offsetY: prev.settings.offsetY + delta * factor,
            },
        }));
    };

    onMouseDown = (event) => {
        if (this.isEventFromCanvas(event)) {
            if (event.button === 0) {   // 鼠标左键
                event.stopPropagation();
                const { mouseX, mouseY } = this.getMousePositionInCanvas(event);
                // const {x, y} = this.transformToCanvas(mouseX, mouseY);

                this._isMouseDown = true;
                this._mouseStartX = mouseX;
                this._mouseStartY = mouseY;
                this._clickDisabled = false;
            }
        }
    };

    onMouseMove = (event) => {
        if (this.isEventFromCanvas(event)) {
            event.stopPropagation();
            const { mouseX, mouseY } = this.getMousePositionInCanvas(event);
            const { x, y } = this.transformToCanvas(mouseX, mouseY);
            const distanceSqrt = Math.pow(mouseX - this._mouseStartX, 2) + Math.pow(mouseY - this._mouseStartY, 2);

            if (this.state.drag) {
                this.onDrag(this.state.drag, mouseX, mouseY);
            }
            else if (this._isMouseDown && distanceSqrt >= 400) {
                this.onDragStart({
                    type: 'canvas',
                    startMouseX: mouseX,
                    startMouseY: mouseY,
                    startOffsetX: this.state.settings.offsetX,
                    startOffsetY: this.state.settings.offsetY,
                });
            }
            else {
                const shape = this.getShape(x, y);
                if (shape) {
                    if (!this.isHighlighted(shape.element)) {
                        this.setHighlightedElement(shape.element);
                    }
                }
                else {
                    if (this.state.highlightedElement !== null) {
                        this.setHighlightedElement(null);
                    }
                }
            }
        }
    };

    onMouseUp = (event) => {
        if (this.isEventFromCanvas(event)) {
            if (event.button === 0) {   // 鼠标左键
                event.stopPropagation();
                const { mouseX, mouseY } = this.getMousePositionInCanvas(event);
                if (this.state.drag) {
                    this.onDragEnd(this.state.drag, mouseX, mouseY);
                }

                this._isMouseDown = false;
                this._mouseStartX = null;
                this._mouseStartY = null;
            }
        }
    };

    onDragStart(drag) {
        // console.log('Drag start', drag.startMouseX, drag.startMouseY);

        let cursor = 'default';
        switch (drag.type) {
            case 'canvas':
                cursor = 'move';
                break;
            case 'element':
                cursor = 'default';
                break;
            default:
                cursor = 'default';
                break;
        }

        this._clickDisabled = true;

        this.setState(prev => ({
            ...prev,
            drag: drag,
            cursor: cursor,
        }));
    }

    onDrag(drag, mouseX, mouseY) {
        // console.log('Drag', this.state.drag.startMouseX, this.state.drag.startMouseY, mouseX, mouseY);

        const { startOffsetX, startOffsetY, startMouseX, startMouseY } = this.state.drag;
        switch (drag.type) {
            case 'canvas':
                this.setState(prev => ({
                    ...prev,
                    settings: {
                        ...prev.settings,
                        offsetX: startOffsetX + mouseX - startMouseX,
                        offsetY: startOffsetY + mouseY - startMouseY,
                    },
                }));
                break;
            case 'element':
            default:
                break;
        }
    }

    onDragEnd(drag, mouseX, mouseY) {
        // console.log('Drag end');

        this.setState(prev => ({
            ...prev,
            drag: null,
            cursor: 'default',
        }));
    }

    setSelectedElement(element) {
        // console.log('Set selected element');

        this.setState(prev => ({
            ...prev,
            selectedElement: element,
        }));

        this.props.setSelectedParagraphId(element ? element.id : null);
    }

    setHighlightedElement(element) {
        const cursor = element ? 'pointer' : 'default';
        this.setState(prev => ({
            ...prev,
            highlightedElement: element,
            cursor: cursor,
        }));
    }

    setLinkingElement(element) {
        this.setState(prev => ({
            ...prev,
            operation: 'Linking',
            selectedElement: element,
        }));
    }

    setMovingElement(element) {
        this.setState(prev => ({
            ...prev,
            operation: 'Moving',
            selectedElement: element,
        }));
    }

    resetOperation() {
        this.setState(prev => ({
            ...prev,
            operation: 'None',
            selectedElement: null,
            highlightedElement: null,
        }));
    }

    renderPopupMenu() {
        const { highlightedElement, drag } = this.state;
        if ((highlightedElement && highlightedElement.type !== 'Joint') && (!drag || !this._clickDisabled)) {
            const { x, y } = this.transformToComponent(highlightedElement.x, highlightedElement.y + 20);
            return (
                <PopupMenu element={highlightedElement} ref={'menu'} x={x} y={y}
                    setLinkingElement={element => this.setLinkingElement(element)}
                    setMovingElement={element => this.setMovingElement(element)}
                    setSelectedElement={element => this.setSelectedElement(element)}
                    setHighlightedElement={element => this.setHighlightedElement(element)}
                    resetOperation={element => this.resetOperation(element)}
                />);
        }
        else {
            return null;
        }
    }

    renderOperationMenu() {
        const { operation } = this.state;
        switch (operation) {
            case 'Linking':
                return (
                    <div className="operation-menu">
                        <p>请选择连接段落</p>
                        <div className='btn-blue-s' onClick={() => this.resetOperation(null)}>取消</div>
                    </div>
                );

            case 'Moving':
                return (
                    <div className="operation-menu">
                        <p>请选择移动位置</p>
                        <div className='btn-blue-s' onClick={() => this.resetOperation(null)}>取消</div>
                    </div>
                );

            default:
                break;
        }
    }

    scaleUp = () => {
        const { offsetX, offsetY, scale, width, height } = this.state.settings;
        const max = 2;
        const step = 0.25;
        const s = Math.min(max, scale + step);
        if (s !== scale) {
            const x = offsetX - (width / 2 * step);
            const y = offsetY - (height / 2 * step);

            this.setState(prev => ({
                ...prev,
                settings: {
                    ...prev.settings,
                    offsetX: x,
                    offsetY: y,
                    scale: s,
                }
            }));
        }
    };

    scaleDown = () => {
        const { offsetX, offsetY, scale, width, height } = this.state.settings;
        const min = 0.5;
        const step = -0.25;
        const s = Math.max(min, scale + step);
        const x = offsetX - (width / 2 * step);
        const y = offsetY - (height / 2 * step);
        if (s !== scale) {
            this.setState(prev => ({
                ...prev,
                settings: {
                    ...prev.settings,
                    offsetX: x,
                    offsetY: y,
                    scale: s,
                }
            }));
        }
    };

    aim = () => {
        const { selectedElement } = this.state;
        if (selectedElement) {
            this.moveCanvasWithElementAsCenter(selectedElement);
        }
    };

    renderToolsMenu() {
        return <ToolsMenu scaleUp={this.scaleUp} scaleDown={this.scaleDown} aim={this.aim} />;
    }

    moveCanvasWithElementAsCenter(element) {
        const { width, height, scale } = this.state.settings;
        this.setState(prev => ({
            ...prev,
            settings: {
                ...prev.settings,
                offsetX: width / 2 - element.x * scale,
                offsetY: height / 2 - element.y * scale,
            }
        }));
    }

    render() {
        // console.log('Render paragraph tree', this.props.project && this.props.project.content.paragraphs.length);

        return (
            <div className="paragraphs" onClick={this.onClick}
                onMouseEnter={this.onMouseEnter}
                onMouseMove={this.onMouseMove}
                onMouseDown={this.onMouseDown}
                onMouseUp={this.onMouseUp}
                onMouseLeave={this.onMouseLeave}
                onWheel={this.onMouseWheel}>
                <canvas tag={'canvas'}
                    ref={'canvas'}
                    className={'canvas'}
                    style={{ cursor: this.state.cursor }}
                    width={this.state.settings.width}
                    height={this.state.settings.height}
                />
                {this.renderPopupMenu()}
                {this.renderToolsMenu()}
                {this.renderOperationMenu()}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    content: state.editor.content,
    errors: state.editor.errors,
    warnings: state.editor.warnings,
});

const mapDispatchToProps = dispatch => ({
    expandBranch: (paragraph_id, expanded) => dispatch({
        type: 'EXPAND_BRANCH',
        paragraph_id: paragraph_id,
        expanded: expanded
    }),
    linkParagraphs: (a, b) => dispatch({
        type: 'LINK_PARAGRAPHS',
        a,
        b,
    }),
    moveParagraph: (from_parent, to_parent, child) => dispatch({
        type: 'MOVE_PARAGRAPH',
        from_parent,
        to_parent,
        child,
    }),
    setSelectedParagraphId: (paragraph_id) => dispatch({
        type: 'SET_SELECTED_PARAGRAPH_ID',
        paragraph_id,
    }),
});

export default connect(mapStateToProps, mapDispatchToProps)(ParagraphTree);