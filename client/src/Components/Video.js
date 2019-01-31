import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchVideo, enterCode } from '../actions/videoActions'
import PropTypes from 'prop-types';
import Modal from 'react-responsive-modal';

import VideoPlayer from './VideoPlayer';
import Paywall from './Paywall'
import Comments from './Comments';

import './Video.css';

class Video extends Component {
  state = {
    loading: true,
    openPaywallModal: false
  };

  showPaywallModal = (event) => {
    this.setState({
      openPaywallModal: true
    });
  }

  unlockVideo = (code) => {
    this.props.enterCode(this.props.video.video_id, code);
  }

  onClosePaywallModal = () => {
    this.setState({
      openPaywallModal: false
    });
  }

  componentDidMount() {
    this.props.fetchVideo(this.props.match.params.id);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errorCode && this.state.openPaywallModal) {
      alert(nextProps.errorCode);
    } 
    if (nextProps.video) {
      this.setState({ loading: false });
    }
    if (nextProps.video_url) {
      this.setState({ openPaywallModal: false });
    }
  }

  renderLoading() {
    return (
      <div><p>Loading</p></div>
    );
  }

  renderBlocker() {
    const thumbnail = this.props.video.thumbnail;
    const title = this.props.video.title;
    return (
      <div className="Video-paywallContainer">
        <img src={thumbnail} className="Video-paywall" alt={title} />
        <button className="btn btn-primary Video-paywallButton" onClick={this.showPaywallModal}>click to view</button>
      </div>
    );
  }

  renderVideo() {
    const videoAttrs = this.props.video;
    const title = videoAttrs.title;
    const uploader = videoAttrs.uploader;
    const description = videoAttrs.description;
    const views = videoAttrs.views;
    const value = videoAttrs.value.toFixed(2);
    return (
      <div>
        <Modal
          classNames={{
            overlay: "Paywall-overlay",
            modal: "Paywall-modal",
          }}
          open={this.state.openPaywallModal}
          onClose={this.onClosePaywallModal}
          center closeOnEsc closeOnOverlayClick>
          <Paywall onClose={this.onCloseUploadModal} unlockVideo={this.unlockVideo} />
        </Modal>
        {this.props.paid ? (<VideoPlayer url={this.props.video_url} />) : (this.renderBlocker()) }
        <div className="Video-info">
          <div className="container-fluid">
            <div className="Video-title row">{title}</div>
            <div className="Video-uploader row">{uploader}</div>
            <div className="row">
              <div className="col-6 nopadding">
                <div className="Video-views">
                  {views} views
                </div>
              </div>
              <div className="col-6 nopadding">
                <div className="row justify-content-end">
                  <div className="Video-value col-4">
                    ${value} accrued
                  </div>
                </div>
              </div>
            </div>
            <hr className="row"/>
            <div className="Video-description row">{description}</div>
            <hr className="row"/>
          </div>
          <Comments comments={this.props.video.comments} video_id={this.props.video.video_id} paid={this.props.paid} />
        </div>
      </div>
    );
  }
  
  render() {
    return (
      <div className="Video-full">
        {this.state.loading ? this.renderLoading() : this.renderVideo()}
      </div>
    );
  }
}

Video.propTypes = {
  fetchVideo: PropTypes.func.isRequired,
  enterCode: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  video: state.videos.item,
  video_url: state.videos.url,
  paid: state.videos.paid,
  errorCode: state.videos.error
})

export default connect(mapStateToProps, { fetchVideo, enterCode })(Video);