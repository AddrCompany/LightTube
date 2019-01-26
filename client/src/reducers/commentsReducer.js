import { POST_COMMENT } from '../actions/types';

const initialState = {}

export default function(state = initialState, action) {
  switch(action.type) {
    case POST_COMMENT:
      return {
        ...state,
        item: action.payload
      }
    default:
      return state;
  }
}