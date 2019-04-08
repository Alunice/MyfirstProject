namespace Alun{
    export class WindowManager extends BaseClass {
        static MANUAL_WIDTH = 1000;
        static MANUAL_HEIGHT = 1920;

        private static INSTANCE: WindowManager = null;
        
        private loadingWindows_ = {};
        private windowContexts_ = [];


        public constructor(){
            super();
            this.windowContexts_ = [];
        }

        static get():WindowManager {
            if (WindowManager.INSTANCE == null){
                WindowManager.INSTANCE = new WindowManager();
            }
            return WindowManager.INSTANCE;
        }

        static reset(){
            if (!WindowManager.INSTANCE){
                return;
            }
            WindowManager.INSTANCE = null;
        }

        public openWindow(name: string, params:any = {},callback: Function = null){
            console.log("openWindow "+ name);
            let complete = function(win: BaseWindow){
                if (callback != null){
                    callback(win);
                }
            }.bind(this);

            if (name == null){
                return complete();
            }
            
            if (this.loadingWindows_[name])
                return ;
            
            let windowContext = this.windowContexts_[name];
            let win:BaseWindow = null;

            // openwindow by name
            if (windowContext == null ){
                let windowClass = name;
                if (window[windowClass]){
                    win = new window[windowClass](name,params);
                }
            } else {
                win = windowContext;
            }

            if (win == null){
                return complete();
            }

            if (windowContext == null){
                this.loadingWindows_[win.name] = win;
                win.loadAsset(null,function(win){
                    this.onWindowLoaded(win, params, complete)
                }.bind(this));
            }
            return win;

        }
        public onWindowLoaded(win: BaseWindow, params, complete){
            if (win == null){
                return complete();
            }
            this.loadingWindows_[win.name] = null;
            this.addWindow(win, params, complete);
        }

        public addWindow(win: BaseWindow, params, complete){
            if (win == null){
                return complete();
            }
            let windowContext = this.windowContexts_[win.name]
            if (windowContext == null || windowContext != win){
                windowContext = win;
            }
            this.windowContexts_[win.name] = win;
            params = params?params : {};
            win.willOpen(params);
            win.addToUILayer();
            complete(win);
        }

        public closeWindow(windowIdenfier: any,callback = null,params = null){
            console.log("closeWindow ",windowIdenfier)
            let complete = function(win:BaseWindow){
                if(callback != null){
                    callback(win);
                }
            }.bind(this);

            if(windowIdenfier == null){
                return complete(null);
            }

            let name = null;
            if(typeof(windowIdenfier) == "string"){
                name = windowIdenfier;
            }else{
                name = windowIdenfier.name;
            }

            this.cancelLoadingWindow(name);

            let windowContext = this.windowContexts_[name];
            if (windowContext == null){
                return complete(null);
            }
            this.removeWindow(windowContext,complete,params);

        }

        public cancelLoadingWindow(name){
            let win = this.loadingWindows_[name];
            if (!win){
                return ;
            }
            this.loadingWindows_[name] = null;
        }

        public removeWindow(win:BaseWindow,callback = null,params = null){
            let complete = function(win){
                if (callback != null){
                    callback(win);
                }
            }
            if (win == null){
                return complete(null);
            }

            params = params?params:{};
            win.willClose(params);
            let windowContext = this.windowContexts_[win.name];

            if (windowContext != null && windowContext != win){
                return complete(null);
            }

            this.windowContexts_[win.name] = null;
            win.dispose(params);
            complete(win);

        }

        public getWindow(name){
            return this.windowContexts_[name];    
        }

    }
}