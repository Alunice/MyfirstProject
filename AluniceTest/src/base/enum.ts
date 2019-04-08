namespace Alun{
    export enum LOGIN_STATUS{
        SUCCESS = 1,
        USER_NOT_EXIST = 2,
        PSW_ERROR = 3,
    }
    
    export enum GROUND_STATE{
        NORMAL = 1,
        DROUGHT = 2,
        DEEP_DROUGHT = 3,
        BLACK = 4,
        GRASS = 5,
    }

    export enum ALERT_TYPE{
        PLANT_INFO = 1,
        SHOP_INFO = 2,
        GROUND_INFO = 3,
    }
    


}