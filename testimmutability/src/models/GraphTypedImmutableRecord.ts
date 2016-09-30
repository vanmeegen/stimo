import {fromJS, Record, List, Map} from 'immutable';
import * as ES6 from 'es6-shim'
import {TypedRecord, recordify} from 'typed-immutable-record'

export enum SelectionKind {
  None, Primary, Secondary
}

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
// typed-immutable-record library
// +: shared data structures from immutable
// +: no duplicate attribute definition
// +: clean interface hiding details
// +: code completion for attributes
// -: no additional methods possible
// -: no constructor can be used
// -: no completion/type in setter

export interface GNode extends TypedRecord<GNode>, IGNode {
}
;
export function constructGNode(title: string,
                               id: number,
                               x: number,
                               y: number,
                               width: number = -1,
                               height: number = -1,
                               selection: SelectionKind = SelectionKind.None) {
  // additional method fails
  let result = recordify<IGNode, GNode>({
    title: title,
    id: id,
    x: x,
    y: y,
    width: width,
    height: height,
    selection: selection,
    getRatio: () => width / height
  });
  return result;
};

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

