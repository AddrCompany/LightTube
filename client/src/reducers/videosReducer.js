import { FETCH_VIDEOS } from '../actions/types';

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
    default:
      return state;
  }
}