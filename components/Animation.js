import React, {Component} from 'react';
import treeData from './../AnimationData/treeStructure';
import Tree from './Tree';
var d3 = require('d3');
var ReactDOM = require('react-dom');
var _ = require('lodash');

// Note from Isaac: I think this blog post is what we're doing right now (I think we copied from it), and what we ideally want to avoid: http://javascript.tutorialhorizon.com/2014/09/08/render-a-d3js-tree-as-a-react-component/

// I think this should live elsewhere...
var treeVisualization = {};

treeVisualization.enter = (selection) =>{
  console.log('in treeVisualization.enter');

  selection.select("circle")
    .attr("r", 1e-6)
    // I checked, and this style is being applied!
    .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

  selection.select("text")
    .attr("x", function(d) { return d.children || d._children ? -13 : 13; })
    .attr("dy", ".35em")
    .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
    .text(function(d) { return d.name; })
    .style("fill-opacity", 1e-6);
}

export default class Animation extends Component {

  constructor(props) {
    super(props);
    this.state = {
      treeData: props.initialTreeData,
      margin: props.initialMargin,
      height: 200 - props.initialMargin.top - props.initialMargin.bottom,
      width: 660 - props.initialMargin.right - props.initialMargin.left
    }
  }

  // BEGIN EXAMPLE code
  // componentDidMount() {
  //  // wrap element in d3
  //  // getDOMNode is deprecated and has been replaced with ReactDOM.findDOMNode().
  //  this.d3Node = d3.select(this.getDOMNode());
  //  this.d3Node.datum(this.props.data)
  //   .call(ExpenseVisualization.enter);
  // }
  // shouldComponentUpdate(nextProps) {
  //  if (nextProps.data.update) {
  //   // use d3 to update component
  //   this.d3Node.datum(nextProps.data)
  //    .call(ExpenseVisualization.update);
  //   return false;
  //  }
  //  return true;
  // },
  // componentDidUpate() {
  //  this.d3Node.datum(this.props.data)
  //   .call(ExpenseVisualization.update);
  // },
  //END EXAMPLE code

  componentDidMount() {
    // I'm using this.state here. This.props is the default props.
    // console.log('in cDU');
    // console.log('this.state', this.state);
    // console.log('this.props', this.props);

    // ReactDOM.findDOMNode(this) returns <div#Animation>
    // Should I use a variable declaration in place of this.d3Node (as I'm doing below)?
    this.d3Node = d3.select(ReactDOM.findDOMNode(this));
    this.d3Node.datum(this.state.treeData) // this is an array containing an array containing just the animation div
      .call(treeVisualization.enter);

    // Can we use selection.select for these?
    // Update our svg's width and height.
    var svg = ReactDOM.findDOMNode(this.refs.ourSVG);
    // Do we need the d3.select? Or can we just call .attr on svg?
    d3.select(svg)
      .attr("width", this.state.width + this.state.margin.right + this.state.margin.left)
      .attr("height", this.state.height + this.state.margin.top + this.state.margin.bottom);

    // Update our main g
    var g = ReactDOM.findDOMNode(this.refs.ourMainG);
    // Again, do we need the d3.select?
    d3.select(g)
      .attr("transform", "translate(" + this.state.margin.left + "," + this.state.margin.top + ")");

    // Do this stuff here? Or in helper function?
    // Set root.x0 and root.y0
    // Set data.y for each node
    // Select g.Trees and bind them to nodes based on d.id? Have I already done this?
    // Update node attributes

    // We should avoid using findDOMNode if possible (https://facebook.github.io/react/docs/top-level-api.html), but it may be inevitable here.
  }

  render() {
    console.log('in render');
    // Create a tree layout of the specified size
    // (Does this mean we're creating a new tree on each render? I think it's OK to run these D3 functions since they're aren't creating or removing DOM elements.)
    // (Should we declare tree here or in this.state?)
    var tree = d3.layout.tree()
      .size([this.state.height, this.state.width]);

    // Create an array of nodes. We will pass one node to each Tree as props.
    var nodes = tree.nodes(this.state.treeData[0]).reverse().map(function(node, index) {
      node.id = index + 1;
      return node;
    });

    var paths = [];
    var trees = nodes && nodes.map((node) => {
      return (<Tree key={node.id} data={node} />)
    });

    return(
      <div id='Animation'>
        <svg ref='ourSVG'>
          <g ref='ourMainG'>
            {paths}
            {trees}
          </g>
        </svg>
      </div>
    )
  }
}

