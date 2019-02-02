import React, { Component } from 'react';
import QRCode from 'react-qr-code';
import { connect } from 'react-redux';
import { generateInvoice, checkStatus  } from '../actions/paywallActions'
import PropTypes from 'prop-types';

import './Paywall.css';

class Paywall extends Component {
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
    this.props.unlockVideo(this.state.code);
    this.setState({
      code: ""
    });
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

  componentWillMount() {
    this.props.generateInvoice(this.props.video_id);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.payreq) {
      this.timer = setInterval(() => this.props.checkStatus(this.props.payreq), 1000);
    }
  }
  
  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    const payreq = this.props.payreq;
    return (
      <div className="Paywall-full text-center">
        <h3>Pay to continue</h3>
        <div className="Paywall-lightning">
          <div className="Paywall-qr">
            {!!payreq ? (<QRCode value={payreq} />) : null }
          </div>
          <div className="Paywall-lightningLogo">powered by OpenNode<span role="img" aria-label="bolt">⚡</span></div>
        </div>
        <div className="Paywall-divider">OR</div>
        {this.renderPasscode()}
      </div>
    );
  }
}

Paywall.propTypes = {
  generateInvoice: PropTypes.func.isRequired,
  checkStatus: PropTypes.func.isRequired,
  video_id: PropTypes.number.isRequired
};

const mapStateToProps = state => ({
  payreq: state.videos.payreq,
})

export default connect(mapStateToProps, { generateInvoice, checkStatus })(Paywall);