namespace Alun{
    export class MainController extends BaseController {

        private static INSTANCE: MainController = null;
        private eventDispatcher_ = Alun.EventDispatcher.get();
        public constructor(){
            super();
            this.onRegister()
        }

        static get():MainController {
            if (MainController.INSTANCE == null){
                MainController.INSTANCE = new MainController();
            }
            return MainController.INSTANCE;
        }

        static reset(){
            if (!MainController.INSTANCE){
                return;
            }
            MainController.INSTANCE = null;
        }

        public onRegister(){
            this.registerEvent(Alun.event.LOGIN_GAME,this.onGameStart,this);
            this.registerEvent(Alun.event.LOGIN_INFO,this.onLoginInfo_,this);
        }

        public onGameStart(event:egret.Event){
            let params = event.data;
            let login_status = params.login_status;
            if (login_status == Alun.LOGIN_STATUS.SUCCESS){
                console.log("login SUCCESS",params);
                let player_info = params.player_info;
                let eventObj = new egret.Event(Alun.event.PLAYER_INFO,false,false,player_info);
                this.eventDispatcher_.dispatchEvent(eventObj);
                let t_params={
                    player_id:player_info.playerID,
                }
                Alun.Backend.get().request(Alun.mid.GET_LOGIN_INFO,t_params);
               
            }else{
                if (login_status == Alun.LOGIN_STATUS.USER_NOT_EXIST){
                    console.log("user not exsit and register failure,error type",login_status);
                }
            }
            
        }

        public onLoginInfo_(event:egret.Event){
            let params = event.data; 
            let loginInfos = params.loginInfos;

            let farmInfos = loginInfos.farmInfos;
            if(farmInfos){
                let eventFarm = new egret.Event(Alun.event.FARM_INFO,false,false,farmInfos);
                this.eventDispatcher_.dispatchEvent(eventFarm);
            }

            let backpackInfos = loginInfos.backpackInfos;
            if(backpackInfos){
                let eventBackPack = new egret.Event(Alun.event.BACKPACK_INFO,false,false,backpackInfos);
                this.eventDispatcher_.dispatchEvent(eventBackPack);
            }

            Alun.WindowManager.get().openWindow("MainWindow",params);
            Alun.WindowManager.get().closeWindow("LoginWindow");
        }

        public loginGame(params){
            Alun.Backend.get().request(Alun.mid.LOGIN_GAME,params);
        }

        public saveGameInfo(){
            
        }

    }
}