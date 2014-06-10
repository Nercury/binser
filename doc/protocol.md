Binser Protocol
===============

Binser is low-level data transmission protocol. It is documented here
because it exists.

Overview
--------

The protocol is for transmitting arbitrary data sequences in binary format.

Consider this nice and easy-to-read JSON example:

```
{
    "name" : "John",
    "age" : 12
}
```

> __WARNING!__ In Binser, it __will look nothing like this__. 
> If you want human-readable protocol, just use __JSON__.

In Binser, __your application__ knows that your object has properties
named "name" and "age", that the name is "string" and the "age" is 8-bit
unsigned integer. So it will not transmit or parse this extra information,
and if you change it without some kind of versioning pre-planned, it will
not work, crash, or - the worst - will read incorrect data.

So, in summary, this is scary format. __Do not use__.

Object
------

With that out of the way, let's get to the exciting stuff.

Smallest bit of data in Binser is __object__. All __objects__ either have
known size (for example 1-byte, 2-byte, 4-byte integers or booleans), or
the size is sent as a header for object (string, array).

There is a __container object__ type which simply has a header that contains
the sum of the sizes of all inner objects.

> The __exact contents of any object__, __the order of objects__, or 
> __object identification__ are not concerns of this protocol. The 
> idea is that your application will always know what objects it is 
> going to send, and what objects it can read. Look at the *Best Practices* 
> section at the end to learn how to prepare your objects for
> *identification* or *versioning*.

* ### Int8

  8-bit integer, or signed byte.

* ### UInt8

  8-bit unsigned integer, or char.

* ### Int16

  16-bit signed Little-Endian integer.

* ### UInt16

  16-bit unsigned Little-Endian integer.

* ### Int32

  32-bit signed Little-Endian integer.

* ### UInt32

  32-bit unsigned Little-Endian integer.
  
* ### CompactNumber

  First byte is interpreted thus:

  > The lowest bit of byte: ```0000000X```

  1. If the lowest bit is 0, the remaining bits ```XXXXXXX0``` contain
     an unsigned integer from 0 to 127. This is the final value.
     
  2. Otherwise, the remaining bits ```XXXXXXX0``` contain an unsigned
     integer that identifies the data-type of the actual number
     object in subsequent bytes:
     
     Value     | Type
     --------- | ---------
     0         | Int8
     1         | UInt8
     2         | Int16
     3         | UInt16
     4         | Int32
     5         | UInt32
     
  For example, a number 2 is ```10``` in binary. It fits between
  0 to 127, so it can be encoded like this: ```00000100```. The lowest
  bit is ```0```, because the number is embeded in the same byte.
    
  Another example, a number -400 as signed Int16 is
  ```01110000 11111110``` in binary. The type value of Int16 is 2, 
  which is ```10``` in binary, plus the lowest bit of ```1``` yields 
  these final three bytes: ```00000101 01110000 11111110```.
     
  > You may notice that this stores some duplicated information, i.e.
    signed numbers can contain both positive and negative, and the 
    *lowest bit* (1) exception can contain a range of *Value 1* or
    *Value 2* numbers. It was certainly possible to store negative 
    numbers as unsigned (since we know sign anyways). But this already
    was scary enough, so let's save these ideas for another, more 
    horrific protocol.