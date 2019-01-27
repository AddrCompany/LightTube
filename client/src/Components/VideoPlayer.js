import React from 'react';
import dashjs from 'dashjs';

import './VideoPlayer.css';

/*
Use Video.js for skin - refer to videojs-contrib-dash lib
import videojs from 'video.js';
*/

export default class VideoPlayer extends React.Component {
  componentDidMount() {
    const url = this.props.url;
    this.player = dashjs.MediaPlayer().create();
    this.player.initialize(this.videoNode, url, false);
  }

  render() {
    return (
      <video width="852" height="480" controls ref={ node => this.videoNode = node } className="Video-viewer"></video>    
    )
  }
}