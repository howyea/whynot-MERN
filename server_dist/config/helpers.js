var path = require('path');
// Helper functions
function root(args) {
    var _a;
    args = Array.prototype.slice.call(arguments, 0);
    return path.join.apply(path, (_a = [__dirname]).concat.apply(_a, ['../../'].concat(args)));
}
exports.root = root;
