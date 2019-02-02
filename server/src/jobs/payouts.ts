import * as path from 'path';
require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });

import fetch, { Headers } from 'node-fetch'
import * as base64 from 'base-64';
import * as Promise from 'bluebird';
import { instantiateModels, VideoMetadata } from '../model';
import * as sequelize from 'sequelize';

const JOB_FREQUENCY = 1000 * 30; // every 30 seconds

const sequelizeInstance = new sequelize(
  process.env.DATABASE_NAME,process.env.DATABASE_USER, process.env.DATABASE_PASSWORD,
  {
    host: 'localhost',
    dialect: 'postgres',
  }
);

const models = instantiateModels(sequelizeInstance);

function getPayInToVideos() {
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

getPayInToVideos()
.then(x => console.log(x))

// first generate invoice for tippin.me

/*
getTippinUserDetails(username)
.then(userDetails => createInvoice(userDetails))
*/

// withdraw x amount to tippin.me

// paid => update database