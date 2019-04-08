class BaseWindow extends eui.Component {
	public name = "";
	protected params;
	public closeFunc = null;

	protected _isInit: boolean;
	protected _myParent: eui.UILayer;
	protected closeBtn: eui.Button;

	protected _layer:number = 0;
	protected _zorder: number = 0;
	private timeoutIDs = [];

	public constructor(name: string, params: any) {
		super();
		this.name = name;
		this.params = params || null;
		this._isInit = false;
	}

	public get myParent(): eui.UILayer{
		return this._myParent;
	}

	public isInit():boolean{
		return this._isInit;
	}

	public isShow(): boolean{
		return this.stage != null && this.visible;
	}

	public removeFromParent():void {
		if (this.parent == null){
			return ;
		}
		this.parent.removeChild(this);
	}
	
	public setVisible(value: boolean):void{
		this.visible = value;
	}

	public loadAsset(loadCompelet: Function = null, initComplete: Function = null){
		if (loadCompelet){
			loadCompelet(this);
		}
		if (initComplete){
			initComplete(this);
		}
	}

	public initWindow(){
		this._isInit = true;
	}

	public willOpen(params){

	}

	public didOpen(params){

	}

	public willClose(params){

		for(let i = 0;i<this.timeoutIDs.length;i++){
			let id = this.timeoutIDs[i];
			if(id){
				egret.clearTimeout(id);
			}
		}
		this.timeoutIDs = [];
	}

	public didClose(params){
		
	}

	public addToUILayer(){
		let layer = Alun.DisplayManager.get().getUIStageByLayer(this._layer);
		this._myParent = layer;
		this._myParent.addChildAt(this,this._zorder);
		this.visible = false;
		this.initWindow();
		this.didOpen(this.params)
		this.visible = true;
	}

	public dispose(params){
		this.didClose(params);
		this.removeFromParent();
		this._myParent = null;
	}

	public setTimeout(listener: Function,thisOBJ, delay: number,...args:any[]){
		let tid = egret.setTimeout((args)=>{
			listener(args);
		},thisOBJ,delay);
		this.timeoutIDs.push(tid);
		return tid;
	}

}