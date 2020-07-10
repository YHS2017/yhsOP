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

    @property(cc.Node)
    Player: cc.Node = null;

    vx: number = 0;
    vy: number = 0;
    powerful: boolean = true;
    invincible: boolean = false;
    damp: number = 10;

    update(dt: number) {
        const gamenode = this.node.parent.parent;
        const game = gamenode.getComponent(Game);
        if (!game.isEnd) {
            let x = this.node.x + this.vx * dt;
            let y = this.node.y + this.vy * dt;
            if (x < -gamenode.width / 2) {
                x = -gamenode.width / 2;
            }
            if (x > gamenode.width / 2) {
                x = gamenode.width / 2;
            }
            if (y < -gamenode.height / 2) {
                y = -gamenode.height / 2
            }
            if (y > gamenode.height / 2) {
                y = gamenode.height / 2;
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
    }

    onCollisionEnter(other: cc.Component, self: cc.Component) {
        const game = this.node.parent.parent.getComponent(Game);
        if (other.node.group === "barrier") {
            if (!this.invincible) {
                game.gameOver();
            }
        } else {
            this.addAward();
            PoolMgr.returnToStarPool(other.node);
        }
    }

    addAward() {
        const game = this.node.parent.parent.getComponent(Game);
        if (!this.powerful) {
            game.power++;
            game.Power.progress = game.power / game.maxpower;
            game.speed = game.defaultspeed + Math.sqrt(game.score) * 5;
            if (game.power === game.maxpower) {
                this.sprint();
                game.power = 0;
                game.Power.progress = game.power / game.maxpower;
            }
        }
    }

    sprint() {
        const game = this.node.parent.parent.getComponent(Game);
        this.powerful = true;
        this.invincible = true;
        game.speed = game.maxspeed;
        this.scheduleOnce(() => {
            this.powerful = false;
            game.speed = game.defaultspeed + Math.sqrt(game.score) * 5;
        }, 5);
        this.scheduleOnce(() => { this.invincible = false }, 7);
    }

}
