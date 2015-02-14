define(["require", "exports"], function (require, exports) {
    var ObservableArray = (function () {
        function ObservableArray(length) {
            if (length === void 0) { length = 0; }
            Object.defineProperty(this, 'length', {
                configurable: false,
                enumerable: false,
                value: length,
                writable: true
            });
        }
        ObservableArray.from = function (items) {
            var observable = new ObservableArray(items.length);
            for (var i = 0; i < items.length; i++) {
                if (items.hasOwnProperty(i)) {
                    observable[i] = items[i];
                }
            }
            return observable;
        };
        ObservableArray.prototype.concat = function () {
            var _this = this;
            var items = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                items[_i - 0] = arguments[_i];
            }
            var array = [];
            this.forEach(function (item, index) {
                array[index] = item;
            });
            items = items.map(function (item) {
                if (item instanceof _this.constructor) {
                    return Array.prototype.slice.call(item, 0);
                }
                return item;
            });
            return ObservableArray.from(Array.prototype.concat.apply(array, items));
        };
        ObservableArray.prototype.every = function (callback, thisObject) {
            return Array.prototype.every.apply(this, arguments);
        };
        ObservableArray.prototype.filter = function (callback, thisObject) {
            return ObservableArray.from(Array.prototype.filter.apply(this, arguments));
        };
        ObservableArray.prototype.forEach = function (callback, thisObject) {
            Array.prototype.forEach.apply(this, arguments);
        };
        ObservableArray.prototype.indexOf = function (searchElement, fromIndex) {
            return Array.prototype.indexOf.apply(this, arguments);
        };
        ObservableArray.prototype.join = function (separator) {
            return Array.prototype.join.apply(this, arguments);
        };
        ObservableArray.prototype.lastIndexOf = function (searchElement, fromIndex) {
            return Array.prototype.lastIndexOf.apply(this, arguments);
        };
        ObservableArray.prototype.map = function (callback, thisObject) {
            return ObservableArray.from(Array.prototype.map.apply(this, arguments));
        };
        ObservableArray.prototype.observe = function (observer) {
            return {
                remove: function () {
                }
            };
        };
        ObservableArray.prototype.pop = function () {
            return this.splice(this.length - 1, 1)[0];
        };
        ObservableArray.prototype.push = function () {
            var items = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                items[_i - 0] = arguments[_i];
            }
            this.splice.apply(this, [this.length, 0].concat(items));
            return this.length;
        };
        ObservableArray.prototype.reduce = function (callback, initialValue) {
            return Array.prototype.reduce.apply(this, arguments);
        };
        ObservableArray.prototype.reduceRight = function (callback, initialValue) {
            return Array.prototype.reduceRight.apply(this, arguments);
        };
        ObservableArray.prototype.reverse = function () {
            Array.prototype.reverse.call(this);
            return this;
        };
        ObservableArray.prototype.set = function (index, value) {
            var oldValue = this[index];
            this[index] = value;
        };
        ObservableArray.prototype.shift = function () {
            return this.splice(0, 1)[0];
        };
        ObservableArray.prototype.slice = function (start, end) {
            return ObservableArray.from(Array.prototype.slice.apply(this, arguments));
        };
        ObservableArray.prototype.some = function (callback, thisObject) {
            return Array.prototype.some.apply(this, arguments);
        };
        ObservableArray.prototype.sort = function (compare) {
            Array.prototype.sort.apply(this, arguments);
            return this;
        };
        ObservableArray.prototype.splice = function (start, deleteCount) {
            if (deleteCount === void 0) { deleteCount = 1; }
            var items = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                items[_i - 2] = arguments[_i];
            }
            var removals = Array.prototype.splice.apply(this, arguments);
            return ObservableArray.from(removals);
        };
        ObservableArray.prototype.unshift = function () {
            var items = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                items[_i - 0] = arguments[_i];
            }
            this.splice.apply(this, [0, 0].concat(items));
            return this.length;
        };
        return ObservableArray;
    })();
    var oldPrototype = ObservableArray.prototype, newPrototype = ObservableArray.prototype = Object.create(Array.prototype);
    Object.getOwnPropertyNames(Array.prototype).forEach(function (name) {
        var descriptor = Object.getOwnPropertyDescriptor(Array.prototype, name);
        if (name in oldPrototype) {
            descriptor.value = oldPrototype[name];
        }
        Object.defineProperty(newPrototype, name, descriptor);
    });
    return ObservableArray;
});
//# sourceMappingURL=ObservableArray.js.map