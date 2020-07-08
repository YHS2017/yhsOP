// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import Game from "../Module/Game";
import PoolMgr from "./PoolMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Star extends cc.Component {

    update(dt: number) {
        const len = this.node.parent.getComponent(Game).speed * dt;
        this.node.y = this.node.y - len;
        if (this.node.y < -1000) {
            PoolMgr.returnToStarPool(this.node);
        }
    }
}
