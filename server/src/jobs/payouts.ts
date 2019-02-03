import * as path from 'path';
require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });

import * as Promise from 'bluebird';
import { instantiateModels, PayIn, PayOut, PayOutAttrs } from '../model';
import * as sequelize from 'sequelize';
import { getTippinUserDetails, createInvoice, Invoice, isInvoiceSettled } from '../tippin-me';
import { withdrawFunds } from '../router/payments';

const JOB_FREQUENCY = 1000 * 30; // every 30 seconds

const sequelizeInstance = new sequelize(
  process.env.DATABASE_NAME,process.env.DATABASE_USER, process.env.DATABASE_PASSWORD,
  {
    host: process.env.DATABASE_HOST,
    dialect: 'postgres',
  }
);

const models = instantiateModels(sequelizeInstance);

interface Balance {
  videoId: number,
  balance: number, // satoshis
}

function getTotalPayToAllVideos(): Promise<PayIn[]> {
  return models.payIns.findAll({
    attributes: [
      [sequelize.fn('SUM', sequelize.col('amountSatoshi')), 'total'],
      'videoId'
    ],
    group: 'videoId',
    where: {
      paid: true
    }
  });
}

function currentPayOutForVideo(videoId: number): Promise<PayOut> {
  return models.payOuts.findOne({
    attributes: [
      [sequelize.fn('SUM', sequelize.col('amountSatoshi')), 'total'],
      'videoId'
    ],
    where: {
      videoId: videoId
    },
    group: 'videoId',
  })
}

function getBalanceForVideo(videoId: number, totalPaid: number): Promise<Balance> {
  return currentPayOutForVideo(videoId)
    .then(sumPayOutAttr => {
      let amountOwed = 0;
      if (sumPayOutAttr) {
        const sumPayOut = sumPayOutAttr.get();
        const currentTotal = sumPayOut.total;
        amountOwed = totalPaid - currentTotal;
      } else {
        amountOwed = totalPaid;
      }
      if (amountOwed > 0) {
        return {
          videoId: videoId,
          balance: amountOwed
        } as Balance;
      }
      else {
        return {
          videoId: videoId,
          balance: 0
        } as Balance;
      }
    });
}

function getBalanceOfPayments(): Promise<Balance[]> {
  return getTotalPayToAllVideos()
  .then(sumPayIns => {
    return Promise.reduce(sumPayIns, (balances: Balance[], sumPayInAttr: PayIn) => {
      const sumPayIn = sumPayInAttr.get();
      const videoId = sumPayIn.videoId;
      const total = sumPayIn.total;
      return getBalanceForVideo(videoId, total)
      .then(balance => {
        balances.push(balance)
        return balances;
      });
    }, []);
  })
}

function generateTippinPaymentRequest(videoId): Promise<Invoice> {
  return models.videos.findById(videoId)
  .then(video => getTippinUserDetails(video.get().user))
  .then(userDetails => {
    if (userDetails.userid !== null) {
      return createInvoice(userDetails)
    }
    return null;
  });
}

function resolveBalanceForVideo(videoId: number, amountDue: number): Promise<PayOut> {
  return generateTippinPaymentRequest(videoId)
    .then(invoice => {
      if (invoice) {
        return withdrawFunds(amountDue, invoice.message)
          .then(() => isInvoiceSettled(invoice))
          .then(settled => {
            if (settled) {
              const payOut: PayOutAttrs = {
                videoId: videoId,
                payreq: invoice.message,
                paid: true,
                amountSatoshi: amountDue
              };
              return models.payOuts.create(payOut)
            }
            else {
              return null;
            }
          });
      }
      else {
        return null;
      }
    })
}

function resolveAllPayments(): Promise<PayOut[]> {
  return getBalanceOfPayments()
  .then(balances => {
    return Promise.map(balances, balance => {
      const videoId = balance.videoId;
      const amountDue = balance.balance;
      return resolveBalanceForVideo(videoId, amountDue);
    });
  })
}

function run() {
  resolveAllPayments()
  .then(payOuts => {
    payOuts.forEach(payOut => {
      if (payOut !== null) {
        const videoId = payOut.get().videoId;
        const amount = payOut.get().amountSatoshi;
        console.log("Resolved: video " + videoId + " for " + amount + " Satoshis");
      }
    });
    setTimeout(run, JOB_FREQUENCY);
  })
  .catch(e => {
    console.error(e);
    setTimeout(run, JOB_FREQUENCY);
  });
}

console.log("Initiating payouts...")
setTimeout(run, JOB_FREQUENCY);