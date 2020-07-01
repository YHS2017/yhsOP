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
export default class NewClass extends cc.Component {

    @property(cc.Label)
    text: cc.Label = null;

    @property(cc.ProgressBar)
    progressbar: cc.ProgressBar = null;

    start() {
        cc.loader.loadResDir("./", (completedCount: number, totalCount: number, item: any) => {
            this.progressbar.progress = completedCount / totalCount;
            this.text.string = "正在加载中(" + completedCount + "/" + totalCount + ")";
        }, (error: Error, resource: any[]) => {
            const homeprefab: cc.Node = cc.loader.getRes("./Module/Home", cc.Prefab);
            const home: cc.Node = cc.instantiate(homeprefab);
            GM.OpenUI(home);
        });
    }
}
