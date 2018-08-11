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
}