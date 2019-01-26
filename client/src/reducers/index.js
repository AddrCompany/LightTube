import { combineReducers } from 'redux';
import videosReducer from './videosReducer';
import commentReducer from './commentsReducer'

export default combineReducers({
  videos: videosReducer,
  comment: commentReducer
});