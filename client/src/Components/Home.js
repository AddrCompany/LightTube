import React, { Component } from 'react';

import './Home.css';

export default class Home extends Component {
    render() {
      return (
        <div className="Videos-full">
          <header className="Videos-header">
            <p style={{color: 'white', fontFamily: 'Sans Serif'}}>New Videos</p>
          </header>
          <div className="Videos-all container-fluid">
            <div className="row">
              <div className="col-3">
                <div className="Video-container" />
              </div>
              <div className="col-3">
                <div className="Video-container" />
              </div>
              <div className="col-3">
                <div className="Video-container" />
              </div>
              <div className="col-3">
                <div className="Video-container" />
              </div>
            </div>

            <div className="row">
              <div className="col-3">
                <div className="Video-container" />
              </div>
              <div className="col-3">
                <div className="Video-container" />
              </div>
              <div className="col-3">
                <div className="Video-container" />
              </div>
              <div className="col-3">
                <div className="Video-container" />
              </div>
            </div>

            <div className="row">
              <div className="col-3">
                <div className="Video-container" />
              </div>
              <div className="col-3">
                <div className="Video-container" />
              </div>
              <div className="col-3">
                <div className="Video-container" />
              </div>
              <div className="col-3">
                <div className="Video-container" />
              </div>
            </div>

            <div className="row">
              <div className="col-3">
                <div className="Video-container" />
              </div>
              <div className="col-3">
                <div className="Video-container" />
              </div>
              <div className="col-3">
                <div className="Video-container" />
              </div>
              <div className="col-3">
                <div className="Video-container" />
              </div>
            </div>

          </div>
        </div>
      );
    }
  }