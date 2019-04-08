namespace Alun{
    export class EventDispatcher extends egret.EventDispatcher{
        private static INSTANCE:EventDispatcher = null;
        
        public constructor(target:egret.IEventDispatcher = null){
            super();
        }

        static get():EventDispatcher {
            if (EventDispatcher.INSTANCE == null){
                EventDispatcher.INSTANCE = new EventDispatcher();
            }
            return EventDispatcher.INSTANCE;
        }
    }
}