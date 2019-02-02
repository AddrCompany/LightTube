import { GENERATE_INVOICE, PAYMENT_SUCCESSFUL, PAYMENT_NOT_RECEIVED } from './types';

export const generateInvoice = (video_id) => dispatch => {
  const endpoint = "http://localhost:8001/video/" + video_id + "/geninvoice";
  fetch(endpoint)
  .then(res => res.json())
  .then(json => dispatch({
    type: GENERATE_INVOICE,
		payload: json.payreq
  }));
}

export const checkStatus = (payreq) => dispatch => {
  const endpoint = "http://localhost:8001/paid/" + payreq;
  fetch(endpoint)
  .then(res => {
    if (res.status === 200) {
      res.json()
      .then(json => dispatch({
        type: PAYMENT_SUCCESSFUL,
        payload: json.url
      }))
    } else if (res.status === 402) {
      dispatch({
        type: PAYMENT_NOT_RECEIVED
      })
    }
  })
}