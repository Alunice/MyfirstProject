class LoginWindow extends BaseWindow {
    private mainController = Alun.MainController.get()
    private login_game :eui.Button;
    private inputAccount_: eui.TextInput;
    private bg : eui.Image;
    private constructor(name, params){
       super(name,params);
       this._layer = 0;
       this._zorder = 0;
       this.skinName = "LoginSkin";
   }

   public initWindow(){
       super.initWindow();
       this.layout();
   }

   public layout(){
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

       this.login_game.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onLoginTouch,this);
   }

   public initShader(){
       let displayManager = Alun.DisplayManager.get();
       displayManager.createSinShader(this.bg);
       let state = 0;
       this.bg.addEventListener(egret.TouchEvent.TOUCH_TAP,()=>{
           ++state%2==0?displayManager.createShenWeiShader(this.bg):displayManager.createDripShader(this.bg);
       },this.bg)
   }


   public onLoginTouch(){
       let szReg = /^[A-Za-z0-9_-]{4,14}$/;
       let account = this.inputAccount_.text;
       console.log("account is",account);
       if(szReg.test(account)){
           let params = {uid: account};
           this.mainController.loginGame(params);
       }else{
           console.log("account error~")
       }
   }
  
}
