class EventProxy{
    private eventDispatcher_:egret.EventDispatcher;
    private handles_:Array<any>;
    private listnerObj_:any;

    public constructor(eventDispatcher:egret.EventDispatcher, listenerObj:any){
        this.eventDispatcher_ = eventDispatcher;
        this.listnerObj_ = listenerObj;
        this.handles_ = new Array<any>();
    }

    public addEventListener(eventName:string,listener:Function,listenerObj?:any):number{
        this.eventDispatcher_.addEventListener(eventName,listener,listenerObj || this.listnerObj_);
        let handle = this.handles_.length;
        this.handles_[handle] = [eventName, listener, listenerObj || this.listnerObj_];
        return handle;
    }

    public removeEventListenerByName(eventName:string):void{
        for(let i = 0;i<this.handles_.length;i++){
            let pair = this.handles_[i];
            if(pair && pair[0] == eventName){
                this.eventDispatcher_.removeEventListener(pair[0],pair[1],pair[2]);
                this.handles_[i] = null;
                break;
            }
        }
    }

    public removeEventListener(eventHandle:number):void{
        let pair = this.handles_[eventHandle];
        if(pair){
             this.eventDispatcher_.removeEventListener(pair[0],pair[1],pair[2]);
             this.handles_[eventHandle] = null;
        }
    }

    public removeAllEventListenerByName(eventName:string):void{
        for(let i = 0;i<this.handles_.length;i++){
            let pair = this.handles_[i];
            if(pair && pair[0] == eventName){
                this.eventDispatcher_.removeEventListener(pair[0],pair[1],pair[2]);
                this.handles_[i] = null;
            }
        }
    }

    public removeAllEventListener():void{
        for(let i = 0;i<this.handles_.length;i++){
            let pair = this.handles_[i];
            if(pair){
                this.eventDispatcher_.removeEventListener(pair[0],pair[1],pair[2]);
                this.handles_[i] = null;
            }
        }
        this.handles_ = new Array<any>();
    }

    public getEventHandle(eventName:string):number{
        for(let i = 0; i<this.handles_.length;i++){
            let pair = this.handles_[i];
            if (pair && pair[0] == eventName){
                return i;
            }
        }
        return -1;
    }

}