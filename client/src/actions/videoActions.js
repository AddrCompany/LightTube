import { FETCH_VIDEOS, FETCH_VIDEO } from './types';

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
		value: 5.5432, // replace me
    video_url: video.video_url,
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