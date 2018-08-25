
module.exports = function() {
    this.Result = class {
    }
    Result.Success = "success";
    Result.Failure = "failure";
    Result.Pending = "pending";
    Result.Error = "error";
};