import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import './VideoContainer.css';

class VideoContainer extends Component {
  flipToGif = () => {
    this.source.src = this.props.gif_url;
  }

  flipToImage = () => {
    this.source.src = this.props.thumbnail;
  }

  render() {
    return (
      <Link to={{pathname: "/video/" + this.props.video_id}}
        style={{ textDecoration: 'none', color: 'black' }}>
        <div className="VideoContainer" onMouseOver={this.flipToGif} onMouseOut={this.flipToImage}>
          <img className="VideoContainer-thumbnail" ref={elem => (this.source = elem)} src={this.props.thumbnail} alt={this.props.title} />
          <div className="VideoContainer-info">
            <div className="text-left VideoContainer-title">
              {this.props.title}
            </div>
            <div className="text-left VideoContainer-uploader">
              {this.props.uploader}
            </div>
            <div className="container-fluid">
              <div className="row">
                <div className="col-6 nopadding VideoContainer-views">
                  {this.props.views} views
                </div>
                <div className="col-6 nopadding VideoContainer-value text-right">
                  ${this.props.value} accrued
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }
}

VideoContainer.propTypes = {
  video_id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  thumbnail: PropTypes.string.isRequired,
  uploader: PropTypes.string.isRequired,
  views: PropTypes.number.isRequired,
  value: PropTypes.string.isRequired,
  created_at: PropTypes.string.isRequired,
  gif_url: PropTypes.string.isRequired
};

export default VideoContainer;
