// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class PoolMgr {
    private static DarkCloudPool: cc.NodePool = new cc.NodePool();
    private static AwardPool: cc.NodePool = new cc.NodePool();

    /**
     * 获取墙节点
     * @param type 
     */
    public static getDarkCloudFromPool(): cc.Node {
        let darkcloud: cc.Node = null;
        if (this.DarkCloudPool.size() > 0) {
            darkcloud = this.DarkCloudPool.get();
        } else {
            const Prefab: cc.Prefab = cc.loader.getRes("Prefab/DarkCloud", cc.Prefab);
            darkcloud = cc.instantiate(Prefab);
        }
        return darkcloud;
    }

    /**
     * 获取奖励节点
     */
    public static getStarFromPool(): cc.Node {
        let star: cc.Node = null;
        if (this.AwardPool.size() > 0) {
            star = this.AwardPool.get();
        } else {
            const Prefab: cc.Prefab = cc.loader.getRes("Prefab/Star", cc.Prefab);
            star = cc.instantiate(Prefab);
        }
        return star;
    }

    /**
     * 回收乌云节点
     * @param darkcloud 
     */
    public static returnToWallPool(darkcloud: cc.Node) {
        this.DarkCloudPool.put(darkcloud);
    }

    /**
     * 回收星星节点
     * @param wall 
     */
    public static returnToStarPool(award: cc.Node) {
        this.AwardPool.put(award);
    }
}