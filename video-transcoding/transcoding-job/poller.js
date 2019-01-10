const { createTranscodingJob } = require('./createTranscodingJob');

// Job
// poll S3 to see if anything exists
// yes: run transcoding job && delete videos from S3
// no: do nothing

function poll() {
    // For all videos in "lighttube.inputs" bucket, it transcodes and 
    // moves them to "lighttube.outputs" bucket
    return createTranscodingJob()
}

module.exports = poll;
