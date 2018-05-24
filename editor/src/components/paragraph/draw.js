import {
    nodeWidth, nodeHeight, nodeBorderRadius, nodeHalfWidth, nodeHalfHeight, elementHorizontalInterval,
    elementVerticalInterval, elementHalfVerticalStep, elementHalfHorizontalStep, jointRadius,
    initializeStyles,
    useClearStyle,
    useTextStyle,
    useNodeStyle, useJointStyle, jointPadding, jointIconRadius, useWireStyle, wireMarginTop, wireMarginBottom,
    useEndStyle, endBorderRadius, useBranchStyle, useLinkStyle, useInversedTextStyle, useLockStyle,
} from './styles';

// 类似OpenGL形式的绘图状态机

const debug = false;
const log = (...params) => {
    if (debug) {
        console.log(...params);
    }
};

export let context = null;
let offsetX = 0;
let offsetY = 0;
let scale = 1;
let width = 800;
let height = 600;
let imagePatterns = null;
// let boundingBox = {left: 0, right: 0, top: 0, bottom: 0};

export function initialize(inContext, settings, inImagePatterns) {
    context = inContext;
    offsetX = settings.offsetX;
    offsetY = settings.offsetY;
    scale = settings.scale;
    width = settings.width;
    height = settings.height;
    imagePatterns = inImagePatterns;

    context.setTransform(1, 0, 0, 1, 0, 0);
    clear();
    context.setTransform(scale, 0, 0, scale, offsetX, offsetY);
}

export function clear() {
    context.save();
    useClearStyle();
    context.fillRect(0, 0, width, height);
    context.restore();
}

export function drawNode(element, style) {
    const { selected, highlighted, hasError, disabled } = style;
    let { x, y, title, image } = element;
    const pattern = imagePatterns[image];
    const left = x - nodeHalfWidth;
    const right = x + nodeHalfWidth;
    const top = y - nodeHalfHeight;
    const bottom = y + nodeHalfHeight;
    log(`'Draw node (${x}, ${y})`);

    context.save();
    useNodeStyle(style);
    context.beginPath();
    context.moveTo(left + nodeBorderRadius, top);
    context.arcTo(right, top, right, bottom, nodeBorderRadius);
    context.arcTo(right, bottom, left, bottom, nodeBorderRadius);
    context.arcTo(left, bottom, left, top, nodeBorderRadius);
    context.arcTo(left, top, right, top, nodeBorderRadius);
    context.closePath();
    if ((highlighted && !selected) || hasError) {
        context.stroke();
    }
    context.fill();
    context.restore();

    // 绘制头像
    if (pattern && pattern.image) {
        context.save();
        context.beginPath();
        context.arc(x - 52, y, 16, 0, Math.PI * 2, true);
        context.closePath();
        context.clip();
        context.drawImage(pattern.image, x - 68, y - 16, 32, 32);
        context.restore();
    }
    else {
        context.save();
        context.fillStyle = '#eeeeee';
        context.beginPath();
        context.arc(x - 52, y, 16, 0, Math.PI * 2, true);
        context.closePath();
        context.fill();
        context.restore();
    }

    // 绘制标题
    context.save();
    useTextStyle(style);
    context.fillText(title.length > 6 ? (title.substring(0, 6) + '...') : title, x + 18, y);
    context.restore();

    return {
        type: 'Rect',
        left: left,
        right: right,
        top: top,
        bottom: bottom,
    };
}

export function drawLock(element, style) {
    const { selected, highlighted, hasError, disabled } = style;
    let { x, y, title } = element;
    const left = x - nodeHalfWidth;
    const right = x + nodeHalfWidth;
    const top = y - nodeHalfHeight;
    const bottom = y + nodeHalfHeight;
    log(`'Draw lock (${x}, ${y})`);

    context.save();
    useLockStyle(style);
    context.beginPath();
    context.moveTo(left + nodeBorderRadius, top);
    context.arcTo(right, top, right, bottom, nodeBorderRadius);
    context.arcTo(right, bottom, left, bottom, nodeBorderRadius);
    context.arcTo(left, bottom, left, top, nodeBorderRadius);
    context.arcTo(left, top, right, top, nodeBorderRadius);
    context.closePath();
    if ((highlighted && !selected) || hasError) {
        context.stroke();
    }
    context.fill();
    context.restore();

    // 绘制标题
    context.save();
    useTextStyle(style);
    context.fillText(title.length > 8 ? (title.substring(0, 8) + '...') : title, x, y);
    context.restore();

    return {
        type: 'Rect',
        left: left,
        right: right,
        top: top,
        bottom: bottom,
    };
}

