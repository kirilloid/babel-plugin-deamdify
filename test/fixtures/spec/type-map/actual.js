define('a', ['_'], function(_) {
    /** @constructor */
    function A () {}
    /**
     * @param {string} s
     * @return {string}
     */
    A.prototype.a = function a (s) {
        return _.trim(s);
    };
});
