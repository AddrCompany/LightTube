import React from 'react';
import dashjs from 'dashjs';

import './Video.css';

/*
Use Video.js for skin - refer to videojs-contrib-dash lib
import videojs from 'video.js';
*/

export default class VideoPlayer extends React.Component {
  componentDidMount() {
    this.player = dashjs.MediaPlayer().create();
    const url = this.props.url;
    this.player.initialize(this.videoNode, url, true);
  }

  render() {
    return (
      <video controls ref={ node => this.videoNode = node } className="Video-viewer"></video>    
    )
  }
}