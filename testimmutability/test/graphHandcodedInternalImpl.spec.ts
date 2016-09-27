/// <reference path="../node_modules/@types/mocha/index.d.ts" />
import {GNode, Graph, SelectionKind} from '../src/models/GraphHandcodedInternalImpl'
import {expect} from 'chai'

describe('GraphHandcodedInternalImpl: access and code completion', () => {
  // constructor
  let n = new GNode("Title", 1, 1, 2, 10, 10);
  it("can get properties with dot", ()=> {
    // with code completion
    expect(n.title).equals("Title");
    // n.nonExisting; //compile error
    // n.title = "bla"; //compile error
  });
  it("can set properties with setter", ()=> {
    // n.height = 5; error since readonly
    // code completion for setter
    expect(n.setTitle("Another").title).equals("Another");
  });
  it('can call additional methods ', () => {
    expect(n.getRatio()).equals(1);
  });
  // it("is not type compatible with plain javascript object", ()=> {
  //   // need to define all setters and methods
  //   let g:GNode = {title: "test",id:1,x:1,y:2,width:10,height:10,selection:SelectionKind.None, getRatio:()=>1, setTitle:(v:string)=>this,setId:(v:number)=>this,setX:(v:number)=>this, setY:(v:number)=>this, setWidth:(v:number)=>this,setHeight:(v:number)=>this, setSelection:(v:SelectionKind) => this, __values__:private {}};
  //   expect(g.title).equals("test");
  //   expect(g.getRatio()).equals(1);
  // });
});

describe('GraphHandcodedInternalImpl: graph.moveNodes', () => {
  var graph;
  var initialNodes;
  beforeEach(() => {
    var nodes = [new GNode("0", 0, 0, 0, 0, 0), new GNode("1", 1, 0, 0, 0, 0), new GNode("2", 2, 10, 10, 10, 5)];
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
  });
});