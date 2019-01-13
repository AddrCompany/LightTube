import React, { Component } from 'react';
import SideNav, { NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import { Route } from 'react-router-dom';
import Home from './Components/Home';
import Upload from './Components/Upload';

import './App.css';

class App extends Component {
  state = {
    atHome: true,
    atUpload: false,
    marginLeft: '64px',
  }

  moveMain = (expanded) => {
    if (expanded) {
      this.setState({marginLeft: '240px'});
    }
    else {
      this.setState({marginLeft: '64px'});
    }
  }

  render() {
    return (
      <div className="App">
        <Route render={({ location, history }) => (
          <React.Fragment>
              <SideNav
                  onToggle={this.moveMain}
                  onSelect={(selected) => {
                    let to = '/'
                    if (selected === "") {
                      this.setState({atHome: true, atUpload: false});
                    }
                    else if (selected === "upload") {
                      to = '/' + selected;
                      this.setState({atHome: false, atUpload: true});
                    }
                    if (location.pathname !== to) {
                      history.push(to);
                    }
                  }}
                  style={{backgroundColor: '#222', borderRight: '1px solid', position: 'fixed', zIndex: 2}}
              >
                  <SideNav.Toggle />
                  <SideNav.Nav defaultSelected="home">
                      <NavItem eventKey="" active={this.state.atHome}>
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
                    <Route path="/" exact component={props => <Home />} />
                    <Route path="/upload" component={props => <Upload />} />
                </div>
              </main>
          </React.Fragment>
      )}
      />
    </div>
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
