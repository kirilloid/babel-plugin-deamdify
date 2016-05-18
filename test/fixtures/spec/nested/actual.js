define('a', ['jQuery'], function($) {
    /** @constructor */
    function A () {}
    /**
     * @param {string} s
     * @return {string}
     */
    A.prototype.a = function a (s) {
        var fn;
        define('b', ['lodash'], function(_) {
            fn = _.trim;
        });
        return fn(s);
    };
});
