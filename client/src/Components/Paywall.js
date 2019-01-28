import React, { Component } from 'react';
import QRCode from 'react-qr-code';

import './Paywall.css';

export default class Paywall extends Component {
  state = {
    code: ""
  };

  onChangeCode = (event) => {
    let value = event.target.value;
    this.setState({
      code: value
    });
  }

  handleSubmit = (event) => {
    event.preventDefault();
  }

  renderPasscode() {
    return (
      <div className="container-fluid Paywall-code">
        <form onSubmit={this.handleSubmit}>
          <div className="form-group row">
            <label className="col-sm-4 col-form-label text-right" htmlFor="inputCode">Code</label>
            <div className="col-sm-8">
              <input type="text" value={this.state.code}
                className="form-control" 
                id="inputCode"
                aria-describedby="codeHelp"
                placeholder="Enter code"
                onChange={this.onChangeCode} />
            </div>
          </div>
          <div className="form-group row">
            <div className="col-sm-12">
              <button type="submit" className="btn btn-primary btn-sm">Submit</button>
            </div>
          </div>
        </form>
      </div>
    );
  }

  render() {
    const test = "lnbc1500n1pwyar2ppp5zd9aqdesw4xzfyp2td432k5dz80j2yhn4fk5cv66e4x23d00h5qsdpa2fjkzep6yp2xsefqw4k8gunp943k7mnnw3e82cm5d9mx2grpwpc8ymmpvd5q6cqzysxqr23st09sxyshzgppv5mlj788agkgz3ykva32ljlx3pqsxx96n0qgju88a500k4ukszrnzee2mecqctncv6vsp7na0apd648m93mr64vjsacphzr2yk";
    return (
      <div className="Paywall-full text-center">
        <h3>Pay to continue</h3>
        <div className="Paywall-lightning">
          <div className="Paywall-qr">
            <QRCode value={test} />
          </div>
          <div className="Paywall-lightningLogo">powered by lightning network<span role="img" aria-label="bolt">⚡</span></div>
        </div>
        <div className="Paywall-divider">OR</div>
        {this.renderPasscode()}
      </div>
    );
  }
}