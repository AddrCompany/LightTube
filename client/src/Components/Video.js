import React, { Component } from 'react';
import Modal from 'react-responsive-modal';

import './Video.css';

export default class Video extends Component {
  constructor(props) {
    super(props);
    // dislikes, likes, thumbnail, title, uploader, video_id, views
    this.state = {
      ...this.props.videoAttrs,
      openVideo: false,
      video: null
    };
  }

  onOpenModal = (json) => {
    this.setState({ openVideo: true, video: json});
  };
 
  onCloseModal = () => {
    this.setState({ openVideo: false });
  };

  goToVideo = () => {
    const endpoint = "http://localhost:8001/video/" + this.state.video_id;
    return fetch(endpoint)
    .then(response => {
      if (response.status === 200) {
        return response;
      } else {
        throw new Error("video not found");
      }
    })
    .then(response => response.json())
    .then(json => this.onOpenModal(json))
    .catch(err => console.error(err));
  }

  render() {
    return (
      <div className="Video-container">
        <Modal open={this.state.openVideo} onClose={this.onCloseModal} center closeOnEsc closeOnOverlayClick>
          <FullVideoComments videoAttrs={this.state.video} />
        </Modal>
        <img className="Video-thumbail" src={this.state.thumbnail} alt={this.state.title} onClick={this.goToVideo} />
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

class FullVideoComments extends Component {
  constructor(props) {
    super(props);
    // video_id, title, description, user, likes, dislikes, views, thumbnail_url, video_url, comments
    // comments: content, user
    this.state = {
      ...this.props.videoAttrs
    };
  }

  render() {
    const allComments = this.state.comments;
    let commentItems = [];
    let i = 0;
    while (i < allComments.length) {
      commentItems.push(
        <div class="Comment-box" key={"comment" + i}>
          <div className="Comment-user">{allComments[i].user}</div>
          <div className="Comment-content">{allComments[i].content}</div>
        </div>
      );
      i += 1;
    }
    return (
      <div className="Video-full">
        <h2>Simple centered modal</h2>
        {commentItems}
      </div>
    );
  }
}
