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
 * Created by Nercury on 2014-06-13.
 */

var types = require('../lib/types.js');
var Reader = require('../lib/reader.js');

module.exports = {
    ReadExactChunk : function (test) {

        var reader = new Reader();
        var objectsRead = [];

        reader.onRead = function (object) {
                objectsRead.push(object);
        };

        reader.Type = types.String;

        reader.feed(types.String.serialize("The white fox might not be so smart to jump"));

        test.equals(1, objectsRead.length);
        test.equals("The white fox might not be so smart to jump", objectsRead[0]);

        test.done();
    },
    ReadFiveChunks : function (test) {

        var reader = new Reader();
        var objectsRead = [];

        reader.onRead = function (object) {
            objectsRead.push(object);
        };

        reader.Type = types.String;

        var buffer = Buffer.concat(
            [
                types.String.serialize("The white fox might not be so smart to jump"),
                types.String.serialize(""),
                types.String.serialize("Over fire"),
                types.String.serialize("Ice"),
                types.String.serialize("Or maybe something else"),
            ]
        );

        reader.feed(buffer);

        test.equals(5, objectsRead.length);
        test.equals("The white fox might not be so smart to jump", objectsRead[0]);
        test.equals("", objectsRead[1]);
        test.equals("Over fire", objectsRead[2]);
        test.equals("Ice", objectsRead[3]);
        test.equals("Or maybe something else", objectsRead[4]);

        test.done();
    },
    ReadSlicedChunksAndBigStringInThem : function (test) {

        var reader = new Reader();

        var objectsRead = [];

        reader.onRead = function (object) {
            objectsRead.push(object);
        };

        reader.Type = types.String;

        var bigString = "";

        for (var duplicate = 0; duplicate < 100; duplicate++) {
            bigString += "How is it possible to predict the end of the universe when it is infinite? ";
        }

        var buffer = Buffer.concat(
            [
                types.String.serialize("The white fox might not be so smart to jump"),
                types.String.serialize(bigString),
                types.String.serialize("Over fire"),
                types.String.serialize("Ice"),
                types.String.serialize("Or maybe something else"),
            ]
        );

        // Slice stuff into 5-byte parts.

        var start = 0,
            end = 5;

        while (start < buffer.length) {
            if (end > buffer.length) {
                end = buffer.length;
            }
            reader.feed(buffer.slice(start, end));
            start += 5;
            end = start + 5;
        }

        test.equals(5, objectsRead.length);
        test.equals("The white fox might not be so smart to jump", objectsRead[0]);
        test.equals(bigString, objectsRead[1]);
        test.equals("Over fire", objectsRead[2]);
        test.equals("Ice", objectsRead[3]);
        test.equals("Or maybe something else", objectsRead[4]);

        test.done();
    },
    ReadVariedStuff : function (test) {

        var reader = new Reader();

        var objectsRead = [];

        var typeSequence = [
            types.Int16,
            types.UInt16,
            types.String,
            types.Int8,
            types.UInt8,
            types.UInt32,
            types.Int32
        ];
        var typeSequenceIndex = 0;

        reader.Type = typeSequence[typeSequenceIndex];
        reader.onRead = function (object) {
            objectsRead.push(object);
            typeSequenceIndex++;
            if (typeSequenceIndex < typeSequence.length) {
                reader.Type = typeSequence[typeSequenceIndex];
            }
        };

        var buffer = Buffer.concat(
            [
                types.Int16.serialize(-345),
                types.UInt16.serialize(847),
                types.String.serialize("The roof is on fire"),
                types.Int8.serialize(-2),
                types.UInt8.serialize(251),
                types.UInt32.serialize(952114),
                types.Int32.serialize(-74441),
            ]
        );

        // Slice stuff into 3-byte parts.

        var start = 0,
            end = 3;

        while (start < buffer.length) {
            if (end > buffer.length) {
                end = buffer.length;
            }
            reader.feed(buffer.slice(start, end));
            start += 3;
            end = start + 3;
        }

        test.equals(-345, objectsRead[0]);
        test.equals(847, objectsRead[1]);
        test.equals("The roof is on fire", objectsRead[2]);
        test.equals(-2, objectsRead[3]);
        test.equals(251, objectsRead[4]);
        test.equals(952114, objectsRead[5]);
        test.equals(-74441, objectsRead[6]);

        test.done();
    }

};