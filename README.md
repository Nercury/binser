Binser - Binary Serializer
==========================

[![Build Status](https://travis-ci.org/Nercury/binser.svg?branch=master)](https://travis-ci.org/Nercury/binser)

Work in progress, but stable usage is documented bellow.

## Simple serialization

### Serialize/deserialize simple object

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

Serialize your hash to buffer using your type:

    ```javascript
    var buffer = MyType.serialize({ name: "John", age: 12 });
    ```
    
Deserialize it back:

    ```javascript
    var hash = MyType.deserialize(buffer);
    ```
    
The buffer is node's Buffer object.

### Serialize/deserialize built-in object

Your created type can be interchanged with any built-in type. 
For example, you can serialize and deserialize a string:

    ```javascript
    var buffer = types.String.serialize("Hello World!");
    var str = types.String.deserialize(buffer);
    ```

### The list of built-in objects so far:

     Value               | 
     ------------------- | ---------
     types.Int8          | 8-bit signed integer.
     types.UInt8         | 8-bit unsigned integer.
     types.Int16         | 16-bit signed integer.
     types.UInt16        | 16-bit unsigned integer.
     types.Int32         | 32-bit signed integer.
     types.UInt32        | 32-bit unsigned integer.
     types.CompactNumber | Integer takes from 1 to 5 bytes, depending on value.
     types.String        | Variable - length string.
     types.ObjectType    | A sequence of any other objects.

## Pass serialized objects over streams similar to TCP

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
    reader.Type = types.String; // Or any other type
    reader.onRead = function(obj) { // Set callback.
        console.log(obj);
    };
    
    // <...>
    
    // On your "data" event, feed the buffer bytes into your reader:
    reader.feed(buffer);
    ```