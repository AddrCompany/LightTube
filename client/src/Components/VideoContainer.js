import React, { Component } from 'react';
import Modal from 'react-responsive-modal';
import { connect } from 'react-redux';
import { fetchVideo } from '../actions/videoActions'
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import FullVideoComments from './FullVideoComments';

import './VideoContainer.css';

class VideoContainer extends Component {
  state = {
    openVideo: false
  };

  onCloseModal = () => {
    this.setState({ openVideo: false });
  };

  goToVideo = () => {
    // this.props.fetchVideo(this.props.video_id);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.video && nextProps.video.video_id === this.props.video_id) {
      this.setState({ openVideo: true });
    }
  }

  render() {
    return (
      <Link to={{
        pathname: "/video/" + this.props.video_id
      }}
      style={{ textDecoration: 'none', color: 'black' }}
      >
        <div className="VideoContainer">
          <Modal
            classNames={{
              overlay: "Video-overlay",
              modal: "Video-modal",
            }}
            open={this.state.openVideo}
            onClose={this.onCloseModal}
            center closeOnEsc closeOnOverlayClick>
            <FullVideoComments {...this.props.video} />
          </Modal>
          <img className="VideoContainer-thumbnail" src={this.props.thumbnail} alt={this.props.title} />
          <div className="text-left VideoContainer-title">
            {this.props.title}
          </div>
          <div className="text-left VideoContainer-uploader">
            {this.props.uploader}
          </div>
        </div>
      </Link>
    );
  }
}

VideoContainer.propTypes = {
  fetchVideo: PropTypes.func.isRequired,
  video_id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  thumbnail: PropTypes.string.isRequired,
  uploader: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  video: state.videos.item
})

export default connect(mapStateToProps, { fetchVideo })(VideoContainer);
