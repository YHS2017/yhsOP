//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

class Main extends egret.DisplayObjectContainer {

    /**
     * 加载进度界面
     */
    private loadingView: LoadingUI;

    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(event: egret.Event) {
        //设置加载进度界面
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);

        //初始化Resource资源加载库
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");
    }
    /**
     * 配置文件加载完成,开始预加载preload资源组。
     */
    private onConfigComplete(event: RES.ResourceEvent): void {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.loadGroup("preload");
    }
    /**
     * preload资源组加载完成
     */
    private onResourceLoadComplete(event: RES.ResourceEvent): void {
        if (event.groupName == "preload") {
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            this.createGameScene();
        }
    }
    /**
     * preload资源组加载进度
     */
    private onResourceProgress(event: RES.ResourceEvent): void {
        if (event.groupName == "preload") {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    }
    //debug模式，使用图形绘制
    private isDebug: boolean = false;

    /**
     * 创建游戏场景
     */
    private createGameScene(): void {
        //egret.Profiler.getInstance().run();
        var factor: number = 50;

        //创建world
        var world: p2.World = new p2.World();
        world.gravity = [0, 0];
        // world.sleepMode = p2.World.NO_SLEEPING;

        //创建材质
        var BallMaterial: p2.Material = new p2.Material(1);
        var PlaneMaterial: p2.Material = new p2.Material(2);

        //初始化材质碰撞系数
        var ballplanelContactMaterial: p2.ContactMaterial = new p2.ContactMaterial(BallMaterial, PlaneMaterial, <p2.ContactMaterialOptions>{ friction: 0, restitution: 1 });
        var ballsContactMaterial: p2.ContactMaterial = new p2.ContactMaterial(BallMaterial, BallMaterial, <p2.ContactMaterialOptions>{ friction: 0, restitution: 1 });
        world.addContactMaterial(ballplanelContactMaterial);
        world.addContactMaterial(ballsContactMaterial);

        //创建墙壁
        let TopPlaneShape: p2.Plane = new p2.Plane();
        TopPlaneShape.material = PlaneMaterial;
        let TopPlaneBody = new p2.Body({
            type: p2.Body.STATIC,
            position: [egret.MainContext.instance.stage.stageWidth / factor, egret.MainContext.instance.stage.stageHeight / factor],
        });
        TopPlaneBody.angle = Math.PI;
        TopPlaneBody.displays = [];
        TopPlaneBody.addShape(TopPlaneShape);
        world.addBody(TopPlaneBody);

        let BottomPlaneShape: p2.Plane = new p2.Plane();
        BottomPlaneShape.material = PlaneMaterial;
        let BottomPlaneBody = new p2.Body({
            type: p2.Body.STATIC,
            position: [0, 0],
        });
        BottomPlaneBody.displays = [];
        BottomPlaneBody.addShape(BottomPlaneShape);
        world.addBody(BottomPlaneBody);

        let LeftPlaneShape: p2.Plane = new p2.Plane();
        LeftPlaneShape.material = PlaneMaterial;
        let LeftPlaneBody = new p2.Body({
            type: p2.Body.STATIC,
            position: [0, egret.MainContext.instance.stage.stageHeight / factor],
        });
        LeftPlaneBody.angle = -Math.PI / 2;
        LeftPlaneBody.displays = [];
        LeftPlaneBody.addShape(LeftPlaneShape);
        world.addBody(LeftPlaneBody);

        let RigthPlaneShape: p2.Plane = new p2.Plane();
        RigthPlaneShape.material = PlaneMaterial;
        let RigthPlaneBody = new p2.Body({
            type: p2.Body.STATIC,
            position: [egret.MainContext.instance.stage.stageWidth / factor, 0],
        });
        RigthPlaneBody.angle = Math.PI / 2;
        RigthPlaneBody.displays = [];
        RigthPlaneBody.addShape(RigthPlaneShape);
        world.addBody(RigthPlaneBody);

        egret.Ticker.getInstance().register(function (dt) {
            if (dt < 10) {
                return;
            }
            if (dt > 1000) {
                return;
            }
            world.step(dt / 1000);

            var stageHeight: number = egret.MainContext.instance.stage.stageHeight;
            var l = world.bodies.length;
            for (var i: number = 0; i < l; i++) {
                var boxBody: p2.Body = world.bodies[i];
                var box: egret.DisplayObject = boxBody.displays[0];
                if (box) {
                    box.x = boxBody.position[0] * factor;
                    box.y = stageHeight - boxBody.position[1] * factor;
                }
            }
        }, this);

        //鼠标点击添加刚体
        this.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, addOneBox, this);
        var self = this;

        function addOneBox(e: egret.TouchEvent): void {
            var positionX: number = Math.floor(e.stageX / factor);
            var positionY: number = Math.floor((egret.MainContext.instance.stage.stageHeight - e.stageY) / factor);
            var display: egret.DisplayObject;

            //添加圆形刚体
            //var boxShape: p2.Shape = new p2.Circle(1);
            var boxShape: p2.Shape = new p2.Circle({ radius: 0.5 });
            boxShape.material = BallMaterial;
            var boxBody: p2.Body = new p2.Body({ mass: 1, damping: 0, fixedRotation: true, position: [positionX, positionY], velocity: [-10, -10] });
            boxBody.addShape(boxShape);
            world.addBody(boxBody);

            if (self.isDebug) {
                display = self.createBall((<p2.Circle>boxShape).radius * factor);
            } else {
                display = self.createBitmapByName("circle");
            }

            display.width = (<p2.Circle>boxShape).radius * 2 * factor;
            display.height = (<p2.Circle>boxShape).radius * 2 * factor;

            display.anchorOffsetX = display.width / 2;
            display.anchorOffsetY = display.height / 2;

            boxBody.displays = [display];
            self.addChild(display);
        }
    }

    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     */
    private createBitmapByName(name: string): egret.Bitmap {
        var result: egret.Bitmap = new egret.Bitmap();
        var texture: egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }
    /**
     * 创建一个圆形
     */
    private createBall(r: number): egret.Shape {
        var shape = new egret.Shape();
        shape.graphics.beginFill(0xfff000);
        shape.graphics.drawCircle(r, r, r);
        shape.graphics.endFill();
        return shape;
    }
    /**
     * 创建一个方形
     */
    private createBox(width: number, height: number): egret.Shape {
        var shape = new egret.Shape();
        shape.graphics.beginFill(0xfff000);
        shape.graphics.drawRect(0, 0, width, height);
        shape.graphics.endFill();
        return shape;
    }
}
