define(["require", "exports"], function (require, exports) {
    exports.version = {
        major: 2,
        minor: 0,
        patch: 0,
        flag: 'dev',
        revision: ('$Rev$'.match(/[0-9a-f]{7,}/) || [])[0],
        toString: function () {
            var v = this;
            return v.major + '.' + v.minor + '.' + v.patch + (v.flag ? '-' + v.flag : '') + (v.revision ? '+' + v.revision : '');
        }
    };
});
//# sourceMappingURL=kernel.js.map