class AlertWindow extends BaseWindow{

    private alert_type;
    private plant_ :BasePlant;
    private alertTitle_ :eui.Label;
    private groundindex :number;
    private plantsCollection : eui.ArrayCollection;
   

    //plantGroup_
    private plantGroup_ :eui.Group;
    private plantImg_ :eui.Image;
    private healthTitle_ : eui.Label;
    private healthNum_ :eui.Label;
    private nextTimeTitle_ :eui.Label;
    private NextCountLeftTime_ :eui.Label;
    private leftTimeTitle_ :eui.Label;
    private leftTime_ :eui.Label;

    //shopGroup_
    private shopGroup_ :eui.Group;

    //groundGroup
    private groundGroup_ :eui.Group;
    private plantChooseGroup_ :eui.DataGroup;
    private scroller_ :eui.Scroller;


    private closeBtn_ :eui.Button;
    private funcBtn_ :eui.Button;



    private constructor(name, params){
       super(name,params);
       this._layer = 2;
       this._zorder = 1; 
       this.skinName = "AlertWindowSkin";
       this.alert_type = params.alert_type;
   }


   public initWindow(){
       super.initWindow();
       this.initLayout();
   }

   private initLayout(){
       if(this.alert_type == Alun.ALERT_TYPE.GROUND_INFO){
           this.initGroundInfo();
       }else if(this.alert_type == Alun.ALERT_TYPE.SHOP_INFO){

       }else if(this.alert_type == Alun.ALERT_TYPE.PLANT_INFO){
           this.initPlantInfo();
       }
       this.closeBtn_.label = "关闭";
       this.closeBtn_.addEventListener(egret.TouchEvent.TOUCH_TAP,()=>{
           Alun.WindowManager.get().closeWindow(this.name);
       },this);
   }

   private initGroundInfo(){
       this.groundindex = this.params.groundIdx;
       this.plantsCollection = new eui.ArrayCollection();
       this.scroller_.bounces = false;
       this.plantChooseGroup_.itemRenderer = SeedItem;
       this.plantChooseGroup_.dataProvider = this.plantsCollection;
       
   }

   private initPlantInfo(){
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
       this.funcBtn_.addEventListener(egret.TouchEvent.TOUCH_TAP,()=>{
           FarmModel.get().removePlantInGround(this.plant_);
           Alun.WindowManager.get().closeWindow(this.name);
       },this);

   }

   public refreshLabel(){
        if(this.alert_type == Alun.ALERT_TYPE.PLANT_INFO && this.plant_){
            let plantID = this.plant_.getPlantID();
            let plantNowCount = this.plant_.getNowStageCount()
            let plantManager_ = Alun.PlantManager.get();
                if(plantNowCount< plantManager_.getPlantStageCount(plantID)){
                this.NextCountLeftTime_.text = String(this.plant_.getNextStageLeftTime());
                this.leftTime_.text = String(this.plant_.getLeftTime());
            }
        }
    }

    public refreshImg(){
        if(this.alert_type == Alun.ALERT_TYPE.PLANT_INFO && this.plant_){
            let plantManager = Alun.PlantManager.get();
            let plantID = this.plant_.getPlantID();
            this.plantImg_.source = plantManager.getPlantSrcByStage(plantID,this.plant_.getNowStageCount());
        }
    }

    public get groundIdx(){
        if(this.alert_type == Alun.ALERT_TYPE.PLANT_INFO && this.plant_){
            return this.plant_.getGroundIdx();
        }
        return -1;
    }
}


class SeedItem extends eui.ItemRenderer{
    private seedImg_ :eui.Image;
    private seed_num :eui.Label;
    private select_ :eui.Image;

    public constructor(){
        super();
        this.skinName = "plantItemSkin";
    }

}

