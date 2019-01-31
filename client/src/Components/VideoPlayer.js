import React from 'react';
import ReactHLS from 'react-hls';

import './VideoPlayer.css';

/*
Use Video.js for skin - refer to videojs-contrib-dash lib
import videojs from 'video.js';
*/

export default class VideoPlayer extends React.Component {
  render() {
    return (
      <ReactHLS url={this.props.url} width="852" height="480" className="Video-viewer"></ReactHLS>    
    )
  }
}