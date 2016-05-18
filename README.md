# babel-plugin-deamdify
Strips AMD declarations to "export" inner declarations with jsdocs

&mdash; hey, google closure compiler, we have written jsdocs for our AMD-based code, maybe you can validate it?

```javascript
define('math', [], function () {
  /** @constructor */
  function Math () {}

  /**
   * @param {number} a
   * @param {number} b
   * @return {number}
   */
  Module.prototype.pow = function (a, b) {
    var m = 1;
    while (b--) m *= a;
    return m;
  };

  return Math;
});
define('module', ['math'], function (Math) {
  var math = new Math();

  /** @constructor */
  function Module () {}

  /**
   * @param {number} a
   * @param {number} b
   * @return {number}
   */
  Module.prototype.method = function (a, b) {
    return math.pow(a, b);
  };

  return Module;
});
```

&mdash; sorry, I can't validate math in the second module, because it's declared inside another scope<br>
&mdash; Okay, I'll transform them with babel plugin for you

See [discussion on stackoverflow](http://stackoverflow.com/q/35796212/255363) for some more details and [tests](fixtures/specs) for examples of transformations
