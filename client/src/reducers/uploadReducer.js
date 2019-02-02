import { POST_UPLOAD, INVALID_USER } from '../actions/types';

const initialState = {}

export default function(state = initialState, action) {
  switch(action.type) {
    case POST_UPLOAD:
      return {
        ...state,
        progress: action.payload
      }
    case INVALID_USER:
      return {
        ...state,
        error: action.payload
      }
    default:
      return state;
  }
}