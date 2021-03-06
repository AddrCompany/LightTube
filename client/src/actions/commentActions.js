import axios from 'axios';
import { POST_COMMENT } from './types';
import { SERVER_ENDPOINT } from './constants';

export const postComment = (video_id, comment, user) => dispatch => {
  const endpoint = SERVER_ENDPOINT + "/video/" + video_id + "/comment";
  const data = new FormData();
  data.append('comment', comment);
  data.append('user', user);
  axios.post(endpoint, data)
  .then(response => dispatch({
		type: POST_COMMENT,
		payload: response.data
	}));
}
