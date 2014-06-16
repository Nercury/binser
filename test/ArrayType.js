/* 
 * Copyright (c) Nerijus Arlauskas
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is furnished
 * to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/**
 * Created by Nercury on 2014-06-16.
 */

var ObjectType = require('../lib/ObjectType.js');
var ArrayType = require('../lib/ArrayType.js');
var types = require('../lib/types.js');

module.exports = {
    EmptyArrayType: function (test) {
        var emptyArrayType = new ArrayType(types.String);
        test.same(
            [],
            emptyArrayType.deserialize(emptyArrayType.serialize([]))
        );
        test.done();
    },
    ArrayOfInt32Type: function (test) {
        var int32ArrayType = new ArrayType(types.Int32);
        test.same(
            [ 18, -841, 95541 ],
            int32ArrayType.deserialize(int32ArrayType.serialize([ 18, -841, 95541 ]))
        );
        test.done();
    },
    ArrayOfCompactNumberType: function (test) {
        var int32ArrayType = new ArrayType(types.CompactNumber);
        test.same(
            [ 18, -841, 95541 ],
            int32ArrayType.deserialize(int32ArrayType.serialize([ 18, -841, 95541 ]))
        );
        test.done();
    },
    ArrayOfCustomType: function (test) {
        var MyType = new ObjectType({
            x : types.CompactNumber,
            y : types.CompactNumber,
            radius: types.CompactNumber
        });
        var int32ArrayType = new ArrayType(MyType);
        test.same(
            [ { x: 15, y: -2, radius: 80 }, { x: 2, y: -624, radius: 30 }, { x: 60, y: 33, radius: 3 } ],
            int32ArrayType.deserialize(
                int32ArrayType.serialize(
                    [ { x: 15, y: -2, radius: 80 }, { x: 2, y: -624, radius: 30 }, { x: 60, y: 33, radius: 3 } ]
                )
            )
        );
        test.done();
    },
    ArrayOfArrayType: function (test) {
        var int32ArrayType = new ArrayType(new ArrayType(types.CompactNumber));
        test.same(
            [ [ 2, 15 ], [ 6, 0, -30 ], [ 4 ], [], [ 18, 815644113, -50 ] ],
            int32ArrayType.deserialize(
                int32ArrayType.serialize(
                    [ [ 2, 15 ], [ 6, 0, -30 ], [ 4 ], [], [ 18, 815644113, -50 ] ]
                )
            )
        );
        test.done()
    }
};