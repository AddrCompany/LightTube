import React, { Component } from 'react';

import './Video.css';

export default class Video extends Component {
  constructor(props) {
    super(props);
    // dislikes, likes, thumbnail, title, uploader, video_id, views
    this.state = {
      ...this.props.videoAttrs
    };
  }

  render() {
    return (
      <div className="Video-container">
        <img className="Video-thumbail" src={this.state.thumbnail} />
        <div className="text-left Video-title">
          {this.state.title}
        </div>
        <div className="text-left Video-uploader">
          {this.state.uploader}
        </div>
      </div>
    );
  }
}
