import * as path from 'path';
require('dotenv').config({ path: path.resolve(process.cwd(), '.env') })

import * as Promise from 'bluebird';
import fetch, { Headers } from 'node-fetch'
import { Models, PayIn } from '../model';

const openNodeApiKey = process.env.OPENNODE_INVOICE_API_KEY;
const openNodeEndpoint = "https://api.opennode.co";

interface OpenNodeLightningInvoice {
  expires_at: number,
  payreq: string
}

export interface OpenNodeInvoice {
  data: {
    id: string,
    name: string,
    description: string,
    created_at: number,
    status: 'unpaid' | 'paid' | 'processing',
    callback_url: string,
    success_url: string,
    order_id: string,
    notes: string,
    currency: 'USD' | 'EUR' | 'GBP' | 'MXN' | 'BRL' | 'AUD',
    source_fiat_value: number,
    fiat_value: number,
    auto_settle: boolean,
    notif_email: string,
    lightning_invoice: OpenNodeLightningInvoice,
    chain_invoice: { address: string },
    amount: number
  }
}

export function generateInvoiceUSD(amount: number): Promise<OpenNodeInvoice> {
  const endpoint = openNodeEndpoint + "/v1/charges";
  const body = {
    amount: amount,
    currency: 'USD'
  };
  let headers = new Headers();
  headers.append('Authorization', openNodeApiKey);
  headers.append('Content-Type', 'application/json');

  return Promise.resolve(fetch(endpoint, {
    method: 'post',
    body: JSON.stringify(body),
    headers: headers,
  })
  .then(res => res.json()));
}

export function isChargePaid(chargeId: string): Promise<boolean> {
  const endpoint = openNodeEndpoint + "/v1/charge/" + chargeId;
  let headers = new Headers();
  headers.append('Authorization', openNodeApiKey);
  headers.append('Content-Type', 'application/json');

  return Promise.resolve(fetch(endpoint, {
    headers: headers,
  })
  .then(res => res.json())
  .then(json => (json.data.status === 'paid')));
}

export function setChargePaid(chargeId: string, models: Models): Promise<PayIn> {
  return models.payIns.findById(chargeId)
  .then(payIn => payIn.set("paid", true));
}

export function findCharge(payreq: string, models: Models) {
  return models.payIns.findOne({
    where: {
      payreq: payreq
    }
  });
}
