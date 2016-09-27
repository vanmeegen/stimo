declare module "seamless-immutable" {
  interface ImmutableCommonMethods<T>{
    setIn?(propertyPath: Array<string|number>, value: any): Immutable<T>;
    merge?(part: T): Immutable<T>;
  }

  interface ImmutableObjectMethods<T> extends ImmutableCommonMethods<T> {
    set(property: string, value: any): ImmutableObject<T>;
    setIn(propertyPath:Array<string>, value:any):ImmutableObject<T>;

    asMutable(): T;
    asMutable(opts:AsMutableOptions): T;

    update(property:string, updaterFunction:(value:any) => any):ImmutableObject<T>;
    update(property:string, updaterFunction:(value:any, additionalParameter1:any) => any, arg1:any):ImmutableObject<T>;
    update(property:string, updaterFunction:(value:any, additionalParameter1:any, additionalParameter2:any) => any, arg1:any, arg2:any):ImmutableObject<T>;
    update(property:string, updaterFunction:(value:any, additionalParameter1:any, additionalParameter2:any, additionalParameter3:any) => any, arg1:any, arg2:any, arg3:any):ImmutableObject<T>;
    update(property:string, updaterFunction:(value:any, additionalParameter1:any, additionalParameter2:any, additionalParameter3:any, additionalParameter4:any) => any, arg1:any, arg2:any, arg3:any, arg4:any):ImmutableObject<T>;

    updateIn(propertyPath:Array<string>, updaterFunction:(value:any) => any):ImmutableObject<T>;
    updateIn(propertyPath:Array<string>, updaterFunction:(value:any, additionalParameter1:any) => any, arg1:any):ImmutableObject<T>;
    updateIn(propertyPath:Array<string>, updaterFunction:(value:any, additionalParameter1:any, additionalParameter2:any) => any, arg1:any, arg2:any):ImmutableObject<T>;
    updateIn(propertyPath:Array<string>, updaterFunction:(value:any, additionalParameter1:any, additionalParameter2:any, additionalParameter3:any) => any, arg1:any, arg2:any, arg3:any):ImmutableObject<T>;
    updateIn(propertyPath:Array<string>, updaterFunction:(value:any, additionalParameter1:any, additionalParameter2:any, additionalParameter3:any, additionalParameter4:any) => any, arg1:any, arg2:any, arg3:any):ImmutableObject<T>;

    without(property:string):ImmutableObject<T>;
    without(propertyPath:string[]):ImmutableObject<T>;
    without(...properties:string[]):ImmutableObject<T>;
    without(filter:(value:any, key:string) => boolean):ImmutableObject<T>;
  }

  interface ImmutableArrayMethods<T> extends ImmutableCommonMethods<T> {
    set(index: number, value: any): ImmutableArray<T>;
    asMutable(): Array<T>;
    asMutable(opts:AsMutableOptions): Array<T>;
    asObject(toKeyValue: (item: T) => Array<Array<any>>): ImmutableArray<T>;
    flatMap(mapFunction: (item: T) => ImmutableArray<T>): any;

    // TODO review methods (missing ones for arrays?)
  }

  interface Options {
    prototype?: any;
  }

  interface AsMutableOptions {
    deep: boolean;
  }

  // an immutable object is both of Type T (i.e., looks like a normal T) and of type Immutable<T>
  export type ImmutableObject<T> = T & ImmutableObjectMethods<T>;
  export type ImmutableArray<T> = Array<T> & ImmutableArrayMethods<T>;
  export type Immutable<T> = ImmutableObject<T> | ImmutableArray<T>;
  // TODO it would be ideal to be able to expose that type and have the variable available from client code
  // couldn't figure out how to do this unfortunately
  /*
   export type SeamlessImmutable = {
   <T>(obj: T, options?: Options): T & ImmutableObject<T>;
   <T>(obj: Array<T>, options?: Options): Array<T> & ImmutableArray<T>;
   from:SeamlessImmutable;
   isImmutable(target: any): boolean;
   ImmutableError(message: string): Error;
   };

   export const Immutable: SeamlessImmutable;
   */

  export function from<T>(obj: T, options?: Options): ImmutableObject<T>;
  export function from<T>(obj: Array<T>, options?: Options): ImmutableArray<T>;

  export function isImmutable(target: any): boolean;
  export function ImmutableError(message: string): Error;
}