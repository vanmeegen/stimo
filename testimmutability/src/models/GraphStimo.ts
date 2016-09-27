import {Map, Iterator} from 'immutable';
import * as ES6 from 'es6-shim';
import {stimo, stimo_get, stimo_set} from './Stimo';
export enum SelectionKind {
  None, Primary, Secondary
}

// @stimo: Decorators implemented by ourselves
// +: fast arraycopy on mutations https://smellegantcode.wordpress.com/2016/03/07/doop-immutable-classes-for-typescript/
// +: immutable not exposed in interface
// +: easily usable
// +: code completion for attributes
// +: additional methods possible
// +: constructor can be used
// +: subclassing possible
// +: completion/type in setter
// +: no duplicate code
// -: getter and setter must be specified with full signature
// -: getter and setter must have initial implementation, but it will be replaced


@stimo
export class GNode {
  constructor(title: string,
              id: number,
              x: number,
              y: number,
              width: number,
              height: number,
              selection: SelectionKind = SelectionKind.None) {
    this.setTitle(title).setId(id).setX(x).setY(y).setWidth(width).setHeight(height).setSelection(selection);
  }

  // some additional methods
  getRatio(): number {
    return this.width / this.height;
  }

  @stimo_get get title(): string {
    return null;
    /*dummy*/
  }

  @stimo_get get id(): number {
    return null;
  }

  @stimo_get get x(): number {
    return null;
  }

  @stimo_get get y(): number {
    return null;
  }

  @stimo_get get width(): number {
    return null;
  }

  @stimo_get get height(): number {
    return null;
  }

  @stimo_get get selection(): SelectionKind {
    return null;
  }

  @stimo_set setTitle(newValue: string): GNode {
    return null;
  }

  @stimo_set setId(newValue: number): GNode {
    return null;
  }

  @stimo_set setX(newValue: number): GNode {
    return null;
  }

  @stimo_set setY(newValue: number): GNode {
    return null;
  }

  @stimo_set setWidth(newValue: number): GNode {
    return null;
  }

  @stimo_set setHeight(newValue: number): GNode {
    return null;
  }

  @stimo_set setSelection(newValue: SelectionKind): GNode {
    return null;
  }
}

@stimo
export class GExtendedNode extends GNode {
  constructor(additional: string, title: string,
              id: number,
              x: number,
              y: number,
              width: number,
              height: number,
              selection: SelectionKind = SelectionKind.None) {
    super(title, id, x, y, width, height, selection);
    this.setAdditional(additional);
  }
  @stimo_get get additional(): string {
    return null;
  }
  @stimo_set setAdditional(additional:string) {
    return null;
  }

}
export class Graph {
  nodes = Map<Number,GNode>();

  constructor(nodes: GNode[]) {
    this.createNodeMap(nodes);
  }

  createNodeMap(nodes: GNode[]) {
    nodes.map(node => {
      this.nodes = this.nodes.set(node.id, node)
    });
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

