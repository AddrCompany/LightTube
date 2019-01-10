// Load the SDK for JavaScript
const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
AWS.config.mediaconvert = {endpoint : 'https://fptwn68eb.mediaconvert.us-east-1.amazonaws.com'};

var TranscodingJobTemplate = require('./TranscodingJob');
var TranscodingJobInputTemplate = require('./TranscodingJobInput')

const INPUT_BUCKET_NAME = "lighttube.inputs";
const INPUT_BUCKET_URN = "s3://lighttube.inputs/";

function retrieveInputFiles() {
    return new Promise((resolve, reject) => {
        const s3 = new AWS.S3();
        const inputBucketParams = {
            Bucket: INPUT_BUCKET_NAME, 
            MaxKeys: 20
        };
        s3.listObjectsV2(inputBucketParams, function(err, data) {
            if (err) {
                
                reject(err);
            } else {
                const allKeys = data.Contents.map((content) => content.Key);
                resolve(allKeys);
            }
        });
    });
}

function fileNamesToJobInputs(filenames) {
    return filenames.map(filename => {
        TranscodingJobInputTemplate.FileInput = INPUT_BUCKET_URN + filename
        return TranscodingJobInputTemplate;
    });
}

function inputsToTranscodingJob(inputs) {
    TranscodingJobTemplate.Settings.Inputs = inputs;
    return TranscodingJobTemplate;
}

function constructTranscodingJob() {
    return retrieveInputFiles().then(files => inputsToTranscodingJob(fileNamesToJobInputs(files)));
}

function createTranscodingJob() {
    return constructTranscodingJob().then(jobParams => {
        return new AWS.MediaConvert({apiVersion: '2017-08-29'}).createJob(jobParams).promise();
    });
}

module.exports = {
    createTranscodingJob: createTranscodingJob
};