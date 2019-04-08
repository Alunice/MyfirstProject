class SelfPlayer extends BaseModel{
    private static INSTANCE: SelfPlayer = null;

    protected playerID_:number = null;
    protected playerName_: string = null;
    protected playerUID_ = null;
    protected level_: number = -1;
    protected exp_ = 0;

    protected gold_ = 0;
    protected mana_ = 0;


    public static get():SelfPlayer{
        if (SelfPlayer.INSTANCE == null){
            SelfPlayer.INSTANCE = new SelfPlayer();
            SelfPlayer.INSTANCE.onRegister();
        }
        return  SelfPlayer.INSTANCE;
    }

    public onRegister(){
        super.onRegister();
        this.registerEvent(Alun.event.PLAYER_INFO,this.onPlayerInfo_,this);
        this.registerEvent(Alun.event.ECNOMIC_CHANGE,this.onEcnomicChange_,this)
    }

    public onEcnomicChange_(event: egret.Event){
        let params = event.data;
        if(params.gold){
            this.gold_ = params.gold;
        }
        if(params.mana){
            this.mana_ = params.mana;
        }
    }

    public onPlayerInfo_(event: egret.Event){
        let params = event.data;
        if(this.playerID_ != null && this.playerID_ != params.playerID){
            return ;
        }
        this.populate(params);
    }

    public populate(params:any){
        this.playerID_ = params.playerID;
        this.playerName_ = params.playerName;
        this.level_ = params.lev;
        this.playerUID_ = params.playerUID;
        this.exp_ = params.exp;
        this.gold_ = params.gold;
        this.mana_ = params.mana;

    }

    public toPlayerInfo(){
        let player_info = {
            playerUID:this.playerUID_,
            playerID: this.playerID_,
            playerName:this.playerName_,
            lev: this.level_,
            exp : this.exp_,
            mana: this.mana_,
            gold:this.gold_,
        }
        return player_info;
    }

    public savePlayerInfo(){
        let player_info = this.toPlayerInfo();
        Alun.Backend.get().request(Alun.mid.SAVE_PLAYER_INFO,player_info);
    }

    public get playerName():string{
        return this.playerName_;
    }

    public get mana(){
        return this.mana_;
    }

    public get gold(){
        return this.gold_;
    }

    public get level(){
        return this.level_;
    }

    public get playerID(){
        return  this.playerID_;
    }

    public get playerUID(){
        return this.playerUID_;
    }

    public get playerExp(){
        return this.exp_;
    }

}