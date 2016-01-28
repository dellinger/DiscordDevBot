"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

console.log("Hello World");

var Test = function (_TestParent) {
    _inherits(Test, _TestParent);

    function Test(someField) {
        _classCallCheck(this, Test);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Test).call(this));

        _this.doSomething = function (withSomeData) {
            console.log("Doing something with " + withSomeData);
        };

        _this.someField = someField;
        return _this;
    }

    return Test;
}(TestParent);
//# sourceMappingURL=all.js.map
