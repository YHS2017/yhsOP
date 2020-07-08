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
export default class Player extends cc.Component {

    vx: number = 0;
    vy: number = 0;
    damp: number = 10;

    update(dt: number) {
        const game = this.node.parent;
        let x = this.node.x + this.vx * dt;
        let y = this.node.y + this.vy * dt;
        if (x < -game.width / 2) {
            x = -game.width / 2;
        }
        if (x > game.width / 2) {
            x = game.width / 2;
        }
        if (y < -game.height / 2) {
            y = -game.height / 2
        }
        if (y > this.node.height / 2) {
            y = this.node.height / 2;
        }
        this.node.x = x;
        this.node.y = y;
        if (this.vx > 0) {
            this.vx = Math.max(this.vx - this.damp, 0);
        } else {
            this.vx = Math.min(this.vx + this.damp, 0);
        }
        if (this.vy > 0) {
            this.vy = Math.max(this.vy - this.damp, 0);
        } else {
            this.vy = Math.min(this.vy + this.damp, 0);
        }
    }

    onCollisionEnter(other: cc.Component, self: cc.Component) {
        if (other.node.group === "barrier") {

        } else {
            this.node.parent.getComponent(Game).addScore();
            PoolMgr.returnToStarPool(other.node);
        }
    }

}
