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
    var MainController = (function (_super) {
        __extends(MainController, _super);
        function MainController() {
            var _this = _super.call(this) || this;
            _this.eventDispatcher_ = Alun.EventDispatcher.get();
            _this.onRegister();
            return _this;
        }
        MainController.get = function () {
            if (MainController.INSTANCE == null) {
                MainController.INSTANCE = new MainController();
            }
            return MainController.INSTANCE;
        };
        MainController.reset = function () {
            if (!MainController.INSTANCE) {
                return;
            }
            MainController.INSTANCE = null;
        };
        MainController.prototype.onRegister = function () {
            this.registerEvent(Alun.event.LOGIN_GAME, this.onGameStart, this);
            this.registerEvent(Alun.event.LOGIN_INFO, this.onLoginInfo_, this);
        };
        MainController.prototype.onGameStart = function (event) {
            var params = event.data;
            var login_status = params.login_status;
            if (login_status == Alun.LOGIN_STATUS.SUCCESS) {
                console.log("login SUCCESS", params);
                var player_info = params.player_info;
                var eventObj = new egret.Event(Alun.event.PLAYER_INFO, false, false, player_info);
                this.eventDispatcher_.dispatchEvent(eventObj);
                var t_params = {
                    player_id: player_info.playerID,
                };
                Alun.Backend.get().request(Alun.mid.GET_LOGIN_INFO, t_params);
            }
            else {
                if (login_status == Alun.LOGIN_STATUS.USER_NOT_EXIST) {
                    console.log("user not exsit and register failure,error type", login_status);
                }
            }
        };
        MainController.prototype.onLoginInfo_ = function (event) {
            var params = event.data;
            var loginInfos = params.loginInfos;
            var farmInfos = loginInfos.farmInfos;
            if (farmInfos) {
                var eventFarm = new egret.Event(Alun.event.FARM_INFO, false, false, farmInfos);
                this.eventDispatcher_.dispatchEvent(eventFarm);
            }
            var backpackInfos = loginInfos.backpackInfos;
            if (backpackInfos) {
                var eventBackPack = new egret.Event(Alun.event.BACKPACK_INFO, false, false, backpackInfos);
                this.eventDispatcher_.dispatchEvent(eventBackPack);
            }
            Alun.WindowManager.get().openWindow("MainWindow", params);
            Alun.WindowManager.get().closeWindow("LoginWindow");
        };
        MainController.prototype.loginGame = function (params) {
            Alun.Backend.get().request(Alun.mid.LOGIN_GAME, params);
        };
        MainController.prototype.saveGameInfo = function () {
        };
        MainController.INSTANCE = null;
        return MainController;
    }(BaseController));
    Alun.MainController = MainController;
    __reflect(MainController.prototype, "Alun.MainController");
})(Alun || (Alun = {}));
//# sourceMappingURL=MainController.js.map