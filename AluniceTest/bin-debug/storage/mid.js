var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var Alun;
(function (Alun) {
    var mid = (function () {
        function mid() {
        }
        mid.LOGIN_GAME = 0x0001;
        mid.SIGN_UP = 0x0002;
        mid.GET_LOGIN_INFO = 0x0003;
        mid.GET_BACKPACK_INFO = 0x0004;
        mid.PLANT_IN_GROUND = 0x1001;
        mid.REMOVE_PLANT_IN_GROUND = 0x1002;
        mid.SAVE_GAME_INFO = 0x2001;
        mid.SAVE_GROUND_INFO = 0x2002;
        mid.SAVE_PLAYER_INFO = 0x2003;
        mid.SAVE_BACKPACK_INFO = 0x2004;
        return mid;
    }());
    Alun.mid = mid;
    __reflect(mid.prototype, "Alun.mid");
})(Alun || (Alun = {}));
//# sourceMappingURL=mid.js.map