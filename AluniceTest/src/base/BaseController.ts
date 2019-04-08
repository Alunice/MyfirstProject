class BaseController{
    
    protected eventProxy_: EventProxy;

    public constructor(){
        this.eventProxy_ = new EventProxy(Alun.EventDispatcher.get(),this);
    }

    public onRegister():void{

    }

    public registerEvent(eventName: string, callback: Function,listener?:any):void{
        this.eventProxy_.addEventListener(eventName,callback,listener);
    }

    public reset():void{
        this.eventProxy_.removeAllEventListener();
    }
}

