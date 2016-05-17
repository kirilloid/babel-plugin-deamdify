// import template from "babel-template";
import generate from "babel-generator";
import * as t from "babel-types";
import { parse } from "babylon";

const typesMap = {
    'jQuery': 'jQuery',
    '_': 'lodash'
}

// const typeAnnotatedImport = template(`
//    /** @type {TYPE} */
//    var NAME;
//`);

const transformModule = (deps, init) => {
    let output = [];
    deps.elements.forEach(function (dep, i) {
        let type = typesMap[dep.value];
        let id = init.params[i];
        if (type || id.leadingComments) {
            let node = t.variableDeclaration('var', [
                t.variableDeclarator(id)
            ]);
            node.leadingComments = id.leadingComments || [{
                type: "CommentBlock",
                value: `* @type {${type}} `
            }];
            output.push(node);
        }
    });
    output.push(...init.body.body);
    var last = output.pop();
    if (!t.isReturnStatement(last)) {
        output.push(last);
    }
    return output;
};

const defineVisitor = {
    CallExpression (path) {
        let { callee, args: [, deps, init] } = path.node.expression;
        if (!t.isMemberExpression(callee)) return false;
        let { object, property } = callee;
        if (!t.isIdentifier(object, { name: "CTC" })) return false;
        if (!t. isIdentifier(property, { name: "define" })) return false;
        if (!t.isStringLiteral(name)) return;
        if (!t.isArrayExpression(deps)) return;
        if (!t.isFunctionExpression(init)) return;
        path.replaceWithMultiple(transformModule(deps, init));
    }
}

const code = `
CTC.define('a', ['jQuery'], function($) {
    /** @constructor */
    function A () {}
    /**
     * @param {string} x
     * @return {string}
     */
    A.prototype.a = function a (s) {
        return $.trim(s);
    }
    return A;
});`;

const ast = parse(code);
let [, deps, init] = ast.program.body[0].expression.arguments;

var newAst = t.blockStatement(transformModule(deps, init));

const newCode = generate(newAst, null, code);
console.log(newCode.code);