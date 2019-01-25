import { FETCH_VIDEOS } from './types';

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
			likes: video.likes,
			dislikes: video.dislikes,
			views: video.views,
			thumbnail: video.thumbnail_url,
			total_comments: video.total_comments
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
};