/// <reference path='../node_modules/immutable/dist/immutable.d.ts'/>

declare module Immutable {
  export function Record<T>(defaultValues: T, name?: string): Record.Factory<T>;

  export module Record {
    interface Base extends Map<string, any> {
      set(key: string, value: any): this;
      // ...
    }

    interface Factory<T> {
      new (): Base;
      new (values: T): Base;
      (): Base;
      (values: T): Base;
    }
  }
}
