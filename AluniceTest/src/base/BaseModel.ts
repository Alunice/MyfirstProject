class BaseModel{
    private events: string[];
    private callbacks: Function[];
    private instances;
    public onRegister(){

    }

    protected constructor(){
        this.events = [];
        this.callbacks = [];
        this.instances = [];
    }

    public registerEvent(eventName: string, callback, thisObject){
        Alun.EventDispatcher.get().addEventListener(eventName, callback, thisObject);
        this.events.push(eventName);
        this.callbacks.push(callback);
        this.instances.push(thisObject);
    }

    public removeEvents(){
        let max = this.events.length;
        for(let i =0; i<max;i++){
            Alun.EventDispatcher.get().removeEventListener(this.events[i],this.callbacks[i],this.instances[i]);
        }
    }
}