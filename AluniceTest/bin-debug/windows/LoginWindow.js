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
var LoginWindow = (function (_super) {
    __extends(LoginWindow, _super);
    function LoginWindow(name, params) {
        var _this = _super.call(this, name, params) || this;
        _this.mainController = Alun.MainController.get();
        _this._layer = 0;
        _this._zorder = 0;
        _this.skinName = "LoginSkin";
        return _this;
    }
    LoginWindow.prototype.initWindow = function () {
        _super.prototype.initWindow.call(this);
        this.layout();
    };
    LoginWindow.prototype.layout = function () {
        this.inputAccount_.textDisplay.textColor = 0x394046;
        this.inputAccount_.textDisplay.stroke = 2;
        this.inputAccount_.textDisplay.strokeColor = 0xfffff;
        this.inputAccount_.textDisplay.bold = true;
        this.inputAccount_.textDisplay.size = 24;
        this.inputAccount_.maxChars = 15;
        this.inputAccount_.prompt = "uid";
        this.inputAccount_.promptDisplay.textColor = 0x5c5c5c;
        this.inputAccount_.promptDisplay.bold = true;
        this.inputAccount_.promptDisplay.size = 24;
        this.initShader();
        this.login_game.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onLoginTouch, this);
    };
    LoginWindow.prototype.initShader = function () {
        var _this = this;
        var displayManager = Alun.DisplayManager.get();
        displayManager.createSinShader(this.bg);
        var state = 0;
        this.bg.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            ++state % 2 == 0 ? displayManager.createShenWeiShader(_this.bg) : displayManager.createDripShader(_this.bg);
        }, this.bg);
    };
    LoginWindow.prototype.onLoginTouch = function () {
        var szReg = /^[A-Za-z0-9_-]{4,14}$/;
        var account = this.inputAccount_.text;
        console.log("account is", account);
        if (szReg.test(account)) {
            var params = { uid: account };
            this.mainController.loginGame(params);
        }
        else {
            console.log("account error~");
        }
    };
    return LoginWindow;
}(BaseWindow));
__reflect(LoginWindow.prototype, "LoginWindow");
//# sourceMappingURL=LoginWindow.js.map