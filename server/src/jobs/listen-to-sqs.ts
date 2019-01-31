// DEPRECATED

/*

import * as path from 'path';
require('dotenv').config({ path: path.resolve(process.cwd(), '.env') })

import * as Promise from 'bluebird';
import * as AWS from 'aws-sdk';
import { instantiateModels, VideoMetadata } from '../model';
import * as sequelize from 'sequelize';
import { ingestUpdate, completeUpdate } from './update-status';

const JOB_FREQUENCY = 1000 * 10; // every 10 seconds

const sequelizeInstance = new sequelize(
  process.env.DATABASE_NAME,process.env.DATABASE_USER, process.env.DATABASE_PASSWORD,
  {
    host: 'localhost',
    dialect: 'postgres',
  }
);

const models = instantiateModels(sequelizeInstance);

interface IngestMessage {
  status: "Ingest",
  guid: string,
  srcVideo: string
}

interface CompleteMessage {
  workflowStatus: "Complete",
  destBucket: string,
  ecodeJobId: string,
  frameCapture: boolean,
  workflowName: string,
  workflowTrigger: string,
  encodingProfile: number,
  cloudFront: string,
  archiveSource: boolean,
  startTime: string,
  jobTemplate: string,
  srcVideo: string,
  srcBucket: string,
  srcHeight: number,
  srcWidth: number,
  EndTime: string,
  mp4Outputs: string[],
  mp4Urls: string[],
  hlsPlaylist: string,
  hlsUrl: string,
  dashPlaylist: string,
  dashUrl: string,
  guid: string,
  thumbNail: string[],
  thumbNailUrl: string[]
}

interface SNSNotification {
  Type: "Notification",
  MessageId: string,
  TopicArn: string,
  Subject: string,
  Message: IngestMessage | CompleteMessage | any,
  Timestamp: string,
  SignatureVersion: string,
  Signature: string,
  SigningCertURL: string,
  UnsubscribeURL: string,
}

class VideoNotFound extends Error {
  constructor(filename) {
    const message = "Filename: " + filename + " not found!"
    super(message);
  }
}

const TRANSCODER_MESSAGE_QUEUE = process.env.AWS_TRANSCODER_SQS;

AWS.config.update({ region: process.env.AWS_REGION });
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const sqs = new AWS.SQS({apiVersion: '2012-11-05'});

function receiveMessage(): Promise<AWS.SQS.Message> {
  return new Promise((resolve, reject) => {
    const receiveParams: AWS.SQS.ReceiveMessageRequest = {
      QueueUrl: TRANSCODER_MESSAGE_QUEUE,
      AttributeNames: [ "ALL" ],
      MaxNumberOfMessages: 1,
      VisibilityTimeout: 20,
      WaitTimeSeconds: 0
    };
    sqs.receiveMessage(receiveParams, 
      (err, data: AWS.SQS.ReceiveMessageResult) => {
        if (err) {
          reject(err);
        }
        else {
          if (data.Messages) {
            resolve(data.Messages[0])
          } else {
            resolve();
          }
        }
      });
  });
}

function parseMessage(msg: AWS.SQS.Message): any {
  try {
    return JSON.parse(msg.Body);
  } catch(e) {
    return { Message: { status: "Failed" } };
  }
}

function parseNotification(notification: SNSNotification): any {
  try {
    return JSON.parse(notification.Message);
  } catch(e) {
    return { status: "Failed" };
  }
}

function deleteMessage(receipt: string): Promise<{}> {
  return new Promise((resolve, reject) => {
    const deleteParams: AWS.SQS.DeleteMessageRequest = {
      QueueUrl: TRANSCODER_MESSAGE_QUEUE,
      ReceiptHandle: receipt
    };
    sqs.deleteMessage(deleteParams, 
      function(err, data) {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      }
    );
  });
}

function handleMessage(msg: AWS.SQS.Message): Promise<boolean> {
  const notification = parseMessage(msg) as SNSNotification;
  const body = parseNotification(notification);
  if (body.status &&
    body.status === "Ingest") {
      const ingest = body as IngestMessage;
      const fileName = ingest.srcVideo;
      const guid = ingest.guid
      return ingestUpdate(fileName, guid, models)
  }
  else if (body.workflowStatus
    && body.workflowStatus === "Complete") {
      const complete = body as CompleteMessage;
      const guid = complete.guid;
      const cloudFront = complete.dashUrl;
      const thumbNailUrl = complete.thumbNailUrl[0];
      return completeUpdate(guid, cloudFront, thumbNailUrl, models);
  }
  else if (body.status && body.status === "Failed") {
    return Promise.resolve(false); // hack to not crash the server
  }
  else {
    return Promise.reject(new Error("Unknown message"));
  }
}


function run() {
  receiveMessage()
  .then((msg: AWS.SQS.Message) => {
    if (msg) {
      const receipt: string = msg.ReceiptHandle;
      handleMessage(msg)
      .then(found => {
        if (found) {
          console.log("Successfully updated");
        } else {
          console.log("Item not found");
        }
        deleteMessage(receipt)
        .then(() => setTimeout(run, JOB_FREQUENCY))
        .catch(err => console.error(err));
      })
      .catch(err => console.error(err));
    } else {
      console.log("No new message");
      setTimeout(run, JOB_FREQUENCY);
    }
  })
  .catch((err) => console.error(err))
}

setTimeout(run, JOB_FREQUENCY);

*/