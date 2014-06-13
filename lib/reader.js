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
 * Binser object reader, used to handle chunked stream data.
 *
 * Created by Nercury on 2014-06-13.
 */

/**
 * Eats my soul.
 *
 * @param {Reader} reader A reader object.
 * @return {boolean}
 */
var eatMySoul = function (reader) {

    if (reader._buffer.length >= reader._requiredBytes) {

        var checkResult = reader.Type.hasEnoughLength(reader._buffer);

        if (checkResult.canRead) {

            var data = reader.Type.deserialize(reader._buffer);

            reader._requiredBytes = 0;
            reader._buffer = reader._buffer.slice(checkResult.requiresLength); // Slice the head!

            if (null !== reader.onRead) { // If it was worth it.
                reader.onRead(data); // Deliver the goods.
            }

            return true;

        } else {

            reader._requiredBytes = checkResult.requiresLength;

        }
    }

    return false;
};

/**
 * Used to read streamed data (usually as chunks of unknown size)
 * into Binser objects.
 *
 * @class Reader
 * @constructor
 */
var Reader = function () {
    // Concatenated buffer.
    this._buffer = new Buffer(0);
    // Required byte count for the next read attempt.
    this._requiredBytes = 0;
    // An object type to read.
    this.Type = null;
    // Call on successful read attempt.
    this.onRead = null;
};

/**
 * Feed reader another buffer.
 *
 * Call this on your "data" event, and pass data as
 * {Buffer} object here.
 *
 * @param {Buffer} b
 */
Reader.prototype.feed = function (b) {

    if (b.length > 0) {
        this._buffer = Buffer.concat([ this._buffer, b ]);
    }

    while (eatMySoul(this)) {}
};

module.exports = Reader;