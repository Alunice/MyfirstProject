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
var BasePlant = (function (_super) {
    __extends(BasePlant, _super);
    function BasePlant(params) {
        var _this = _super.call(this) || this;
        _this.healthyValue = 100;
        _this.plantManager_ = Alun.PlantManager.get();
        var plantInfo_ = params.plantInfo_;
        _this.plantID_ = plantInfo_.plantID;
        _this.leftTime = plantInfo_.leftTime;
        _this.healthyValue = plantInfo_.healthyValue;
        _this.groundIdx = params.groundIdx;
        _this.setInfo();
        return _this;
    }
    BasePlant.prototype.setInfo = function (params) {
        if (params) {
            this.plantID_ = params.plantID;
            this.leftTime = params.leftTime;
            this.healthyValue = params.healthyValue;
        }
        this.leftTime = Math.max(this.leftTime, 0);
        this.stageCount = this.plantManager_.getPlantStageCount(this.plantID_);
        this.unitTime = this.plantManager_.getPlantUnitTime(this.plantID_);
        this.nowStageCount_ = Math.floor(this.stageCount - (this.leftTime / (this.unitTime * Alun.Global.UNIT_TIME_FACTOR)));
        this.nextStageTimeLeft = this.leftTime % (this.unitTime * Alun.Global.UNIT_TIME_FACTOR);
    };
    BasePlant.prototype.setCountDownTimer = function () {
        this.nextStageTimeLeft = this.nextStageTimeLeft + 1;
        this.leftTime = this.leftTime + 1; //call refreshCountDown soon so we need + 1 in here
        if (this.countTimer) {
            this.countTimer.stop();
            this.countTimer = null;
        }
        this.countTimer = new egret.Timer(1000, this.leftTime);
        this.countTimer.addEventListener(egret.TimerEvent.TIMER, this.refreshCountDown, this);
        this.countTimer.start();
        this.refreshCountDown();
    };
    BasePlant.prototype.stopTimeCount = function () {
        if (this.countTimer) {
            this.countTimer.stop();
            this.countTimer = null;
        }
    };
    BasePlant.prototype.refreshCountDown = function () {
        this.leftTime = this.leftTime - 1;
        this.nextStageTimeLeft = this.nextStageTimeLeft - 1;
        if (this.leftTime < 0) {
            this.leftTime = 0;
        }
        if (this.nextStageTimeLeft < 0) {
            this.nextStageTimeLeft = 0;
        }
        if (this.nextStageTimeLeft <= 0) {
            this.nowStageCount_ = this.nowStageCount_ + 1;
            this.nextStageTimeLeft = this.unitTime;
            this.levUpEvent();
        }
        if (this.leftTime <= 0) {
            this.leftTime = 0;
            this.nowStageCount_ = this.stageCount;
            this.nextStageTimeLeft = 0;
            if (this.countTimer) {
                this.countTimer.stop();
                this.countTimer = null;
            }
        }
        this.updateLabel();
    };
    BasePlant.prototype.changeHealthyValue = function (health) {
        this.healthyValue = health;
    };
    BasePlant.prototype.getHealthyValue = function () {
        return this.healthyValue;
    };
    BasePlant.prototype.getLeftTime = function () {
        return this.leftTime;
    };
    BasePlant.prototype.getNextStageLeftTime = function () {
        return this.nextStageTimeLeft;
    };
    BasePlant.prototype.getPlantID = function () {
        return this.plantID_;
    };
    BasePlant.prototype.getNowStageCount = function () {
        return this.nowStageCount_;
    };
    BasePlant.prototype.getGroundIdx = function () {
        return this.groundIdx;
    };
    BasePlant.prototype.toParams = function () {
        var plantInfos_ = {
            plantID: this.plantID_,
            leftTime: this.leftTime,
            healthyValue: this.healthyValue,
        };
        return plantInfos_;
    };
    BasePlant.prototype.levUpEvent = function () {
        var wnd = Alun.WindowManager.get().getWindow("MainWindow");
        if (wnd) {
            wnd.refreshGroundItems(false, this.groundIdx);
        }
        var alert_wnd = Alun.WindowManager.get().getWindow("AlertWindow");
        if (alert_wnd) {
            if (alert_wnd.groundIdx == this.groundIdx)
                alert_wnd.refreshImg();
        }
    };
    BasePlant.prototype.updateLabel = function () {
        var wnd = Alun.WindowManager.get().getWindow("MainWindow");
        if (wnd) {
            wnd.updateGroundItemLabel(this.groundIdx);
        }
        var alert_wnd = Alun.WindowManager.get().getWindow("AlertWindow");
        if (alert_wnd) {
            if (alert_wnd.groundIdx == this.groundIdx)
                alert_wnd.refreshLabel();
        }
    };
    return BasePlant;
}(BaseClass));
__reflect(BasePlant.prototype, "BasePlant");
//# sourceMappingURL=BasePlant.js.map