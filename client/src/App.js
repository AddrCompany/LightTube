import React, { Component } from 'react';
import SideNav, { NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import { Route } from 'react-router-dom';
import { Provider } from 'react-redux';

import Home from './components/Home';
import Upload from './components/Upload';

import store from './store';

import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Route component={CustomSideNav} />
    </div>
    );
  }
}

class CustomSideNav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      atHome: true,
      marginLeft: '64px',
    };
  }

  // react-router is a disappointment or maybe I am?
  onlySelectedActive = (selected) => {
    if (selected === "home") {
      this.setState({
        atHome: true,
        atUpload: false
      });
    } else if (selected === "upload") {
      this.setState({
        atHome: false,
        atUpload: true
      });
    } else {
      this.setState({
        atHome: false,
        atUpload: false
      });
    }
  }

  componentWillMount() {
    let currentPath = this.props.location.pathname.substring(1);
    if (currentPath === "") {
      currentPath = "home";
    }
    this.onlySelectedActive(currentPath);
  }

  moveMain = (expanded) => {
    if (expanded) {
      this.setState({marginLeft: '240px'});
    }
    else {
      this.setState({marginLeft: '64px'});
    }
  }

  toggleSelect = (selected) => {
    let to = '/' + selected;
    this.onlySelectedActive(selected);
    if (this.props.location.pathname !== to) {
      this.props.history.push(to);
    }
  }

  render() {
    return (
      <Provider store={store}>
        <React.Fragment>
          <SideNav
              onToggle={this.moveMain}
              onSelect={this.toggleSelect}
              style={{backgroundColor: '#222', borderRight: '1px solid', position: 'fixed', zIndex: 2}}
          >
              <SideNav.Toggle />
              <SideNav.Nav>
                  <NavItem eventKey="home" active={this.state.atHome}>
                      <NavIcon>
                          <i className="fa fa-fw fa-home" style={{ fontSize: '1.75em' }} />
                      </NavIcon>
                      <NavText>
                          Home
                      </NavText>
                  </NavItem>
                  <NavItem eventKey="upload" active={this.state.atUpload}>
                      <NavIcon>
                        <i className="fa fa-fw fa-upload" style={{ fontSize: '1.75em' }} />
                      </NavIcon>
                      <NavText>
                          Upload
                      </NavText>
                  </NavItem>
              </SideNav.Nav>
          </SideNav>
          <main style={{marginLeft: this.state.marginLeft}}>
            <TopNav />
            <div className="Container-videos">
                <Route path="/" exact component={props => <Home {...this.props} />} />
                <Route path="/home" component={props => <Home {...this.props} />} />
                <Route path="/upload" component={props => <Upload {...this.props} navTrigger={this.onlySelectedActive} />} />
            </div>
          </main>
        </React.Fragment>
      </Provider>
    );
  }
}

class TopNav extends Component {
  render() {
    return (
      <div style={{height: '8vh', backgroundColor: '#333', position: 'fixed', width: '100%', display: 'block', zIndex: 1}}>
        <div className="Brand">
          Light<span role="img" aria-label="Thunder">⚡</span>Tube
        </div>
      </div>

    );
  }
}

export default App;
