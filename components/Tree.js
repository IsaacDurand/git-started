import React, {Component} from 'react';
var d3 = require('d3');
var ReactDOM = require('react-dom');

var treeVisualization = {};

treeVisualization.enter = (selection) =>{
  // I need to define source.
  selection.attr("transform", function(d) {
      // console.log('this', this); // this is the <g> element, not a node.
      // console.log('selection', selection); // I think this is a node
      return "translate(" + d.rootY0 + "," + d.rootX0 + ")"; })
    // need to add onclick function

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
    // I think I just need to run the nodeUpdate and nodeExit stuff now. I've done nodeEnter.

  // Transition nodes to their new position.
  var duration = 450;
  var transition = selection.transition()
    .duration(duration)
    .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

  transition.select("circle")
    .attr("r", 10)
    .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

  transition.select("text")
    .style("fill-opacity", 1);
}

export default class Tree extends Component {
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
  // console.log(ReactDOM.findDOMNode(this)); // ReactDOM.findDOMNode(this) returns <g.Tree>

  // Should I use a variable declaration in place of this.d3Node (as I'm doing below)?
  this.d3Node = d3.select(ReactDOM.findDOMNode(this));
  this.d3Node.datum(this.props.data)
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
