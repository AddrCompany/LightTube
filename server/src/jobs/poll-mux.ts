import * as path from 'path';
require('dotenv').config({ path: path.resolve(process.cwd(), '.env') })

import fetch, { Headers } from 'node-fetch'
import * as base64 from 'base-64';
import * as Promise from 'bluebird';
import { instantiateModels, VideoMetadata } from '../model';
import * as sequelize from 'sequelize';

const JOB_FREQUENCY = 1000 * 30; // every 30 seconds

const sequelizeInstance = new sequelize(
  process.env.DATABASE_NAME,process.env.DATABASE_USER, process.env.DATABASE_PASSWORD,
  {
    host: 'localhost',
    dialect: 'postgres',
  }
);

const models = instantiateModels(sequelizeInstance);

const muxAccessId: string = process.env.MUX_ACCESS_ID;
const muxSecretKey: string = process.env.MUX_SECRET_KEY;

const muxGetAssetEndpoint: string = "https://api.mux.com/video/v1/assets/";
const muxGetThumbnailEndpoint: string = "https://image.mux.com/"
const muxGetStreamEndpoint: string = "https://stream.mux.com/"

interface MuxPlaybackIdResponse {
  id: string,
  policy: string
}

interface MuxGetAssetResponse {
  data: {
    id: string,
    tracks: any, // ignore for now
    status: string,
    playback_ids: MuxPlaybackIdResponse[],
    mp4_support: string,
    max_stored_resolution: string,
    max_stored_frame_rate: number,
    master_access: string,
    duration: number,
    created_at: string,
    aspect_ratio: string
  }
}

function getAllAssetsInQueue(): Promise<VideoMetadata[]> {
  return models.videosMetadata.findAll({
    where: {
      latestStatus: "muxIngest"
    }
  })
}

function getAssetFromMux(assetId: string): Promise<MuxGetAssetResponse> {
  const endpoint = muxGetAssetEndpoint + assetId;
  let headers = new Headers();
  headers.append('Authorization', 'Basic ' + base64.encode(muxAccessId + ":" + muxSecretKey));
  headers.append('Content-Type', 'application/json');
  
  return Promise.resolve(fetch(endpoint, {
    method: 'get',
    headers: headers,
  })
  .then(res => res.json()));
}

function updateIfReady(metadata: VideoMetadata, response: MuxGetAssetResponse) {
  if (response.data.status === 'ready') {
    return metadata.set("latestStatus", "ready")
      .set("thumbnailUrl", muxGetThumbnailEndpoint + metadata.get().muxPlaybackId + "/thumbnail.jpg")
      .set("gifUrl", muxGetThumbnailEndpoint + metadata.get().muxPlaybackId + "/animated.gif")
      .set("hlsUrl", muxGetStreamEndpoint + metadata.get().muxPlaybackId + ".m3u8")
      .set("duration", response.data.duration)
      .save();
  }
  return metadata;
}

function checkAllAssets(): Promise<VideoMetadata[]> {
  return Promise.map(getAllAssetsInQueue(), metadata => 
    getAssetFromMux(metadata.get().muxAssetId)
    .then(response => updateIfReady(metadata, response))
  );
}

function run() {
  checkAllAssets()
  .then(updatedMetadatas => {
    updatedMetadatas.forEach(updatedMetadata => {
      const videoId = updatedMetadata.get().videoId;
      const videoTitle = updatedMetadata.get().video.title;
      console.log("Ready: video " + videoId + " (" + videoTitle + ")");
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