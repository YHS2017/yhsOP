// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import PoolMgr from "../Game/PoolMgr";
import Player from "../Game/Player";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Game extends cc.Component {
    @property(cc.Node)
    Player: cc.Node = null;

    @property(cc.Label)
    ScoreText: cc.Label = null;

    score: number = 0;
    speed: number = 300;
    barrierlen: number = 0;
    awardlen: number = 0;
    walltype: string = 'WallLeft';
    awardspan: number = 0;
    barrierspan: number = 0;

    init() {
        this.score = 0;
        this.speed = 300;
        this.barrierlen = 0;
        this.awardlen = 0;
        this.walltype = 'WallLeft';
        this.awardspan = 0;
        this.barrierspan = 0;
    }

    start() {
        this.init();
        this.node.on(cc.Node.EventType.TOUCH_MOVE, (event: cc.Event.EventTouch) => {
            let delta = event.touch.getDelta();
            const player = this.Player.getComponent(Player);
            if (delta.x > 0) {
                player.vx = Math.min(player.vx + delta.x * 4, 600);
            } else {
                player.vx = Math.max(player.vx + delta.x * 4, -600);
            }
            if (delta.y > 0) {
                player.vy = Math.min(player.vy + delta.y * 4, 600);
            } else {
                player.vy = Math.max(player.vy + delta.y * 4, -600);
            }
        }, this.node);
        const manager = cc.director.getCollisionManager();
        manager.enabled = true;
    }

    update(dt: number) {
        this.barrierlen += dt * this.speed;
        this.awardlen += dt * this.speed;
        if (!this.barrierspan) {
            this.barrierspan = 400 + Math.random() * 500;
        }
        if (this.barrierlen >= this.barrierspan) {
            this.barrierspan = 0;
            this.barrierlen = 0;
            this.creatWall();
        }

        if (!this.awardspan) {
            this.awardspan = 200 + Math.random() * 250;
        }
        if (this.awardlen >= this.awardspan) {
            this.awardspan = 0;
            this.awardlen = 0;
            this.creatStar();
            this.creatStar();
        }
    }

    creatWall() {
        let wall: cc.Node;
        if (this.walltype === "WallLeft") {
            wall = PoolMgr.getWallFromPool(this.walltype);
            this.walltype = "WallRight";
            wall.y = this.node.height / 2 + 5;
        } else {
            wall = PoolMgr.getWallFromPool(this.walltype);
            this.walltype = "WallLeft";
            wall.y = this.node.height / 2 + 5;
        }
        this.node.addChild(wall);
    }

    creatStar() {
        const star = PoolMgr.getStarFromPool();
        const x = -this.node.width / 2 + Math.random() * 880;
        const y = this.node.height / 2 + Math.random() * 300;
        star.x = x;
        star.y = y;
        this.node.addChild(star);
    }

    addScore() {
        this.score++;
        this.ScoreText.string = "Score:" + this.score.toString();
    }
}
