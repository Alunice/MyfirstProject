var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var Alun;
(function (Alun) {
    var Backend = (function () {
        function Backend() {
            this.eventDispatcher_ = Alun.EventDispatcher.get();
            this.setupMid2EventNameMappings_();
            this.register();
        }
        Backend.get = function () {
            if (Backend.INSTANCE == null) {
                Backend.INSTANCE = new Backend();
            }
            return Backend.INSTANCE;
        };
        Backend.reset = function () {
            if (!Backend.INSTANCE) {
                return;
            }
            Backend.INSTANCE = null;
        };
        Backend.prototype.setupMid2EventNameMappings_ = function () {
            this.mid2EventNames_ = (_a = {},
                _a[Alun.mid.LOGIN_GAME] = Alun.event.LOGIN_GAME,
                _a[Alun.mid.SIGN_UP] = Alun.event.SIGN_UP,
                _a[Alun.mid.GET_LOGIN_INFO] = Alun.event.LOGIN_INFO,
                _a[Alun.mid.PLANT_IN_GROUND] = Alun.event.PLANT_IN_GROUND,
                _a[Alun.mid.REMOVE_PLANT_IN_GROUND] = Alun.event.REMOVE_PLANT,
                _a[Alun.mid.SAVE_GROUND_INFO] = Alun.event.SAVE_GROUND_INFO,
                _a[Alun.mid.SAVE_PLAYER_INFO] = Alun.event.SAVE_PLAYER_INFO,
                _a);
            var _a;
        };
        Backend.prototype.register = function () {
            this.eventDispatcher_.addEventListener(Alun.event.RECIVE_MESSAGE, function (msg) {
                console.log("recive the message form server");
                console.log(msg);
                this.onSockertMessage_(msg);
            }, this);
        };
        Backend.prototype.request = function (mid, params) {
            var eventObj = new egret.Event(Alun.event.SEND_MESSAGE);
            this.eventDispatcher_.dispatchEvent(eventObj);
            console.log("send message", mid, params);
            this.responseRequestLocally(mid, params);
        };
        Backend.prototype.responseRequestLocally = function (mid, params) {
            if (mid == Alun.mid.LOGIN_GAME) {
                this.onLoginGame(params);
            }
            else if (mid == Alun.mid.SIGN_UP) {
            }
            else if (mid == Alun.mid.GET_LOGIN_INFO) {
                this.onRequestLoginInfo(params);
            }
            else if (mid == Alun.mid.PLANT_IN_GROUND) {
                this.onPlantInGround(params);
            }
            else if (mid == Alun.mid.REMOVE_PLANT_IN_GROUND) {
                this.onRemovePlant(params);
            }
            else if (mid == Alun.mid.SAVE_GROUND_INFO) {
                this.onSaveFarmInfo(params);
            }
            else if (mid == Alun.mid.SAVE_PLAYER_INFO) {
                this.onSavePlayerInfo(params);
            }
        };
        Backend.prototype.onLoginGame = function (params) {
            var uid = params.uid;
            if (!uid)
                return;
            var res_info = Alun.db.playerdb.getPlayerInfoByUID(uid);
            var msg = {};
            if (res_info) {
                msg = {
                    mid: Alun.mid.LOGIN_GAME,
                    login_status: Alun.LOGIN_STATUS.SUCCESS,
                    player_info: res_info,
                };
                console.log("get the infos", res_info);
            }
            else {
                this.registerNewPlayer(uid);
                res_info = Alun.db.playerdb.getPlayerInfoByUID(uid);
                console.log("register the new infos", res_info);
                msg = {
                    mid: Alun.mid.LOGIN_GAME,
                    login_status: res_info ? Alun.LOGIN_STATUS.SUCCESS : Alun.LOGIN_STATUS.USER_NOT_EXIST,
                    player_info: res_info,
                };
            }
            var eventObj = new egret.Event(Alun.event.RECIVE_MESSAGE, false, false, msg);
            this.eventDispatcher_.dispatchEvent(eventObj);
        };
        Backend.prototype.registerNewPlayer = function (uid) {
            Alun.db.gamedb.initGameDbByUID(uid);
            var player_id = Alun.db.playerdb.initPlayerDbByUID(uid);
            Alun.db.farmdb.initFarmDbByPlayerID(player_id);
            Alun.db.backpackdb.initBackPackDbByPlayerID(player_id);
        };
        Backend.prototype.onRequestLoginInfo = function (params) {
            var player_id = params.player_id;
            var LoginInfos = {
                farmInfos: null,
                backpackInfos: null,
            };
            var farmInfos = Alun.db.farmdb.getFarmInfos(player_id);
            LoginInfos.farmInfos = farmInfos;
            var backpackInfos = Alun.db.backpackdb.getBackPackInfos(player_id);
            LoginInfos.backpackInfos = backpackInfos;
            var msg = {
                mid: Alun.mid.GET_LOGIN_INFO,
                loginInfos: LoginInfos,
            };
            var eventObj = new egret.Event(Alun.event.RECIVE_MESSAGE, false, false, msg);
            this.eventDispatcher_.dispatchEvent(eventObj);
        };
        Backend.prototype.onPlantInGround = function (params) {
            var player_id = params.player_id;
            var plantID = params.plantID;
            var groundIdx = params.groundIdx;
            var farmInfos = Alun.db.farmdb.getFarmInfos(player_id);
            if (!farmInfos.farmInfo[groundIdx].plantInfo_) {
                var plManager = Alun.PlantManager.get();
                var plantInfos = {
                    plantID: plantID,
                    leftTime: plManager.getPlantUnitTime(plantID) * plManager.getPlantStageCount(plantID),
                    healthyValue: Alun.Global.DEFAULT_HEALTHY_VALUE,
                };
                farmInfos.farmInfo[groundIdx].plantInfo_ = plantInfos;
                Alun.db.farmdb.setFarmInfos(farmInfos);
                var msg = {
                    mid: Alun.mid.PLANT_IN_GROUND,
                    plantGroundInfo: {
                        groundIdx: groundIdx,
                        plantInfo_: plantInfos,
                    }
                };
                var eventObj = new egret.Event(Alun.event.RECIVE_MESSAGE, false, false, msg);
                this.eventDispatcher_.dispatchEvent(eventObj);
            }
        };
        Backend.prototype.onRemovePlant = function (params) {
            var player_id = params.player_id;
            var plantID = params.plantID;
            var groundIdx = params.groundIdx;
            var farmInfos = Alun.db.farmdb.getFarmInfos(player_id);
            if (farmInfos.farmInfo[groundIdx].plantInfo_) {
                farmInfos.farmInfo[groundIdx].plantInfo_ = null;
                Alun.db.farmdb.setFarmInfos(farmInfos);
                var msg = {
                    mid: Alun.mid.PLANT_IN_GROUND,
                    plantGroundInfo: {
                        groundIdx: groundIdx,
                        plantInfo_: null,
                    }
                };
                var eventObj = new egret.Event(Alun.event.RECIVE_MESSAGE, false, false, msg);
                this.eventDispatcher_.dispatchEvent(eventObj);
            }
        };
        Backend.prototype.onSaveFarmInfo = function (farmInfos) {
            Alun.db.farmdb.setFarmInfos(farmInfos);
            var msg = {
                mid: Alun.mid.SAVE_GROUND_INFO,
            };
            var eventObj = new egret.Event(Alun.event.RECIVE_MESSAGE, false, false, msg);
            this.eventDispatcher_.dispatchEvent(eventObj);
        };
        Backend.prototype.onSavePlayerInfo = function (playerInfos) {
            Alun.db.playerdb.setPlayerInfo(playerInfos);
            var msg = {
                mid: Alun.mid.SAVE_PLAYER_INFO,
            };
            var eventObj = new egret.Event(Alun.event.RECIVE_MESSAGE, false, false, msg);
            this.eventDispatcher_.dispatchEvent(eventObj);
        };
        Backend.prototype.onSockertMessage_ = function (msg) {
            var body = msg.data;
            var mid = body.mid;
            var eventObj = new egret.Event(this.mid2EventNames_[mid] || mid + "", false, false, body);
            console.log("msg2event in Backend", eventObj);
            this.eventDispatcher_.dispatchEvent(eventObj);
        };
        Backend.INSTANCE = null;
        return Backend;
    }());
    Alun.Backend = Backend;
    __reflect(Backend.prototype, "Alun.Backend");
})(Alun || (Alun = {}));
//# sourceMappingURL=Backend.js.map