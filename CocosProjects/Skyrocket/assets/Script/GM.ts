// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

export default class GM {
    private static _Root: cc.Node = null;
    private static _Pages: cc.Node[] = [];

    public static set Root(root: cc.Node) {
        this._Root = root;
    }

    private static get Pages(): cc.Node[] {
        return this._Pages;
    }

    private static set Pages(pages: cc.Node[]) {
        this._Pages = pages;
    }

    /**
     * 打开一个页面
     * @param page 页面节点
     * @param overlay 是否叠加显示默认是false不叠加显示
     */
    public static OpenUI(page: cc.Node, overlay?: boolean) {
        if (overlay) {
            this._Root.addChild(page);
            this._Pages.push(page);
        } else {
            this._Pages.forEach(page => {
                page.destroy();
            });
            this._Root.addChild(page);
            this._Pages = [page];
        }
    }

    /**
     * 关闭一个页面
     * @param page 页面节点
     */
    public static CloseUI(page: cc.Node) {
        page.destroy();
        this._Pages = this.Pages.filter(p => p.name !== page.name);
    }
}
