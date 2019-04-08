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
    var PlantManager = (function (_super) {
        __extends(PlantManager, _super);
        function PlantManager() {
            return _super.call(this) || this;
        }
        PlantManager.get = function () {
            if (PlantManager.INSTANCE == null) {
                PlantManager.INSTANCE = new PlantManager();
            }
            return PlantManager.INSTANCE;
        };
        PlantManager.reset = function () {
            if (!PlantManager.INSTANCE) {
                return;
            }
            PlantManager.INSTANCE = null;
        };
        PlantManager.prototype.getPlantInfo = function (plantID) {
            return PlantManager.PLANT_INFO[plantID];
        };
        PlantManager.prototype.getPlantName = function (plantID) {
            return PlantManager.PLANT_INFO[plantID].name;
        };
        PlantManager.prototype.getPlantStageCount = function (plantID) {
            return PlantManager.PLANT_INFO[plantID].stageCount;
        };
        PlantManager.prototype.getPlantSellMoney = function (plantID) {
            return PlantManager.PLANT_INFO[plantID].sellMoney;
        };
        PlantManager.prototype.getPlantSeedMoney = function (plantID) {
            return PlantManager.PLANT_INFO[plantID].seedMoney;
        };
        PlantManager.prototype.getPlantUnitTime = function (plantID) {
            return PlantManager.PLANT_INFO[plantID].unitTime;
        };
        PlantManager.prototype.getPlantSrcByStage = function (plantID, stageCount) {
            var src = PlantManager.PLANT_INFO[plantID].name + "_" + stageCount + "_png";
            return src;
        };
        PlantManager.prototype.getPlantSeed = function (plantID) {
            var src = PlantManager.PLANT_INFO[plantID].name + "_seed_png";
            return src;
        };
        PlantManager.INSTANCE = null;
        //-------------------------------   PLANT_INFO  ---------------------------------
        //the plant image source path is plant name + _ + stageCount,
        //example:strawberry in the stageCount 1 pic src is "strawberry_1"
        //seed src is plant name + "_seed",
        PlantManager.PLANT_INFO = {
            10001: {
                name: "strawberry",
                stageCount: 5,
                buyLevel: 1,
                sellMoney: 20,
                seedMoney: 10,
                unitTime: 10,
            },
            10002: {
                name: "corn",
                stageCount: 5,
                buyLevel: 1,
                sellMoney: 30,
                seedMoney: 15,
                unitTime: 12,
            },
            10003: {
                name: "whiteRadish",
                stageCount: 4,
                buyLevel: 1,
                sellMoney: 35,
                seedMoney: 18,
                unitTime: 18,
            },
            10004: {
                name: "redRadish",
                stageCount: 4,
                buyLevel: 1,
                sellMoney: 37,
                seedMoney: 19,
                unitTime: 16,
            },
            10005: {
                name: "potato",
                stageCount: 5,
                buyLevel: 2,
                sellMoney: 40,
                seedMoney: 20,
                unitTime: 18,
            }
        };
        return PlantManager;
    }(BaseClass));
    Alun.PlantManager = PlantManager;
    __reflect(PlantManager.prototype, "Alun.PlantManager");
})(Alun || (Alun = {}));
//# sourceMappingURL=PlantManager.js.map