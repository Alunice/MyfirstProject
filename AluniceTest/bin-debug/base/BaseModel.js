var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var BaseModel = (function () {
    function BaseModel() {
        this.events = [];
        this.callbacks = [];
        this.instances = [];
    }
    BaseModel.prototype.onRegister = function () {
    };
    BaseModel.prototype.registerEvent = function (eventName, callback, thisObject) {
        Alun.EventDispatcher.get().addEventListener(eventName, callback, thisObject);
        this.events.push(eventName);
        this.callbacks.push(callback);
        this.instances.push(thisObject);
    };
    BaseModel.prototype.removeEvents = function () {
        var max = this.events.length;
        for (var i = 0; i < max; i++) {
            Alun.EventDispatcher.get().removeEventListener(this.events[i], this.callbacks[i], this.instances[i]);
        }
    };
    return BaseModel;
}());
__reflect(BaseModel.prototype, "BaseModel");
//# sourceMappingURL=BaseModel.js.map