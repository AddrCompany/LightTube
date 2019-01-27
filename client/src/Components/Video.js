import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchVideo } from '../actions/videoActions'
import PropTypes from 'prop-types';

import VideoPlayer from './VideoPlayer';

import './Video.css';

class Video extends Component {
  state = {
    loading: true,
    paid: false
  };

  showPaywallModal = (event) => {
    this.setState({
      paid: true
    })
  }

  componentDidMount() {
    this.props.fetchVideo(this.props.match.params.id);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.video) {
      this.setState({
        loading: false
      })
    }
  }

  renderLoading() {
    return (
      <div><p>Loading</p></div>
    );
  }

  renderCommentSubmitForm() {
    return (
      <form className="Comment-form" onSubmit={this.handleSubmit}>
        <div className="form-group row">
          <label className="col-sm-2 col-form-label text-right" htmlFor="inputComment">Comment</label>
          <div className="col-sm-6">
            <textarea value={this.state.viewerComment} className="form-control form-control-sm" id="inputComment" aria-describedby="commentHelp" placeholder="Enter comment" onChange={this.onChangeViewerComment} />
          </div>
        </div>
        <div className="form-group row">
          <label className="col-sm-2 col-form-label text-right" htmlFor="inputUser">User</label>
          <div className="col-sm-6">
            <input type="text" value={this.state.viewerUser} className="form-control form-control-sm" id="inputUser" aria-describedby="userHelp" placeholder="Enter user" onChange={this.onChangeViewerUser} />
          </div>
        </div>
        <div className="row">
          <div className="col-sm-2"></div>
          <div className="col-sm-2">
            <button type="submit" className="btn btn-primary btn-sm">Submit</button>
          </div>
        </div>
      </form>
    );
  }

  renderComments() {
    const allComments = this.props.video.comments;
    let commentItems = [];
    if (allComments.length === 0) {
      commentItems.push(<div className="font-italic Comment-content">No comments</div>)
    }
    let i = 0;
    while (i < allComments.length) {
      commentItems.push(
        <div className="Comment-box" key={"comment" + i}>
          <div className="Comment-user">{allComments[i].user}</div>
          <div className="Comment-content">{allComments[i].content}</div>
        </div>
      );
      i += 1;
    }
    return (
      <div className="container-fluid">      
        <div className="row">
          {commentItems}
        </div>
        <hr className="row " />
        <div className="row">
          {this.state.paid? this.renderCommentSubmitForm() : null }
        </div>
      </div>
    );
  }

  renderPaywall() {
    const thumbnail = this.props.video.thumbnail;
    const title = this.props.video.title;
    return (
      <div className="Video-paywallContainer">
        <img src={thumbnail} className="Video-paywall" alt={title} />
        <button className="btn btn-primary Video-paywallButton" onClick={this.showPaywallModal}>Pay</button>
      </div>
    );
  }

  renderVideo() {
    const videoAttrs = this.props.video;
    const title = videoAttrs.title;
    const video_url = videoAttrs.video_url;
    const uploader = videoAttrs.uploader;
    const description = videoAttrs.description;
    const views = videoAttrs.views;
    const value = videoAttrs.value.toFixed(2);
    return (
      <div>
        {this.state.paid ? (<VideoPlayer url={video_url} />) : (this.renderPaywall()) }
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
                    ${value} spent
                  </div>
                </div>
              </div>
            </div>
            <hr className="row"/>
            <div className="Video-description row">{description}</div>
            <hr className="row"/>
          </div>
          {this.renderComments()}
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
};

const mapStateToProps = state => ({
  video: state.videos.item
})

export default connect(mapStateToProps, { fetchVideo })(Video);