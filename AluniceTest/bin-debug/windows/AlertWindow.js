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
var AlertWindow = (function (_super) {
    __extends(AlertWindow, _super);
    function AlertWindow(name, params) {
        var _this = _super.call(this, name, params) || this;
        _this._layer = 2;
        _this._zorder = 1;
        _this.skinName = "AlertWindowSkin";
        _this.alert_type = params.alert_type;
        return _this;
    }
    AlertWindow.prototype.initWindow = function () {
        _super.prototype.initWindow.call(this);
        this.initLayout();
    };
    AlertWindow.prototype.initLayout = function () {
        var _this = this;
        if (this.alert_type == Alun.ALERT_TYPE.GROUND_INFO) {
            this.initGroundInfo();
        }
        else if (this.alert_type == Alun.ALERT_TYPE.SHOP_INFO) {
        }
        else if (this.alert_type == Alun.ALERT_TYPE.PLANT_INFO) {
            this.initPlantInfo();
        }
        this.closeBtn_.label = "关闭";
        this.closeBtn_.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            Alun.WindowManager.get().closeWindow(_this.name);
        }, this);
    };
    AlertWindow.prototype.initGroundInfo = function () {
        this.groundindex = this.params.groundIdx;
        this.plantsCollection = new eui.ArrayCollection();
        this.scroller_.bounces = false;
        this.plantChooseGroup_.itemRenderer = SeedItem;
        this.plantChooseGroup_.dataProvider = this.plantsCollection;
    };
    AlertWindow.prototype.initPlantInfo = function () {
        var _this = this;
        this.shopGroup_.visible = false;
        this.plant_ = this.params.plant_;
        this.nextTimeTitle_.text = "下一阶段:";
        this.leftTimeTitle_.text = "成熟时间:";
        this.healthTitle_.text = "健康值:";
        this.healthNum_.text = this.plant_.getHealthyValue() + "/" + Alun.Global.DEFAULT_HEALTHY_VALUE;
        this.alertTitle_.text = Alun.PlantManager.get().getPlantName(this.plant_.getPlantID());
        this.refreshLabel();
        this.refreshImg();
        this.funcBtn_.label = "移除";
        this.funcBtn_.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            FarmModel.get().removePlantInGround(_this.plant_);
            Alun.WindowManager.get().closeWindow(_this.name);
        }, this);
    };
    AlertWindow.prototype.refreshLabel = function () {
        if (this.alert_type == Alun.ALERT_TYPE.PLANT_INFO && this.plant_) {
            var plantID = this.plant_.getPlantID();
            var plantNowCount = this.plant_.getNowStageCount();
            var plantManager_ = Alun.PlantManager.get();
            if (plantNowCount < plantManager_.getPlantStageCount(plantID)) {
                this.NextCountLeftTime_.text = String(this.plant_.getNextStageLeftTime());
                this.leftTime_.text = String(this.plant_.getLeftTime());
            }
        }
    };
    AlertWindow.prototype.refreshImg = function () {
        if (this.alert_type == Alun.ALERT_TYPE.PLANT_INFO && this.plant_) {
            var plantManager = Alun.PlantManager.get();
            var plantID = this.plant_.getPlantID();
            this.plantImg_.source = plantManager.getPlantSrcByStage(plantID, this.plant_.getNowStageCount());
        }
    };
    Object.defineProperty(AlertWindow.prototype, "groundIdx", {
        get: function () {
            if (this.alert_type == Alun.ALERT_TYPE.PLANT_INFO && this.plant_) {
                return this.plant_.getGroundIdx();
            }
            return -1;
        },
        enumerable: true,
        configurable: true
    });
    return AlertWindow;
}(BaseWindow));
__reflect(AlertWindow.prototype, "AlertWindow");
var SeedItem = (function (_super) {
    __extends(SeedItem, _super);
    function SeedItem() {
        var _this = _super.call(this) || this;
        _this.skinName = "plantItemSkin";
        return _this;
    }
    return SeedItem;
}(eui.ItemRenderer));
__reflect(SeedItem.prototype, "SeedItem");
//# sourceMappingURL=AlertWindow.js.map