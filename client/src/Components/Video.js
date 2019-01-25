import React, { Component } from 'react';
import Modal from 'react-responsive-modal';
import { connect } from 'react-redux';
import { fetchVideo } from '../actions/videoActions'
import PropTypes from 'prop-types';

import FullVideoComments from './FullVideoComments';

import './Video.css';

class Video extends Component {
  state = {
    openVideo: false
  };

  onOpenModal = () => {
    this.setState({ openVideo: true });
  };
 
  onCloseModal = () => {
    this.setState({ openVideo: false });
  };

  goToVideo = () => {
    this.props.fetchVideo(this.props.video_id);
    this.onOpenModal();
  }

  render() {
    return (
      <div className="Video-container">
        <Modal
          classNames={{
            overlay: "Video-overlay",
            modal: "Video-modal",
          }}
          open={this.state.openVideo}
          onClose={this.onCloseModal}
          center closeOnEsc closeOnOverlayClick>
          <FullVideoComments videoAttrs={this.props.video} />
        </Modal>
        <img className="Video-thumbnail" src={this.props.thumbnail} alt={this.props.title} onClick={this.goToVideo} />
        <div className="text-left Video-title">
          {this.props.title}
        </div>
        <div className="text-left Video-uploader">
          {this.props.uploader}
        </div>
      </div>
    );
  }
}

Video.propTypes = {
  fetchVideo: PropTypes.func.isRequired,
  video_id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  thumbnail: PropTypes.string.isRequired,
  uploader: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  video: state.videos.item
})

export default connect(mapStateToProps, { fetchVideo })(Video);
