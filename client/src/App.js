import React, { Component } from 'react';
import { Provider } from 'react-redux';
import Modal from 'react-responsive-modal';

import Home from './components/Home';
import Upload from './components/Upload';
import TopNav from './components/TopNav';

import store from './store';

import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openUploadModal: false
    };
  }

  openUpload = () => {
    this.setState({openUploadModal: true})
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
          <div>
            <Home />
          </div>
        </main>
      </Provider>
    );
  }
}

export default App;
