import * as path from 'path';
require('dotenv').config({ path: path.resolve(process.cwd(), '.env') })

import * as Promise from 'bluebird';
import * as AWS from 'aws-sdk';
import { readFile, readdir, unlink } from 'fs';
import { instantiateModels } from '../model';
import * as sequelize from 'sequelize';

const JOB_FREQUENCY = 1000 * 10; // every 10 seconds

const sequelizeInstance = new sequelize(
  process.env.DATABASE_NAME,process.env.DATABASE_USER, process.env.DATABASE_PASSWORD,
  {
    host: 'localhost',
    dialect: 'postgres',
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
      console.log("Files found: ", videoFileNames);
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

function uploadToBucket(fileName, data): Promise<AWS.S3.ManagedUpload.SendData> {
  const s3 = new AWS.S3();
  const uploadParams: AWS.S3.PutObjectRequest = {
    Bucket: SOURCE_BUCKET_NAME,
    Key: fileName,
    Body: data,
    ACL: 'private',
    ContentEncoding: 'base64'
  };
  return new Promise((resolve, reject) => {
    s3.upload(uploadParams, function (err, data) {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
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
    .then(() =>
      models.videosMetadata.findOne({
        where: {
          local_file_name: fileName
        }
      })
    )
    .then(() => deleteFile(fileName))
  );
}

function run() {
  console.log("Initiating upload...")
  uploadAllFilesAndCleanUp()
  .then(() => {
    console.log("Upload complete");
    setTimeout(run, JOB_FREQUENCY);
  });
}

setTimeout(run, JOB_FREQUENCY);