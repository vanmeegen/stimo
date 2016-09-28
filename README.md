## Features

Using Typescript with immutable.js Records is not really satisfying. stimo is an approach to replace Records by typescript classes using fast copy on mutate.

Features are:
* fast arraycopy on mutations https://smellegantcode.wordpress.com/2016/03/07/doop-immutable-classes-for-typescript/
* immutable not exposed in interface
* easily usable
* code completion for attributes
* additional methods possible
* constructor can be used
* subclassing possible
* completion/type in setter
* no duplicate code

Disadvantages:
* getter and setter must be specified with full signature
* getter and setter must have initial dummy implementation, which will be replaced by auto-generated one
* needs Typescript setting "experimentalDecorators": true

## Installation
* TODO: should be npm install stimo
* in tsconfig.json set CompilerOption "experimentalDecorators": true

## Usage
```typescript
@stimo
class MyRecord {
  @stimo_get get title(): string { return null; /* dummy for compiler */};
  @stimo_set setTitle(title:string): MyRecord { return null;};
  @stimo_get get id(): number { return null; /* dummy for compiler */};
  @stimo_set setId(id:number): MyRecord { return null;};

  constructor(title: string, id:number) {
    this.setTitle(title).setId(id);
  }
}
```
* Make sure to use @stimo on the class, otherwise it will not work
* You will have full code-completion and compile time type checking support, no operations with magic strings or accidental call of setters
* constructor will call setters inplace for performance
* Outside constructor setters will return a new instance if the value was mutated




