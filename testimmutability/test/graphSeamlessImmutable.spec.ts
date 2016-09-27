/// <reference path="../node_modules/@types/mocha/index.d.ts" />
import {GNode, Graph, GNodeMutable} from '../src/models/GraphSeamlessImmutable'
import {expect} from 'chai'
import * as SeamlessImmutable from "seamless-immutable";

describe('SeamlessImmutable: access and code completion', () => {
  // constructor
  var gNodeMutable = new GNodeMutable("Title", 1, 1, 2, 10, 10);
  let n:GNode = SeamlessImmutable.from(gNodeMutable);
  it("can get properties with dot", ()=> {
    // with code completion
    expect(n.title).equals("Title");
    // n.nonExisting; compile error
  });
  it("can set properties with magic string", ()=> {
    // n.height = 5; error since readonly
    // with magic string, no code completion for title
    expect(n.set("title", "Another").title).equals("Another");
  });
  // does not work
  // it('can call additional methods ', () => {
  //   expect(gNodeMutable.getRatio()).equals(1);
  //   expect(n.getRatio()).equals(1);
  // })
});

describe('SeamlessImmutable: graph.moveNodes', () => {
  var graph;
  var initialNodes;
  beforeEach(() => {
    var nodes = [new GNodeMutable("0", 0, 0, 0, 0, 0), new GNodeMutable("1", 1, 0, 0, 0, 0), new GNodeMutable("2", 2, 10, 10, 10, 5)];
    graph = new Graph(nodes);
    initialNodes = graph.nodes
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
  })

});
