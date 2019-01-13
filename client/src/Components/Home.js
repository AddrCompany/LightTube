import React, { Component } from 'react';
import InfiniteScroll from 'react-infinite-scroller';

import './Home.css';

export default class Home extends Component {
  // https://github.com/CassetteRocks/react-infinite-scroller/blob/master/docs/src/index.js
  state = {
    hasMoreItems: true,
    total: 16,
  };

  loadItems = (page) => {
    let self = this;
    setTimeout(function() {
      let next = self.state.total + 12;
      self.setState({total: next});
    }, 1000);
  }

  currentRow = (start) => {
    let end = start + 3;
    let allItems = [];
    for (let i = start; i <= Math.min(end, this.state.total); i++) {
      allItems.push(
          <div className="col-3" key={i}>
            <div className="Video-container" />
          </div>
      );
    }
    return allItems;
  }

  render() {
    const loader = <div key={this.state.total} className="loader">Loading ...</div>;
    let items = [];
    let i = 0;
    let rowIndex = 0;
    let totalRows = Math.ceil(this.state.total/4.0);
    while (rowIndex < totalRows) {
      let row = this.currentRow(i);
      items.push(
        <div className="row" key={'row'+rowIndex}>
          {row}
        </div>
      );
      i += 4;
      rowIndex += 1;
    }

    return (
      <div className="Videos-full">
        <header className="Videos-header">
          <p style={{color: 'white', fontFamily: 'Sans Serif'}}>New Videos</p>
        </header>
        <div className="Videos-all container-fluid">
          <InfiniteScroll
            pageStart={0}
            loadMore={this.loadItems}
            hasMore={this.state.hasMoreItems}
            loader={loader}>

            <div>
              {items}
            </div>
          </InfiniteScroll>
        </div>
      </div>
    );
  }
}