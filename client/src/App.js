import React, { Component } from 'react';
import { Provider } from 'react-redux';
import Modal from 'react-responsive-modal';
import { Route, Switch } from 'react-router-dom';

import Home from './components/Home';
import Upload from './components/Upload';
import TopNav from './components/TopNav';
import Video from './components/Video';

import store from './store';

import './App.css';

const LinkToGoogleForm = "https://goo.gl/forms/R6Z33UQ3SjzWXfCI2";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openUploadModal: false
    };
  }
  
  openInNewTab() {
    var win = window.open(LinkToGoogleForm, '_blank');
    win.focus();
  }

  openUpload = () => {
    // this.setState({openUploadModal: true});
    this.openInNewTab();
    
  }

  onCloseUploadModal = () => {
    this.setState({openUploadModal: false})
  }


  render() {
    return (
      <Provider store={store}>
        <main>
          <TopNav triggerUpload={this.openUpload} />
          <Modal
            classNames={{
              overlay: "Upload-overlay",
              modal: "Upload-modal",
            }}
            open={this.state.openUploadModal}
            onClose={this.onCloseUploadModal}
            center closeOnEsc closeOnOverlayClick>
            <Upload onClose={this.onCloseUploadModal} />
          </Modal>
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/video/:id" component={Video} />
          </Switch>
        </main>
      </Provider>
    );
  }
}

export default App;
