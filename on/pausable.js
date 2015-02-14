define(["require", "exports", '../on'], function (require, exports, on) {
    function pausable(type) {
        return function (target, listener, capture) {
            var paused;
            var handle = on(target, type, function () {
                if (!paused) {
                    listener.apply(this, arguments);
                }
            }, capture);
            handle.pause = function () {
                paused = true;
            };
            handle.resume = function () {
                paused = false;
            };
            return handle;
        };
    }
    return pausable;
});
//# sourceMappingURL=pausable.js.map