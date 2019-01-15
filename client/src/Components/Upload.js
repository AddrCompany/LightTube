import React, { Component } from 'react';

import './Upload.css';

export default class Upload extends Component {
  state = {
    fileLabel: "Choose file",
    title: "",
    description: "",
    user: "",
    file: null,
    isAnon: false
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
      console.log(this.state)
      // do something
    }
  }

  toggleAnon = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    if (value) {
      this.setState({isAnon: true, user: "Anonymous"});
    } else {
      this.setState({isAnon: false, user: ""});
    }
  }

  render() {
    return (
      <div className="Upload-full">
        <header className="Upload-header">
          <p style={{color: 'white', fontFamily: 'Sans Serif'}}>Upload</p>
        </header>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group row">
            <label className="col-sm-2 col-form-label text-right" htmlFor="inputTitle">Title</label>
            <div className="col-sm-8">
              <input value={this.state.title} type="text" className="form-control" id="inputTitle" aria-describedby="titleHelp" placeholder="Enter title" onChange={this.onChangeTitle} />
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-2 col-form-label text-right" htmlFor="inputDescription">Description</label>
            <div className="col-sm-8">
              <textarea value={this.state.description} className="form-control" id="inputDescription" aria-describedby="descriptionHelp" placeholder="Enter description" onChange={this.onChangeDescription} />
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-2 col-form-label text-right" htmlFor="inputUser">Submitted by</label>
            <div className="col-sm-8">
              <input type="text" disabled={this.state.isAnon} value={this.state.user} className="form-control" id="inputUser" aria-describedby="userHelp" placeholder="Enter user" onChange={this.onChangeUser} />
              <div className="pl-4 float-left">
                <input type="checkbox" className="form-check-input" id="anonCheck" checked={this.state.isAnon} onChange={this.toggleAnon} />
                <label className="form-check-label" htmlFor="anonCheck">anonymous</label>
              </div>
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-2 col-form-label text-right" htmlFor="inputUpload">Upload</label>
            <div className="col-sm-8">
              <div  className="custom-file">
                <input type="file" ref={ref => (this.uploadInput = ref)} className="custom-file-input" id="customFile" onChange={this.onChangeFile}
                  accept=".mp4,.mpg,.m4v,.m2ts,.mov" />
                <small id="uploadHelp" className="form-text text-muted text-left">We currently only accept the following file extensions: .mp4, .mpg, .m4v, .m2ts or .mov</small>
                <label className="custom-file-label" htmlFor="customFile">{this.state.fileLabel}</label>
              </div>
            </div>
          </div>
          <button type="submit" className="btn btn-primary">Submit</button>
        </form>
      </div>
    );
  }
}
