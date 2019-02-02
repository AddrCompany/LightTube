import { combineReducers } from 'redux';
import videosReducer from './videosReducer';
import commentReducer from './commentsReducer';
import uploadReducer from './uploadReducer';

export default combineReducers({
  videos: videosReducer,
  comment: commentReducer,
  upload: uploadReducer,
});