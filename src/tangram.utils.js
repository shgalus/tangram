var TANGRAM = TANGRAM || {};

TANGRAM.utils = (function() {
  "use strict";

  var assert, sqr;

  assert = function(condition, message) {
    if (!condition)
      throw new Error(message || "Assertion failed");
  };

  sqr = function(x) {
    return x * x;
  };

  return {
    assert: assert,
    sqr: sqr
  };

}());
