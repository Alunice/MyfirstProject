var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var Alun;
(function (Alun) {
    var db = (function () {
        function db() {
        }
        Object.defineProperty(db, "gamedb", {
            get: function () {
                if (db.GAME_DB == null) {
                    db.GAME_DB = new GameDb();
                }
                return db.GAME_DB;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(db, "playerdb", {
            get: function () {
                if (db.PLAYER_DB == null) {
                    db.PLAYER_DB = new PlayerDb();
                }
                return db.PLAYER_DB;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(db, "farmdb", {
            get: function () {
                if (db.FARM_DB == null) {
                    db.FARM_DB = new FarmDb();
                }
                return db.FARM_DB;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(db, "backpackdb", {
            get: function () {
                if (db.BACKPACK_DB == null) {
                    db.BACKPACK_DB = new BackPackDb();
                }
                return db.BACKPACK_DB;
            },
            enumerable: true,
            configurable: true
        });
        return db;
    }());
    Alun.db = db;
    __reflect(db.prototype, "Alun.db");
})(Alun || (Alun = {}));
// restore the all uid infos
var GameDb = (function () {
    function GameDb() {
        this.data = {};
        this.prefix = "GameDb:";
        this.lastUID_ = "lastUid";
        this.allPlayers = "allPlayers";
    }
    GameDb.prototype.getLastUID = function () {
        var dbKey = this.prefix + this.lastUID_;
        var value = egret.localStorage.getItem(dbKey);
        return value;
    };
    GameDb.prototype.setLastUID = function (uid) {
        var dbKey = this.prefix + this.lastUID_;
        egret.localStorage.setItem(dbKey, uid);
    };
    GameDb.prototype.getAllPlayers = function () {
        if (!this.ALL_UIDS) {
            this.ALL_UIDS = [];
            var dbKey = this.prefix + this.allPlayers;
            var value = egret.localStorage.getItem(dbKey);
            var result = JSON.parse(value);
            if (result) {
                this.ALL_UIDS = result;
            }
        }
        return this.ALL_UIDS;
    };
    GameDb.prototype.setAllPlayers = function (players) {
        this.ALL_UIDS = players;
        var dbKey = this.prefix + this.allPlayers;
        var val = JSON.stringify(players);
        egret.localStorage.setItem(dbKey, val);
    };
    GameDb.prototype.initGameDbByUID = function (uid) {
        this.getAllPlayers();
        this.ALL_UIDS.push(uid);
        this.setAllPlayers(this.ALL_UIDS);
    };
    return GameDb;
}());
__reflect(GameDb.prototype, "GameDb");
// restore the playeruid,player_id and player_name
var PlayerDb = (function () {
    function PlayerDb() {
        this.data = {};
        this.prefix = "PlayerDb:";
        this.default_id = 10000;
        this.default_name = "Famer_";
        this.default_gold = 0;
        this.default_mana = 500;
        this.default_exp = 0;
        this.default_level = 1;
    }
    //the struct is  {playerUID: any;playerID: number;playerName: string;lev: number;gold: number;mana: number;exp: number;}
    PlayerDb.prototype.getPlayerInfoByUID = function (uid) {
        var dbKey = this.prefix + uid;
        var val = egret.localStorage.getItem(dbKey);
        var result = JSON.parse(val);
        return result;
    };
    PlayerDb.prototype.setPlayerInfo = function (player_info) {
        var uid = player_info.playerUID;
        var dbKey = this.prefix + uid;
        var val = JSON.stringify(player_info);
        egret.localStorage.setItem(dbKey, val);
    };
    PlayerDb.prototype.initPlayerDbByUID = function (uid) {
        var allPlayers = Alun.db.gamedb.getAllPlayers();
        var player_id = this.default_id + allPlayers.length + 1;
        var player_name = this.default_name + player_id;
        var dbKey = this.prefix + uid;
        var value = { playerUID: uid, playerID: player_id, playerName: player_name, lev: this.default_level,
            gold: this.default_gold, mana: this.default_mana, exp: this.default_exp,
        };
        var val = JSON.stringify(value);
        egret.localStorage.setItem(dbKey, val);
        return player_id;
    };
    return PlayerDb;
}());
__reflect(PlayerDb.prototype, "PlayerDb");
// restore the farm information
var FarmDb = (function () {
    function FarmDb() {
        this.data = {};
        this.prefix = "farmDb:";
    }
    //the struct is  {playerID: number; farmInfo:{groundState,isLocked,plantInfo_}}
    FarmDb.prototype.initFarmDbByPlayerID = function (player_id) {
        var farmInfos = [];
        for (var i = 1; i <= Alun.Global.MAX_FARM_NUM; i++) {
            var groundInfo = {
                groundState: Alun.GROUND_STATE.NORMAL,
                plantInfo_: null,
                isLocked: true,
            };
            if (i <= 3) {
                groundInfo.isLocked = false;
            }
            farmInfos.push(groundInfo);
        }
        var dbKey = this.prefix + player_id;
        var value = { playerID: player_id, farmInfo: farmInfos
        };
        var val = JSON.stringify(value);
        egret.localStorage.setItem(dbKey, val);
    };
    FarmDb.prototype.setFarmInfos = function (farmInfos) {
        var player_id = farmInfos.playerID;
        var dbKey = this.prefix + player_id;
        var val = JSON.stringify(farmInfos);
        egret.localStorage.setItem(dbKey, val);
    };
    FarmDb.prototype.getFarmInfos = function (player_id) {
        var dbKey = this.prefix + player_id;
        var val = egret.localStorage.getItem(dbKey);
        var result = JSON.parse(val);
        return result;
    };
    return FarmDb;
}());
__reflect(FarmDb.prototype, "FarmDb");
// restore the backpack item information
var BackPackDb = (function () {
    function BackPackDb() {
        this.data = {};
        this.prefix = "backpackDb:";
    }
    //the backpack info struct is  {playerID: number; ItemInofs:{itemID(string),itemNum(number),itemType}}
    BackPackDb.prototype.initBackPackDbByPlayerID = function (player_id) {
        var ItemInofs = [];
        var dbKey = this.prefix + player_id;
        var value = { playerID: player_id, ItemInofs: ItemInofs
        };
        var val = JSON.stringify(value);
        egret.localStorage.setItem(dbKey, val);
    };
    BackPackDb.prototype.setBackPackInfos = function (backpackInofs) {
        var player_id = backpackInofs.playerID;
        var dbKey = this.prefix + player_id;
        var val = JSON.stringify(backpackInofs);
        egret.localStorage.setItem(dbKey, val);
    };
    BackPackDb.prototype.getBackPackInfos = function (player_id) {
        var dbKey = this.prefix + player_id;
        var val = egret.localStorage.getItem(dbKey);
        var result = JSON.parse(val);
        return result;
    };
    return BackPackDb;
}());
__reflect(BackPackDb.prototype, "BackPackDb");
//# sourceMappingURL=db.js.map