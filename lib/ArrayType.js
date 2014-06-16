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

var types = require('./types.js');

/**
 * Array type builder, holds a single element type repeated as array.
 *
 * @class ArrayType
 * @param {*} elementType Array element type.
 * @constructor
 */
var ArrayType = function(elementType) {
    this.elementType = elementType;
};

/**
 * Serialize an array.
 *
 * @param {[]} items Array value.
 * @return {Buffer} Buffer.
 */
ArrayType.prototype.serialize = function (items) {
    var buffers = [],
        totalLength = 0,
        innerBuffer,
        index
    ;

    if (!(items instanceof Array)) {
        throw new TypeError('ArrayType expected array object');
    }

    innerBuffer = types.CompactNumber.serialize(items.length);
    totalLength += innerBuffer.length;
    buffers.push(innerBuffer);

    for (index in items) {
        innerBuffer = this.elementType.serialize(items[index]);
        totalLength += innerBuffer.length;
        buffers.push(innerBuffer);
    }

    return Buffer.concat(
        [
            types.CompactNumber.serialize(totalLength),
            Buffer.concat(buffers, totalLength)
        ]
    );
};

/**
 * Deserialize an array.
 *
 * @param {Buffer} b Buffer.
 * @return {[]} Value.
 */
ArrayType.prototype.deserialize = function (b) {
    var items = [];
    var typeCheck;
    var objectLength;
    var objectBuffer;
    var arraySize;
    var index;

    typeCheck = types.CompactNumber.hasEnoughLength(b);
    if (!typeCheck.canRead) {
        throw new RangeError('Can not read array object length, buffer too short');
    }
    objectLength = types.CompactNumber.deserialize(b);
    objectBuffer = b.slice(typeCheck.requiresLength);
    if (objectBuffer.length < objectLength) {
        throw new RangeError('Can not read array object, buffer too short');
    }

    typeCheck = types.CompactNumber.hasEnoughLength(objectBuffer);
    if (typeCheck.canRead) {
        arraySize = types.CompactNumber.deserialize(objectBuffer);
        objectBuffer = objectBuffer.slice(typeCheck.requiresLength);
    } else {
        throw new RangeError('Can not read array size, buffer too short');
    }

    for (index = 0; index < arraySize; index++) {
        typeCheck = this.elementType.hasEnoughLength(objectBuffer);
        if (typeCheck.canRead) {
            items.push(this.elementType.deserialize(objectBuffer));
            objectBuffer = objectBuffer.slice(typeCheck.requiresLength);
        } else {
            throw new RangeError('Failed to read array item, it was bigger than parent');
        }
    }

    return items;
};

/**
 * Check if buffer has enough data to deserialize this item.
 * If it does not, return minimum required length for the next
 * check. If it does, return required length.
 *
 * @param {Buffer} b Buffer.
 * @returns {{canRead: boolean, requiresLength: int}}
 */
ArrayType.prototype.hasEnoughLength = function (b) {
    var typeCheck = types.CompactNumber.hasEnoughLength(b);

    if (false === typeCheck.canRead) {
        return typeCheck;
    }

    var objectLength = types.CompactNumber.deserialize(b);
    var fullLength = objectLength + typeCheck.requiresLength;

    return {
        canRead: b.length >= fullLength,
        requiresLength: fullLength
    };
};

module.exports = ArrayType;