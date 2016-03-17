import React, {Component} from 'react';
var d3 = require('d3');


export default class Tree extends Component {

  // We can't render the treeData object, but we can render arrays.
  render() {
    // console.log('this.props.treeData:', this.props.treeData); // this is the entire tree
    // console.log('this.props.treeData[0].children:', this.props.treeData[0].children); // this is just the trees one level below the current tree

    var childrenToRender;
    if (this.props.treeData.children) {
      childrenToRender = this.props.treeData.children.map((child, index) => {
        return <li className='change-to-?' key={index}>
          <Tree treeData={child} />
        </li>
      });
    }

    return (
      <ul className='Tree' className='change-to-g'>
        <span className='change-to-circle'></span>
        <li className='change-to-text'>{this.props.treeData.name}</li>
        <ul className='change-to-g'>
          {childrenToRender}
        </ul>
      </ul>
    )
  }
}
