Binser - Binary Serializer
==========================

[![Build Status](https://travis-ci.org/Nercury/binser.svg?branch=master)](https://travis-ci.org/Nercury/binser)

Work in progress, but stable usage is documented bellow.

## Pass simple strings over streams similar to TCP

When Binser String serializer serializes string to bytes, it prepends
the size before it. Size is encoded in Binser CompactNumber format,
it takes minimum 1 byte (if string is small) and maximum 5 bytes 
(see the doc for details). Maximum string size (in bytes) is unsigned 
Int32 maximum value, but it may not be the best idea to pass message 
of this size over the network.

Included reader helper will grow internal buffer in memory to contain
all the transmitted string before firing "onRead" callback.

### Stream writing example

```javascript
// Require "types" object that contains built-in object serializers.
var types = require('binser').types;

// <...>

// Serialize your string to buffer.
var buffer = types.String.serialize("Hello World!");

// Send the buffer over your connection (for example, Node's TCP client):
client.write(buffer);
```

### Stream reading example

The reader will call onRead callback when full string is received.

```javascript
// Require "types" object that contains built-in object serializers.
var types = require('binser').types;
// Require "Reader" that deals with variable-length chunks in network. 
var Reader = require('binser').Reader;

// <...>

// Create one reader per connection:
var reader = new Reader();
reader.Type = types.String; // Set expected type to string.
reader.onRead = function(str) { // Set callback.
    console.log(str);
};

// <...>

// On your "data" event, feed the buffer bytes into your reader:
reader.feed(buffer);
```