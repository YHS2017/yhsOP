import {context} from './draw';

export const elementMaxHeight = 40;
export const nodeWidth = 150;
export const nodeHeight = elementMaxHeight;
export const nodeBorderRadius = 6;
export const nodeHalfWidth = nodeWidth / 2;
export const nodeHalfHeight = nodeHeight / 2;
export const endBorderRadius = elementMaxHeight / 2;
export const elementHorizontalInterval = 20;
export const elementVerticalInterval = 32;
export const elementHorizontalStep = nodeWidth + elementHorizontalInterval;
export const elementVerticalStep = nodeHeight + elementVerticalInterval;
export const elementHalfHorizontalStep = elementHorizontalStep / 2;
export const elementHalfVerticalStep = elementVerticalStep / 2;
export const jointRadius = 8;
export const jointPadding = 2;
export const jointIconRadius = jointRadius - jointPadding;
export const wireMarginTop = elementMaxHeight / 2 + 8;
export const wireMarginBottom = elementMaxHeight / 2 + 4;

export function useClearStyle() {
    context.fillStyle = '#fefbf9';
}

export function useTextStyle(style) {
    const {selected, highlighted, hasError, disabled} = style;

    context.font = '12px Arial';
    context.fillStyle = '#ffffff';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    //
    // if (disabled) {
    //     context.globalAlpha = 0.5;
    // }
}

export function useInversedTextStyle() {
    context.font = '12px Arial';
    context.fillStyle = '#333333';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
}

export function useNodeStyle(style) {
    const {selected, highlighted, hasError, disabled} = style;

    if (disabled) {
        context.fillStyle = '#ccc';
        if (selected) {
            context.strokeStyle = '#6495ed';
            context.lineWidth = 4;
        }
    }
    else if (hasError) {
        context.fillStyle = '#ff5d5e';
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 4;
        context.shadowBlur = 4;
        context.shadowColor = 'rgba(0, 0, 0, 0.1)';
        context.strokeStyle = '#ff5d5e';
        context.lineWidth = 4;
    }
    else if (selected) {
        context.fillStyle = '#6495ed';
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 4;
        context.shadowBlur = 4;
        context.shadowColor = 'rgba(0, 0, 0, 0.1)';
    }
    else if (highlighted) {
        context.fillStyle = '#aaa';
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 4;
        context.shadowBlur = 4;
        context.shadowColor = 'rgba(0, 0, 0, 0.1)';
        context.strokeStyle = '#6495ed';
        context.lineWidth = 4;
    }
    else {
        context.fillStyle = '#aaa';
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 4;
        context.shadowBlur = 4;
        context.shadowColor = 'rgba(0, 0, 0, 0.1)';
    }
}

export function useLockStyle(style) {
    const {selected, highlighted, hasError, disabled} = style;

    if (disabled) {
        context.fillStyle = '#ccc';
        if (selected) {
            context.strokeStyle = '#6495ed';
            context.lineWidth = 4;
        }
    }
    else if (hasError) {
        context.fillStyle = '#ff5d5e';
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 4;
        context.shadowBlur = 4;
        context.shadowColor = 'rgba(0, 0, 0, 0.1)';
        context.strokeStyle = '#ff5d5e';
        context.lineWidth = 4;
    }
    else if (selected) {
        context.fillStyle = '#6495ed';
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 4;
        context.shadowBlur = 4;
        context.shadowColor = 'rgba(0, 0, 0, 0.1)';
    }
    else if (highlighted) {
        context.fillStyle = '#f46f22';
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 4;
        context.shadowBlur = 4;
        context.shadowColor = 'rgba(0, 0, 0, 0.1)';
        context.strokeStyle = '#6495ed';
        context.lineWidth = 4;
    }
    else {
        context.fillStyle = '#f46f22';
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 4;
        context.shadowBlur = 4;
        context.shadowColor = 'rgba(0, 0, 0, 0.1)';
    }
}

export function useBranchStyle(style) {
    const {selected, highlighted, hasError, disabled} = style;

    if (disabled) {
        context.fillStyle = '#ccc';
        if (selected) {
            context.strokeStyle = '#6495ed';
            context.lineWidth = 4;
        }
    }
    else if (selected) {
        context.fillStyle = '#6495ed';
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 4;
        context.shadowBlur = 4;
        context.shadowColor = 'rgba(0, 0, 0, 0.1)';
    }
    else if (highlighted) {
        context.fillStyle = '#FF9900';
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 4;
        context.shadowBlur = 4;
        context.shadowColor = 'rgba(0, 0, 0, 0.1)';
        context.strokeStyle = '#6495ed';
        context.lineWidth = 4;
    }
    else {
        context.fillStyle = '#FF9900';
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 4;
        context.shadowBlur = 4;
        context.shadowColor = 'rgba(0, 0, 0, 0.1)';
    }

    if (hasError) {
        context.fillStyle = '#ff5d5e';
    }
}

export function useJointStyle(highlighted) {
    if (highlighted) {
        context.fillStyle = '#ffffff';
        context.strokeStyle = '#6495ed';
        context.lineWidth = 1;
        context.lineCap = 'round';
    }
    else {
        context.fillStyle = '#ffffff';
        context.strokeStyle = 'LightGrey';
        context.lineWidth = 1;
        context.lineCap = 'round';
    }
}

export function useLinkStyle(style) {
    const {selected, highlighted, hasError, disabled} = style;

    if (disabled) {
        context.fillStyle = '#f1f1f1';
        context.lineWidth = 6;
        context.setLineDash([10, 6]);
        if (selected) {
            context.strokeStyle = '#6495ed';
        }
        else {
            context.strokeStyle = '#ccc';
        }
    }
    else if (selected) {
        context.fillStyle = '#ffffff';
        context.strokeStyle = '#6495ed';
        context.lineWidth = 6;
        context.setLineDash([10, 6]);
    }
    else if (highlighted) {
        context.fillStyle = '#ffffff';
        context.strokeStyle = '#6495ed';
        context.lineWidth = 6;
        context.setLineDash([10, 6]);
    }
    else {
        context.fillStyle = '#ffffff';
        context.strokeStyle = 'LightGrey';
        context.lineWidth = 6;
        context.setLineDash([10, 6]);
    }
}

export function useEndStyle(style) {
    const {selected, highlighted, hasError, disabled} = style;

    if (disabled) {
        context.fillStyle = '#ccc';
        if (selected) {
            context.strokeStyle = '#6495ed';
            context.lineWidth = 4;
        }
    }
    else if (selected) {
        context.fillStyle = '#6495ed';
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 4;
        context.shadowBlur = 4;
        context.shadowColor = 'rgba(0, 0, 0, 0.1)';
    }
    else if (highlighted) {
        context.fillStyle = '#ff9999';
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 4;
        context.shadowBlur = 4;
        context.shadowColor = 'rgba(0, 0, 0, 0.1)';
        context.strokeStyle = '#6495ed';
        context.lineWidth = 4;
    }
    else {
        context.fillStyle = '#ff9999';
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 4;
        context.shadowBlur = 4;
        context.shadowColor = 'rgba(0, 0, 0, 0.1)';
    }
}

export function useWireStyle() {
    context.lineWidth = 2;
    context.strokeStyle = '#ccc';
    context.lineCap = 'round';
    context.lineJoin = 'round';
}
