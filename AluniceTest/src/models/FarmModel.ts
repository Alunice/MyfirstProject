class FarmModel extends BaseModel{
    private static INSTANCE: FarmModel = null;

    // let groundInfo = {
    //             groundState:Alun.GROUND_STATE.NORMAL,
    //             plantInfo_:null,
    //             isLocked:true,
    //         };

    protected farmInfos_ = [];
    public groundItems_:GroundItem[] = [];


    public static get():FarmModel{
        if (FarmModel.INSTANCE == null){
            FarmModel.INSTANCE = new FarmModel();
            FarmModel.INSTANCE.onRegister();
        }
        return  FarmModel.INSTANCE;
    }

    public onRegister(){
        super.onRegister();
        this.registerEvent(Alun.event.FARM_INFO,this.onFarmInfo_,this);
        this.registerEvent(Alun.event.PLANT_IN_GROUND,this.onFarmChangeForceRefresh,this);
        this.registerEvent(Alun.event.REMOVE_PLANT,this.onFarmChangeForceRefresh,this);
    }

    public onFarmInfo_(event: egret.Event){
        let params = event.data;
        this.farmInfos_ = params.farmInfo;
    }

    public getGroundInfo(idx :number){
        if (this.farmInfos_)
            return this.farmInfos_[idx];
    }


    public plantInGround(plantID,groundIdx){
        let params = {
            player_id: SelfPlayer.get().playerID,
            plantID:plantID,
            groundIdx:groundIdx,
        };
        Alun.Backend.get().request(Alun.mid.PLANT_IN_GROUND,params);
    }

    public removePlantInGround(plant : BasePlant){
        let plantID = plant.getPlantID();
        let groundIdx = plant.getGroundIdx();
        let params = {
            player_id: SelfPlayer.get().playerID,
            plantID:plantID,
            groundIdx:groundIdx,
        }
        Alun.Backend.get().request(Alun.mid.REMOVE_PLANT_IN_GROUND,params);
    }

    public onFarmChangeForceRefresh(event: egret.Event){
        let params = event.data;
        let plantGroundInfo= params.plantGroundInfo;
        this.farmInfos_[plantGroundInfo.groundIdx].plantInfo_ = plantGroundInfo.plantInfo_;
        this.refreshFarmInfo(true,plantGroundInfo.groundIdx);
    }

    public refreshFarmInfo(forceRefresh = false,groundIdx?){
        let wnd = Alun.WindowManager.get().getWindow("MainWindow");
        if(wnd){
            wnd.refreshGroundItems(forceRefresh,groundIdx);
        }
    }

    public updateGroundInfo(idx:number,groundInfos){
        this.farmInfos_[idx] = groundInfos;
    }

    public saveFarmInfo(){
        let farmInfos = this.createFarmInfos();
        Alun.Backend.get().request(Alun.mid.SAVE_GROUND_INFO,farmInfos);
    }

    public createFarmInfos(){
        let player_id = SelfPlayer.get().playerID;
        for(let groundItem of this.groundItems_){
            groundItem.updateToFMModel();
        }
        let params = {
            playerID:player_id,
            farmInfo:this.farmInfos_,
        }
        return params;
    }

    public setGroundItem(groundItems:GroundItem[]){
        this.groundItems_ = groundItems;
    }



}