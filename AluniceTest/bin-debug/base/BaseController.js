var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var BaseController = (function () {
    function BaseController() {
        this.eventProxy_ = new EventProxy(Alun.EventDispatcher.get(), this);
    }
    BaseController.prototype.onRegister = function () {
    };
    BaseController.prototype.registerEvent = function (eventName, callback, listener) {
        this.eventProxy_.addEventListener(eventName, callback, listener);
    };
    BaseController.prototype.reset = function () {
        this.eventProxy_.removeAllEventListener();
    };
    return BaseController;
}());
__reflect(BaseController.prototype, "BaseController");
//# sourceMappingURL=BaseController.js.map