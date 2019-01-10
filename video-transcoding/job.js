const { createTranscodingJob } = require('./createTranscodingJob');

// Job
// poll S3 to see if anything exists
// yes: run transcoding job && delete videos from S3
// no: do nothing


createTranscodingJob()
.then(job => console.log(job))
.catch(err => console.error(err));