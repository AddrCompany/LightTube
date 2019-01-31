import { FETCH_VIDEOS, FETCH_VIDEO, VERIFY_CODE_SUCCESSFUL, VERIFY_CODE_FAIL } from '../actions/types';

const initialState = {
  items: [],
  item: {},
  url: "",
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
        item: action.payload,
        url: "",
      }
    case VERIFY_CODE_SUCCESSFUL:
      return {
        ...state,
        url: action.payload,
        error: null
      }
    case VERIFY_CODE_FAIL:
      return {
        ...state,
        // hack to invoke it as a new object each time
        // eslint-disable-next-line
        error: new String(action.payload),
      }
    default:
      return state;
  }
}