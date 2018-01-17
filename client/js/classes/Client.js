class Client {
    constructor() {
        this.id = null;
        this.map = null;
        this.backupMap = null;
        this.player = null;
        this.debugOn = true;
    }

    //Set the players map and make a backup for map editor
    setMap(map) {
        this.map = map;
        this.backupMap = JSON.parse(JSON.stringify(map));
    }

    //Check if client has account type
    is(accountType) {
        if(accountType == null) return true;
        if (this.player === null) return false;

        //If given an array of account types
        if (Array.isArray(accountType)) {
            for (let i in accountType)
                if (accountType[i] === this.player.accountType) return true;
            return false;
        }

        //If given a single account type as a string
        return this.player.accountType === accountType;
    }
}