/// <reference path='../../overrides/immutable-override1.d.ts'/>
import {fromJS, Record, List, Map} from 'immutable';
import Immutable = require('immutable');
import * as ES6 from 'es6-shim'

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

export interface IGNode {
  readonly title: string;
  readonly id: number;
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly selection: SelectionKind;
  getRatio(): number;
}
// define immutable types
export class GNode extends Record<IGNode>({
  title: '',
  id: -1,
  x: 0,
  y: 0,
  width: -1,
  height: -1,
  selection: SelectionKind.None,
  getRatio: ()=>0
}) implements IGNode {
  title: string;
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  selection: SelectionKind;

  constructor(title: string,
              id: number,
              x: number,
              y: number,
              width: number,
              height: number,
              selection: SelectionKind = SelectionKind.None) {
    super({title, id, x, y, width, height, selection, getRatio: ()=>0});
  }

  // some additional methods
  getRatio(): number {
    return this.width / this.height;
  }
}

export class Graph {
  nodes: Map<Number, IGNode>;

  constructor(nodes: IGNode[]) {
    this.nodes = Graph.createNodeMap(nodes);
  }

  static createNodeMap(nodes: IGNode[]) {
    return Map<Number, IGNode>(nodes.map(node => [node.id, node]))
  }

  moveNodes(nodeIds: number[], dx: number, dy: number) {
    for (let nodeId of nodeIds) {
      // to mutate, use specific implementation
      var node: GNode = <GNode>this.getNode(nodeId);
      if (!node) {
        throw Error(`There is no node with id ${nodeId} to move`)
      }
      var updated: IGNode = node.set("x", node.x + dx).set("y", node.y + dy);
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
    let result = this.nodes.filter((node) => node.selection == SelectionKind.Primary).keys();
    return result;
  }


  getNode(nodeId: number): IGNode {
    return this.nodes.get(nodeId)
  }
}

