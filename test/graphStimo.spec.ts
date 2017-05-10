/// <reference path="../node_modules/@types/mocha/index.d.ts" />
import {GNode, Graph, GExtendedNode, GMoreExtendedNode, SelectionKind} from './GraphStimo'
import {expect} from 'chai'

describe('access and code completion', () => {
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
    expect(n).to.be.an.instanceOf(GNode);
    expect(n.setTitle("Another")).to.be.an.instanceOf(GNode);
  });
  it('will not mutate on setting same value', () => {
    expect(n.setTitle("Title")).equal(n);
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

describe('graph.moveNodes', () => {
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

describe('supports inheritance', () => {
  // constructor
  let n = new GExtendedNode("additional", "Title", 1, 1, 2, 10, 10);
  it("can get extended properties with dot", ()=> {
    expect(n.title).equals("Title");
    expect(n.additional).equals("additional");
  });
  it("can set properties with setter", ()=> {
    expect(n.setTitle("Another").title).equals("Another");
    expect(n.setAdditional("what").additional).equals("what");
  });
  it('returns the correct derived class clone', () => {
    expect(n).to.be.an.instanceOf(GExtendedNode);
    expect(n.setTitle("mytitle")).to.be.an.instanceOf(GExtendedNode);
    expect(n.setAdditional("myadd")).to.be.an.instanceOf(GExtendedNode);
  });
  it('can call inherited methods ', () => {
    expect(n.getRatio()).equals(1);
  });
});

describe('supports 2 level inheritance', () => {
  // constructor
  let n = new GMoreExtendedNode("additional", "Title", 1, 10, 20, 100, 25, SelectionKind.None, 99);
  it("can get extended properties with dot", ()=> {
    expect(n.additionalNumber).equals(99);
  });
  it("can set properties with setter", ()=> {
    expect(n.setAdditionalNumber(999).additionalNumber).equals(999);
  });
  it('returns the correct derived class clone', () => {
    expect(n).to.be.an.instanceOf(GMoreExtendedNode);
    expect(n.setTitle("mytitle")).to.be.an.instanceOf(GMoreExtendedNode);
    expect(n.setAdditionalNumber(9999)).to.be.an.instanceOf(GMoreExtendedNode);
  });
  it('can call inherited methods', () => {
    expect(n.getStringRepresentation()).to.equal("additional: additional, title: Title, id: 1, x: 10, y: 20, width: 100, height: 25, selection: 0, additionalNumber: 99");
    expect(n.getRatio()).equals(4);
  });
  it('can set all variables without mixing indices up', () => {
    n = n.setAdditional("additional2").setTitle("Title2").setId(2).setX(20).setY(40).setWidth(200).setHeight(50).setSelection(SelectionKind.Primary) as GMoreExtendedNode;
    n = (n as GMoreExtendedNode).setAdditionalNumber(198);

    expect(n.getStringRepresentation()).to.equal("additional: additional2, title: Title2, id: 2, x: 20, y: 40, width: 200, height: 50, selection: 1, additionalNumber: 198");
    expect(n.getRatio()).equals(4);
  });
});

describe('withMutations', () => {
  let n: GNode = new GNode("Title", 0, 0, 0, 0, 0);
  let flag: boolean = false;
  let check = (mutated: GNode) => {
    expect(mutated).to.not.equal(n);
    expect((mutated as any).__stimo__Constructing).to.equal(1,"mutated instance is not mutable");
  }
  // constructor
  it("will only copy once and then mutate inplace", ()=> {
    let mutated: GNode = n.withMutations((m: GNode)=> {
      check(m);
      return m.setHeight(5).setWidth(10);
    });
    expect(mutated.height).to.equal(5);
    expect(mutated.width).to.equal(10);
  });
});
