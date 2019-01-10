const { createTranscodingJob } = require('./createTranscodingJob');

createTranscodingJob()
.then(job => console.log(job))
.catch(err => console.error(err));