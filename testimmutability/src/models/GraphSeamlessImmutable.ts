/// <reference path='../../overrides/my-seamless-immutable.d.ts'/>
import {Map} from 'immutable';
import * as SeamlessImmutable from "seamless-immutable";
import {ImmutableObject} from "seamless-immutable";
import * as ES6 from 'es6-shim'
export enum SelectionKind {
  None, Primary, Secondary
}
/**
 * @author Marco van Meegen
 */

// seamless-immutable with typings from https://github.com/rtfeldman/seamless-immutable/issues/108
// +: easily usable like standard datatypes, fully compatible
// +: code completion for everything
// +: additional methods possible
// +: constructor can be used
// -: seamless-immutable exposed in interface
// -: no shared data structures from immutable
// -: no maps, sets
// -: no performance improvements
// -: no typed setter
// -: type does not give any hint that it is immutable

export class GNodeMutable {
  // fake for typing
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
}

export type GNode = ImmutableObject<GNodeMutable>;
let gnodeMutable = new GNodeMutable("title",1,0,0,10,10);
const immutableNode:GNode = SeamlessImmutable.from(gnodeMutable);
const mutated:GNode = immutableNode.set("title","NewTitle");

export class Graph {
  nodes: Map<Number, GNode>;

  constructor(nodes: GNodeMutable[]) {
    this.nodes = Graph.createNodeMap(nodes);
  }

  static createNodeMap(nodes: GNodeMutable[]) {
    return Map<Number, GNode>(nodes.map(node => [node.id, SeamlessImmutable.from(node)]))
  }

  moveNodes(nodeIds: number[], dx: number, dy: number) {
    for (let nodeId of nodeIds) {
      var node: GNode = this.getNode(nodeId);
      if (!node) {
        throw Error(`There is no node with id ${nodeId} to move`)
      }
      var updated: GNode = node.set("x", node.x + dx).set("y", node.y + dy);
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


  getNode(nodeId: number): GNode {
    return this.nodes.get(nodeId)
  }
}

