namespace Alun{
    export class db{
        private static GAME_DB:GameDb;
        private static PLAYER_DB:PlayerDb;
        private static FARM_DB:FarmDb;
        private static BACKPACK_DB:BackPackDb;

        constructor(){
        }

        public static get gamedb(){
            if (db.GAME_DB == null){
                db.GAME_DB = new GameDb();
            }
            return db.GAME_DB;
        }

        public static get playerdb(){
            if (db.PLAYER_DB == null){
                db.PLAYER_DB = new PlayerDb();
            }
            return db.PLAYER_DB;
        }

        public static get farmdb(){
            if (db.FARM_DB == null){
                db.FARM_DB = new FarmDb();
            }
            return db.FARM_DB;
        }

        public static get backpackdb(){
            if (db.BACKPACK_DB == null){
                db.BACKPACK_DB = new BackPackDb();
            }
            return db.BACKPACK_DB;
        }

    }
}

// restore the all uid infos
class GameDb{
    private data = {};
    private prefix = "GameDb:";
    private lastUID_ = "lastUid";
    private allPlayers = "allPlayers";
    private ALL_UIDS:any[];

    public constructor(){
    }
    public getLastUID(){
        let dbKey = this.prefix + this.lastUID_ ;
        let value = egret.localStorage.getItem(dbKey);
        return value;
    }

    public setLastUID(uid){
        let dbKey = this.prefix + this.lastUID_
        egret.localStorage.setItem(dbKey,uid);
    }

    public getAllPlayers():any[]{
        if (!this.ALL_UIDS){
            this.ALL_UIDS = [];
            let dbKey = this.prefix + this.allPlayers;
            let value = egret.localStorage.getItem(dbKey);
            let result = JSON.parse(value);
            if (result){
                this.ALL_UIDS = result;
            }
        }
        return this.ALL_UIDS;
    }

    private setAllPlayers(players:any[]){
        this.ALL_UIDS = players;
        let dbKey = this.prefix + this.allPlayers;
        let val = JSON.stringify(players);
        egret.localStorage.setItem(dbKey,val)
    }

    public initGameDbByUID(uid){
        this.getAllPlayers();
        this.ALL_UIDS.push(uid)
        this.setAllPlayers(this.ALL_UIDS);
    }
}

// restore the playeruid,player_id and player_name
class PlayerDb{
    private data = {};
    private prefix = "PlayerDb:";
    private default_id = 10000;
    private default_name = "Famer_";
    private default_gold = 0;
    private default_mana = 500;
    private default_exp = 0;
    private default_level = 1;

    public constructor(){
    }

    //the struct is  {playerUID: any;playerID: number;playerName: string;lev: number;gold: number;mana: number;exp: number;}
    public getPlayerInfoByUID(uid){
        let dbKey = this.prefix + uid;
        let val = egret.localStorage.getItem(dbKey);
        let result = JSON.parse(val);
        return result;
    }

    public setPlayerInfo(player_info){
        let uid = player_info.playerUID;
        let dbKey = this.prefix + uid;
        let val = JSON.stringify(player_info);
        egret.localStorage.setItem(dbKey,val);
    }

    public initPlayerDbByUID(uid):number{
        let allPlayers = Alun.db.gamedb.getAllPlayers();
        let player_id = this.default_id + allPlayers.length + 1;
        let player_name = this.default_name + player_id;
        let dbKey = this.prefix + uid;
        let value = {playerUID : uid, playerID : player_id, playerName: player_name, lev:this.default_level, 
            gold:this.default_gold, mana: this.default_mana, exp: this.default_exp,
        };
        let val = JSON.stringify(value);
        egret.localStorage.setItem(dbKey,val);
        
        return player_id;
    }
}

// restore the farm information
class FarmDb{
    private data = {};
    private prefix = "farmDb:";

    public constructor(){
    }
//the struct is  {playerID: number; farmInfo:{groundState,isLocked,plantInfo_}}
    public initFarmDbByPlayerID(player_id){
        let farmInfos = [];
        for(let i =1;i<=Alun.Global.MAX_FARM_NUM;i++){
            let groundInfo = {
                groundState:Alun.GROUND_STATE.NORMAL,
                plantInfo_:null,
                isLocked:true,
            };
            if(i <= 3){
                groundInfo.isLocked = false;
            }
            farmInfos.push(groundInfo);
        }
        let dbKey = this.prefix + player_id;
        let value = { playerID : player_id, farmInfo : farmInfos
        };
        let val = JSON.stringify(value);
        egret.localStorage.setItem(dbKey,val);
    }

    public setFarmInfos(farmInfos){
        let player_id = farmInfos.playerID;
        let dbKey = this.prefix + player_id;
        let val = JSON.stringify(farmInfos);
        egret.localStorage.setItem(dbKey,val);
    }

    public getFarmInfos(player_id){
        let dbKey = this.prefix + player_id;
        let val = egret.localStorage.getItem(dbKey);
        let result = JSON.parse(val);
        return result;
    }

}

// restore the backpack item information
class BackPackDb{
    private data = {};
    private prefix = "backpackDb:";

    public constructor(){
    }
//the backpack info struct is  {playerID: number; ItemInofs:{itemID(string),itemNum(number),itemType}}
    public initBackPackDbByPlayerID(player_id){
        let ItemInofs = [];
        let dbKey = this.prefix + player_id;
        let value = { playerID : player_id, ItemInofs : ItemInofs
        };
        let val = JSON.stringify(value);
        egret.localStorage.setItem(dbKey,val);
    }

    public setBackPackInfos(backpackInofs){
        let player_id = backpackInofs.playerID;
        let dbKey = this.prefix + player_id;
        let val = JSON.stringify(backpackInofs);
        egret.localStorage.setItem(dbKey,val);
    }

    public getBackPackInfos(player_id){
        let dbKey = this.prefix + player_id;
        let val = egret.localStorage.getItem(dbKey);
        let result = JSON.parse(val);
        return result;
    }

}