# LightTube

Platform for supporting micropayments for media content.

Main components of LightTube

### Transcoding

Relies on MUX

### Payments

Relies on OpenNode for charging customers and Tippin for creators

### LightTube Server

LightTube server is an ExpressJS application that queries the transcoding service and provides an API to interface with the client. As mentioned earlier, it does that by constantly polling SQS for new notifications. There are also two jobs that runs alongwith ExpressJS: the job for listening to SQS and the job to upload fresh video to S3 (where it would be picked up by the transcoding service). Please refer to the server README, to learn more about the architecture and how to set it up.

### LightTube Client

Currently, LightTube only supports the web client. The client is built in ReactJS and queries the server for fetching all videos alongwith their comments and upload videos to the server as well. The design is supposed to be simplistic to appeal to most audience.
