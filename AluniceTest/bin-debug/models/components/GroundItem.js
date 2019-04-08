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
var GroundItem = (function (_super) {
    __extends(GroundItem, _super);
    function GroundItem(params) {
        var _this = _super.call(this) || this;
        _this.chooseState = false;
        _this.groundState = Alun.GROUND_STATE.NORMAL;
        _this.plantInfo_ = null;
        _this.plant_ = null;
        _this.isLocked = true;
        _this.noClick = false;
        _this.skinName = "GroundSkin";
        _this.idx = params.id;
        _this.initLayout();
        return _this;
    }
    GroundItem.prototype.createChildren = function () {
        _super.prototype.createChildren.call(this);
        this.groundImg.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickIcon, this);
        this.groundImg.touchEnabled = true;
        if (this.noClick) {
            this.groundImg.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickIcon, this);
        }
    };
    GroundItem.prototype.initLayout = function () {
        var params = FarmModel.get().getGroundInfo(this.idx);
        if (this.idx == 0) {
            console.log("ground1 params is", FarmModel.get().getGroundInfo(this.idx));
        }
        if (!params)
            return;
        this.groundState = params.groundState;
        this.isLocked = params.isLocked;
        this.plantInfo_ = params.plantInfo_ || null;
        if (this.plantInfo_) {
            this.plant_ = new BasePlant({ plantInfo_: this.plantInfo_, groundIdx: this.idx });
        }
        else {
            if (this.plant_) {
                this.plant_.stopTimeCount();
            }
            this.plant_ = null;
        }
        this.groundImg.source = GroundItem.GROUND_SOURCE[this.groundState - 1] + "_png";
        if (this.plant_) {
            this.setPlantInfo();
        }
        else {
            this.groupPlant_.visible = false;
            this.plantImg.source = "";
        }
    };
    GroundItem.prototype.setPlantInfo = function () {
        var plantID = this.plant_.getPlantID();
        var plantNowCount = this.plant_.getNowStageCount();
        var plantManager_ = Alun.PlantManager.get();
        this.plantImg.source = plantManager_.getPlantSrcByStage(plantID, plantNowCount);
        this.plantImg.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickIcon, this);
        if (this.noClick) {
            this.plantImg.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickIcon, this);
        }
        this.groupPlant_.visible = true;
        if (plantNowCount < plantManager_.getPlantStageCount(plantID)) {
            this.NextCountLeftTime_.text = "next lev:  " + this.plant_.getNextStageLeftTime();
            this.leftTime_.text = "time left  " + this.plant_.getLeftTime();
        }
        else {
            this.NextCountLeftTime_.visible = false;
            this.leftTime_.visible = false;
        }
    };
    GroundItem.prototype.startPlantCountDown = function () {
        if (this.plant_) {
            this.plant_.setCountDownTimer();
        }
    };
    GroundItem.prototype.onClickIcon = function () {
        var _this = this;
        var wnd = Alun.WindowManager.get().getWindow("AlertWindow");
        if (wnd) {
            Alun.WindowManager.get().closeWindow(wnd, function () {
                if (_this.plant_) {
                    Alun.WindowManager.get().openWindow("AlertWindow", { alert_type: Alun.ALERT_TYPE.PLANT_INFO, plant_: _this.plant_ });
                }
                else {
                    Alun.WindowManager.get().openWindow("AlertWindow", { alert_type: Alun.ALERT_TYPE.GROUND_INFO, groundIdx_: _this.idx });
                }
            });
        }
        else {
            if (this.plant_) {
                Alun.WindowManager.get().openWindow("AlertWindow", { alert_type: Alun.ALERT_TYPE.PLANT_INFO, plant_: this.plant_ });
            }
            else {
                Alun.WindowManager.get().openWindow("AlertWindow", { alert_type: Alun.ALERT_TYPE.GROUND_INFO, groundIdx_: this.idx });
            }
        }
    };
    GroundItem.prototype.refreshResource = function (forceRefresh) {
        if (!forceRefresh) {
            this.refreshImg();
        }
        else {
            this.initLayout();
            this.startPlantCountDown();
            this.updateToFMModel();
        }
    };
    GroundItem.prototype.refreshImg = function () {
        if (this.plant_) {
            var plantID = this.plant_.getPlantID();
            var plantNowCount = this.plant_.getNowStageCount();
            var plantManager_ = Alun.PlantManager.get();
            this.plantImg.source = plantManager_.getPlantSrcByStage(plantID, plantNowCount);
        }
    };
    GroundItem.prototype.refreshLabel = function () {
        if (this.plant_) {
            var plantID = this.plant_.getPlantID();
            var plantNowCount = this.plant_.getNowStageCount();
            var plantManager_ = Alun.PlantManager.get();
            if (plantNowCount < plantManager_.getPlantStageCount(plantID)) {
                this.NextCountLeftTime_.text = "next lev:  " + this.plant_.getNextStageLeftTime();
                this.leftTime_.text = "time left  " + this.plant_.getLeftTime();
            }
            else {
                this.NextCountLeftTime_.visible = false;
                this.leftTime_.visible = false;
            }
        }
    };
    GroundItem.prototype.updateToFMModel = function () {
        var groundInfos = this.toParams();
        FarmModel.get().updateGroundInfo(this.idx, groundInfos);
    };
    GroundItem.prototype.toParams = function () {
        if (this.plant_)
            this.plantInfo_ = this.plant_.toParams();
        var groundInfos_ = {
            groundState: this.groundState,
            isLocked: this.isLocked,
            plantInfo_: this.plantInfo_,
        };
        return groundInfos_;
    };
    GroundItem.GROUND_SOURCE = [
        "normal",
        "drought",
        "deep_drought",
        "black_ground",
        "grass_ground"
    ];
    return GroundItem;
}(eui.Component));
__reflect(GroundItem.prototype, "GroundItem");
//# sourceMappingURL=GroundItem.js.map