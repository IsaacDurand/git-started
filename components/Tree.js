import React, {Component} from 'react';
var d3 = require('d3');

export default class Tree extends Component {

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
