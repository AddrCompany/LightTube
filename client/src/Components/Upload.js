import React, { Component } from 'react';
import { connect } from 'react-redux';
import { uploadVideo } from '../actions/uploadActions'
import PropTypes from 'prop-types';

import './Upload.css';

class Upload extends Component {
  state = {
    fileLabel: "Choose file",
    title: "",
    description: "",
    user: "",
    file: null,
    loaded: 0,
    loading: false
  };

  onChangeTitle = (event) => {
    let value = event.target.value;
    this.setState({
      title: value
    });
  }

  onChangeDescription = (event) => {
    let value = event.target.value;
    this.setState({
      description: value
    });
  }

  onChangeUser = (event) => {
    let value = event.target.value;
    this.setState({
      user: value
    });
  }

  onChangeFile = (event) => {
    let value = event.target.value;
    let fileName = value.split('\\').pop();
    this.setState({
      fileLabel: fileName,
      file: this.uploadInput.files[0]
    });
  }

  validateFields = () => {
    if (this.state.title === "") {
      alert("'Title' is a required field");
      return false;
    }
    if (this.state.user === "") {
      alert("'Submitted by' is a required field");
      return false;
    }
    if (this.state.file === null) {
      alert("'File' is a required field");
      return false;
    }
    return true;
  }

  handleSubmit = (event) => {
    event.preventDefault();
    let valid = this.validateFields();
    if (valid) {
      this.props.uploadVideo(this.state.file, this.state.title, this.state.description, this.state.user);
      this.setState({
        loading: true
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.progress === 100) {
      alert("Successfully uploaded. Your video will shortly appear on the website");
      this.props.onClose(); // close modal
    }
  }

  render() {
    let loader = (
      <div className="Upload-progressbar">
          {this.props.progress}% loaded
      </div>
    );
    return (
      <div className="Upload-full">
        <header className="Upload-header"><p>Upload</p></header>
        <form className="Upload-form" onSubmit={this.handleSubmit}>
          <div className="form-group row">
            <label className="col-sm-3 col-form-label text-right" htmlFor="inputTitle">Title</label>
            <div className="col-sm-8">
              <input value={this.state.title} type="text" className="form-control" id="inputTitle" aria-describedby="titleHelp" placeholder="Enter title" onChange={this.onChangeTitle} />
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-3 col-form-label text-right" htmlFor="inputDescription">Description</label>
            <div className="col-sm-8">
              <textarea value={this.state.description} className="form-control" id="inputDescription" aria-describedby="descriptionHelp" placeholder="Enter description" onChange={this.onChangeDescription} />
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-3 col-form-label text-right" htmlFor="inputUser">User</label>
            <div className="col-sm-8">
              <input type="text" value={this.state.user} className="form-control" id="inputUser" aria-describedby="userHelp" placeholder="Enter user" onChange={this.onChangeUser} />
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-3 col-form-label text-right" htmlFor="inputUpload">Video file</label>
            <div className="col-sm-8">
              <div  className="custom-file">
                <input type="file" ref={ref => (this.uploadInput = ref)} className="custom-file-input" id="customFile" onChange={this.onChangeFile}
                  accept=".mp4,.mpg,.m4v,.m2ts,.mov" />
                <small id="uploadHelp" className="form-text text-muted text-left">We currently only accept the following file extensions: .mp4, .mpg, .m4v, .m2ts or .mov</small>
                <label className="custom-file-label" htmlFor="customFile">{this.state.fileLabel}</label>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-3"></div>
            <div className="col-sm-3">
              <button type="submit" className="btn btn-primary">Submit</button>
            </div>
          </div>
        </form>
        {this.state.loading ? loader : null}
      </div>
    );
  }
}

Upload.propTypes = {
  uploadVideo: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  progress: state.upload.progress
})

export default connect(mapStateToProps, { uploadVideo })(Upload);
