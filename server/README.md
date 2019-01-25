# LightTube server

## Setup

The server relies on a `postgres` database for storing changes. Please ensure that you have postgres service installed and running on your machine before proceeding forward. I personally use `pgAdmin` for interfacing with the database,  but that's optional.

You also have to sure that the transcoding service is up and running. Follow the README there to set it up.

Once, you have the pre-requisites setup. Go ahead and fill variables in `.env` file in the server root folder with the following parameters.

```
PORT=
DATABASE_NAME=
DATABASE_USER=
DATABASE_PASSWORD=
AWS_REGION=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_TRANSCODER_SOURCE_BUCKET=
AWS_TRANSCODER_TARGET_BUCKET=
AWS_TRANSCODER_SQS=
AWS_DDB_TABLE_NAME=
```

There is currently no CI/CD in place. But that might change soon.

## Start

You need three processes to be running for the server to be properly functioning.

`npm run start`: Starts the server
`npm run upload`: Ensures that the files uploaded to the server are transferred to the transcoding service
`npm run transcode`: Polls the transcoding service to get any new notifications.