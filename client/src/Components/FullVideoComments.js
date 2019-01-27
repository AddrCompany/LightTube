import React, { Component } from 'react';
import { connect } from 'react-redux';
import { postComment } from '../actions/commentActions'
import PropTypes from 'prop-types';

import VideoPlayer from './VideoPlayer';

import './FullVideoComments.css';

class FullVideoComments extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
    if (valid) {
      this.props.postComment(this.props.video_id, this.state.viewerComment, this.state.viewerUser)
      this.setState({
        viewerComment: "",
        viewerUser: "",
        viewerIsAnon: false
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps.comment);
    if (nextProps.comment) {
      this.props.comments.unshift(nextProps.comment);
    }
  }

  render() {
    const allComments = this.props.comments;
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
        <VideoPlayer url={this.props.video_url} />  
        <div className="Comments-full">
          {commentItems}
        </div>
        <form className="Comment-form" onSubmit={this.handleSubmit}>
          <div className="form-group row">
            <label className="col-sm-2 col-form-label text-right" htmlFor="inputComment">Comment</label>
            <div className="col-sm-8">
              <textarea value={this.state.viewerComment} className="form-control" id="inputComment" aria-describedby="commentHelp" placeholder="Enter comment" onChange={this.onChangeViewerComment} />
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

FullVideoComments.propTypes = {
  postComment: PropTypes.func.isRequired,
  video_id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  comments: PropTypes.array.isRequired,
  video_url: PropTypes.string.isRequired,
  user: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  comment: state.comment.item
})

export default connect(mapStateToProps, { postComment })(FullVideoComments);
