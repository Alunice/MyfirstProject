namespace Alun{
    export class Backend{
        private static INSTANCE: Backend = null;

        private mid2EventNames_: any;
        private eventDispatcher_  = Alun.EventDispatcher.get(); 

        public constructor(){
            this.setupMid2EventNameMappings_();
            this.register();
        }

        static get():Backend {
            if (Backend.INSTANCE == null){
                Backend.INSTANCE = new Backend();
            }
            return Backend.INSTANCE;
        }

        static reset(){
            if (!Backend.INSTANCE){
                return;
            }
            Backend.INSTANCE = null;
        }

        public setupMid2EventNameMappings_(){
            this.mid2EventNames_ = {
                [Alun.mid.LOGIN_GAME]: Alun.event.LOGIN_GAME,
                [Alun.mid.SIGN_UP]: Alun.event.SIGN_UP,
                [Alun.mid.GET_LOGIN_INFO]: Alun.event.LOGIN_INFO,
                [Alun.mid.PLANT_IN_GROUND]: Alun.event.PLANT_IN_GROUND,
                [Alun.mid.REMOVE_PLANT_IN_GROUND]: Alun.event.REMOVE_PLANT,
                [Alun.mid.SAVE_GROUND_INFO]: Alun.event.SAVE_GROUND_INFO,
                [Alun.mid.SAVE_PLAYER_INFO]: Alun.event.SAVE_PLAYER_INFO,
            }
        }

        public register(){
            this.eventDispatcher_.addEventListener(Alun.event.RECIVE_MESSAGE,function(msg){
                console.log("recive the message form server");
                console.log(msg);
                this.onSockertMessage_(msg);
            },this);
        }

        public request(mid: number, params: any){
            let eventObj = new egret.Event(Alun.event.SEND_MESSAGE);
            this.eventDispatcher_.dispatchEvent(eventObj);
            console.log("send message",mid,params)
            this.responseRequestLocally(mid, params);
        }

        public responseRequestLocally(mid: number, params: any){
            if (mid == Alun.mid.LOGIN_GAME){

                this.onLoginGame(params);
                
            }else if(mid == Alun.mid.SIGN_UP){

                

            }else if(mid == Alun.mid.GET_LOGIN_INFO){
                this.onRequestLoginInfo(params);
            }else if(mid == Alun.mid.PLANT_IN_GROUND){
                this.onPlantInGround(params);
            }else if (mid == Alun.mid.REMOVE_PLANT_IN_GROUND){
                this.onRemovePlant(params);
            }else if(mid == Alun.mid.SAVE_GROUND_INFO){
                this.onSaveFarmInfo(params);
            }else if(mid == Alun.mid.SAVE_PLAYER_INFO){
                this.onSavePlayerInfo(params);
            }
        }

        public onLoginGame(params:any){
            let uid = params.uid;
            if (!uid) return ;
            let res_info = Alun.db.playerdb.getPlayerInfoByUID(uid);
            let msg = {}
            if (res_info){
                msg = {
                    mid:Alun.mid.LOGIN_GAME,
                    login_status :Alun.LOGIN_STATUS.SUCCESS,
                    player_info :res_info,
                }
                console.log("get the infos",res_info);
            }else{ // not exist the uid and init db by uid
                this.registerNewPlayer(uid);
                res_info = Alun.db.playerdb.getPlayerInfoByUID(uid);
                console.log("register the new infos",res_info);
                msg = {
                    mid:Alun.mid.LOGIN_GAME,
                    login_status: res_info?Alun.LOGIN_STATUS.SUCCESS:Alun.LOGIN_STATUS.USER_NOT_EXIST,
                    player_info :res_info,
                }
            }
            let eventObj = new egret.Event(Alun.event.RECIVE_MESSAGE,false,false,msg);
            this.eventDispatcher_.dispatchEvent(eventObj);
        }

        public registerNewPlayer(uid){
            Alun.db.gamedb.initGameDbByUID(uid);
            let player_id = Alun.db.playerdb.initPlayerDbByUID(uid);
            Alun.db.farmdb.initFarmDbByPlayerID(player_id);
            Alun.db.backpackdb.initBackPackDbByPlayerID(player_id);
        }

        public onRequestLoginInfo(params){
            let player_id = params.player_id;
            let LoginInfos = {
                farmInfos:null,
                backpackInfos:null,
            };
            let farmInfos = Alun.db.farmdb.getFarmInfos(player_id);
            LoginInfos.farmInfos = farmInfos;
            let backpackInfos = Alun.db.backpackdb.getBackPackInfos(player_id);
            LoginInfos.backpackInfos = backpackInfos;
            let msg = {
                mid:Alun.mid.GET_LOGIN_INFO,
                loginInfos:LoginInfos,
            }
            let eventObj = new egret.Event(Alun.event.RECIVE_MESSAGE,false,false,msg);
            this.eventDispatcher_.dispatchEvent(eventObj);
        }

        public onPlantInGround(params){
            let player_id = params.player_id;
            let plantID = params.plantID;
            let groundIdx = params.groundIdx;
            let farmInfos = Alun.db.farmdb.getFarmInfos(player_id);
            if(!farmInfos.farmInfo[groundIdx].plantInfo_){
                let plManager = Alun.PlantManager.get();
                let plantInfos = {
                    plantID:plantID,
                    leftTime:plManager.getPlantUnitTime(plantID) * plManager.getPlantStageCount(plantID),
                    healthyValue:Alun.Global.DEFAULT_HEALTHY_VALUE,
                }
                farmInfos.farmInfo[groundIdx].plantInfo_ = plantInfos;
                Alun.db.farmdb.setFarmInfos(farmInfos);
                let msg = {
                    mid:Alun.mid.PLANT_IN_GROUND,
                    plantGroundInfo:{
                        groundIdx:groundIdx,
                        plantInfo_:plantInfos,
                    }
                }
                let eventObj = new egret.Event(Alun.event.RECIVE_MESSAGE,false,false,msg);
                this.eventDispatcher_.dispatchEvent(eventObj);
            }
        }

        public onRemovePlant(params){
            let player_id = params.player_id;
            let plantID = params.plantID;
            let groundIdx = params.groundIdx;
            let farmInfos = Alun.db.farmdb.getFarmInfos(player_id);
            if(farmInfos.farmInfo[groundIdx].plantInfo_){
                farmInfos.farmInfo[groundIdx].plantInfo_ = null;
                Alun.db.farmdb.setFarmInfos(farmInfos);
                let msg = {
                    mid:Alun.mid.PLANT_IN_GROUND,
                    plantGroundInfo:{
                        groundIdx:groundIdx,
                        plantInfo_:null,
                    }
                }
                let eventObj = new egret.Event(Alun.event.RECIVE_MESSAGE,false,false,msg);
                this.eventDispatcher_.dispatchEvent(eventObj);
            }
        }

        public onSaveFarmInfo(farmInfos){
            Alun.db.farmdb.setFarmInfos(farmInfos);
            let msg = {
                mid:Alun.mid.SAVE_GROUND_INFO,
            }
            let eventObj = new egret.Event(Alun.event.RECIVE_MESSAGE,false,false,msg);
            this.eventDispatcher_.dispatchEvent(eventObj);
        }

        public onSavePlayerInfo(playerInfos){
            Alun.db.playerdb.setPlayerInfo(playerInfos);
            let msg = {
                mid:Alun.mid.SAVE_PLAYER_INFO,
            }
            let eventObj = new egret.Event(Alun.event.RECIVE_MESSAGE,false,false,msg);
            this.eventDispatcher_.dispatchEvent(eventObj);
        }





        public onSockertMessage_(msg:egret.Event){
            let body = msg.data;
            let mid = body.mid;

            let eventObj = new egret.Event(this.mid2EventNames_[mid] || mid + "",false,false,body);
            console.log("msg2event in Backend",eventObj);
            this.eventDispatcher_.dispatchEvent(eventObj);
        }

    }
}