Animation.defaultProps = {
  initialTreeData: treeData,
  initialMargin: {top: 0, right: 20, bottom: 0, left: 90}
}

// This was my first attempt at Reactifying our files/folders.
class V2Animation extends Component {

  constructor(props) {
    super(props);
    this.state = {
      treeData: treeData
    }
  }

  componentDidMount() {
    ipcRenderer.on('direc-schema', (e, arg)=>{
      // console.log('about to set state');
      this.setState({
        treeData: arg
      })
    });
  }

  // Paths should be inside g.tree-container
  render() {
    console.log('Rendering - this.state.treeData is', this.state.treeData);
    return (
      <div id='Animation'>
        <svg>
          <g className='tree-container'>
            <Tree treeData={this.state.treeData[0]} />
          </g>
        </svg>
      </div>
    )
  }
}

// This is the class we exported previously
class V1Animation extends Component {

  constructor(props) {
    super(props);
    this.state = {
      treeData: treeData
    }
  }

  componentDidMount(){
    // mountNode grabs the DOM element corresponding to this.refs.treeRender.
    // 'this' is Animation, and this.refs.treeRender is the SVG  element.
    // Avoid using findDOMNode if possible: https://facebook.github.io/react/docs/top-level-api.html
    var mountNode = ReactDOM.findDOMNode(this.refs.treeRender);
    // Render the tree usng d3 after first component mount
    renderTree(this.state.treeData, mountNode);
  }

  shouldComponentUpdate(nextProps, nextState){
    // console.log(_.isEqual(this.state,nextState));
    // console.log(this.state, nextState)
    // if (_.isEqual(this.state,nextState)){
    //   return false
    // } else {
      // Delegate rendering the tree to a d3 function on prop change
      renderTree(nextState.treeData, ReactDOM.findDOMNode(this.refs.treeRender));
      // Do not allow react to render the component on prop change
      return false;
    // }
      // renderTree(nextState.treeData, ReactDOM.findDOMNode(this.refs.treeRender));
      // Do not allow react to render the component on prop change
      // return false;
  }

  updateTree(newSchema){
    // var tempTree = this.state.treeData;
    // tempTree[0].name = "banana"
    this.setState({
      treeData: newSchema
    })
    // console.log('tree data: ', this.state.treeData)
    // console.log(tempTree);
  }

  render() {
    ipcRenderer.on('direc-schema', (e,arg)=>{
      console.log(arg);
      this.updateTree(arg);
    })
    return (
      <div id='Animation'>
      	Animation
        <svg ref="treeRender"></svg>
      </div>
    )
  }
  // Note from Isaac: ref is a special attribute provided by React: https://facebook.github.io/react/docs/more-about-refs.html#the-ref-string-attribute.
  // We're giving the svg element a ref attribute of 'treeRender' so that our lifecycle methods can access it, but I'm not sure we need to do this.
}

