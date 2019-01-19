import React, { Component } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import Video from './Video';

import './Home.css';

export default class Home extends Component {
  state = {
    hasMoreItems: true,
    total: 0,
    videos: []
  };

  loadItems = (_page) => {
    this.loadAllVideos()
    .then(videos => this.convertToDisplayableVideos(videos))
    .then(displayVideos => this.setState({videos: displayVideos, total: displayVideos.length, hasMoreItems: false}));
  }

  currentRow = (startIndex) => {
    let endIndex = startIndex + 3;
    let itemInRow = [];
    for (let i = startIndex; i <= Math.min(endIndex, this.state.total-1); i++) {
      itemInRow.push(
          <div className="col-3" key={i}>
            <Video />
          </div>
      );
    }
    return itemInRow;
  }

  convertToDisplayableVideos = (videos) => {
    return videos.map(video => {
      return {
        video_id: video.video_id,
        title: video.title,
        description: video.description,
        uploader: video.user,
        likes: video.likes,
        dislikes: video.dislikes,
        views: video.views,
        thumbnail: video.thumbnail_url,
      };
    })
  }

  loadAllVideos = () => {
    const endpoint = "http://localhost:8001/videos";
    return fetch(endpoint)
    .then(response => response.json())
    .then(json => json.videos);
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