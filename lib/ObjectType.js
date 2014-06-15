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
 * Created by Nercury on 2014-06-15.
 */

var types = require('./types.js');

/**
 * Custom serialization type builder.
 *
 * @class ObjectType
 * @param {{}} fields Field name and type configuration.
 * @constructor
 */
var ObjectType = function(fields) {
    this.fields = fields;
};

/**
 * Serialize an object.
 *
 * @param {{}} v Object value.
 * @return {Buffer} Buffer.
 */
ObjectType.prototype.serialize = function (v) {
    var buffers = [],
        totalLength = 0,
        name,
        Type,
        innerBuffer;

    for (name in this.fields) {
        if (!v.hasOwnProperty(name)) {
            throw new TypeError('Expected object to have "' + name + '" property');
        }
        Type = this.fields[name];
        innerBuffer = Type.serialize(v[name]);
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
 * Deserialize an object.
 *
 * @param {Buffer} b Buffer.
 * @return {{}} Value.
 */
ObjectType.prototype.deserialize = function (b) {
    var v = {};
    var typeCheck;
    var objectLength;
    var objectBuffer,
        name,
        Type
    ;

    typeCheck = types.CompactNumber.hasEnoughLength(b);
    if (!typeCheck.canRead) {
        throw new RangeError('Can not read object length, buffer too short');
    }
    objectLength = types.CompactNumber.deserialize(b);
    objectBuffer = b.slice(typeCheck.requiresLength);
    if (objectBuffer.length < objectLength) {
        throw new RangeError('Can not read object, buffer too short');
    }

    for (name in this.fields) {
        Type = this.fields[name];
        typeCheck = Type.hasEnoughLength(objectBuffer);
        if (typeCheck.canRead) {
            v[name] = Type.deserialize(objectBuffer);
            objectBuffer = objectBuffer.slice(typeCheck.requiresLength);
        } else {
            throw new RangeError("Contained object is bigger than parent")
        }
    }

    return v;
};

/**
 * Check if buffer has enough data to deserialize this item.
 * If it does not, return minimum required length for the next
 * check. If it does, return required length.
 *
 * @param {Buffer} b Buffer.
 * @returns {{canRead: boolean, requiresLength: int}}
 */
ObjectType.prototype.hasEnoughLength = function (b) {
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

module.exports = ObjectType;