// svgDomNode is just our <svg> element
var renderTree = function(treeData, svgDomNode) {

  var margin = {top: 0, right: 20, bottom: 0, left: 90},
  	width = 660 - margin.right - margin.left,
  	height = 200 - margin.top - margin.bottom;

    var i = 0,
      duration = 450,
      root;
      // console.log('svgDomNode passed to renderTree', svgDomNode);
    // Cleans up the SVG on re-render
    d3.select(svgDomNode).selectAll("*").remove();

    // Create a tree layout of the specified size
    var tree = d3.layout.tree()
      .size([height, width]);
    // console.log('tree:', tree);

    // Create a new 'diagonal generator' with a projection that reverses the x and y coordinates?
    // The links/paths will use this diagonal - I'll ignore it for now.
    var diagonal = d3.svg.diagonal()
      .projection(function(d) { return [d.y, d.x]; });
    // console.log('diagonal:', diagonal);

    // Grab the svg element on the DOM (using d3.select(node) rather than d3.select(selector)), update its width and height.
    var svg = d3.select(svgDomNode)
      .attr("width", width + margin.right + margin.left)
      .attr("height", height + margin.top + margin.bottom)
    // Append a g element to the SVG element and set its transform attribute to the specified translate value.
      .append("g") // Returns the newly appended <g> element
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // root grabs the first element of treeData - the current directory
    root = treeData[0];
    // Set the baseline x and y coordinate data for the root? (I'm not seeing a change in the root's x0 and y0 attributes before and after the following two lines of code.)
    root.x0 = height / 2;
    root.y0 = 0;

    update(root);

    function update(source) {

      // Compute the new tree layout.
      var nodes = tree.nodes(root).reverse(), // Why are we reversing this array?
      // nodes is an array of the child nodes of root. It looks like it also includes the root itself.
        links = tree.links(nodes);
        // links is an array with one element for each child.
      console.log('nodes:', nodes);
      // console.log('links:', links);

      // Normalize for fixed-depth.
      // Set the y-coordinate for each node based on the node's depth (its 'level' in the tree).
      nodes.forEach(function(d) { d.y = d.depth * 180; });

      // Update the nodes…
      // node
      var node = svg.selectAll("g.node")
      // node is a selection of all the <g> elements with a class of node (basically, all the circles on the svg). Do these exist the first time this function is called?
        // Bind this selection (node) to the data in nodes, giving each a unique key?
        .data(nodes, function(d) {
          // if (i === 0) console.log('d:', d);
          return d.id || (d.id = ++i);
        });

      // Enter any new nodes at the parent's previous position.
      var nodeEnter = node.enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
        .on("click", click);
      // nodeEnter is a selection of newly appended <g> elements
      // It looks like node.enter() is pretty much the same thing, but with the addition of an update method we don't need.

      nodeEnter.append("circle")
        .attr("r", 1e-6)
        .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

      nodeEnter.append("text")
        .attr("x", function(d) { return d.children || d._children ? -13 : 13; })
        .attr("dy", ".35em")
        .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
        .text(function(d) { return d.name; })
        .style("fill-opacity", 1e-6);

      // Transition nodes to their new position.
      var nodeUpdate = node.transition()
        .duration(duration)
        .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });
      // It looks like nodeEnter and nodeUpdate contain the same nodes: all the nodes on the screen. Is this what we want? Shouldn't nodeEnter be only incoming nodes and nodeUpdate be only persistent nodes?
      // console.log('nodeEnter:', nodeEnter);
      // console.log('nodeUpdate:', nodeUpdate);

      nodeUpdate.select("circle")
        .attr("r", 10)
        .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

      nodeUpdate.select("text")
        .style("fill-opacity", 1);

      // Transition exiting nodes to the parent's new position.
      var nodeExit = node.exit().transition()
        .duration(duration)
        .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
        .remove();

      // Why aren't we removing these circle and text selections?
      nodeExit.select("circle")
        .attr("r", 1e-6);

      nodeExit.select("text")
        .style("fill-opacity", 1e-6);

      // Note from Isaac: I haven't looked at the links section yet. These must be the lines connecting the circles on the screen.
      // Update the links…
      var link = svg.selectAll("path.link")
        .data(links, function(d) { return d.target.id; });

      // Enter any new links at the parent's previous position.
      link.enter().insert("path", "g")
        .attr("class", "link")
        .attr("d", function(d) {
        var o = {x: source.x0, y: source.y0};
        return diagonal({source: o, target: o});
        });

      // Transition links to their new position.
      link.transition()
        .duration(duration)
        .attr("d", diagonal);

      // Transition exiting nodes to the parent's new position.
      link.exit().transition()
        .duration(duration)
        .attr("d", function(d) {
        var o = {x: source.x, y: source.y};
        return diagonal({source: o, target: o});
        })
        .remove();

      // Stash the old positions for transition.
      nodes.forEach(function(d) {
      d.x0 = d.x;
      d.y0 = d.y;
      });
    }

    // Toggle children on click.
    // More specifically, show/hide children when you click the root.
    function click(d) {
      if (d.children) {
      d._children = d.children;
      d.children = null;
      } else {
      d.children = d._children;
      d._children = null;
      }
      update(d);
    }
}
