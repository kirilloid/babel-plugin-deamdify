"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }(); // import template from "babel-template";


var _babelGenerator = require("babel-generator");

var _babelGenerator2 = _interopRequireDefault(_babelGenerator);

var _babelTypes = require("babel-types");

var t = _interopRequireWildcard(_babelTypes);

var _babylon = require("babylon");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var typesMap = {
    'jQuery': 'jQuery',
    '_': 'lodash'
};

// const typeAnnotatedImport = template(`
//    /** @type {TYPE} */
//    var NAME;
//`);

var transformModule = function transformModule(deps, init) {
    var output = [];
    deps.elements.forEach(function (dep, i) {
        var type = typesMap[dep.value];
        var id = init.params[i];
        if (type || id.leadingComments) {
            var node = t.variableDeclaration('var', [t.variableDeclarator(id)]);
            node.leadingComments = id.leadingComments || [{
                type: "CommentBlock",
                value: "* @type {" + type + "} "
            }];
            output.push(node);
        }
    });
    output.push.apply(output, init.body.body);
    var last = output.pop();
    if (!t.isReturnStatement(last)) {
        output.push(last);
    }
    return output;
};

var defineVisitor = {
    CallExpression: function CallExpression(path) {
        var _path$node$expression = path.node.expression;
        var callee = _path$node$expression.callee;

        var _path$node$expression2 = _slicedToArray(_path$node$expression.args, 3);

        var deps = _path$node$expression2[1];
        var init = _path$node$expression2[2];

        if (!t.isMemberExpression(callee)) return false;
        var object = callee.object;
        var property = callee.property;

        if (!t.isIdentifier(object, { name: "CTC" })) return false;
        if (!t.isIdentifier(property, { name: "define" })) return false;
        if (!t.isStringLiteral(name)) return;
        if (!t.isArrayExpression(deps)) return;
        if (!t.isFunctionExpression(init)) return;
        path.replaceWithMultiple(transformModule(deps, init));
    }
};

var code = "\nCTC.define('a', ['jQuery'], function($) {\n    /** @constructor */\n    function A () {}\n    /**\n     * @param {string} x\n     * @return {string}\n     */\n    A.prototype.a = function a (s) {\n        return $.trim(s);\n    }\n    return A;\n});";

var ast = (0, _babylon.parse)(code);

var _ast$program$body$0$e = _slicedToArray(ast.program.body[0].expression.arguments, 3);

var deps = _ast$program$body$0$e[1];
var init = _ast$program$body$0$e[2];


var newAst = t.blockStatement(transformModule(deps, init));

var newCode = (0, _babelGenerator2.default)(newAst, null, code);
console.log(newCode.code);

