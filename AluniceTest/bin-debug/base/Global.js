var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var Alun;
(function (Alun) {
    var Global = (function () {
        function Global() {
        }
        Global.UNIT_TIME_FACTOR = 1;
        Global.MAX_FARM_NUM = 15;
        Global.DEFAULT_HEALTHY_VALUE = 100;
        Global.PLANT_IDS = {
            strawberryID: 10001,
            cornID: 10002,
            whiteRadishID: 10003,
            redRadishID: 10004,
            potatoID: 10005,
        };
        return Global;
    }());
    Alun.Global = Global;
    __reflect(Global.prototype, "Alun.Global");
})(Alun || (Alun = {}));
//# sourceMappingURL=Global.js.map