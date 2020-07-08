// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class ContentResize extends cc.Component {

    start() {
        let srcScaleForShowAll = Math.min(
            cc.view.getCanvasSize().width / this.node.width,
            cc.view.getCanvasSize().height / this.node.height
        );
        let realWidth = this.node.width * srcScaleForShowAll;
        let realHeight = this.node.height * srcScaleForShowAll;

        // 2. 基于第一步的数据，再做节点宽高重置
        this.node.width = this.node.width *
            (cc.view.getCanvasSize().width / realWidth);
        this.node.height = this.node.height *
            (cc.view.getCanvasSize().height / realHeight);
    }
}
