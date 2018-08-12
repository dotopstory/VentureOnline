
module.exports = function() {
    this.ServerState = class {
    }
    ServerState.Offline = "offline";
    ServerState.Loading = "loading";
    ServerState.Ready = "ready";
};