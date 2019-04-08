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
    var EventDispatcher = (function (_super) {
        __extends(EventDispatcher, _super);
        function EventDispatcher(target) {
            if (target === void 0) { target = null; }
            return _super.call(this) || this;
        }
        EventDispatcher.get = function () {
            if (EventDispatcher.INSTANCE == null) {
                EventDispatcher.INSTANCE = new EventDispatcher();
            }
            return EventDispatcher.INSTANCE;
        };
        EventDispatcher.INSTANCE = null;
        return EventDispatcher;
    }(egret.EventDispatcher));
    Alun.EventDispatcher = EventDispatcher;
    __reflect(EventDispatcher.prototype, "Alun.EventDispatcher");
})(Alun || (Alun = {}));
//# sourceMappingURL=EventDispatcher.js.map