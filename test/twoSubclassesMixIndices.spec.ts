import {expect} from "chai";
import "mocha";
import {stimo, stimo_get, stimo_set} from '../src/stimo';

@stimo
class A {
  @stimo_get get value(): number {
    return null;
  };

  //noinspection JSUnusedLocalSymbols
  @stimo_set setValue(newValue: number): A {
    return null;
    /*dummy*/
  };

  constructor() {
    this.setValue(1);
  }
}

@stimo
class B extends A {
  constructor(x: number = 0) {
    super();
    this.setX(x);
  }

  @stimo_get get x(): number {
    return null;
  };

  //noinspection JSUnusedLocalSymbols
  @stimo_set setX(newValue: number): B {
    return null;
    /*dummy*/
  };

}

@stimo
class C extends A {
  constructor(name: string,
              x: number = 0) {
    super();
    this.setName(name).setX(x);
  }

  @stimo_get get name(): string {
    return null;
  };

  @stimo_get get x(): number {
    return null;
  };

  //noinspection JSUnusedLocalSymbols
  @stimo_set setName(newValue: string): C {
    return null;
  };

  //noinspection JSUnusedLocalSymbols
  @stimo_set setX(newValue: number): C {
    return null;
  };
  getStringRepresentation(): string {
    return "name: " + this.name+ ", x: " + this.x;
  }
}

describe("two subclasses B,C of A", () => {
  it("can have the same property at different indices", ()=> {
    const vAttribute = new C("Name", 10);
    expect(vAttribute.getStringRepresentation()).to.equal("name: Name, x: 10");
  });
});
