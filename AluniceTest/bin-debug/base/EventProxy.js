var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var EventProxy = (function () {
    function EventProxy(eventDispatcher, listenerObj) {
        this.eventDispatcher_ = eventDispatcher;
        this.listnerObj_ = listenerObj;
        this.handles_ = new Array();
    }
    EventProxy.prototype.addEventListener = function (eventName, listener, listenerObj) {
        this.eventDispatcher_.addEventListener(eventName, listener, listenerObj || this.listnerObj_);
        var handle = this.handles_.length;
        this.handles_[handle] = [eventName, listener, listenerObj || this.listnerObj_];
        return handle;
    };
    EventProxy.prototype.removeEventListenerByName = function (eventName) {
        for (var i = 0; i < this.handles_.length; i++) {
            var pair = this.handles_[i];
            if (pair && pair[0] == eventName) {
                this.eventDispatcher_.removeEventListener(pair[0], pair[1], pair[2]);
                this.handles_[i] = null;
                break;
            }
        }
    };
    EventProxy.prototype.removeEventListener = function (eventHandle) {
        var pair = this.handles_[eventHandle];
        if (pair) {
            this.eventDispatcher_.removeEventListener(pair[0], pair[1], pair[2]);
            this.handles_[eventHandle] = null;
        }
    };
    EventProxy.prototype.removeAllEventListenerByName = function (eventName) {
        for (var i = 0; i < this.handles_.length; i++) {
            var pair = this.handles_[i];
            if (pair && pair[0] == eventName) {
                this.eventDispatcher_.removeEventListener(pair[0], pair[1], pair[2]);
                this.handles_[i] = null;
            }
        }
    };
    EventProxy.prototype.removeAllEventListener = function () {
        for (var i = 0; i < this.handles_.length; i++) {
            var pair = this.handles_[i];
            if (pair) {
                this.eventDispatcher_.removeEventListener(pair[0], pair[1], pair[2]);
                this.handles_[i] = null;
            }
        }
        this.handles_ = new Array();
    };
    EventProxy.prototype.getEventHandle = function (eventName) {
        for (var i = 0; i < this.handles_.length; i++) {
            var pair = this.handles_[i];
            if (pair && pair[0] == eventName) {
                return i;
            }
        }
        return -1;
    };
    return EventProxy;
}());
__reflect(EventProxy.prototype, "EventProxy");
//# sourceMappingURL=EventProxy.js.map