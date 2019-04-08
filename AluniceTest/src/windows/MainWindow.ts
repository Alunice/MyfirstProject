class MainWindow extends BaseWindow {

    private moveIcon;
    private textfield: egret.TextField;
    private bg :eui.Image;
    private farmGroup_ :eui.Group;
    private goundGroup :eui.Group;
    private touchLayer_ :eui.Group;

    private windowManager  = Alun.WindowManager.get();;
    private displayManager = Alun.DisplayManager.get();
    private selfPlayer_ = SelfPlayer.get();

    private isMoving: boolean = false;
    private startMoving: boolean = false;
    private  MAX_X_OFFSET = 105;
    private  MIN_X_OFFSET = -455;
    private  DEFAULT_X_OFFSET = 105;
    private last_x = 0;
    private last_bg = 0;
    
    //ground Items
    private g_1 : eui.Image;
    private g_2 : eui.Image;
    private g_3 : eui.Image;
    private g_4 : eui.Image;
    private g_5 : eui.Image;
    private g_6 : eui.Image;
    private g_7 : eui.Image;
    private g_8 : eui.Image;
    private g_9 : eui.Image;
    private g_10 : eui.Image;
    private g_11 : eui.Image;
    private g_12 : eui.Image;
    private g_13 : eui.Image;
    private g_14 : eui.Image;
    private g_15 : eui.Image;
    private g_16 : eui.Image;

    public groundItems_:GroundItem[] = [];

    private constructor(name, params){
       super(name,params);
       this._layer = 1;
       this._zorder = 1; 
       this.skinName = "MainSkin";
       this.farmGroup_.x = this.DEFAULT_X_OFFSET;
   }

   public initWindow(){
       super.initWindow();
       this.initLayout();
   }

    public initLayout() {
        this.initTouchMap();
       // this.addEventListener(egret.TouchEvent.TOUCH_TAP,this.testTimer,this);
    }

    public onTouch(event:egret.TouchEvent){
        
        if(event.type == egret.TouchEvent.TOUCH_BEGIN){
            this.touchLayer_.addEventListener(egret.TouchEvent.TOUCH_MOVE,this.onTouch,this);
            this.touchLayer_.addEventListener(egret.TouchEvent.TOUCH_END,this.onTouch,this);
            this.startMoving = true;
            this.last_x = event.localX
            this.last_bg = this.farmGroup_.x;
        }else if(event.type == egret.TouchEvent.TOUCH_MOVE){
            let now_x = event.localX;
           
            let offset_x = now_x - this.last_x;
            if (this.last_bg + offset_x >= this.MAX_X_OFFSET){
                this.farmGroup_.x = this.MAX_X_OFFSET;
                this.last_bg = this.farmGroup_.x;
                this.last_x = now_x;
            }else if(this.last_bg + offset_x <= this.MIN_X_OFFSET){
                this.farmGroup_.x = this.MIN_X_OFFSET;
                this.last_x = now_x;
                this.last_bg = this.farmGroup_.x;
            }else{
                this.farmGroup_.x =this.last_bg + offset_x;
            }
           //console.log("now_x,offset_x,last_x,last_bg",now_x,offset_x,this.last_x,this.last_bg)
            
        }else if(event.type == egret.TouchEvent.TOUCH_END){
            this.touchLayer_.removeEventListener(egret.TouchEvent.TOUCH_MOVE,this.onTouch,this);
            this.touchLayer_.removeEventListener(egret.TouchEvent.TOUCH_END,this.onTouch,this);
            this.inMoving(event.localX - this.last_x);
        }
    }

    public inMoving(offset_x){
        let duration = 0.5;
        let firstPosX = this.farmGroup_.x + offset_x / 3;
        let nextPosX = this.farmGroup_.x + offset_x / 2;
        firstPosX = Math.max(firstPosX,this.MIN_X_OFFSET);
        firstPosX = Math.min(firstPosX,this.MAX_X_OFFSET);
        nextPosX = Math.max(nextPosX,this.MIN_X_OFFSET);
        nextPosX = Math.min(nextPosX,this.MAX_X_OFFSET);
        egret.Tween.get(this.farmGroup_).to({x:firstPosX},200,egret.Ease.sineIn);
        egret.setTimeout(function(){
            egret.Tween.get(this.farmGroup_).to({x:nextPosX},300,egret.Ease.sineIn);
        },this,200);
    }

    public initTouchMap(){
        this.touchLayer_.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.onTouch,this);
        let t_img = new eui.Image();
        t_img.texture
        for(let i = 0;i < 15;i++){
            let ground_item = new GroundItem({id:i});
            let pos_index = i + 1;
            let item_pos = this['g_' + pos_index];
            this.goundGroup.addChild(ground_item);
            ground_item.x = item_pos.x;
            ground_item.y = item_pos.y;
            item_pos.visible = false;
            this.groundItems_.push(ground_item);
            ground_item.startPlantCountDown();
        }
        FarmModel.get().setGroundItem(this.groundItems_);
    }

    public refreshGroundItems(forceRefresh = false,groundIdx?){
        if(groundIdx){
            this.groundItems_[groundIdx].refreshResource(forceRefresh);
        }else{
            for(let i = 0;i<this.groundItems_.length;i++){
                let ground_item = this.groundItems_[i];
                ground_item.refreshResource(forceRefresh);
            }
        }
    }

    public updateGroundItemLabel(groundIdx?){
        if(groundIdx){
            this.groundItems_[groundIdx].refreshLabel();
        }else{
            for(let i = 0;i<this.groundItems_.length;i++){
                let ground_item = this.groundItems_[i];
                ground_item.refreshLabel();
            }
        }
    }

}
