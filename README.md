# node-hue-api-v2-shim

[![npm](https://img.shields.io/npm/v/node-hue-api-v2-shim.svg)](http://npmjs.org/node-hue-api-v2-shim)

This is a standalone library to provide ~90% backwards compatibility to the [node-hue-api](https://github.com/peter-murray/node-hue-api)
library for the API that was provided for release versions 2.x.

The older versions of the library supported a mixed bag of Q promises and callbacks, that were refactored out in version 
3.x of the `node-hue-api` library. This is a modified copy of the backwards compatibility shim that was present in the 
`3.x` release versions of `node-hue-api`.

This shim does have performance issues and it will mess with your native JavaScript `Promise` object to make it emulate 
the old `Q` promise. But using the over the `2.x` versions of `node-hue-api` will still give a significant performance
benefit due to the speed increases introduced in the `3.x` refactoring of `node-hue-api`.

It was originally implemented to be a 90% backwards compatible shim that covers the major use cases of the older versions 
of `node-hue-api`. 


## Usage
You are strongly encouraged to only use this module as a gap stop whilst you plan to adapt your code over to the latest
version of the `node-hue-api` v3 API.

There will be limited work performed on this library going forward and it only exists to ease the burden on converting 
when taking the latest versions of the `node-hue-api`.


## Installation

Node.js using npm:
```
$ npm install node-hue-api-v2-shim
```

Node.js using yarn:
```
$ yarn install node-hue-api-v2-shim
```


## Documentation

The v2 api documentation is available in the [docs](./docs/v2_api.md).
