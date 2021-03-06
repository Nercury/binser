/**
 * Created by brolis on 2014-06-08.
 */

var types = require('../lib/types.js');

var process = function(s, stuff) {
    return s.deserialize(s.serialize(stuff));
};

module.exports = {
    Int8: function (test) {
        var s = types.Int8;
        test.equals(74, process(s, 74));
        test.equals(0, process(s, 0));
        test.equals(-1, process(s, -1));
        test.equals(127, process(s, 127));
        test.equals(-128, process(s, -128));
        test.throws(function () { process(s, 128) });
        test.throws(function () { process(s, -129) });
        test.done();
    },
    UInt8: function (test) {
        var s = types.UInt8;
        test.equals(74, process(s, 74));
        test.equals(0, process(s, 0));
        test.equals(255, process(s, 255));
        test.throws(function () { process(s, -1) });
        test.throws(function () { process(s, 256) });
        test.done();
    },
    Int16: function (test) {
        var s = types.Int16;
        test.equals(74, process(s, 74));
        test.equals(300, process(s, 300));
        test.equals(-74, process(s, -74));
        test.equals(-300, process(s, -300));
        test.throws(function () { process(s, 32768) });
        test.throws(function () { process(s, -32769) });
        test.done();
    },
    UInt16: function (test) {
        var s = types.UInt16;
        test.equals(74, process(s, 74));
        test.equals(300, process(s, 300));
        test.equals(32768, process(s, 32768));
        test.equals(65535, process(s, 65535));
        test.throws(function () { process(s, -1) });
        test.throws(function () { process(s, 65536) });
        test.done();
    },
    Int32: function (test) {
        var s = types.Int32;
        test.equals(74, process(s, 74));
        test.equals(300, process(s, 300));
        test.equals(-74, process(s, -74));
        test.equals(-300, process(s, -300));
        test.equals(2147483647, process(s, 2147483647));
        test.equals(-2147483648, process(s, -2147483648));
        test.throws(function () { process(s, 2147483648) });
        test.throws(function () { process(s, -2147483649) });
        test.done();
    },
    UInt32: function (test) {
        var s = types.UInt32;
        test.equals(74, process(s, 74));
        test.equals(300, process(s, 300));
        test.equals(32768, process(s, 32768));
        test.equals(65535, process(s, 65535));
        test.equals(4294967295, process(s, 4294967295));
        test.throws(function () { process(s, -1) });
        test.throws(function () { process(s, 4294967296) });
        test.done();
    },
    CompactNumber: function (test) {
        var s = types.CompactNumber;
        test.equals(0, process(s, 0));
        test.equals(1, process(s, 1));
        test.equals(-1, process(s, -1));
        test.equals(126, process(s, 126));
        test.equals(127, process(s, 127));
        test.equals(128, process(s, 128));
        test.equals(-126, process(s, -126));
        test.equals(-127, process(s, -127));
        test.equals(-128, process(s, -128));
        test.equals(-129, process(s, -129));
        test.equals(254, process(s, 254));
        test.equals(255, process(s, 255));
        test.equals(256, process(s, 256));
        test.equals(257, process(s, 257));
        test.equals(358, process(s, 358));
        test.equals(-358, process(s, -358));
        test.equals(32767, process(s, 32767));
        test.equals(32768, process(s, 32768));
        test.equals(-32768, process(s, -32768));
        test.equals(-32769, process(s, -32769));
        test.equals(32769, process(s, 32769));
        test.equals(65535, process(s, 65535));
        test.equals(2147483647, process(s, 2147483647));
        test.equals(-2147483648, process(s, -2147483648));
        test.equals(4294967295, process(s, 4294967295));
        test.throws(function () { process(s, 4294967296) });
        test.throws(function () { process(s, -2147483649) });
        test.done();
    },
    String: function (test) {
        var s = types.String;
        test.equals("", process(s, ""));
        test.equals("a", process(s, "a"));
        test.equals("<html></html>", process(s, "<html></html>"));
        test.equals("Hello\nworld", process(s, "Hello\nworld"));
        test.done();
    }
};