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
var MainWindow = (function (_super) {
    __extends(MainWindow, _super);
    function MainWindow(name, params) {
        var _this = _super.call(this, name, params) || this;
        _this.windowManager = Alun.WindowManager.get();
        _this.displayManager = Alun.DisplayManager.get();
        _this.selfPlayer_ = SelfPlayer.get();
        _this.isMoving = false;
        _this.startMoving = false;
        _this.MAX_X_OFFSET = 105;
        _this.MIN_X_OFFSET = -455;
        _this.DEFAULT_X_OFFSET = 105;
        _this.last_x = 0;
        _this.last_bg = 0;
        _this.groundItems_ = [];
        _this._layer = 1;
        _this._zorder = 1;
        _this.skinName = "MainSkin";
        _this.farmGroup_.x = _this.DEFAULT_X_OFFSET;
        return _this;
    }
    ;
    MainWindow.prototype.initWindow = function () {
        _super.prototype.initWindow.call(this);
        this.initLayout();
    };
    MainWindow.prototype.initLayout = function () {
        this.initTouchMap();
        // this.addEventListener(egret.TouchEvent.TOUCH_TAP,this.testTimer,this);
    };
    MainWindow.prototype.onTouch = function (event) {
        if (event.type == egret.TouchEvent.TOUCH_BEGIN) {
            this.touchLayer_.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouch, this);
            this.touchLayer_.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouch, this);
            this.startMoving = true;
            this.last_x = event.localX;
            this.last_bg = this.farmGroup_.x;
        }
        else if (event.type == egret.TouchEvent.TOUCH_MOVE) {
            var now_x = event.localX;
            var offset_x = now_x - this.last_x;
            if (this.last_bg + offset_x >= this.MAX_X_OFFSET) {
                this.farmGroup_.x = this.MAX_X_OFFSET;
                this.last_bg = this.farmGroup_.x;
                this.last_x = now_x;
            }
            else if (this.last_bg + offset_x <= this.MIN_X_OFFSET) {
                this.farmGroup_.x = this.MIN_X_OFFSET;
                this.last_x = now_x;
                this.last_bg = this.farmGroup_.x;
            }
            else {
                this.farmGroup_.x = this.last_bg + offset_x;
            }
            //console.log("now_x,offset_x,last_x,last_bg",now_x,offset_x,this.last_x,this.last_bg)
        }
        else if (event.type == egret.TouchEvent.TOUCH_END) {
            this.touchLayer_.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouch, this);
            this.touchLayer_.removeEventListener(egret.TouchEvent.TOUCH_END, this.onTouch, this);
            this.inMoving(event.localX - this.last_x);
        }
    };
    MainWindow.prototype.inMoving = function (offset_x) {
        var duration = 0.5;
        var firstPosX = this.farmGroup_.x + offset_x / 3;
        var nextPosX = this.farmGroup_.x + offset_x / 2;
        firstPosX = Math.max(firstPosX, this.MIN_X_OFFSET);
        firstPosX = Math.min(firstPosX, this.MAX_X_OFFSET);
        nextPosX = Math.max(nextPosX, this.MIN_X_OFFSET);
        nextPosX = Math.min(nextPosX, this.MAX_X_OFFSET);
        egret.Tween.get(this.farmGroup_).to({ x: firstPosX }, 200, egret.Ease.sineIn);
        egret.setTimeout(function () {
            egret.Tween.get(this.farmGroup_).to({ x: nextPosX }, 300, egret.Ease.sineIn);
        }, this, 200);
    };
    MainWindow.prototype.initTouchMap = function () {
        this.touchLayer_.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouch, this);
        var t_img = new eui.Image();
        t_img.texture;
        for (var i = 0; i < 15; i++) {
            var ground_item = new GroundItem({ id: i });
            var pos_index = i + 1;
            var item_pos = this['g_' + pos_index];
            this.goundGroup.addChild(ground_item);
            ground_item.x = item_pos.x;
            ground_item.y = item_pos.y;
            item_pos.visible = false;
            this.groundItems_.push(ground_item);
            ground_item.startPlantCountDown();
        }
        FarmModel.get().setGroundItem(this.groundItems_);
    };
    MainWindow.prototype.refreshGroundItems = function (forceRefresh, groundIdx) {
        if (forceRefresh === void 0) { forceRefresh = false; }
        if (groundIdx) {
            this.groundItems_[groundIdx].refreshResource(forceRefresh);
        }
        else {
            for (var i = 0; i < this.groundItems_.length; i++) {
                var ground_item = this.groundItems_[i];
                ground_item.refreshResource(forceRefresh);
            }
        }
    };
    MainWindow.prototype.updateGroundItemLabel = function (groundIdx) {
        if (groundIdx) {
            this.groundItems_[groundIdx].refreshLabel();
        }
        else {
            for (var i = 0; i < this.groundItems_.length; i++) {
                var ground_item = this.groundItems_[i];
                ground_item.refreshLabel();
            }
        }
    };
    return MainWindow;
}(BaseWindow));
__reflect(MainWindow.prototype, "MainWindow");
//# sourceMappingURL=MainWindow.js.map