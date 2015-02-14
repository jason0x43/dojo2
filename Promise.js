define(["require", "exports", './nextTick'], function (require, exports, nextTick) {
    function isPromise(value) {
        return value && typeof value.then === 'function';
    }
    function runCallbacks(callbacks) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        for (var i = 0, callback; callback = callbacks[i]; ++i) {
            callback.apply(null, args);
        }
    }
    var Deferred = (function () {
        function Deferred(canceler) {
            var _this = this;
            this.promise = new Promise(function (resolve, reject, progress, setCanceler) {
                _this.progress = progress;
                _this.reject = reject;
                _this.resolve = resolve;
                canceler && setCanceler(canceler);
            });
        }
        return Deferred;
    })();
    var Promise = (function () {
        function Promise(initializer) {
            var state = 0 /* PENDING */;
            Object.defineProperty(this, 'state', {
                get: function () {
                    return state;
                }
            });
            function isResolved() {
                return state !== 0 /* PENDING */ || isChained;
            }
            var isChained = false;
            var resolvedValue;
            var callbacks = [];
            var whenFinished = function (callback) {
                callbacks.push(callback);
            };
            var progressCallbacks = [];
            var whenProgress = function (callback) {
                progressCallbacks.push(callback);
            };
            var canceler;
            var enqueue = (function () {
                function originalSchedule() {
                    schedule = function () {
                    };
                    nextTick(function run() {
                        try {
                            var callback;
                            while ((callback = queue.shift())) {
                                callback();
                            }
                        }
                        finally {
                            if (queue.length) {
                                run();
                            }
                            else {
                                schedule = originalSchedule;
                            }
                        }
                    });
                }
                var queue = [];
                var schedule = originalSchedule;
                return function (callback) {
                    queue.push(callback);
                    schedule();
                };
            })();
            var resolve = function (newState, value) {
                if (isResolved()) {
                    return;
                }
                if (isPromise(value)) {
                    if (value === this) {
                        throw new TypeError('Cannot chain a promise to itself');
                    }
                    isChained = true;
                    value.then(settle.bind(null, 1 /* FULFILLED */), settle.bind(null, 2 /* REJECTED */));
                    this.cancel = value.cancel;
                }
                else {
                    settle(newState, value);
                }
            }.bind(this);
            function settle(newState, value) {
                state = newState;
                resolvedValue = value;
                whenFinished = enqueue;
                whenProgress = function () {
                };
                enqueue(function () {
                    runCallbacks(callbacks);
                    callbacks = progressCallbacks = null;
                });
            }
            this.cancel = function (reason) {
                if (isResolved() || !canceler) {
                    return;
                }
                if (!reason) {
                    reason = new Error();
                    reason.name = 'CancelError';
                }
                try {
                    resolve(1 /* FULFILLED */, canceler(reason));
                }
                catch (error) {
                    settle(2 /* REJECTED */, error);
                }
            };
            this.then = function (onFulfilled, onRejected, onProgress) {
                return new Promise(function (resolve, reject, progress, setCanceler) {
                    setCanceler(function (reason) {
                        if (canceler) {
                            resolve(canceler(reason));
                            return;
                        }
                        throw reason;
                    });
                    whenProgress(function (data) {
                        try {
                            if (typeof onProgress === 'function') {
                                progress(onProgress(data));
                            }
                            else {
                                progress(data);
                            }
                        }
                        catch (error) {
                            if (error.name !== 'StopProgressPropagation') {
                                throw error;
                            }
                        }
                    });
                    whenFinished(function () {
                        var callback = state === 2 /* REJECTED */ ? onRejected : onFulfilled;
                        if (typeof callback === 'function') {
                            try {
                                resolve(callback(resolvedValue));
                            }
                            catch (error) {
                                reject(error);
                            }
                        }
                        else if (state === 2 /* REJECTED */) {
                            reject(resolvedValue);
                        }
                        else {
                            resolve(resolvedValue);
                        }
                    });
                });
            };
            try {
                initializer(resolve.bind(null, 1 /* FULFILLED */), resolve.bind(null, 2 /* REJECTED */), function (data) {
                    if (state === 0 /* PENDING */) {
                        enqueue(runCallbacks.bind(null, progressCallbacks, data));
                    }
                }, function (value) {
                    canceler = value;
                });
            }
            catch (error) {
                settle(2 /* REJECTED */, error);
            }
        }
        Promise.all = function (iterable) {
            return new this(function (resolve, reject, progress, setCanceler) {
                setCanceler(function (reason) {
                    walkIterable(function (key, value) {
                        if (value && value.cancel) {
                            value.cancel(reason);
                        }
                    });
                    return values;
                });
                function fulfill(key, value) {
                    values[key] = value;
                    progress(values);
                    ++complete;
                    finish();
                }
                function finish() {
                    if (populating || complete < total) {
                        return;
                    }
                    resolve(values);
                }
                function processItem(key, value) {
                    ++total;
                    if (isPromise(value)) {
                        value.then(fulfill.bind(null, key), reject.bind(null));
                    }
                    else {
                        fulfill(key, value);
                    }
                }
                function walkIterable(callback) {
                    if (Array.isArray(iterable)) {
                        for (var i = 0, j = iterable.length; i < j; ++i) {
                            if (i in iterable) {
                                callback(String(i), iterable[i]);
                            }
                        }
                    }
                    else {
                        for (var key in iterable) {
                            callback(key, iterable[key]);
                        }
                    }
                }
                var values = Array.isArray(iterable) ? [] : {};
                var complete = 0;
                var total = 0;
                var populating = true;
                walkIterable(processItem);
                populating = false;
                finish();
            });
        };
        Promise.reject = function (error) {
            return new this(function (resolve, reject) {
                reject(error);
            });
        };
        Promise.resolve = function (value) {
            if (value instanceof Promise) {
                return value;
            }
            return new this(function (resolve) {
                resolve(value);
            });
        };
        Promise.prototype.catch = function (onRejected) {
            return this.then(null, onRejected);
        };
        Promise.prototype.finally = function (onFulfilledOrRejected) {
            return this.then(onFulfilledOrRejected, onFulfilledOrRejected);
        };
        Promise.prototype.progress = function (onProgress) {
            return this.then(null, null, onProgress);
        };
        Promise.Deferred = Deferred;
        return Promise;
    })();
    var Promise;
    (function (Promise) {
        (function (State) {
            State[State["PENDING"] = 0] = "PENDING";
            State[State["FULFILLED"] = 1] = "FULFILLED";
            State[State["REJECTED"] = 2] = "REJECTED";
        })(Promise.State || (Promise.State = {}));
        var State = Promise.State;
    })(Promise || (Promise = {}));
    return Promise;
});
//# sourceMappingURL=Promise.js.map