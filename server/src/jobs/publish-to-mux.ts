import * as path from 'path';
require('dotenv').config({ path: path.resolve(process.cwd(), '.env') })

import fetch, { Headers } from 'node-fetch'
import * as base64 from 'base-64';
import * as Promise from 'bluebird';
import { instantiateModels, VideoMetadata } from '../model';
import * as sequelize from 'sequelize';

const JOB_FREQUENCY = 1000 * 10; // every 10 seconds

const sequelizeInstance = new sequelize(
  process.env.DATABASE_NAME,process.env.DATABASE_USER, process.env.DATABASE_PASSWORD,
  {
    host: process.env.DATABASE_HOST,
    dialect: 'postgres',
    logging: false
  }
);

const models = instantiateModels(sequelizeInstance);

const muxAccessId: string = process.env.MUX_ACCESS_ID;
const muxSecretKey: string = process.env.MUX_SECRET_KEY;

const muxPostAssetEndpoint: string = "https://api.mux.com/video/v1/assets";

interface MuxPlaybackIdResponse {
  id: string,
  policy: string
}

interface MuxCreateAssetResponse {
  data: {
    id : string,
    created_at: number,
    playback_ids: MuxPlaybackIdResponse[],
    status: string
  }
}

function getAllVideosS3NotMux(): Promise<VideoMetadata[]> {
  return models.videosMetadata.findAll({
    where: {
      latestStatus: "s3"
    },
    include: [
      {
        model: models.videos,
        as: "video"
      }
    ]
  });
}

function postAssetToMux(videoUrl: string): Promise<MuxCreateAssetResponse> {
  const body: any = {
    input: videoUrl,
    playback_policy: "public"
  };

  let headers = new Headers();
  headers.append('Authorization', 'Basic ' + base64.encode(muxAccessId + ":" + muxSecretKey));
  headers.append('Content-Type', 'application/json');
  
  return Promise.resolve(fetch(muxPostAssetEndpoint, {
    method: 'post',
    body:    JSON.stringify(body),
    headers: headers,
  })
  .then(res => res.json()));
}

function updateMetadata(metadata: VideoMetadata, muxResponse: MuxCreateAssetResponse): Promise<VideoMetadata> {
  const playback_ids = muxResponse.data.playback_ids;
  const assetId = muxResponse.data.id;
  return metadata.set("muxPlaybackId", playback_ids[0].id)
    .set("muxAssetId", assetId)
    .set("latestStatus", "muxIngest")
    .save();
}

function publishAll(): Promise<VideoMetadata[]> {
  return Promise.map(getAllVideosS3NotMux(), metadata => 
    postAssetToMux(metadata.get().sourceVideoUrl)
    .then(response => updateMetadata(metadata, response))
  );
}

function run() {
  publishAll()
  .then(updatedMetadatas => {
    updatedMetadatas.forEach(updatedMetadata => {
      const videoId = updatedMetadata.get().videoId;
      const videoTitle = updatedMetadata.get().video.title;
      console.log("Updated: video " + videoId + " (" + videoTitle + ")");
    });
    setTimeout(run, JOB_FREQUENCY);
  })
  .catch(e => {
    console.error(e);
    setTimeout(run, JOB_FREQUENCY);
  });
}

console.log("Initiating upload to MUX...")
setTimeout(run, JOB_FREQUENCY);