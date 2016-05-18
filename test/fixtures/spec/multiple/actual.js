define('a', ['jQuery'], function($) {
    /** @constructor */
    function A () {}
    /**
     * @param {string} s
     * @return {string}
     */
    A.prototype.a = function a (s) {
        return $.trim(s);
    };
});

define('b', ['jQuery'], function($) {
    /** @constructor */
    function B () {}
    /**
     * @param {string} s
     * @return {string}
     */
    B.prototype.b = function b (s) {
        return $.grim(s);
    };
});
