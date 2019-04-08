class GroundItem extends eui.Component{
    private idx:number;
    private groundImg: eui.Image;
    private plantImg: eui.Image;
    private chooseState = false;
    private groundState:number = Alun.GROUND_STATE.NORMAL;
    private plantInfo_ = null;
    private plant_:BasePlant = null;
    private isLocked = true;
    private groupPlant_ :eui.Group;

    private NextCountLeftTime_ :eui.Label;
    private leftTime_ :eui.Label;

    protected static GROUND_SOURCE = [
      "normal",
      "drought",
      "deep_drought",
      "black_ground",
      "grass_ground"
    ]

    private noClick = false;

    public constructor(params){
        super();
        this.skinName = "GroundSkin";
        this.idx = params.id;
        this.initLayout()
    }

    protected createChildren(){
        super.createChildren();
        this.groundImg.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onClickIcon,this);
        this.groundImg.touchEnabled = true;
        if(this.noClick){
            this.groundImg.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onClickIcon,this);
        }
    }

    public initLayout(){
        let params = FarmModel.get().getGroundInfo(this.idx);
        if(this.idx == 0){
            console.log("ground1 params is",FarmModel.get().getGroundInfo(this.idx));
        }
        if(!params) return ;
        this.groundState = params.groundState;
        this.isLocked = params.isLocked;
        this.plantInfo_ = params.plantInfo_ || null;
        if(this.plantInfo_){
            this.plant_ = new BasePlant({plantInfo_:this.plantInfo_,groundIdx:this.idx});
        }else{
            if(this.plant_){
                this.plant_.stopTimeCount();
            }
            this.plant_ = null;
        }
        this.groundImg.source = GroundItem.GROUND_SOURCE[this.groundState - 1] + "_png";
        if(this.plant_){
            this.setPlantInfo();
        }else{
            this.groupPlant_.visible = false;
            this.plantImg.source = "";
        }
        
    }

    private setPlantInfo(){
        let plantID = this.plant_.getPlantID();
        let plantNowCount = this.plant_.getNowStageCount()
        let plantManager_ = Alun.PlantManager.get();
        this.plantImg.source = plantManager_.getPlantSrcByStage(plantID,plantNowCount);
        this.plantImg.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onClickIcon,this);
        if(this.noClick){
            this.plantImg.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onClickIcon,this);
        }
        this.groupPlant_.visible = true;
        if(plantNowCount< plantManager_.getPlantStageCount(plantID)){
            this.NextCountLeftTime_.text = "next lev:  " + this.plant_.getNextStageLeftTime();
            this.leftTime_.text = "time left  " + this.plant_.getLeftTime();
        }else{
            this.NextCountLeftTime_.visible = false;
            this.leftTime_.visible = false;
        }
        
    }

    public startPlantCountDown(){
        if(this.plant_){
            this.plant_.setCountDownTimer();
        }
    }


    public onClickIcon(){
        let wnd = Alun.WindowManager.get().getWindow("AlertWindow");
        if(wnd){
            Alun.WindowManager.get().closeWindow(wnd,()=>{
                if(this.plant_){
                    Alun.WindowManager.get().openWindow("AlertWindow",{alert_type:Alun.ALERT_TYPE.PLANT_INFO,plant_:this.plant_});
                }else{
                    Alun.WindowManager.get().openWindow("AlertWindow",{alert_type:Alun.ALERT_TYPE.GROUND_INFO,groundIdx_:this.idx});
                } 
            });
        }else{
            if(this.plant_){
                Alun.WindowManager.get().openWindow("AlertWindow",{alert_type:Alun.ALERT_TYPE.PLANT_INFO,plant_:this.plant_});
            }else{
                Alun.WindowManager.get().openWindow("AlertWindow",{alert_type:Alun.ALERT_TYPE.GROUND_INFO,groundIdx_:this.idx});
            }
        }
    }

    public refreshResource(forceRefresh:boolean){
        if(!forceRefresh){
            this.refreshImg();
        }else{
            this.initLayout();
            this.startPlantCountDown();
            this.updateToFMModel();
        }
    }

    public refreshImg(){
        if(this.plant_){
            let plantID = this.plant_.getPlantID();
            let plantNowCount = this.plant_.getNowStageCount()
            let plantManager_ = Alun.PlantManager.get();
            this.plantImg.source = plantManager_.getPlantSrcByStage(plantID,plantNowCount);
        }
    }

    public refreshLabel(){
        if(this.plant_){
            let plantID = this.plant_.getPlantID();
            let plantNowCount = this.plant_.getNowStageCount()
            let plantManager_ = Alun.PlantManager.get();
                if(plantNowCount< plantManager_.getPlantStageCount(plantID)){
                this.NextCountLeftTime_.text = "next lev:  " + this.plant_.getNextStageLeftTime();
                this.leftTime_.text = "time left  " + this.plant_.getLeftTime();
            }else{
                this.NextCountLeftTime_.visible = false;
                this.leftTime_.visible = false;
            }
        }
    }

    public updateToFMModel(){
        let groundInfos = this.toParams();
        FarmModel.get().updateGroundInfo(this.idx,groundInfos);
    }

    public toParams(){
        if(this.plant_)
            this.plantInfo_ = this.plant_.toParams();
        let groundInfos_ = {
            groundState : this.groundState,
            isLocked : this.isLocked,
            plantInfo_ : this.plantInfo_,
        }
        return groundInfos_;
    }


}