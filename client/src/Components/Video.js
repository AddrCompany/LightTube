import React, { Component } from 'react';
import Modal from 'react-responsive-modal';
import axios from 'axios';

import VideoPlayer from './VideoPlayer';
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
        <Modal
          classNames={{
            overlay: "Video-overlay",
            modal: "Video-modal",
          }}
          open={this.state.openVideo}
          onClose={this.onCloseModal}
          center closeOnEsc closeOnOverlayClick>
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
      ...this.props.videoAttrs,
      viewerComment: "",
      viewerUser: "",
      viewerIsAnon: false,
    };    
  }

  onChangeViewerComment = (event) => {
    let value = event.target.value;
    this.setState({
      viewerComment: value
    });
  }

  onChangeViewerUser = (event) => {
    let value = event.target.value;
    this.setState({
      viewerUser: value
    });
  }

  toggleAnon = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    if (value) {
      this.setState({viewerIsAnon: true, viewerUser: "Anonymous"});
    } else {
      this.setState({viewerIsAnon: false, viewerUser: ""});
    }
  }

  validateFields = () => {
    const comment = this.state.viewerComment;
    const user = this.state.viewerUser;
    if (comment === "") {
      alert("Comment can not be empty");
      return false;
    }
    if (user === "") {
      alert("User can not be empty");
      return false
    }
    return true;
  }

  handleSubmit = (event) => {
    event.preventDefault();
    let valid = this.validateFields();
    const endpoint = "http://localhost:8001/video/" + this.state.video_id + "/comment";
    if (valid) {
      const data = new FormData();
      data.append('comment', this.state.viewerComment);
      data.append('user', this.state.viewerUser);
      axios.post(endpoint, data)
      .then(response => {
        this.setState({
          ...response.data,
          viewerComment: "",
          viewerUser: "",
          viewerIsAnon: false,
        });
      });
    }
  }


  render() {
    const allComments = this.state.comments;
    let commentItems = [];
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
      <div className="Video-full">      
        <VideoPlayer url={this.state.video_url} />  
        <div className="Comments-full">
          {commentItems}
        </div>
        <form className="Comment-form" onSubmit={this.handleSubmit}>
          <div className="form-group row">
            <label className="col-sm-2 col-form-label text-right" htmlFor="inputComment">Comment</label>
            <div className="col-sm-8">
              <textarea value={this.state.userComment} className="form-control" id="inputComment" aria-describedby="commentHelp" placeholder="Enter comment" onChange={this.onChangeViewerComment} />
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-2 col-form-label text-right" htmlFor="inputUser">User</label>
            <div className="col-sm-6">
              <input type="text" disabled={this.state.viewerIsAnon} value={this.state.viewerUser} className="form-control" id="inputUser" aria-describedby="userHelp" placeholder="Enter user" onChange={this.onChangeViewerUser} />
              <div className="pl-4 float-left">
                <input type="checkbox" className="form-check-input" id="anonCheck" checked={this.state.viewerIsAnon} onChange={this.toggleAnon} />
                <label className="form-check-label" htmlFor="anonCheck">anonymous</label>
              </div>
            </div>
            <div className="col-sm-2">
              <button type="submit" className="btn btn-primary">Submit</button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}
