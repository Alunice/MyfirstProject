var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var BaseClass = (function () {
    function BaseClass() {
    }
    BaseClass.getInstance = function () {
        var Class = this;
        if (!Class._instance) {
            Class._instance = new Class();
        }
        return Class._instance;
    };
    return BaseClass;
}());
__reflect(BaseClass.prototype, "BaseClass");
//# sourceMappingURL=BaseClass.js.map