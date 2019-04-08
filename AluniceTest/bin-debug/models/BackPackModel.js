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
var BackPackModel = (function (_super) {
    __extends(BackPackModel, _super);
    function BackPackModel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //the backpack info struct is  {playerID: number; ItemInofs:{itemID(string),itemNum(number),itemType}}
        _this.ItemInofs_ = {};
        _this.ItemInfosByType = {};
        return _this;
    }
    BackPackModel.get = function () {
        if (BackPackModel.INSTANCE == null) {
            BackPackModel.INSTANCE = new BackPackModel();
            BackPackModel.INSTANCE.onRegister();
        }
        return BackPackModel.INSTANCE;
    };
    BackPackModel.prototype.onRegister = function () {
        _super.prototype.onRegister.call(this);
        this.registerEvent(Alun.event.BACKPACK_INFO, this.onBackPackInfo_, this);
        this.registerEvent(Alun.event.ITEM_CHANGE, this.onItemChange, this);
    };
    BackPackModel.prototype.onBackPackInfo_ = function (event) {
        var params = event.data;
        this.ItemInofs_ = params.ItemInofs;
        for (var _i = 0, _a = Object.keys(this.ItemInofs_); _i < _a.length; _i++) {
            var key = _a[_i];
            var ItemInfo = this.ItemInofs_[key];
            if (!this.ItemInfosByType[ItemInfo.itemType]) {
                this.ItemInfosByType[ItemInfo.itemType] = [];
            }
            this.ItemInfosByType[ItemInfo.itemType].push(ItemInfo);
        }
    };
    BackPackModel.prototype.onItemChange = function (event) {
        this.onBackPackInfo_(event);
    };
    BackPackModel.prototype.getItemNum = function (itemID) {
        for (var _i = 0, _a = Object.keys(this.ItemInofs_); _i < _a.length; _i++) {
            var key = _a[_i];
            var ItemInfo = this.ItemInofs_[key];
            if (ItemInfo.itemID == itemID) {
                return ItemInfo.itemNum;
            }
        }
        return 0;
    };
    BackPackModel.prototype.getItemInfoByType = function (itemType) {
        return this.ItemInfosByType[itemType];
    };
    BackPackModel.prototype.getItemList = function () {
        return this.ItemInofs_;
    };
    BackPackModel.INSTANCE = null;
    return BackPackModel;
}(BaseModel));
__reflect(BackPackModel.prototype, "BackPackModel");
//# sourceMappingURL=BackPackModel.js.map