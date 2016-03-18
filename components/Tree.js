import React, {Component} from 'react';
var d3 = require('d3');
var ReactDOM = require('react-dom');

var treeVisualization = {};

treeVisualization.enter = (selection) =>{
  console.log('in treeVisualization.enter');

  // selection.selectAll("g .node")?
  // When I changed .select to .selectAll, I get an 'undefined' error message, and no attributes are updated. Why is d undefined?

  // console.log('select', selection.select('circle'));
  // console.log('selectAll', selection.selectAll('circle')); // This seems kind of like what we want, so what's the problem?

  selection.select("circle")
    .attr("r", 1e-6)
    // I checked, and this style is being applied!
    .style("fill", function(d) {
      // console.log('select circle', this); // this is <circle>
      console.log('select d', d);
      return d._children ? "lightsteelblue" : "#fff"; });

  selection.select("text")
    .attr("x", function(d) {
      // console.log('selectAll text', this); // this is <text>
      // console.log('selectAll d', d); // Undefined
      return d.children || d._children ? -13 : 13; })
    .attr("dy", ".35em")
    .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
    .text(function(d) { return d.name; })
    .style("fill-opacity", 1e-6);
}

export default class Tree extends Component {

  componentDidMount() {
    console.log('in Tree.cDM');

  // Should I use a variable declaration in place of this.d3Node (as I'm doing below)?
  this.d3Node = d3.select(ReactDOM.findDOMNode(this));
  this.d3Node.datum(this.props.data) // this is an array containing an array containing just the animation div
    .call(treeVisualization.enter);

  // Do this stuff here? Or in helper function?
  // Set root.x0 and root.y0
  // Set data.y for each node
  // Select g.Trees and bind them to nodes based on d.id? Have I already done this?
  // Update node attributes
  }

  // I think I want to use this.props.data.name instead of this.props.name...
  render() {
    return <g className='Tree'>
      <circle></circle>
      <text>{this.props.data.name}</text>
    </g>
  }
}

// This was my first attempt at Reactifying our files/folders.
class OldTree extends Component {

  // We can't render the treeData object, but we can render arrays.
  render() {
    // console.log('this.props.treeData:', this.props.treeData); // this is the entire tree
    // console.log('this.props.treeData[0].children:', this.props.treeData[0].children); // this is just the trees one level below the current tree

    var childrenToRender;
    if (this.props.treeData.children) {
      childrenToRender = this.props.treeData.children.map((child, index) => {
        return <g key={index}>
          <Tree treeData={child} />
        </g>
      });
    }

    // We may not need a <g> element around childrenToRender. Or maybe we don't need the <g> element above?
    return (
      <g className='Tree'>
        <circle></circle>
        <text>{this.props.treeData.name}</text>
        <g className='children-container'>
          {childrenToRender}
        </g>
      </g>
    )
  }
}
