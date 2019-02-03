import { POST_UPLOAD, INVALID_USER } from './types';
import axios from 'axios';
import { SERVER_ENDPOINT } from './constants';

export const uploadVideo = (file, title, description, user, unlockCode) => dispatch => {
  const endpoint = SERVER_ENDPOINT + "/upload";
  const data = new FormData();
  data.append('file', file);
  data.append('title', title);
  data.append('description', description);
  data.append('user', user);
  data.append('unlock_code', unlockCode)
  return axios.post(endpoint, data, {
    onUploadProgress: ProgressEvent => dispatch({
        type: POST_UPLOAD,
        payload: parseInt(ProgressEvent.loaded / ProgressEvent.total*100)
      })
    },
  )
  .then(response => {
    dispatch({
      type: POST_UPLOAD,
      payload: 100 // probably better to make an obj that has this set as a boolean
    })
  });
}

export const checkTippinUser = (username) => dispatch => {
  const endpoint = SERVER_ENDPOINT + "/upload/check/" + username;
  fetch(endpoint)
  .then(res => res.json())
  .then(json => {
    if (json.error) {
      dispatch({
        type: INVALID_USER,
        payload: json.error
      })
    }
  })
}
