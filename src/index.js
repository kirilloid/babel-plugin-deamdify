/**
 * strips initializer function from AMD module declaration
 * and puts its dependencies at the beginning as local vars
 * also removes last return from the module
 */
const transformModule = (t, typesMap, deps, init) => {
    let output = [];
    deps.elements.forEach(function (dep, i) {
        // dependency type {string}
        let type = typesMap[dep.value] || dep.value;
        let param = init.params[i];
        // type is either present in global typesMap or is declared in-line
        let node = t.variableDeclaration('var', [
            t.variableDeclarator(param)
        ]);
        node.leadingComments = param.leadingComments || [{
            type: "CommentBlock",
            value: `* @type {${type}} `
        }];
        output.push(node);
    });
    output.push(...init.body.body);
    var last = output.pop();
    if (!t.isReturnStatement(last)) {
        output.push(last);
    }
    return output;
};

var _rootCheckersCache = {};

/**
 * checks that this is proper define function
 */
function rootNameToPathCheck (t, root) {
    var checker = _rootCheckersCache[root];
    if (checker) { return checker; }
    var parts = root.split('.');
    // special case for faster work
    if (parts.length === 1) {
        return _rootCheckersCache[root] = function rootChecker (node) {
            return t.isIdentifier(node, { name: root });
        }
    }
    /**
     * `My.Cool.Custom.define(...)` would be parsed into
     * callee: MemberExpression
     *   object: MemberExpression
     *     object: MemberExpression
     *       object: #My
     *       property: #Cool
     *     property: #Custom
     *   property: #define
     */
    return _rootCheckersCache[root] = function rootChecker (node) {
        for (var i = parts.length - 1; i > 0; i--) {
            if (!t.isMemberExpression(node)
            ||  !t.isIdentifier(node.property, { name: parts[i] })) {
                return false;
            }
            node = node.object;
        }
        return t.isIdentifier(node, { name: parts[0] });
    };
}

function plugin ({ types: t }) {
    return {
        visitor: {
            CallExpression (path, state) {
                let { root = "define",
                      typesMap = {}
                    }
                =   plugin.options      // work-around for tests
                ||  state && state.opts // normal way to pass options
                ||  {};                 // default empty object
                let { callee, arguments: [name, deps, init] } = path.node;
                if (rootNameToPathCheck(t, root)(callee)
                &&  t.isStringLiteral(name)
                &&  t.isArrayExpression(deps)
                &&  t.isFunctionExpression(init)) {
                    path.replaceWithMultiple(transformModule(t, typesMap, deps, init));
                }
            }
        }
    }
}

export default plugin;
