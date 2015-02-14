define(["require", "exports"], function (require, exports) {
    function objectToQuery(map) {
        var query = [];
        var value;
        for (var key in map) {
            value = map[key];
            key = encodeURIComponent(key);
            if (typeof value === 'boolean') {
                value && query.push(key);
            }
            else if (Array.isArray(value)) {
                for (var i = 0, j = value.length; i < j; ++i) {
                    query.push(key + '=' + encodeURIComponent(value[i]));
                }
            }
            else {
                query.push(key + '=' + encodeURIComponent(value));
            }
        }
        return query.join('&');
    }
    exports.objectToQuery = objectToQuery;
});
//# sourceMappingURL=io-query.js.map