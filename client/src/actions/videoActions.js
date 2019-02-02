import axios from 'axios';
import { FETCH_VIDEOS, FETCH_VIDEO, VERIFY_CODE_FAIL, VERIFY_CODE_SUCCESSFUL } from './types';

function loadAllVideos() {
	const endpoint = "http://localhost:8001/videos";
	return fetch(endpoint)
		.then(response => response.json())
		.then(json => json.videos);
}

function convertToDisplayableVideos(videos) {
	return videos.map(video => {
		return {
			video_id: video.video_id,
			title: video.title,
			uploader: video.user,
			views: video.views,
			thumbnail: video.thumbnail_url,
			gif_url: video.gif_url,
			created_at: video.created_at,
			value: video.amount,
		};
	})
}

export const fetchVideos = () => dispatch => {
	loadAllVideos()
	.then(videos => convertToDisplayableVideos(videos))
	.then(displayVideos => dispatch({
		type: FETCH_VIDEOS,
		payload: displayVideos
	}));
}

function loadVideo(id) {
	const endpoint = "http://localhost:8001/video/" + id;
	return fetch(endpoint)
		.then(response => response.json())
}

function convertToDisplayableVideo(video) {
	return {
		video_id: video.video_id,
    title: video.title,
    description: video.description,
    uploader: video.user,
    likes: video.likes,
    dislikes: video.dislikes,
    views: video.views,
		thumbnail: video.thumbnail_url,
		value: video.amount,
    comments: video.comments
	};
}

export const fetchVideo = (id) => dispatch => {
	loadVideo(id)
	.then(video => convertToDisplayableVideo(video))
	.then(displayVideo => dispatch({
		type: FETCH_VIDEO,
		payload: displayVideo
	}))
}

export const enterCode = (id, code) => dispatch => {
	const endpoint = "http://localhost:8001/video/" + id + "/verify";
  const data = new FormData();
  data.append('code', code);
  axios.post(endpoint, data)
  .then(response => dispatch({
		type: VERIFY_CODE_SUCCESSFUL,
		payload: response.data.url
	}))
	.catch(e => dispatch({
		type: VERIFY_CODE_FAIL,
		payload: "Wrong code entered"
	}));
}
