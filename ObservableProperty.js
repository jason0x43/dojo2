var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", './Observable'], function (require, exports, Observable) {
    var ObservableProperty = (function (_super) {
        __extends(ObservableProperty, _super);
        function ObservableProperty(observable, property) {
            var _this = this;
            this._observable = observable;
            this._propertyName = property;
            this._handle = observable.observe(property, function (newValue, oldValue) {
                _this._notify('value', newValue, oldValue);
            });
            _super.call(this);
            this._callbacks['value'] = [];
        }
        Object.defineProperty(ObservableProperty.prototype, "value", {
            get: function () {
                return this._observable[this._propertyName];
            },
            set: function (value) {
                this._observable[this._propertyName] = value;
            },
            enumerable: true,
            configurable: true
        });
        ObservableProperty.prototype.destroy = function () {
            this._handle.remove();
            this._observable = null;
        };
        ObservableProperty.prototype._schedule = function () {
            this._dispatch();
        };
        return ObservableProperty;
    })(Observable);
    return ObservableProperty;
});
//# sourceMappingURL=ObservableProperty.js.map