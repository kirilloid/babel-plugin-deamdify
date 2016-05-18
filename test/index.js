var generate = require("babel-generator")["default"];
var traverse = require("babel-traverse")["default"];
var t = require("babel-types");
var babylon = require("babylon");

var plugin = require("../lib/index.js")["default"];

var glob = require("glob");
var fs = require("fs");
var assert = require("assert");
var colors = require('colors/safe');

function compareAssert (actual, expected, message) {
    if (actual === expected) {
        console.log(colors.green('[ OK ] ') + message);
        return;
    }
    console.log(colors.red('[FAIL] ') + message);
    var eLines = expected.split('\n');
    var aLines = actual.split('\n');
    for (var i = 0; i < eLines.length; i++) {
        if (eLines[i] === aLines[i]) {
            console.log(' ' + eLines[i]);
        } else {
            console.log(colors.green('+' + aLines[i]));
            console.log(colors.red('-' + eLines[i]));
        }
    }
    assert.fail(actual, expected, "Didn't match");
}

glob('./test/fixtures/spec/*', function (err, dirs) {
    function readFile (dir, name) {
        return fs.readFileSync(dir + '/' + name, { encoding: 'utf-8' });
    }
    dirs.forEach(function (dir) {
        var initial = readFile(dir, 'actual.js');
        var expected = readFile(dir, 'expected.js').trim();
        try {
            var optionsStr = readFile(dir, 'options.json');
            plugin.options = JSON.parse(optionsStr);
        } catch (e) {
            plugin.options = null;
        }
        var ast = babylon.parse(initial);
        traverse(ast, plugin({ types: t }).visitor);

        var actual = generate(ast, null, initial).code.trim();
        var msg = dir.match(/[\w-]+$/)[0].replace(/-/g, ' ');
        compareAssert(actual, expected, msg);

    });
});

