import React, {Component} from 'react';
var d3 = require('d3');
var ReactDOM = require('react-dom'); // Do we need this?
var _ = require('lodash'); // Do we need this?


export default class Tree extends Component {

  // We can't render the treeData object, but we can render arrays.
  render() {
    console.log('this.props.treeData:', this.props.treeData);
    return (
      <ul className='Tree' className='change-to-g'>
        <circle></circle>
        <li className='change-to-text'>Tree name: {this.props.treeData[0].name}</li>
        <ul className='change-to-g'>Trees for any child trees go here - this will be an array. Am I passing down props? I think so.</ul>
      </ul>
    )
  }
}
