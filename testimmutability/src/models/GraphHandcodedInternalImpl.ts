import {Map,Iterator } from 'immutable';
import * as ES6 from 'es6-shim';
export enum SelectionKind {
  None, Primary, Secondary
}

// hacking immutable.d.ts as discussed in https://github.com/facebook/immutable-js/issues/341
// +: shared data structures from immutable
// +: immutable not exposed in interface
// +: easily usable
// +: code completion for attributes
// +: additional methods possible
// +: constructor can be used
// -: triplicate attribute lists in Record constructor, class and interface definition
// -: no completion/type in setter


export class GNode {
 private __values__ :any = {};
  // constructor(o:{title: string,
  //             id: number,
  //             x: number,
  //             y: number,
  //             width: number,
  //             height: number,
  //             selection: SelectionKind}) {
  //   this.title = o.title;
  //   this.id=o.id;
  //   this.x = o.x;
  //   this.y = o.y;
  //   this.width = o.width;
  //   this.height = o.height;
  //   this.selection = o.selection;
  // }
  constructor(title: string,
              id: number,
              x: number,
              y: number,
              width: number,
              height: number,
              selection: SelectionKind = SelectionKind.None){
    this.__values__["title"] = title;
    this.__values__["id"] = id;
    this.__values__["x"] = x;
    this.__values__["y"] = y;
    this.__values__["width"] = width;
    this.__values__["height"] = height;
    this.__values__["selection"] = selection;
  }

  // some additional methods
  getRatio(): number {
    return this.width / this.height;
  }

  get title():string {
    return this.__values__["title"];
}
  get id():number {
    return this.__values__["id"];
  }

  get x():number {
    return this.__values__["x"];
  }
  get y():number {
    return this.__values__["y"];
  }
  get width():number {
    return this.__values__["width"];
  }
  get height():number {
    return this.__values__["height"];
  }

  get selection():SelectionKind {
    return this.__values__["selection"];
  }
  setTitle(newTitle:string):GNode {
    let clone:GNode = Object.create(this);
    clone.__values__["title"] = newTitle;
    return clone;
  };

  setId(newValue:number):GNode {
    let clone:GNode = Object.create(this);
    clone.__values__["id"] = newValue;
    return clone;
  };

  setX(newValue:number):GNode {
    let clone:GNode = Object.create(this);
    clone.__values__["x"] = newValue;
    return clone;
  };

  setY(newValue:number):GNode {
    let clone:GNode = Object.create(this);
    clone.__values__["y"] = newValue;
    return clone;
  };
  setWidth(newValue:number):GNode {
    let clone:GNode = Object.create(this);
    clone.__values__["width"] = newValue;
    return clone;
  };
  setHeight(newValue:number):GNode {
    let clone:GNode = Object.create(this);
    clone.__values__["height"] = newValue;
    return clone;
  };
  setSelection(newValue:SelectionKind):GNode {
    let clone:GNode = Object.create(this);
    clone.__values__["selection"] = newValue;
    return clone;
  };
}

export class Graph {
  nodes = Map<Number,GNode>();

  constructor(nodes: GNode[]) {
    this.createNodeMap(nodes);
  }

  createNodeMap(nodes: GNode[]) {
    nodes.map(node => {this.nodes = this.nodes.set(node.id, node)});
  }

  moveNodes(nodeIds: number[], dx: number, dy: number) {
    for (let nodeId of nodeIds) {
      // to mutate, use specific implementation
      var node: GNode = <GNode>this.getNode(nodeId);
      if (!node) {
        throw Error(`There is no node with id ${nodeId} to move`)
      }
      var updated: GNode = node.setX(node.x + dx).setY(node.y + dy);
      if (node !== updated) {
        this.nodes = this.nodes.set(updated.id, updated);
      }
    }
  }

  /**
   *
   * @returns {number[]} ids of the selected nodes in this graph
   */
  getSelectedNodes(): Iterator<Number> {
    let result = this.nodes.filter((node) => node.selection === SelectionKind.Primary).keys();
    return result;
  }


  getNode(nodeId: number): GNode {
    return this.nodes.get(nodeId)
  }
}

