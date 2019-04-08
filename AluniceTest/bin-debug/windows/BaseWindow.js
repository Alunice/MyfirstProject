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
var BaseWindow = (function (_super) {
    __extends(BaseWindow, _super);
    function BaseWindow(name, params) {
        var _this = _super.call(this) || this;
        _this.name = "";
        _this.closeFunc = null;
        _this._layer = 0;
        _this._zorder = 0;
        _this.timeoutIDs = [];
        _this.name = name;
        _this.params = params || null;
        _this._isInit = false;
        return _this;
    }
    Object.defineProperty(BaseWindow.prototype, "myParent", {
        get: function () {
            return this._myParent;
        },
        enumerable: true,
        configurable: true
    });
    BaseWindow.prototype.isInit = function () {
        return this._isInit;
    };
    BaseWindow.prototype.isShow = function () {
        return this.stage != null && this.visible;
    };
    BaseWindow.prototype.removeFromParent = function () {
        if (this.parent == null) {
            return;
        }
        this.parent.removeChild(this);
    };
    BaseWindow.prototype.setVisible = function (value) {
        this.visible = value;
    };
    BaseWindow.prototype.loadAsset = function (loadCompelet, initComplete) {
        if (loadCompelet === void 0) { loadCompelet = null; }
        if (initComplete === void 0) { initComplete = null; }
        if (loadCompelet) {
            loadCompelet(this);
        }
        if (initComplete) {
            initComplete(this);
        }
    };
    BaseWindow.prototype.initWindow = function () {
        this._isInit = true;
    };
    BaseWindow.prototype.willOpen = function (params) {
    };
    BaseWindow.prototype.didOpen = function (params) {
    };
    BaseWindow.prototype.willClose = function (params) {
        for (var i = 0; i < this.timeoutIDs.length; i++) {
            var id = this.timeoutIDs[i];
            if (id) {
                egret.clearTimeout(id);
            }
        }
        this.timeoutIDs = [];
    };
    BaseWindow.prototype.didClose = function (params) {
    };
    BaseWindow.prototype.addToUILayer = function () {
        var layer = Alun.DisplayManager.get().getUIStageByLayer(this._layer);
        this._myParent = layer;
        this._myParent.addChildAt(this, this._zorder);
        this.visible = false;
        this.initWindow();
        this.didOpen(this.params);
        this.visible = true;
    };
    BaseWindow.prototype.dispose = function (params) {
        this.didClose(params);
        this.removeFromParent();
        this._myParent = null;
    };
    BaseWindow.prototype.setTimeout = function (listener, thisOBJ, delay) {
        var args = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            args[_i - 3] = arguments[_i];
        }
        var tid = egret.setTimeout(function (args) {
            listener(args);
        }, thisOBJ, delay);
        this.timeoutIDs.push(tid);
        return tid;
    };
    return BaseWindow;
}(eui.Component));
__reflect(BaseWindow.prototype, "BaseWindow");
//# sourceMappingURL=BaseWindow.js.map