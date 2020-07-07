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

const { ccclass, property } = cc._decorator;

@ccclass
export default class Game extends cc.Component {
    @property(cc.Node)
    Player: cc.Node = null;

    speed: number = 200;
    minspan: number = 300;
    maxspan: number = 700;
    len: number = 0;
    walltype: string = 'WallLeft';
    span: number = 0;


    start() {
        this.node.on(cc.Node.EventType.TOUCH_MOVE, (event: cc.Event.EventTouch) => {
            let delta1 = event.touch.getDelta();
            this.Player.x += delta1.x;
            this.Player.y += delta1.y;
        }, this.node);
    }

    update(dt: number) {
        this.len += dt * this.speed;
        if (!this.span) {
            this.span = this.minspan + Math.random() * (this.maxspan - this.minspan);
        }
        if (this.len >= this.span) {
            this.span = 0;
            this.len = 0;
            this.creatWall();
        }
    }

    creatWall() {
        let wall: cc.Node;
        if (this.walltype === "WallLeft") {
            wall = PoolMgr.getWallFromPool(this.walltype);
            this.walltype = "WallRight";
            wall.y = 1000;
        } else {
            wall = PoolMgr.getWallFromPool(this.walltype);
            this.walltype = "WallLeft";
            wall.y = 1000;
        }
        this.node.addChild(wall);
    }
}
