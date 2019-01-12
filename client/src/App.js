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
  }

  render() {
    return (
      <div className="App">
        <Route render={({ location, history }) => (
          <React.Fragment>
              <SideNav
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
                  style={{background: '#919191', borderRight: '1px solid'}}
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
              <main>
                  <Route path="/" exact component={props => <Home />} />
                  <Route path="/upload" component={props => <Upload />} />
              </main>
          </React.Fragment>
      )}
      />
    </div>
    );
  }
}

export default App;
