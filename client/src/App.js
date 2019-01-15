import React, { Component } from 'react';
import SideNav, { NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import { Route } from 'react-router-dom';
import Home from './Components/Home';
import Upload from './Components/Upload';

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
    let currentPath = this.props.location.pathname.substring(1);
    if (currentPath === "") {
      currentPath = "home";
    }
    this.state = {
      currentPath: currentPath,
      marginLeft: '64px',
    };
  }

  atHome = () => {
    if (this.state.currentPath === "home") {
      return true;
    }
    return false;
  }

  atUpload = () => {
    if (this.state.currentPath === "upload") {
      return true;
    }
    return false;
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
    this.setState({currentPath: selected});
    if (this.props.location.pathname !== to) {
      this.props.history.push(to);
    }
  }

  render() {
    return (
      <React.Fragment>
        <SideNav
            onToggle={this.moveMain}
            onSelect={this.toggleSelect}
            style={{backgroundColor: '#222', borderRight: '1px solid', position: 'fixed', zIndex: 2}}
        >
            <SideNav.Toggle />
            <SideNav.Nav defaultSelected={this.state.currentPath}>
                <NavItem eventKey="home" active={this.atHome()}>
                    <NavIcon>
                        <i className="fa fa-fw fa-home" style={{ fontSize: '1.75em' }} />
                    </NavIcon>
                    <NavText>
                        Home
                    </NavText>
                </NavItem>
                <NavItem eventKey="upload" active={this.atUpload()}>
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
              <Route path="/" exact component={props => <Home />} />
              <Route path="/home" component={props => <Home />} />
              <Route path="/upload" component={props => <Upload />} />
          </div>
        </main>
      </React.Fragment>
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
