import React, { Component } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import VideoContainer from './VideoContainer';
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
    const endIndex = startIndex + 3;
    let itemInRow = [];
    for (let i = startIndex; i <= Math.min(endIndex, this.state.total-1); i++) {
      const currentVideo = this.props.videos[i];
      const video_id = currentVideo.video_id;
      const title = currentVideo.title;
      const thumbnail = currentVideo.thumbnail;
      const uploader = currentVideo.uploader;
      itemInRow.push(
        <div className="col-3" key={i}>
          <VideoContainer
            video_id={video_id}
            title={title}
            thumbnail={thumbnail}
            uploader={uploader} />
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
        <header className="Videos-header"></header>
        <div className="container-fluid">
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