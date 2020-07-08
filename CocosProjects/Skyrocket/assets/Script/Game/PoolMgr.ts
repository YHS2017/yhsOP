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
    private static WallLeftPool: cc.NodePool = new cc.NodePool();
    private static WallRightPool: cc.NodePool = new cc.NodePool();
    private static StarPool: cc.NodePool = new cc.NodePool();

    /**
     * 获取墙节点
     * @param type 
     */
    public static getWallFromPool(type: string): cc.Node {
        let wall: cc.Node = null;
        if (type === "WallLeft") {
            if (this.WallLeftPool.size() > 0) {
                wall = this.WallLeftPool.get();
            } else {
                const Prefab: cc.Prefab = cc.loader.getRes("Prefab/WallLeft", cc.Prefab);
                wall = cc.instantiate(Prefab);
            }
        } else {
            if (this.WallRightPool.size() > 0) {
                wall = this.WallRightPool.get();
            } else {
                const Prefab: cc.Prefab = cc.loader.getRes("Prefab/WallRight", cc.Prefab);
                wall = cc.instantiate(Prefab);
            }
        }
        wall.name = type;
        return wall;
    }

    /**
     * 获取星星节点
     */
    public static getStarFromPool(): cc.Node {
        let star: cc.Node = null;
        if (this.StarPool.size() > 0) {
            star = this.StarPool.get();
        } else {
            const Prefab: cc.Prefab = cc.loader.getRes("Prefab/Star", cc.Prefab);
            star = cc.instantiate(Prefab);
        }
        return star;
    }

    /**
     * 回收墙节点
     * @param wall 
     */
    public static returnToWallPool(wall: cc.Node) {
        if (wall.name === "WallLeft") {
            this.WallLeftPool.put(wall);
        } else {
            this.WallRightPool.put(wall);
        }
    }

    /**
     * 回收星星节点
     * @param wall 
     */
    public static returnToStarPool(star: cc.Node) {
        this.StarPool.put(star);
    }
}