define(["require", "exports", './CallbackQueue', './nextTick'], function (require, exports, CallbackQueue, nextTick) {
    var Scheduler = (function () {
        function Scheduler() {
            this._callbacks = new CallbackQueue();
        }
        Scheduler.schedule = function (callback) {
            return scheduler.schedule(callback);
        };
        Scheduler.prototype.schedule = function (callback) {
            var _this = this;
            var handle = this._callbacks.add(callback);
            nextTick(function () {
                _this._callbacks.drain();
            });
            return handle;
        };
        return Scheduler;
    })();
    var scheduler = new Scheduler();
    return Scheduler;
});
//# sourceMappingURL=Scheduler.js.map