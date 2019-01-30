import fetch from 'node-fetch';
import { URLSearchParams } from 'url';

const newInvoiceUrl: string = 'https://tippin.me/lndreq/newinvoice.php';
const lookupInvoiceUrl: string = 'https://tippin.me/lndreq/lookupinvoice.php';
const userLookupUrl: string = "https://tippin.me/buttons/send-lite.php?u="

interface UserDetails {
  username: string,
  userid: string,
  isTaco: "0" | "1"
}

interface Invoice {
  error: boolean,
  message: string,
  rhash: string
}

function getUserDetails(username: string) : Promise<UserDetails> {
  const useridRegExp: RegExp = /(?<=var_userid\s*=\s*)\d*/g;
  const isTacoRegExp: RegExp = /(?<=var_isTaco\s*=\s*)\d*/g;
  return fetch(userLookupUrl + username)
  .then(response => response.text())
  .then(text => {
    return {
      username: username,
      userid: text.match(useridRegExp)[1],
      isTaco: text.match(isTacoRegExp)[1]
    } as UserDetails;
  });
}

function createInvoice(userDetails: UserDetails): Promise<Invoice> {
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

function isInvoiceSettled(invoice: Invoice): Promise<boolean> {
  console.log(invoice);
  const params = new URLSearchParams();
  params.append('rhash', invoice.rhash)
  return fetch(lookupInvoiceUrl, {
    method: 'post',
    body:    params,
  })
  .then(response => response.json())
  .then(result => result.settled);
}

getUserDetails("uneeb123")
.then(userDetails => createInvoice(userDetails))
.then(invoice => isInvoiceSettled(invoice))
.then(status => console.log(status));