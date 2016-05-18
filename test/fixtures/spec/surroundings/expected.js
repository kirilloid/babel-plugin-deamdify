/*! some banner */
console.log('before');

/** @type {jQuery} */var $;

/** @constructor */
function A() {}
/**
 * @param {string} s
 * @return {string}
 */
A.prototype.a = function a(s) {
    return $.trim(s);
};


console.log('after');
console.log('after2');

