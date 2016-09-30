import {Map,Iterator } from 'immutable';
import * as ES6 from 'es6-shim';
export enum SelectionKind {
  None, Primary, Secondary
}

// handcoded implementation of all setters using Object.assign
// +: shared data structures from immutable
// +: immutable not exposed in interface
// +: easily usable
// +: code completion for attributes
// +: additional methods possible
// +: constructor can be used
// +: simple, no magic
// -: Object.assign is not very efficient
// -: tedious implementation easy to get wrong

export class GNode {
  readonly title:string;
  readonly id:number;
  readonly x:number;
  readonly y:number;
  readonly width:number;
  readonly height:number;
  readonly selection:SelectionKind;


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
    this.title = title;
    this.id = id;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.selection = selection;
  }


  // some additional methods
  getRatio(): number {
    return this.width / this.height;
  }

  setTitle(newTitle:string):GNode {
    return Object.assign(Object.create(this),this,{title:newTitle});
  };

  setId(newValue:number):GNode {
    return Object.assign(Object.create(this),this,{id:newValue});
  };

  setX(newValue:number):GNode {
    return Object.assign(Object.create(this),this,{x:newValue});
  };

  setY(newValue:number):GNode {
    return Object.assign(Object.create(this),this,{y:newValue});
  };
  setWidth(newValue:number):GNode {
    return Object.assign(Object.create(this),this,{width:newValue});
  };
  setHeight(newValue:number):GNode {
    return Object.assign(Object.create(this),this,{height:newValue});
  };
  setSelection(newValue:SelectionKind):GNode {
    return Object.assign(Object.create(this),this,{selection:newValue});
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

