import { POST_UPLOAD } from '../actions/types';

const initialState = {}

export default function(state = initialState, action) {
  switch(action.type) {
    case POST_UPLOAD:
      return {
        ...state,
        progress: action.payload
      }
    default:
      return state;
  }
}