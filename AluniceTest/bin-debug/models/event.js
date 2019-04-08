var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var Alun;
(function (Alun) {
    var event = (function () {
        function event() {
        }
        event.LOGIN_GAME = "__event_login_game__";
        event.LOGIN_FAILURE = "__event_login_failure__";
        event.SIGN_UP = "__event_sing_up__";
        event.LOGIN_INFO = "__event_login_info__";
        event.RECIVE_MESSAGE = "__event_recive_message__";
        event.SEND_MESSAGE = "__event_send_message__";
        event.PLAYER_INFO = "__event_player_info__";
        event.ECNOMIC_CHANGE = "__ecnomic_change__";
        event.BACKPACK_INFO = "__backpack_info__";
        event.FARM_INFO = "__farm_info__";
        event.ITEM_CHANGE = "__item_change__";
        event.PLANT_IN_GROUND = "__plant_in_ground__";
        event.REMOVE_PLANT = "__remove_plant__";
        event.SAVE_PLAYER_INFO = "__save_player_info__";
        event.SAVE_GROUND_INFO = "__save_ground_info__";
        event.SAVE_BACKPACK_INFO = "__save_backpack_info__";
        event.SAVE_GAME_INFO = "__save_game_info__";
        return event;
    }());
    Alun.event = event;
    __reflect(event.prototype, "Alun.event");
})(Alun || (Alun = {}));
//# sourceMappingURL=event.js.map