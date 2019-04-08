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
var Alun;
(function (Alun) {
    var WindowManager = (function (_super) {
        __extends(WindowManager, _super);
        function WindowManager() {
            var _this = _super.call(this) || this;
            _this.loadingWindows_ = {};
            _this.windowContexts_ = [];
            _this.windowContexts_ = [];
            return _this;
        }
        WindowManager.get = function () {
            if (WindowManager.INSTANCE == null) {
                WindowManager.INSTANCE = new WindowManager();
            }
            return WindowManager.INSTANCE;
        };
        WindowManager.reset = function () {
            if (!WindowManager.INSTANCE) {
                return;
            }
            WindowManager.INSTANCE = null;
        };
        WindowManager.prototype.openWindow = function (name, params, callback) {
            if (params === void 0) { params = {}; }
            if (callback === void 0) { callback = null; }
            console.log("openWindow " + name);
            var complete = function (win) {
                if (callback != null) {
                    callback(win);
                }
            }.bind(this);
            if (name == null) {
                return complete();
            }
            if (this.loadingWindows_[name])
                return;
            var windowContext = this.windowContexts_[name];
            var win = null;
            // openwindow by name
            if (windowContext == null) {
                var windowClass = name;
                if (window[windowClass]) {
                    win = new window[windowClass](name, params);
                }
            }
            else {
                win = windowContext;
            }
            if (win == null) {
                return complete();
            }
            if (windowContext == null) {
                this.loadingWindows_[win.name] = win;
                win.loadAsset(null, function (win) {
                    this.onWindowLoaded(win, params, complete);
                }.bind(this));
            }
            return win;
        };
        WindowManager.prototype.onWindowLoaded = function (win, params, complete) {
            if (win == null) {
                return complete();
            }
            this.loadingWindows_[win.name] = null;
            this.addWindow(win, params, complete);
        };
        WindowManager.prototype.addWindow = function (win, params, complete) {
            if (win == null) {
                return complete();
            }
            var windowContext = this.windowContexts_[win.name];
            if (windowContext == null || windowContext != win) {
                windowContext = win;
            }
            this.windowContexts_[win.name] = win;
            params = params ? params : {};
            win.willOpen(params);
            win.addToUILayer();
            complete(win);
        };
        WindowManager.prototype.closeWindow = function (windowIdenfier, callback, params) {
            if (callback === void 0) { callback = null; }
            if (params === void 0) { params = null; }
            console.log("closeWindow ", windowIdenfier);
            var complete = function (win) {
                if (callback != null) {
                    callback(win);
                }
            }.bind(this);
            if (windowIdenfier == null) {
                return complete(null);
            }
            var name = null;
            if (typeof (windowIdenfier) == "string") {
                name = windowIdenfier;
            }
            else {
                name = windowIdenfier.name;
            }
            this.cancelLoadingWindow(name);
            var windowContext = this.windowContexts_[name];
            if (windowContext == null) {
                return complete(null);
            }
            this.removeWindow(windowContext, complete, params);
        };
        WindowManager.prototype.cancelLoadingWindow = function (name) {
            var win = this.loadingWindows_[name];
            if (!win) {
                return;
            }
            this.loadingWindows_[name] = null;
        };
        WindowManager.prototype.removeWindow = function (win, callback, params) {
            if (callback === void 0) { callback = null; }
            if (params === void 0) { params = null; }
            var complete = function (win) {
                if (callback != null) {
                    callback(win);
                }
            };
            if (win == null) {
                return complete(null);
            }
            params = params ? params : {};
            win.willClose(params);
            var windowContext = this.windowContexts_[win.name];
            if (windowContext != null && windowContext != win) {
                return complete(null);
            }
            this.windowContexts_[win.name] = null;
            win.dispose(params);
            complete(win);
        };
        WindowManager.prototype.getWindow = function (name) {
            return this.windowContexts_[name];
        };
        WindowManager.MANUAL_WIDTH = 1000;
        WindowManager.MANUAL_HEIGHT = 1920;
        WindowManager.INSTANCE = null;
        return WindowManager;
    }(BaseClass));
    Alun.WindowManager = WindowManager;
    __reflect(WindowManager.prototype, "Alun.WindowManager");
})(Alun || (Alun = {}));
//# sourceMappingURL=WindowManager.js.map