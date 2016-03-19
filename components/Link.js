import React, {Component} from 'react';
var d3 = require('d3');
var ReactDOM = require('react-dom');

var linkVisualization = {};

// Flesh out the linkVisualization object

export default class Path extends Component {
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

  // componentDidMount() {
  // this.d3Node = d3.select(ReactDOM.findDOMNode(this));
  // this.d3Node.datum(this.props.data)
  //   .call(treeVisualization.enter);
  // }

  // I think I want to use this.props.data.name instead of this.props.name...
  render() {
    return <path className='Link'></path>
  }
}
