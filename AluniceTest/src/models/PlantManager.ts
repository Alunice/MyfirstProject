namespace Alun{
    export class PlantManager extends BaseClass {

        private static INSTANCE: PlantManager = null;

        public constructor(){
            super();
        }

        static get():PlantManager {
            if (PlantManager.INSTANCE == null){
                PlantManager.INSTANCE = new PlantManager();
            }
            return PlantManager.INSTANCE;
        }

        static reset(){
            if (!PlantManager.INSTANCE){
                return;
            }
            PlantManager.INSTANCE = null;
        }

        public getPlantInfo(plantID){
            return PlantManager.PLANT_INFO[plantID];
        }

        public getPlantName(plantID):string{
            return PlantManager.PLANT_INFO[plantID].name;
        }

        public getPlantStageCount(plantID):number{
            return PlantManager.PLANT_INFO[plantID].stageCount;
        }

        public getPlantSellMoney(plantID):number{
            return PlantManager.PLANT_INFO[plantID].sellMoney;
        }

        public getPlantSeedMoney(plantID):number{
            return PlantManager.PLANT_INFO[plantID].seedMoney;
        }

        public getPlantUnitTime(plantID):number{
            return PlantManager.PLANT_INFO[plantID].unitTime;
        }

        public getPlantSrcByStage(plantID,stageCount):string{
            let src = PlantManager.PLANT_INFO[plantID].name + "_" + stageCount + "_png";
            return src;
        }

        public getPlantSeed(plantID):string{
            let src = PlantManager.PLANT_INFO[plantID].name + "_seed_png";
            return src;
        }


//-------------------------------   PLANT_INFO  ---------------------------------

        //the plant image source path is plant name + _ + stageCount,
        //example:strawberry in the stageCount 1 pic src is "strawberry_1"
        //seed src is plant name + "_seed",
        private static PLANT_INFO = {
            10001 : {
                name : "strawberry",
                stageCount: 5,
                buyLevel: 1,
                sellMoney:20,
                seedMoney:10,
                unitTime:10,
            },
            10002 : {
                name : "corn",
                stageCount: 5,
                buyLevel: 1,
                sellMoney:30,
                seedMoney:15,
                unitTime:12,
            },
            10003 : {
                name : "whiteRadish",
                stageCount: 4,
                buyLevel: 1,
                sellMoney:35,
                seedMoney:18,
                unitTime:18,
            },
            10004 : {
                name : "redRadish",
                stageCount: 4,
                buyLevel: 1,
                sellMoney:37,
                seedMoney:19,
                unitTime:16,
            },
            10005 : {
                name : "potato",
                stageCount: 5,
                buyLevel: 2,
                sellMoney:40,
                seedMoney:20,
                unitTime:18,
            }
        }
    }
}