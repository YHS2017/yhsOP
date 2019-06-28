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
var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var Main = (function (_super) {
    __extends(Main, _super);
    function Main() {
        var _this = _super.call(this) || this;
        //debug模式，使用图形绘制
        _this.isDebug = false;
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        return _this;
    }
    Main.prototype.onAddToStage = function (event) {
        //设置加载进度界面
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);
        //初始化Resource资源加载库
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");
    };
    /**
     * 配置文件加载完成,开始预加载preload资源组。
     */
    Main.prototype.onConfigComplete = function (event) {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.loadGroup("preload");
    };
    /**
     * preload资源组加载完成
     */
    Main.prototype.onResourceLoadComplete = function (event) {
        if (event.groupName == "preload") {
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            this.createGameScene();
        }
    };
    /**
     * preload资源组加载进度
     */
    Main.prototype.onResourceProgress = function (event) {
        if (event.groupName == "preload") {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    };
    /**
     * 创建游戏场景
     */
    Main.prototype.createGameScene = function () {
        //egret.Profiler.getInstance().run();
        var factor = 50;
        //创建world
        var world = new p2.World();
        p2.vec2.set(world.gravity, 0, 0);
        // world.sleepMode = p2.World.BODY_SLEEPING;
        //创建材质
        var BallMaterial = new p2.Material(1);
        var PlaneMaterial = new p2.Material(2);
        //初始化材质碰撞系数
        var gameSteelContactMaterial = new p2.ContactMaterial(BallMaterial, PlaneMaterial, { restitution: 1 });
        world.addContactMaterial(gameSteelContactMaterial);
        //创建墙壁
        var TopPlaneShape = new p2.Plane();
        TopPlaneShape.material = PlaneMaterial;
        var TopPlaneBody = new p2.Body({
            type: p2.Body.STATIC,
            position: [this.stage.stageWidth, 0],
        });
        TopPlaneBody.angle = Math.PI;
        TopPlaneBody.displays = [];
        TopPlaneBody.addShape(TopPlaneShape);
        world.addBody(TopPlaneBody);
        var BottomPlaneShape = new p2.Plane();
        BottomPlaneShape.material = PlaneMaterial;
        var BottomPlaneBody = new p2.Body({
            type: p2.Body.STATIC,
            position: [0, 0],
        });
        BottomPlaneBody.displays = [];
        BottomPlaneBody.addShape(BottomPlaneShape);
        world.addBody(BottomPlaneBody);
        // let LeftPlaneShape: p2.Plane = new p2.Plane();
        // LeftPlaneShape.material = PlaneMaterial;
        // let LeftPlaneBody = new p2.Body({
        //     type: p2.Body.STATIC,
        //     position: [0, 0],
        // });
        // LeftPlaneBody.angle = Math.PI / 2;
        // LeftPlaneBody.displays = [];
        // LeftPlaneBody.addShape(LeftPlaneShape);
        // world.addBody(LeftPlaneBody);
        // let RigthPlaneShape: p2.Plane = new p2.Plane();
        // RigthPlaneShape.material = PlaneMaterial;
        // let RigthPlaneBody = new p2.Body({
        //     type: p2.Body.STATIC,
        //     position: [this.stage.stageWidth, -this.stage.stageHeight],
        // });
        // RigthPlaneBody.angle = -Math.PI / 2;
        // RigthPlaneBody.displays = [];
        // RigthPlaneBody.addShape(RigthPlaneShape);
        // world.addBody(RigthPlaneBody);
        egret.Ticker.getInstance().register(function (dt) {
            if (dt < 10) {
                return;
            }
            if (dt > 1000) {
                return;
            }
            world.step(dt / 1000);
            var stageHeight = egret.MainContext.instance.stage.stageHeight;
            var l = world.bodies.length;
            for (var i = 0; i < l; i++) {
                var boxBody = world.bodies[i];
                var box = boxBody.displays[0];
                if (box) {
                    box.x = boxBody.position[0] * factor;
                    box.y = stageHeight - boxBody.position[1] * factor;
                    box.rotation = 360 - (boxBody.angle + boxBody.shapes[0].angle) * 180 / Math.PI;
                    if (boxBody.sleepState == p2.Body.SLEEPING) {
                        box.alpha = 0.5;
                    }
                    else {
                        box.alpha = 1;
                    }
                }
            }
        }, this);
        //鼠标点击添加刚体
        this.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, addOneBox, this);
        var self = this;
        function addOneBox(e) {
            var positionX = Math.floor(e.stageX / factor);
            var positionY = Math.floor((egret.MainContext.instance.stage.stageHeight - e.stageY) / factor);
            var display;
            //添加圆形刚体
            //var boxShape: p2.Shape = new p2.Circle(1);
            var boxShape = new p2.Circle({ radius: 1 });
            boxShape.material = BallMaterial;
            var boxBody = new p2.Body({ mass: 1, position: [positionX, positionY], velocity: [0, -5] });
            boxBody.addShape(boxShape);
            world.addBody(boxBody);
            if (self.isDebug) {
                display = self.createBall(boxShape.radius * factor);
            }
            else {
                display = self.createBitmapByName("circle");
            }
            display.width = boxShape.radius * 2 * factor;
            display.height = boxShape.radius * 2 * factor;
            display.anchorOffsetX = display.width / 2;
            display.anchorOffsetY = display.height / 2;
            boxBody.displays = [display];
            self.addChild(display);
        }
    };
    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     */
    Main.prototype.createBitmapByName = function (name) {
        var result = new egret.Bitmap();
        var texture = RES.getRes(name);
        result.texture = texture;
        return result;
    };
    /**
     * 创建一个圆形
     */
    Main.prototype.createBall = function (r) {
        var shape = new egret.Shape();
        shape.graphics.beginFill(0xfff000);
        shape.graphics.drawCircle(r, r, r);
        shape.graphics.endFill();
        return shape;
    };
    /**
     * 创建一个方形
     */
    Main.prototype.createBox = function (width, height) {
        var shape = new egret.Shape();
        shape.graphics.beginFill(0xfff000);
        shape.graphics.drawRect(0, 0, width, height);
        shape.graphics.endFill();
        return shape;
    };
    return Main;
}(egret.DisplayObjectContainer));
__reflect(Main.prototype, "Main");
//# sourceMappingURL=Main.js.map