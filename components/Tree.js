import React, {Component} from 'react';
var d3 = require('d3');
var ReactDOM = require('react-dom'); // Do we need this?
var _ = require('lodash'); // Do we need this?


export default class Tree extends Component {

  render() {
    return (
      <g className='Tree'>
        <circle></circle>
        <text>Tree name here</text>
        <g>Trees for any child trees go here</g>
      </g>
    )  
  }
}
