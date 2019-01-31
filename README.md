# LightTube

Platform for supporting micropayments for media content.

Main components of LightTube

### Transcoding

Relies on MUX

### Payments

Relies on OpenNode for charging customers and Tippin for creators

### LightTube Server

LightTube server is an ExpressJS application with postgres database. It is composed to an HTTP interface to interact with the client - providing content and it interfaces with OpenNode, Tippin.me and MUX in the form of forever running jobs or server invoking logic.

### LightTube Client

Currently, LightTube only supports the web client. The client is built in ReactJS and queries the server for fetching all videos alongwith their comments and upload videos to the server as well. The design is supposed to be simplistic to appeal to most audience.
