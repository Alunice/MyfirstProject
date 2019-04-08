class BaseClass {
	public constructor() {
	}

	public static getInstance():any{
		var Class:any = this;
		if(!Class._instance){
			Class._instance = new Class();
		}
		return Class._instance;
	}
}