# Test of various Immutable Typescript Approaches

## Tested Approaches 
* simple subclassing of Record
* typed-immutable-record library
* overridden type definition for immutable using newer typescript features
* seamless-immutable
* hand-coded approach using Object.assign
* doop: generated implementation using es6 decorators
* stimo: generated implementation using es6 decorators, same interface as hand-coded approach

## Comparison
The same objects are implemented using the different approaches.
* Each Implementation file has a comment in the beginning summarizing pros and cons

## Running

* `npm run test`
 
