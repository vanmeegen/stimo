## Simple Typed Immutable Objects (stimo)
Using Typescript with immutable.js Records is not really satisfying.
stimo is an approach to replace Records by typescript classes using fast copy on mutate.

The design goals were:
* stay close to hand-coded immutable objects (type compatibility)
* minimal changes in code reading your stimo objects compared to mutable objects
* get best typescript experience with compile errors on all mis-usages
* do not use a generator
* make object copy cheaper than Object.assign
* minimize boiler plate code

stimo is inspired by https://github.com/danielearwicker/doop.

## Features

* fast arraycopy on mutations https://smellegantcode.wordpress.com/2016/03/07/doop-immutable-classes-for-typescript/
* immutable not exposed in interface
* easily usable
* code completion for attributes
* additional methods possible
* constructor can be used
* subclassing of stimo objects possible
* completion/type in setter
* no duplicate code

Disadvantages:
* getter and setter must be specified with full signature
* getter and setter must have initial dummy implementation, which will be replaced by auto-generated one
* needs Typescript setting "experimentalDecorators": true

## Preconditions
* Typescript >= 1.8 (but I think it should work with other type systems as well, since decorators are ES 6 feature)
* Need for Immutability
* node and npm

## Installation
* npm install stimo
* in tsconfig.json set CompilerOption "experimentalDecorators": true

## Usage
```typescript
@stimo
class MyRecord {
  @stimo_get get title(): string { return null; /* dummy for compiler */};
  @stimo_set setTitle(title:string): MyRecord { return null;/* dummy for compiler */};
  @stimo_get get id(): number { return null; /* dummy for compiler */};
  @stimo_set setId(id:number): MyRecord { return null;/* dummy for compiler */};

  constructor(title: string, id:number) {
    this.setTitle(title).setId(id);
  }
  
  // write your own methods
  dump():string {
    return this.title + '(' + this.id + ')';
  }
}
```

You can then use your immutable stimo Object like this:
```typescript
const m:MyRecord = new MyRecord("Test",5);
// standard typed property access
expect(m.title).toEqual("test");
m.title = 5; // compile error
const c:number = m.title; // compile error
m.setTitle(5); // compile error

// setter returns new mutated object
const n:MyRecord = m.setTitle("newTitle");
expect(m.title).toEqual("newTitle");
expect(m !== n);

```
* Make sure to use @stimo on the class, otherwise it will not work
* You will have full code-completion and compile time type checking support, no operations with magic strings or accidental call of setters
* constructor will call setters inplace for performance
* Outside constructor setters will return a new instance if the value was mutated

## Background
After checking lots of options for typing immutable objects, I was left disappointed.

Thinking about using decorators to generated the access code, I found https://github.com/danielearwicker/doop, which seemed close to what we need for our application. Porting the application to doop was not real fun, because of the accessor syntax of doop, so I decided to write something myself.

stimo has more boilerplate than doop, but has some advantages: stronger typing, property assignment will be flagged as error by compiler, type compatibility with handcoded immutable object.

If you have any ideas in further reducing boilerplate, please contribute.

References of other approaches trying to solve the same problem (none of them I found satisfying):
* https://github.com/rangle/typed-immutable-record
* https://coderwall.com/p/vxk_tg/using-immutable-js-in-typescript
* http://themapguyde.blogspot.de/2016/04/making-immutablejs-objects-easier-to.html
* https://github.com/Microsoft/TypeScript/issues/2225

Implementations and Tests for different approaches creating typed immutable object can be found in subdirectory 'testimmutability' in this repo.

All are commented with pros/cons of the respective approach.


