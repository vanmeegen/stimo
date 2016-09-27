/// <reference path='../overrides/immutable-override1.d.ts'/>
/// <reference path="../node_modules/@types/mocha/index.d.ts" />
import {IGNode, GNode, Graph, SelectionKind, constructGNode} from '../src/models/GraphTypedImmutableRecord'
import {expect} from 'chai'
import {Map} from 'immutable'

describe('typed-immutable-record: access and code completion', () => {
  // constructor
  let n: IGNode = constructGNode("Title", 1, 1, 2, 10, 10);
  it("can get properties with dot", ()=> {
    // with code completion
    expect(n.title).equals("Title");
    // n.nonExisting; compile error
  });
  it("can set properties with magic string", ()=> {
    // n.height = 5; error since readonly
    // with magic string, no code completion for title
    expect((<GNode>n).set("title", "Another").title).equals("Another");
  });
  it('can call additional methods ', () => {
    expect(n.getRatio()).equals(1);
  })
});

describe('typed-immutable-record: graph.moveNodes', () => {
  var graph: Graph;
  var initialNodes: Map<Number,IGNode>;
  beforeEach(() => {
    var nodes: IGNode[] = [constructGNode("0", 0, 0, 0), constructGNode("1", 1, 0, 0, 0, 0), constructGNode("2", 2, 10, 10, 10, 5)];
    graph = new Graph(nodes);
    initialNodes = graph.nodes;
  });

  it('updates the nodes list for one node', () => {
    graph.moveNodes([0], 100, 0);
    expect(graph.nodes === initialNodes, "nodes is updated").to.be.false;
    expect(graph.nodes.get(0).x).equals(100);
    expect(graph.nodes.get(0) === graph.getNode(0)).to.be.true
  });

  it('updates all nodes passed with the same delta', () => {
    graph.moveNodes([1, 2], 50, 10);
    expect(graph.nodes === initialNodes, "nodes is updated").to.be.false;
    expect(graph.getNode(1) === initialNodes.get(1)).to.be.false;
    expect(graph.nodes.get(1).x).equals(50);
    expect(graph.nodes.get(1).y).equals(10);
    expect(graph.nodes.get(2).x).equals(60);
    expect(graph.nodes.get(2).y).equals(20)
  });
});
