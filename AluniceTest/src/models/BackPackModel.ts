class BackPackModel extends BaseModel{
    private static INSTANCE: BackPackModel = null;

//the backpack info struct is  {playerID: number; ItemInofs:{itemID(string),itemNum(number),itemType}}

    protected ItemInofs_ = {};
    protected ItemInfosByType = {};


    public static get():BackPackModel{
        if (BackPackModel.INSTANCE == null){
            BackPackModel.INSTANCE = new BackPackModel();
            BackPackModel.INSTANCE.onRegister();
        }
        return  BackPackModel.INSTANCE;
    }

    public onRegister(){
        super.onRegister();
        this.registerEvent(Alun.event.BACKPACK_INFO,this.onBackPackInfo_,this);
        this.registerEvent(Alun.event.ITEM_CHANGE,this.onItemChange,this);
    }

    private onBackPackInfo_(event: egret.Event){
        let params = event.data;
        this.ItemInofs_ = params.ItemInofs;
        for(let key of Object.keys(this.ItemInofs_)){
            let ItemInfo = this.ItemInofs_[key];
            if(!this.ItemInfosByType[ItemInfo.itemType]){
                this.ItemInfosByType[ItemInfo.itemType] = [];
            }
            this.ItemInfosByType[ItemInfo.itemType].push(ItemInfo);
        }
    }

    private onItemChange(event: egret.Event){
        this.onBackPackInfo_(event);
    }

    public getItemNum(itemID):number{
        for(let key of Object.keys(this.ItemInofs_)){
            let ItemInfo = this.ItemInofs_[key];
            if(ItemInfo.itemID == itemID){
                return ItemInfo.itemNum;
            }
        }
        return 0;
    }

    public getItemInfoByType(itemType){
        return this.ItemInfosByType[itemType];
    }

    public getItemList(){
        return this.ItemInofs_;
    }







}