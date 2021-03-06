Binser - Binary Serializer
==========================

[![Build Status](https://travis-ci.org/Nercury/binser.svg?branch=master)](https://travis-ci.org/Nercury/binser)

Binser uses its own binary protocol to serialize nested object
structures to binary stream. Some features:

 * Primitives such as ```Int8```, ```UInt8``` ... ```Int32```, ```UInt32```;
 * **CompactNumber** minimizes size of numbers;
 * **String** type that takes care of string transmission by pre-pending string size;
 * **Custom object type** for your own objects;
 * **Arrays**;
 * Unlimited **mixing and nesting** of **all** available type combinations;
 * Documented protocol: look at /doc.

Stable usage is documented bellow.

### Serialize/deserialize simple object using ObjectType

Require this:

```javascript
// Require "types" object that contains built-in object serializers.
var types = require('binser').types;
// Require "ObjectType" that can be used to make a template for your object.
var ObjectType = require('binser').ObjectType;
```

Create your type serializer:

```javascript
// Create your type that is composed from other types.
var MyType = new ObjectType(
    {
        name: types.String,
        age: types.UInt8
    }
);
```

Serialize your hash to buffer using your type serializer:

```javascript
var buffer = MyType.serialize({ name: "John", age: 12 });
```
    
Deserialize it back:

```javascript
var hash = MyType.deserialize(buffer);
```
    
### Serialize/deserialize built-in object

Any built-in type serializer can be used the same way as ObjectType. 
For example, serializing and deserializing a string:

```javascript
var buffer = types.String.serialize("Hello World!");
var str = types.String.deserialize(buffer);
```

### Serialize/deserialize an array of objects using ArrayType

ArrayType can be used for serializing arrays of any type of
objects, here is an example of string array:

```javascript
var ArrayType = require('binser').ArrayType;

var stringArrayType = new ArrayType(types.String);

var buffer = stringArrayType.serialize([ "Hello", " ", "World!" ]);
var stringArray = stringArrayType.deserialize(buffer);
```

ObjectType can also be used:

```javascript
var ArrayType = require('binser').ArrayType;
var ObjectType = require('binser').ObjectType;

var pointType = new ObjectType({
    x: types.CompactNumber,
    y: types.CompactNumber,
});
var pointsArrayType = new ArrayType(pointType);

var buffer = pointsArrayType.serialize([ { x: 15, y: -10 }, { x: 0, y: 62111 } ]);
var pointsArray = pointsArrayType.deserialize(buffer);
```

And any other nested combination.

### The list of built-in serializers so far:

Value               | Size
------------------- | ---------
types.Int8          | 8-bit signed integer.
types.UInt8         | 8-bit unsigned integer.
types.Int16         | 16-bit signed integer.
types.UInt16        | 16-bit unsigned integer.
types.Int32         | 32-bit signed integer.
types.UInt32        | 32-bit unsigned integer.
types.CompactNumber | Integer takes from 1 to 5 bytes, depending on value size.
types.String        | Variable - length string.
ObjectType(config)  | A sequence of other objects.
ArrayType(<Type>)   | A varied sequence of other objects.

No floating point numbers (yet).

### Pass serialized objects over streams similar to TCP

Included ```Reader``` helper can help deserializing data transmitted
over protocol such as TCP. It will automatically call ```onRead```
callback only when full object is available.

Writing to stream is easy:

```javascript
// Send the buffer over your connection (for example, Node's TCP client):
client.write(buffer);
```

Reading is a bit more involved:

```javascript
// Require "Reader" that deals with variable-length chunks in network. 
var Reader = require('binser').Reader;

// <...>

// Create one reader per connection:
var reader = new Reader();
reader.Type = types.String; // Or any other type serializer.
reader.onRead = function(obj) { // Set callback.
    console.log(obj);
};

// <...>

// On your "data" event, feed the buffer bytes into your reader:
reader.feed(buffer);
```