export function drawBranch(element, style) {
    const { x, y, title } = element;
    const { selected, highlighted } = style;
    const xx = x - nodeHalfWidth;
    const yy = y - nodeHalfHeight;

    log(`'Draw branch (${xx}, ${yy})`);

    context.save();
    useBranchStyle(style);
    context.beginPath();
    context.moveTo(xx + nodeBorderRadius, yy);
    context.arcTo(xx + nodeWidth, yy, xx + nodeWidth, yy + nodeHeight, nodeBorderRadius);
    context.arcTo(xx + nodeWidth, yy + nodeHeight, xx, yy + nodeHeight, nodeBorderRadius);
    context.arcTo(xx, yy + nodeHeight, xx, yy, nodeBorderRadius);
    context.arcTo(xx, yy, xx + nodeWidth, yy, nodeBorderRadius);
    context.closePath();
    if (highlighted && !selected) {
        context.stroke();
    }
    context.fill();
    context.restore();

    context.save();
    useTextStyle(style);
    context.fillText(title.length > 10 ? (title.substring(0, 10) + '...') : title, x, y);
    context.restore();

    return {
        type: 'Rect',
        left: xx,
        right: xx + nodeWidth,
        top: yy,
        bottom: yy + nodeHeight,
    };
}

export function drawJoint(element, style) {
    const { x, y, expanded } = element;
    const { highlighted } = style;

    log(`'Draw joint (${x}, ${y})`);

    context.save();
    useJointStyle(highlighted);
    context.beginPath();
    context.arc(x, y, jointRadius, 0, 360, false);
    context.closePath();
    context.fill();
    context.stroke();

    if (expanded) {
        context.beginPath();
        context.moveTo(x - jointIconRadius, y);
        context.lineTo(x + jointIconRadius, y);
        context.closePath();
        context.stroke();
    }
    else {
        context.beginPath();
        context.moveTo(x - jointRadius + jointPadding, y);
        context.lineTo(x + jointRadius - jointPadding, y);
        context.moveTo(x, y + jointRadius - jointPadding);
        context.lineTo(x, y - jointRadius + jointPadding);
        context.closePath();
        context.stroke();
    }

    context.restore();

    return {
        type: 'Circle',
        x: x,
        y: y,
        radius: jointRadius,
    };
}

export function drawEnd(element, style) {
    const { x, y, title } = element;
    const { selected, highlighted } = style;
    const left = x - nodeHalfWidth;
    const right = x + nodeHalfWidth;
    const top = y - nodeHalfHeight;
    const bottom = y + nodeHalfHeight;
    log(`'Draw end (${x}, ${y})`);

    context.save();
    useEndStyle(style);
    context.beginPath();
    context.moveTo(left + endBorderRadius, top);
    context.arcTo(right, top, right, bottom, endBorderRadius);
    context.arcTo(right, bottom, left, bottom, endBorderRadius);
    context.arcTo(left, bottom, left, top, endBorderRadius);
    context.arcTo(left, top, right, top, endBorderRadius);
    context.closePath();
    if (highlighted && !selected) {
        context.stroke();
    }
    context.fill();
    context.restore();

    context.save();
    useTextStyle(style);
    context.fillText(title.length > 10 ? (title.substring(0, 10) + '...') : title, x, y);
    context.restore();

    return {
        type: 'Rect',
        left: left,
        right: right,
        top: top,
        bottom: bottom,
    };
}

export function drawLink(element, style) {
    const { selected, highlighted } = style;
    let { x, y, title } = element;
    const left = x - nodeHalfWidth;
    const right = x + nodeHalfWidth;
    const top = y - nodeHalfHeight;
    const bottom = y + nodeHalfHeight;
    log(`'Draw node (${x}, ${y})`);

    context.save();
    useLinkStyle(style);
    context.beginPath();
    context.moveTo(left + nodeBorderRadius, top);
    context.arcTo(right, top, right, bottom, nodeBorderRadius);
    context.arcTo(right, bottom, left, bottom, nodeBorderRadius);
    context.arcTo(left, bottom, left, top, nodeBorderRadius);
    context.arcTo(left, top, right, top, nodeBorderRadius);
    context.closePath();
    context.stroke();
    context.fill();
    context.restore();

    context.save();
    useInversedTextStyle();
    const lines = title.split('\n');
    if (lines.length === 2) {
        context.fillText(lines[0].substring(0, 8), x, y - 7.5);
        context.fillText(lines[1].substring(0, 8), x, y + 7.5);
    }
    else if (lines.length > 2) {
        context.fillText(lines[0].substring(0, 8), x, y - 10);
        context.fillText(lines[1].substring(0, 8), x, y + 2.5);
        context.fillText('...', x, y + 10);
    }
    else {
        context.fillText(title.substring(0, 8), x, y);
    }
    context.restore();

    return {
        type: 'Rect',
        left: left,
        right: right,
        top: top,
        bottom: bottom,
    };
}

export function drawWire(element, style) {
    const { a, b } = element;
    const { x: x1, y: y1 } = a;
    const { x: x2, y: y2 } = b;
    const y = (y1 + y2) / 2;

    context.save();
    useWireStyle();
    context.beginPath();
    context.moveTo(x1, y1 + wireMarginTop);
    context.lineTo(x1, y);
    context.lineTo(x2, y);
    context.lineTo(x2, y2 - wireMarginBottom);
    context.stroke();
    context.closePath();
    context.restore();
}