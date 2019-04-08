class BasePlant extends BaseClass{
    private plantID_:number;
    private leftTime:number;
    private countTimer: egret.Timer;
    private healthyValue:number = 100;
    private unitTime:number;
    private stageCount:number;
    private nowStageCount_ : number;
    private plantManager_ = Alun.PlantManager.get();
    private nextStageTimeLeft : number;
    private groundIdx :number;
    
    public constructor(params){
        super();
        let plantInfo_ = params.plantInfo_;
        this.plantID_ = plantInfo_.plantID;
        this.leftTime = plantInfo_.leftTime;
        this.healthyValue = plantInfo_.healthyValue;
        this.groundIdx = params.groundIdx;
        this.setInfo();
    }

    public setInfo(params?){
        if(params){
            this.plantID_ = params.plantID;
            this.leftTime = params.leftTime;
            this.healthyValue = params.healthyValue;
        }
        this.leftTime = Math.max(this.leftTime,0);
        this.stageCount = this.plantManager_.getPlantStageCount(this.plantID_);
        this.unitTime = this.plantManager_.getPlantUnitTime(this.plantID_);
        this.nowStageCount_ = Math.floor(this.stageCount - (this.leftTime / (this.unitTime * Alun.Global.UNIT_TIME_FACTOR)));
        this.nextStageTimeLeft = this.leftTime % (this.unitTime * Alun.Global.UNIT_TIME_FACTOR);
        
    }

    public setCountDownTimer(){
        this.nextStageTimeLeft = this.nextStageTimeLeft + 1;
        this.leftTime = this.leftTime + 1;//call refreshCountDown soon so we need + 1 in here
        if(this.countTimer){
            this.countTimer.stop();
            this.countTimer = null;
        }
        this.countTimer = new egret.Timer(1000,this.leftTime);
        this.countTimer.addEventListener(egret.TimerEvent.TIMER,this.refreshCountDown,this);
        this.countTimer.start();
        this.refreshCountDown();
    }

    public stopTimeCount(){
        if(this.countTimer){
            this.countTimer.stop();
            this.countTimer = null;
        }
    }

    private refreshCountDown(){
        this.leftTime = this.leftTime - 1;
        this.nextStageTimeLeft = this.nextStageTimeLeft - 1;
        if(this.leftTime < 0){
            this.leftTime = 0;
        }
        if(this.nextStageTimeLeft < 0){
            this.nextStageTimeLeft = 0;
        }
        if(this.nextStageTimeLeft <= 0){
            this.nowStageCount_ = this.nowStageCount_ + 1;
            this.nextStageTimeLeft = this.unitTime;
            this.levUpEvent();
        }
        if(this.leftTime <= 0){
            this.leftTime = 0;
            this.nowStageCount_ = this.stageCount;
            this.nextStageTimeLeft = 0;
            if(this.countTimer){
                this.countTimer.stop();
                this.countTimer = null;
            }
        }
        this.updateLabel();
    }

    public changeHealthyValue(health:number){
        this.healthyValue = health;
    }

    public getHealthyValue(){
        return this.healthyValue;
    }

    public getLeftTime(){
        return this.leftTime;
    }

    public getNextStageLeftTime(){
        return this.nextStageTimeLeft;
    }

    public getPlantID(){
        return this.plantID_;
    }
    
    public getNowStageCount(){
        return this.nowStageCount_;
    }

    public getGroundIdx(){
        return this.groundIdx;
    }

    public toParams(){
        let plantInfos_ = {
            plantID : this.plantID_,
            leftTime : this.leftTime,
            healthyValue : this.healthyValue,
        };
        return plantInfos_;
    }

    public levUpEvent(){
        let wnd = Alun.WindowManager.get().getWindow("MainWindow");
        if(wnd){
            wnd.refreshGroundItems(false,this.groundIdx);
        }
        let alert_wnd = Alun.WindowManager.get().getWindow("AlertWindow");
        if(alert_wnd ){
            if (alert_wnd.groundIdx == this.groundIdx)
                alert_wnd.refreshImg();
        }
    }
    
    public updateLabel(){
        let wnd = Alun.WindowManager.get().getWindow("MainWindow");
        if(wnd){
            wnd.updateGroundItemLabel(this.groundIdx);
        }
        let alert_wnd = Alun.WindowManager.get().getWindow("AlertWindow");
        if(alert_wnd ){
            if (alert_wnd.groundIdx == this.groundIdx)
                alert_wnd.refreshLabel();
        }
    }

}