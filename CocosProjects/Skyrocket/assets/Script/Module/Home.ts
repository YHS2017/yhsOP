// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import GM from "../GM";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Home extends cc.Component {
    start() {

    }

    toPlay() {
        const gameprefab: cc.Node = cc.loader.getRes("./Module/Game", cc.Prefab);
        const game: cc.Node = cc.instantiate(gameprefab);
        GM.OpenUI(game);
    }
}
