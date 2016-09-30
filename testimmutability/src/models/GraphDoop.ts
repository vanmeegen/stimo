import { doop } from "doop";
import {Map,Iterator } from 'immutable';

export enum SelectionKind {
  None, Primary, Secondary
}

// @doop: Decorators
// +: fast arraycopy on mutations https://smellegantcode.wordpress.com/2016/03/07/doop-immutable-classes-for-typescript/
// +: immutable not exposed in interface
// +: easily usable
// +: no duplicate code
// +: code completion for attributes
// +: additional methods possible
// +: constructor can be used
// +: subclassing possible
// +: completion/type in setter
// -: getter must be accessed using x() notation with brackets --> not easy to change
// -: type not compatible with javascript object since properties are functions
// -: wrong assignment destroys property function

@doop
export class GNode {
  @doop
  get title(){ return doop<string,this>()};
  @doop
  get id(){return doop<number,this>()};
  @doop
  get x(){return doop<number,this>()};
  @doop
  get y(){ return doop<number,this>()};
  @doop
  get width(){ return doop<number,this>()};
  @doop
  get height(){ return doop<number,this>()};
  @doop
  get selection(){ return doop<SelectionKind,this>()};

  constructor(title: string,
              id: number,
              x: number,
              y: number,
              width: number,
              height: number,
              selection: SelectionKind = SelectionKind.None) {
    this.title(title).id(id).x(x).y(y).width(width).height(height).selection(selection);
  }


  // some additional methods
  getRatio(): number {
    return this.width() / this.height();
  }
}

export class Graph {
  nodes = Map<Number,GNode>();

  constructor(nodes: GNode[]) {
    this.createNodeMap(nodes);
  }

  createNodeMap(nodes: GNode[]) {
    nodes.map(node => {this.nodes = this.nodes.set(node.id(), node)});
  }

  moveNodes(nodeIds: number[], dx: number, dy: number) {
    for (let nodeId of nodeIds) {
      // to mutate, use specific implementation
      var node: GNode = <GNode>this.getNode(nodeId);
      if (!node) {
        throw Error(`There is no node with id ${nodeId} to move`)
      }
      var updated: GNode = node.x(node.x() + dx).y(node.y() + dy);
      if (node !== updated) {
        this.nodes = this.nodes.set(updated.id(), updated);
      }
    }
  }

  /**
   *
   * @returns {number[]} ids of the selected nodes in this graph
   */
  getSelectedNodes(): Iterator<Number> {
    let result = this.nodes.filter((node) => node.selection() === SelectionKind.Primary).keys();
    return result;
  }


  getNode(nodeId: number): GNode {
    return this.nodes.get(nodeId)
  }
}

