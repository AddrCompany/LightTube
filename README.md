# LightTube

Platform for supporting micropayments for media content.

There are three components of LightTube

### Video-transcoding

This component containts scripts that take care of the transcoding infrastructure on AWS. It runs independently of the server and the server has to communicate with the transcoding service itself. Currently, the way to do that is via SQS. Transcoding-service publishes updates via SNS and those are picked up by the SQS services. Message in the queue are then polled by the backend server to know the state of the service and update its values correspondingly. Transcoding service also stores its state in DynamoDB, which can be queried by the server. Refer to the transcoding README, for more details.


### LightTube Server

LightTube server is an ExpressJS application that queries the transcoding service and provides an API to interface with the client. As mentioned earlier, it does that by constantly polling SQS for new notifications. There are also two jobs that runs alongwith ExpressJS: the job for listening to SQS and the job to upload fresh video to S3 (where it would be picked up by the transcoding service). Please refer to the server README, to learn more about the architecture and how to set it up.

### LightTube Client

Currently, LightTube only supports the web client. The client is built in ReactJS and queries the server for fetching all videos alongwith their comments and upload videos to the server as well. The design is supposed to be simplistic to appeal to most audience.