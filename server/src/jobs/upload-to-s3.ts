import * as path from 'path';
require('dotenv').config({ path: path.resolve(process.cwd(), '.env') })

import * as Promise from 'bluebird';
import * as AWS from 'aws-sdk';
import { readFile, readdir, unlink } from 'fs';
import { instantiateModels, VideoMetadata } from '../model';
import * as sequelize from 'sequelize';

const JOB_FREQUENCY = 1000 * 10; // every 10 seconds

const sequelizeInstance = new sequelize(
  process.env.DATABASE_NAME,process.env.DATABASE_USER, process.env.DATABASE_PASSWORD,
  {
    host: process.env.DATABASE_HOST,
    dialect: 'postgres',
    logging: false
  }
);

const models = instantiateModels(sequelizeInstance);

AWS.config.update({ region: process.env.AWS_REGION });
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const SUPPORTED_EXTENSIONS = ["mp4", "mpg", "m4v", "m2ts", "mov"];

const UPLOAD_PATH: string = process.cwd() + "/uploads";
const SOURCE_BUCKET_NAME = process.env.AWS_TRANSCODER_SOURCE_BUCKET;

function getAllFileNames(): Promise<string[]> {
  return new Promise((resolve, reject) => {
    readdir(UPLOAD_PATH, (err, fileNames) => {
      if (err) {
        reject(err);
      }
      const videoFileNames = fileNames.filter(file => {
        const extension = file.split('.').pop();
        return (SUPPORTED_EXTENSIONS.indexOf(extension) !== -1)
      });
      if (videoFileNames.length >= 0) console.log("Files found: ", videoFileNames);
      resolve(videoFileNames);
    });
  });
}

function readVideo(fileName: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    readFile(fileName, { encoding: 'base64' }, (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(Buffer.from(data, 'base64'));
    });
  });
}

function uploadToBucket(key: string, data: Buffer): Promise<AWS.S3.ManagedUpload.SendData> {
  const s3 = new AWS.S3();
  const uploadParams: AWS.S3.PutObjectRequest = {
    Bucket: SOURCE_BUCKET_NAME,
    Key: key,
    Body: data,
    ACL: 'public-read',
    ContentEncoding: 'base64'
  };
  return Promise.resolve(s3.upload(uploadParams).promise());
}

function storeS3Source(fileName: string, data: AWS.S3.ManagedUpload.SendData): Promise<VideoMetadata> {
  return models.videosMetadata.findOne({
    where: {
      localFileName: fileName
    }
  })
  .then(metadata => {
    return metadata.set("sourceVideoUrl", data.Location)
      .set("latestStatus", "s3")
      .save()
  });
}

function deleteFile(fileName: string): Promise<void> {
  return new Promise((resolve, reject) => {
    unlink(UPLOAD_PATH + "/" + fileName, (err) => {
      if (err) {
        reject(err);
      }
      resolve();
    })
  });
}

export function uploadAllFilesAndCleanUp(): Promise<void[]> {
  return Promise.map(getAllFileNames(), fileName => 
    readVideo(UPLOAD_PATH + "/" + fileName)
    .then(data => uploadToBucket(fileName, data))
    .then(sendData => storeS3Source(fileName, sendData))
    .then(() => deleteFile(fileName))
  );
}

function run() {
  uploadAllFilesAndCleanUp()
  .then(() => {
    setTimeout(run, JOB_FREQUENCY);
  })
  .catch(e => {
    console.error(e);
    setTimeout(run, JOB_FREQUENCY);
  });
}

console.log("Initiating upload to S3...")
setTimeout(run, JOB_FREQUENCY);