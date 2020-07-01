// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import GM from "./GM";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Main extends cc.Component {

    start() {
        GM.Root = this.node;
        cc.loader.loadRes("./Module/Loading", cc.Prefab, (error: Error, resource: any) => {
            const loading = cc.instantiate(resource);
            GM.OpenUI(loading);
        });
    }
}
