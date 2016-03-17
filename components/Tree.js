import React, {Component} from 'react';
var d3 = require('d3');


export default class Tree extends Component {

  // We can't render the treeData object, but we can render arrays.
  render() {
    // console.log('this.props.treeData:', this.props.treeData); // this is the entire tree
    // console.log('this.props.treeData[0].children:', this.props.treeData[0].children); // this is just the trees one level below the current tree

    var children;
    if (this.props.treeData[0].children) {
      children = this.props.treeData[0].children.map((child, index) => {
        return <li className='change-to-?' key={index}>
          <Tree treeData={child} />
        </li>
      });
    }

    return (
      <ul className='Tree' className='change-to-g'>
        <span className='change-to-circle'></span>
        <li className='change-to-text'>Tree name: {this.props.treeData[0].name}</li>
        <ul className='change-to-g'>
          {children}
        </ul>
      </ul>
    )
  }
}
