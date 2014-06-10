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
 * Created by Nercury on 2014-06-10.
 */

var defaults = {
    Int8: {
        /**
         * @returns {Buffer}
         */
        serialize: function(v) {
            var b = new Buffer(1);
            b.writeInt8(v, 0);
            return b;
        },
        /**
         * @param {Buffer} b
         */
        deserialize : function (b) {
            return b.readInt8(0);
        }
    },
    UInt8: {
        /**
         * @returns {Buffer}
         */
        serialize: function(v) {
            var b = new Buffer(1);
            b.writeUInt8(v, 0);
            return b;
        },
        /**
         * @param {Buffer} b
         */
        deserialize : function (b) {
            return b.readUInt8(0);
        }
    },
    Int16: {
        /**
         * @returns {Buffer}
         */
        serialize: function(v) {
            var b = new Buffer(2);
            b.writeInt16LE(v, 0);
            return b;
        },
        /**
         * @param {Buffer} b
         */
        deserialize : function (b) {
            return b.readInt16LE(0);
        }
    },
    UInt16: {
        /**
         * @returns {Buffer}
         */
        serialize: function(v) {
            var b = new Buffer(2);
            b.writeUInt16LE(v, 0);
            return b;
        },
        /**
         * @param {Buffer} b
         */
        deserialize : function (b) {
            return b.readUInt16LE(0);
        }
    },
    Int32: {
        /**
         * @returns {Buffer}
         */
        serialize: function(v) {
            var b = new Buffer(4);
            b.writeInt32LE(v, 0);
            return b;
        },
        /**
         * @param {Buffer} b
         */
        deserialize : function (b) {
            return b.readInt32LE(0);
        }
    },
    UInt32: {
        /**
         * @returns {Buffer}
         */
        serialize: function(v) {
            var b = new Buffer(4);
            b.writeUInt32LE(v, 0);
            return b;
        },
        /**
         * @param {Buffer} b
         */
        deserialize : function (b) {
            return b.readUInt32LE(0);
        }
    },
    CompactNumber: {
        /**
         * @returns {Buffer}
         */
        serialize: function(v) {
            if (v >= 0 && v < 128) { // Exception.
                return defaults.UInt8.serialize(v << 1);
            }

            var
                type,
                b
            ;

            if (v >= 0) {
                if (v < 256) {
                    type = 1;
                    b = new Buffer(2);
                    b.writeUInt8((type << 1) + 1, 0);
                    b.writeUInt8(v, 1);
                } else if (v < 65536) {
                    type = 3;
                    b = new Buffer(3);
                    b.writeUInt8((type << 1) + 1, 0);
                    b.writeUInt16LE(v, 1);
                } else if (v < 4294967296) {
                    type = 5;
                    b = new Buffer(5);
                    b.writeUInt8((type << 1) + 1, 0);
                    b.writeUInt32LE(v, 1);
                } else {
                    throw new TypeError('value is out of bounds');
                }
            } else {
                if (v >= -128) {
                    type = 0;
                    b = new Buffer(2);
                    b.writeUInt8((type << 1) + 1, 0);
                    b.writeInt8(v, 1);
                } else if (v >= -32768) {
                    type = 2;
                    b = new Buffer(3);
                    b.writeUInt8((type << 1) + 1, 0);
                    b.writeInt16LE(v, 1);
                } else if (v >= -2147483648) {
                    type = 4;
                    b = new Buffer(5);
                    b.writeUInt8((type << 1) + 1, 0);
                    b.writeInt32LE(v, 1);
                } else {
                    throw new TypeError('value is out of bounds');
                }
            }

            return b;
        },
        /**
         * @param {Buffer} b
         */
        deserialize : function (b) {
            var
                exception,
                firstByte,
                type
            ;

            firstByte = b.readUInt8(0);
            exception = firstByte & 1 ? false : true;

            if (exception) {
                return firstByte >>> 1;
            }

            type = firstByte >>> 1;

            if (type === 0) {
                return b.readInt8(1);
            } else if (type === 1) {
                return b.readUInt8(1);
            } else if (type === 2) {
                return b.readInt16LE(1);
            } else if (type === 3) {
                return b.readUInt16LE(1);
            } else if (type === 4) {
                return b.readInt32LE(1);
            } else if (type === 5) {
                return b.readUInt32LE(1);
            }

            throw new RangeError('Unknown value type');
        }
    }
//    String: {
//        /**
//         * @returns {Buffer}
//         */
//        serialize: function(v) {
//            var sl =
//            var sb = new Buffer(v);
//        },
//        /**
//         * @param {Buffer} b
//         */
//        deserialize : function (b) {
//            return b.toString();
//        }
//    }
};

/**
 * @param {{}} items
 * @class SerializerBuilder
 */
module.exports = function(items) {

    var items = items | [];

    return {

        int8: function(name) {
            items.push(
                {
                    name: name,
                    serializer: defaults.Int8
                }
            );
        },

        /**
         * @class Serializer
         * @param items
         */
        getSerializer: function(items) {

            return {
                /**
                 * Serialize an object to buffer.
                 *
                 * @param {{}} obj
                 *
                 * @return {Buffer}
                 */
                serialize: function(obj) {
                    var buffers = [];
                    var i;
                    var val;
                    var lastBuf;
                    var totalLength = 0;
                    for (i = 0; i < items.length; i++) {
                        val = obj[items[i].name];
                        lastBuf = items[i].serializer.serialize(val);
                        buffers.push(lastBuf);
                        totalLength += lastBuf.length;
                    }
                    return Buffer.concat(buffers, totalLength);
                },

                /**
                 * Deserialize an object from buffer.
                 *
                 * @param {Buffer} buf
                 *
                 * @return {{}}
                 */
                deserialize: function(buf) {

                }
            };
        }
    };
};

module.exports.defaults = defaults;