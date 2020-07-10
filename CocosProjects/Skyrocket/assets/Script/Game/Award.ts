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
import Player from "./Player";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Award extends cc.Component {

    type: number = 0;

    update(dt: number) {
        const game = this.node.parent.parent.getComponent(Game);
        const player = game.Player.getComponent(Player);
        if (!game.isEnd) {
            const len = game.speed * dt;
            this.node.y = this.node.y - len;
            if (this.node.y < -this.node.parent.parent.height / 2 - 50) {
                PoolMgr.returnToStarPool(this.node);
            }
            if (player.powerful) {
                if (this.getPointsLength(game.Player.position, this.node.position) <= 600) {
                    const vec = this.getABVec(game.Player.position, this.node.position);
                    this.node.x = this.node.x + vec.x * 4000 * dt;
                    this.node.y = this.node.y + vec.y * 4000 * dt;
                }
            }
        }
    }

    getABVec(A: cc.Vec2, B: cc.Vec2) {
        let a = A.x - B.x;
        let b = A.y - B.y;
        let c = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
        var vector = cc.v2(a / c, b / c);
        return vector;
    }

    getPointsLength(A: cc.Vec2, B: cc.Vec2) {
        let a = A.x - B.x;
        let b = A.y - B.y;
        let c = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
        return c;
    }
}
