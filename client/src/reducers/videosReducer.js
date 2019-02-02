import {
  FETCH_VIDEOS,
  FETCH_VIDEO,
  VERIFY_CODE_SUCCESSFUL,
  VERIFY_CODE_FAIL,
  PAYMENT_NOT_RECEIVED,
  PAYMENT_SUCCESSFUL,
  GENERATE_INVOICE
} from '../actions/types';

const initialState = {
  items: [],
  item: {},
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
        paid: false,
        item: action.payload,
      }
    case GENERATE_INVOICE:
      return {
        ...state,
        payreq: action.payload
      }
    case PAYMENT_SUCCESSFUL:
      return {
        ...state,
        url: action.payload,
        paid: true
      }
    case PAYMENT_NOT_RECEIVED:
      return state
    case VERIFY_CODE_SUCCESSFUL:
      return {
        ...state,
        url: action.payload,
        paid: true,
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