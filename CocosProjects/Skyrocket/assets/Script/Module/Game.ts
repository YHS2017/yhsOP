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
import GM from "../GM";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Game extends cc.Component {
    @property(cc.Node)
    Player: cc.Node = null;

    @property(cc.ProgressBar)
    Power: cc.ProgressBar = null;

    @property(cc.Node)
    Fight: cc.Node = null;

    @property(cc.Label)
    ScoreText: cc.Label = null;

    @property(cc.Node)
    Over: cc.Node = null;

    score: number = 0;
    speed: number = 0;
    defaultspeed: number = 400;
    maxspeed: number = 3000;
    barrierlen: number = 0;
    awardlen: number = 0;
    awardspan: number = 0;
    barrierspan: number = 0;
    isEnd: boolean = false;
    power: number = 0;
    maxpower: number = 50;

    init() {
        this.score = 0;
        this.speed = this.defaultspeed;
        this.barrierlen = 0;
        this.awardlen = 0;
        this.awardspan = 0;
        this.barrierspan = 0;
        this.isEnd = false;
        this.power = 0;
    }

    start() {
        this.init();
        this.node.on(cc.Node.EventType.TOUCH_MOVE, (event: cc.Event.EventTouch) => {
            let delta = event.touch.getDelta();
            const player = this.Player.getComponent(Player);
            if (delta.x > 0) {
                player.vx = Math.min(player.vx + delta.x * 4, 800);
            } else {
                player.vx = Math.max(player.vx + delta.x * 4, -800);
            }
            if (delta.y > 0) {
                player.vy = Math.min(player.vy + delta.y * 4, 800);
            } else {
                player.vy = Math.max(player.vy + delta.y * 4, -800);
            }
        }, this.node);
        const player = this.Player.getComponent(Player);
        player.sprint();
        const manager = cc.director.getCollisionManager();
        manager.enabled = true;
    }

    update(dt: number) {
        if (!this.isEnd) {
            this.score = this.score + Math.ceil(this.speed * dt / 10);
            this.ScoreText.string = "高度: " + this.score.toString() + " 米";
            this.barrierlen += dt * this.speed;
            this.awardlen += dt * this.speed;
            if (!this.barrierspan) {
                this.barrierspan = 400 + Math.random() * 500;
            }
            if (this.barrierlen >= this.barrierspan) {
                this.barrierspan = 0;
                this.barrierlen = 0;
                this.creatDarkCloud();
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
    }

    creatDarkCloud() {
        const darkcloud: cc.Node = PoolMgr.getDarkCloudFromPool();
        const x = -this.node.width / 2 + 50 + Math.random() * 980;
        const y = this.node.height / 2 + 200;
        darkcloud.x = x;
        darkcloud.y = y;
        this.Fight.addChild(darkcloud);
    }

    creatStar() {
        const star = PoolMgr.getStarFromPool();
        const x = -this.node.width / 2 + 100 + Math.random() * 880;
        const y = this.node.height / 2 + Math.random() * 300;
        star.x = x;
        star.y = y;
        this.Fight.addChild(star);
    }

    gameOver() {
        this.isEnd = true;
        this.Over.active = true;
    }

    gameContinu() {
        this.isEnd = false;
        this.Over.active = false;
        const player = this.Player.getComponent(Player);
        player.sprint();
    }

    quitGame() {
        const homeprefab: cc.Node = cc.loader.getRes("./Module/Home", cc.Prefab);
        const home: cc.Node = cc.instantiate(homeprefab);
        GM.OpenUI(home);
    }
}
