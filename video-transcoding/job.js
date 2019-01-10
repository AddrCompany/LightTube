const poller = require('./transcoding-job/poller');

poller()
.then(job => console.log(job))
.catch(err => console.error(err));