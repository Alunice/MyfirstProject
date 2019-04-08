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
var SelfPlayer = (function (_super) {
    __extends(SelfPlayer, _super);
    function SelfPlayer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.playerID_ = null;
        _this.playerName_ = null;
        _this.playerUID_ = null;
        _this.level_ = -1;
        _this.exp_ = 0;
        _this.gold_ = 0;
        _this.mana_ = 0;
        return _this;
    }
    SelfPlayer.get = function () {
        if (SelfPlayer.INSTANCE == null) {
            SelfPlayer.INSTANCE = new SelfPlayer();
            SelfPlayer.INSTANCE.onRegister();
        }
        return SelfPlayer.INSTANCE;
    };
    SelfPlayer.prototype.onRegister = function () {
        _super.prototype.onRegister.call(this);
        this.registerEvent(Alun.event.PLAYER_INFO, this.onPlayerInfo_, this);
        this.registerEvent(Alun.event.ECNOMIC_CHANGE, this.onEcnomicChange_, this);
    };
    SelfPlayer.prototype.onEcnomicChange_ = function (event) {
        var params = event.data;
        if (params.gold) {
            this.gold_ = params.gold;
        }
        if (params.mana) {
            this.mana_ = params.mana;
        }
    };
    SelfPlayer.prototype.onPlayerInfo_ = function (event) {
        var params = event.data;
        if (this.playerID_ != null && this.playerID_ != params.playerID) {
            return;
        }
        this.populate(params);
    };
    SelfPlayer.prototype.populate = function (params) {
        this.playerID_ = params.playerID;
        this.playerName_ = params.playerName;
        this.level_ = params.lev;
        this.playerUID_ = params.playerUID;
        this.exp_ = params.exp;
        this.gold_ = params.gold;
        this.mana_ = params.mana;
    };
    SelfPlayer.prototype.toPlayerInfo = function () {
        var player_info = {
            playerUID: this.playerUID_,
            playerID: this.playerID_,
            playerName: this.playerName_,
            lev: this.level_,
            exp: this.exp_,
            mana: this.mana_,
            gold: this.gold_,
        };
        return player_info;
    };
    SelfPlayer.prototype.savePlayerInfo = function () {
        var player_info = this.toPlayerInfo();
        Alun.Backend.get().request(Alun.mid.SAVE_PLAYER_INFO, player_info);
    };
    Object.defineProperty(SelfPlayer.prototype, "playerName", {
        get: function () {
            return this.playerName_;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SelfPlayer.prototype, "mana", {
        get: function () {
            return this.mana_;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SelfPlayer.prototype, "gold", {
        get: function () {
            return this.gold_;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SelfPlayer.prototype, "level", {
        get: function () {
            return this.level_;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SelfPlayer.prototype, "playerID", {
        get: function () {
            return this.playerID_;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SelfPlayer.prototype, "playerUID", {
        get: function () {
            return this.playerUID_;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SelfPlayer.prototype, "playerExp", {
        get: function () {
            return this.exp_;
        },
        enumerable: true,
        configurable: true
    });
    SelfPlayer.INSTANCE = null;
    return SelfPlayer;
}(BaseModel));
__reflect(SelfPlayer.prototype, "SelfPlayer");
//# sourceMappingURL=SelfPlayer.js.map