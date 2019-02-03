import fetch from 'node-fetch';
import { URLSearchParams } from 'url';

const newInvoiceUrl: string = 'https://tippin.me/lndreq/newinvoice.php';
const lookupInvoiceUrl: string = 'https://tippin.me/lndreq/lookupinvoice.php';
const userLookupUrl: string = "https://tippin.me/buttons/send-lite.php?u="

export interface UserDetails {
  username: string,
  userid: string,
  isTaco: "0" | "1"
}

export interface Invoice {
  error: boolean,
  message: string,
  rhash: string
}

export function userExistsOrNoUser(username: string): Promise<boolean> {
  if (username === "") return Promise.resolve(true);
  return getTippinUserDetails(username)
  .then(user => (user.userid !== null));
}

export function getTippinUserDetails(username: string) : Promise<UserDetails> {
  const useridRegExp: RegExp = /(?<=var_userid\s*=\s*)\d*/g;
  const isTacoRegExp: RegExp = /(?<=var_isTaco\s*=\s*)\d*/g;
  return fetch(userLookupUrl + username)
  .then(response => response.text())
  .then(text => {
    const userid = text.match(useridRegExp) ? text.match(useridRegExp)[1] : null;
    const isTaco = text.match(isTacoRegExp) ? text.match(isTacoRegExp)[1] : null;
    return {
      username: username,
      userid: userid,
      isTaco: isTaco
    } as UserDetails;
  });
}

export function createInvoice(userDetails: UserDetails): Promise<Invoice> {
  const params = new URLSearchParams();
  params.append('username', userDetails.username);
  params.append('userid', userDetails.userid);
  params.append('istaco', userDetails.isTaco);
  return fetch(newInvoiceUrl, {
    method: 'post',
    body:    params,
  })
  .then(response => response.json())
  .then(result => (result as Invoice));
}

export function isInvoiceSettled(invoice: Invoice): Promise<boolean> {
  const params = new URLSearchParams();
  params.append('rhash', invoice.rhash)
  return fetch(lookupInvoiceUrl, {
    method: 'post',
    body:    params,
  })
  .then(response => response.json())
  .then(result => result.settled);
}

/*
.then(userDetails => createInvoice(userDetails))
.then(invoice => isInvoiceSettled(invoice))
.then(status => console.log(status));


if (this.state.user === "") return;
    return fetch(userLookupUrl + this.state.user, {
      mode: "no-cors"
    })
    .then(response => response.text())
    .then(text => {
      const userid = text.match(useridRegExp) ? text.match(useridRegExp)[1] : null;
      if (userid === null) {
        alert("Tippin.me profile (" + this.state.user  + ") does not exist");
      }
    });
*/