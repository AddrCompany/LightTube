import { FETCH_VIDEOS, FETCH_VIDEO } from '../actions/types';

const initialState = {
  items: []
}

export default function(state = initialState, action) {
  switch(action.type) {
    case FETCH_VIDEOS:
      return {
        ...state,
        items: action.payload
      }
    case FETCH_VIDEO:
      return {
        ...state,
        item: action.payload 
      }
    default:
      return state;
  }
}