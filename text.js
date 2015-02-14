define(["require", "exports", './has'], function (require, exports, has) {
    var getText;
    if (has('host-browser')) {
        getText = function (url, callback) {
            var xhr = new XMLHttpRequest();
            xhr.onload = function () {
                callback(xhr.responseText);
            };
            xhr.open('GET', url, true);
            xhr.send(null);
        };
    }
    else if (has('host-node')) {
        var req = require;
        var fs = req.nodeRequire('fs');
        getText = function (url, callback) {
            url = req.toUrl(url);
            fs.readFile(url, { encoding: 'utf8' }, function (error, data) {
                if (error) {
                    throw error;
                }
                callback(data);
            });
        };
    }
    else {
        getText = function () {
            throw new Error('dojo/text not supported on this platform');
        };
    }
    function load(resourceId, require, load) {
        getText(resourceId, load);
    }
    exports.load = load;
});
//# sourceMappingURL=text.js.map