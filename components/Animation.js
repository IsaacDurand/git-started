import React, {Component} from 'react';
import GitAnimation from './GitAnimation';

// Notes from Isaac
// I've included two options here: StructureAnimation (which is what we're currently using) and IsaacsHalfwayFinishedComponent (which we're not currently using).
// To toggle between them, simply comment out one of the two lines below.
import StructureAnimation from './StructureAnimation';
// import StructureAnimation from './HalfwayFinishedStructureAnimation';

export default class Animation extends Component {

  showGit() {
    this.props.setStructureAnimationVisibility(false);
  }

  showStructure() {
    this.props.setStructureAnimationVisibility(true);
  }

  // Images from https://www.iconfinder.com/icons/172515/folder_opened_icon#size=32 and https://www.iconfinder.com/icons/83306/git_icon#size=32
  render() {
    var selectedAnimation;
    var gitStyle = {
      borderBottom: '1px solid black',
      padding: '1rem'
     };
    var structureStyle = {padding: '1rem'};

    if (this.props.structureAnimationVisible) {
      // What to show for structure Animation
      selectedAnimation = <StructureAnimation />;
      gitStyle.backgroundColor = 'transparent';
      structureStyle.backgroundColor = 'lightBlue';
    } else {
      // What to show for Git Animation
      selectedAnimation = <GitAnimation />;
      gitStyle.backgroundColor = 'lightBlue';
      structureStyle.backgroundColor = 'transparent';
    }

    return (
      <div id='Animation'>
        <div className='add-padding'>
          <div style={{float: 'right', border: '1px solid black', textAlign: 'center', marginBottom: '1rem'}}>
            <div style={gitStyle} onClick={this.showGit.bind(this)}>
              <img src='assets/git-icon.png' alt='Git view' />
            </div>
            <div style={structureStyle} onClick={this.showStructure.bind(this)}>
              <img src='assets/folder-icon.png' alt='Directory view' />
            </div>
          </div>
          {selectedAnimation}
        </div>
      </div>
    )
  }
}
