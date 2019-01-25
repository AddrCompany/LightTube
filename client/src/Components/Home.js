import React, { Component } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import Video from './Video';
import { connect } from 'react-redux';
import { fetchVideos } from '../actions/videoActions'
import PropTypes from 'prop-types';

import './Home.css';

class Home extends Component {
  state = {
    hasMoreItems: true,
    total: 0,
  };

  loadItems = (_page) => {
    this.props.fetchVideos();
    //  no pagination yet
    this.setState({
      hasMoreItems: false
    })
  }

  currentRow = (startIndex) => {
    let endIndex = startIndex + 3;
    let itemInRow = [];
    for (let i = startIndex; i <= Math.min(endIndex, this.state.total-1); i++) {
      itemInRow.push(
          <div className="col-3" key={i}>
            <Video videoAttrs={this.props.videos[i]} />
          </div>
      );
    }
    return itemInRow;
  }  

  componentWillReceiveProps(nextProps) {
    if (nextProps.videos) {
      this.setState({total: nextProps.videos.length});
    } 
  }

  render() {
    const loader = <div key={this.state.total} className="loader">Loading ...</div>;
    let allVideoRows = [];
    let i = 0;
    let rowIndex = 0;
    let totalRows = Math.ceil(this.state.total/4.0);
    while (rowIndex < totalRows) {
      let row = this.currentRow(i);
      allVideoRows.push(
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
              {allVideoRows}
            </div>
          </InfiniteScroll>
        </div>
      </div>
    );
  }
}

Home.propTypes = {
  fetchVideos: PropTypes.func.isRequired,
  videos: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  videos: state.videos.items
})

export default connect(mapStateToProps, { fetchVideos })(Home);