/*! some banner */
console.log('before');

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

console.log('after');
console.log('after2');

