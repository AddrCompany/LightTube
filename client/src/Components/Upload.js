import React, { Component } from 'react';
import { connect } from 'react-redux';
import { uploadVideo, checkTippinUser } from '../actions/uploadActions'
import PropTypes from 'prop-types';
import CircularProgressbar from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import './Upload.css';

class Upload extends Component {
  state = {
    fileLabel: "Choose file",
    title: "",
    description: "",
    user: "",
    unlockCode: "",
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

  onChangeUnlockCode = (event) => {
    let value = event.target.value;
    this.setState({
      unlockCode: value
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
  
  checkTippinUser = () => {
    if (this.state.user !== "") {
      this.props.checkTippinUser(this.state.user);
    }
  }

  validateFields = () => {
    if (this.state.title === "") {
      alert("'Title' is a required field");
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
      this.props.uploadVideo(this.state.file, this.state.title, this.state.description, this.state.user, this.state.unlockCode);
      this.setState({
        loading: true
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.error) {
      alert(nextProps.error)
    }
    if (nextProps.progress === 100) {
      alert("Successfully uploaded. Your video will shortly appear on the website");
      this.props.onClose(); // close modal
    }
  }

  render() {
    const tippinMeHelperText = "This is where you will receive PayOuts for the money that you earn on the videos. Usually the same as your Twitter username.";
    let percentage = this.props.progress || 0;
    let loader = (
      <div style={{ width: "100px", margin: "0 auto" }}>
        <CircularProgressbar percentage={percentage} text={`${percentage}%`} />
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
          <div className="form-group row">
            <label className="col-sm-3 col-form-label text-right" htmlFor="inputUnlockCode">Unlock code</label>
            <div className="col-sm-8">
              <input value={this.state.unlockCode} type="text" className="form-control" id="inputUnlockCode" aria-describedby="codeHelp" placeholder="Enter code to unlock video" onChange={this.onChangeUnlockCode} />
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-3 col-form-label text-right" htmlFor="inputUser">
              <a rel="noopener noreferrer" href="https://tippin.me/" target="_blank">Tippin.me</a> user
            </label>
              <div className="input-group col-sm-8">
                <div className="input-group-prepend">
              <div className="input-group-text">@</div>
              </div>
              <input type="text"
                value={this.state.user}
                className="form-control"
                id="inputUser"
                aria-describedby="userHelp"
                placeholder="Enter tippin.me user (optional)"
                onChange={this.onChangeUser}
                onBlur={this.checkTippinUser} />
              <small id="uploadHelp" className="form-text text-muted text-left">{tippinMeHelperText}</small>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-3"></div>
            <div className="col-sm-3">
              {this.state.loading? null : (<button type="submit"  className="btn btn-primary">Submit</button>)}
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
  checkTippinUser: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  progress: state.upload.progress,
  error: state.upload.error
})

export default connect(mapStateToProps, { uploadVideo, checkTippinUser })(Upload);
