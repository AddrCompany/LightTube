import React, { Component } from 'react';
import { connect } from 'react-redux';
import { postComment } from '../actions/commentActions'
import PropTypes from 'prop-types';

import './Comments.css';

class Comments extends Component {
  state = {
    viewerComment: "",
    viewerUser: "",
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
        viewerUser: ""
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.newComment) {
      this.props.comments.push(nextProps.newComment);
    }
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

  render() {
    const allComments = this.props.comments;
    let commentItems = [];
    if (allComments.length === 0) {
      commentItems.push(<div key={0} className="font-italic Comment-content">No comments</div>)
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
          {this.props.paid? this.renderCommentSubmitForm() : null }
        </div>
      </div>
    );
  }
}

Comments.propTypes = {
  postComment: PropTypes.func.isRequired,
  comments: PropTypes.array.isRequired,
  video_id: PropTypes.number.isRequired,
  paid: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  newComment: state.comment.item,
})

export default connect(mapStateToProps, { postComment })(Comments);