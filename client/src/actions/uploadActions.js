import { POST_UPLOAD } from './types';
import axios from 'axios';

export const uploadVideo = (file, title, description, user, unlockCode) => dispatch => {
  const endpoint = "http://localhost:8001/upload";
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
