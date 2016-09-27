import {fromJS, Record, List, Map} from 'immutable';
import * as ES6 from 'es6-shim'

export enum SelectionKind {
  None, Primary, Secondary
}
/**
 * @author Marco van Meegen
 */

// without specific hacks, just a class extending GNodeRecord, idea taken from https://coderwall.com/p/vxk_tg/using-immutable-js-in-typescript
// +: shared data structures from immutable
// +: easily usable
// +: code completion for attributes
// +: additional methods possible
// +: constructor can be used
// -: duplicate attribute lists in Record constructor and class definition
// -: no completion/type in setter
// -: immutable exposed in interface

const GNodeRecord = Record({title: "", id: 0, x: 0, y: 0, width: 0, height: 0, selection: SelectionKind.None});
export class GNode extends GNodeRecord {
  // fake for typing
  readonly title: string;
  readonly id: number;
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly selection: SelectionKind;

  constructor(title: string,
              id: number,
              x: number,
              y: number,
              width: number,
              height: number,
              selection: SelectionKind = SelectionKind.None) {
    super({title, id, x, y, width, height, selection});
  }

  // TODO: to return this type instead of base type
  set(key: string, value: any): GNode {
    var r: any = super.set(key, value);
    return r
  }

  // some additional methods
  getRatio(): number {
    return this.width / this.height;
  }
}

export class Graph {
  nodes: Map<Number, GNode>;

  constructor(nodes: GNode[]) {
    this.nodes = Graph.createNodeMap(nodes);
  }

  static createNodeMap(nodes: GNode[]) {
    return Map<Number, GNode>(nodes.map(node => [node.id, node]))
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

