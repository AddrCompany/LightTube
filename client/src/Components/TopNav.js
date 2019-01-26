import React, { Component } from 'react';
import logo from './logo.png';

import './TopNav.css';

export default class TopNav extends Component {

  render() {
    return (
      <nav className="navbar fixed-top navbar-light shadow TopNav-navbar">
        <div className="navbar-brand">
          <img src={logo} height="30" className="d-inline-block align-top TopNav-logo" alt="logo" />
          <span className="TopNav-brand">LightTube</span>
        </div>
        <ul className="nav justify-content-end">
          <li className="nav-item">
            <button className="nav-link TopNav-upload"  onClick={this.props.triggerUpload}>
              <i className="fa fa-fw fa-upload TopNav-upload-icon" style={{ fontSize: '1.0em' }} />Upload
            </button>
          </li>
        </ul>
      </nav>
    );
  }
}
