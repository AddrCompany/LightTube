import { GENERATE_INVOICE, PAYMENT_SUCCESSFUL, PAYMENT_NOT_RECEIVED } from './types';
import { SERVER_ENDPOINT } from './constants';

export const generateInvoice = (video_id) => dispatch => {
  const endpoint = SERVER_ENDPOINT + "/video/" + video_id + "/geninvoice";
  fetch(endpoint)
  .then(res => res.json())
  .then(json => dispatch({
    type: GENERATE_INVOICE,
		payload: json.payreq
  }));
}

export const checkStatus = (payreq) => dispatch => {
  const endpoint = SERVER_ENDPOINT + "/paid/";
  const body = {
    payreq: payreq
  }
  fetch(endpoint, {
    method: 'post',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  })
  .then(res => {
    if (res.status === 200) {
      res.json()
      .then(json => dispatch({
        type: PAYMENT_SUCCESSFUL,
        payload: json.url
      }))
    }
    else if (res.status === 402) {
      dispatch({
        type: PAYMENT_NOT_RECEIVED
      })
    } else {
      console.error(res.status)
    }
  })
}