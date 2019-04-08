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
var FarmModel = (function (_super) {
    __extends(FarmModel, _super);
    function FarmModel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // let groundInfo = {
        //             groundState:Alun.GROUND_STATE.NORMAL,
        //             plantInfo_:null,
        //             isLocked:true,
        //         };
        _this.farmInfos_ = [];
        _this.groundItems_ = [];
        return _this;
    }
    FarmModel.get = function () {
        if (FarmModel.INSTANCE == null) {
            FarmModel.INSTANCE = new FarmModel();
            FarmModel.INSTANCE.onRegister();
        }
        return FarmModel.INSTANCE;
    };
    FarmModel.prototype.onRegister = function () {
        _super.prototype.onRegister.call(this);
        this.registerEvent(Alun.event.FARM_INFO, this.onFarmInfo_, this);
        this.registerEvent(Alun.event.PLANT_IN_GROUND, this.onFarmChangeForceRefresh, this);
        this.registerEvent(Alun.event.REMOVE_PLANT, this.onFarmChangeForceRefresh, this);
    };
    FarmModel.prototype.onFarmInfo_ = function (event) {
        var params = event.data;
        this.farmInfos_ = params.farmInfo;
    };
    FarmModel.prototype.getGroundInfo = function (idx) {
        if (this.farmInfos_)
            return this.farmInfos_[idx];
    };
    FarmModel.prototype.plantInGround = function (plantID, groundIdx) {
        var params = {
            player_id: SelfPlayer.get().playerID,
            plantID: plantID,
            groundIdx: groundIdx,
        };
        Alun.Backend.get().request(Alun.mid.PLANT_IN_GROUND, params);
    };
    FarmModel.prototype.removePlantInGround = function (plant) {
        var plantID = plant.getPlantID();
        var groundIdx = plant.getGroundIdx();
        var params = {
            player_id: SelfPlayer.get().playerID,
            plantID: plantID,
            groundIdx: groundIdx,
        };
        Alun.Backend.get().request(Alun.mid.REMOVE_PLANT_IN_GROUND, params);
    };
    FarmModel.prototype.onFarmChangeForceRefresh = function (event) {
        var params = event.data;
        var plantGroundInfo = params.plantGroundInfo;
        this.farmInfos_[plantGroundInfo.groundIdx].plantInfo_ = plantGroundInfo.plantInfo_;
        this.refreshFarmInfo(true, plantGroundInfo.groundIdx);
    };
    FarmModel.prototype.refreshFarmInfo = function (forceRefresh, groundIdx) {
        if (forceRefresh === void 0) { forceRefresh = false; }
        var wnd = Alun.WindowManager.get().getWindow("MainWindow");
        if (wnd) {
            wnd.refreshGroundItems(forceRefresh, groundIdx);
        }
    };
    FarmModel.prototype.updateGroundInfo = function (idx, groundInfos) {
        this.farmInfos_[idx] = groundInfos;
    };
    FarmModel.prototype.saveFarmInfo = function () {
        var farmInfos = this.createFarmInfos();
        Alun.Backend.get().request(Alun.mid.SAVE_GROUND_INFO, farmInfos);
    };
    FarmModel.prototype.createFarmInfos = function () {
        var player_id = SelfPlayer.get().playerID;
        for (var _i = 0, _a = this.groundItems_; _i < _a.length; _i++) {
            var groundItem = _a[_i];
            groundItem.updateToFMModel();
        }
        var params = {
            playerID: player_id,
            farmInfo: this.farmInfos_,
        };
        return params;
    };
    FarmModel.prototype.setGroundItem = function (groundItems) {
        this.groundItems_ = groundItems;
    };
    FarmModel.INSTANCE = null;
    return FarmModel;
}(BaseModel));
__reflect(FarmModel.prototype, "FarmModel");
//# sourceMappingURL=FarmModel.js.map