import * as Promise from "bluebird";
import * as uuidv4 from 'uuid/v4';
import { UploadedFile } from "express-fileupload";

import { ServingVideos, ServingVideoThumbnail, ServingVideo, ServingComment } from "./iServing";

import { VideoAttrs, Video, VideoMetadataAttrs, CommentAttrs, Models, PayInAttrs, PayIn } from "../model";
import { UploadRequestBody } from "./iRequest";
import { OpenNodeInvoice } from "./payments";
import fetch from "node-fetch";

export function storeVideoFileLocally(videoFile: UploadedFile, uploadRequest: UploadRequestBody, models: Models): Promise<number> {
  return new Promise((resolve, reject) => {
    const videoFileName: string = uuidv4();
    const videoFileExtension = videoFile.name.split('.').pop().toLowerCase();
    const fullVideoFileName: string = videoFileName + '.' + videoFileExtension;
    videoFile.mv(
      `${process.cwd()}/uploads/${fullVideoFileName}`,
      function (err) {
        if (err) {
          return reject(err)
        }
        const videoParams: VideoAttrs = {
          title: uploadRequest.title,
          description: uploadRequest.description,
          user: (uploadRequest.user === "") ? "Anonymous" : uploadRequest.user,
          unlockCode: uploadRequest.unlock_code
        };
        persistNewVideo(videoParams, models, fullVideoFileName)
        .then(video => resolve(video.get().id));
      },
    );
  });
}

export function persistNewVideo(
  videoParams: VideoAttrs, models: Models, fileName: string
): Promise<Video> {
  return models.videos.create(videoParams)
  .then(video => {
      const metadata: VideoMetadataAttrs = {
          videoId: video.get().id,
          localFileName: fileName,
          latestStatus: "local"
      }
      return models.videosMetadata.create(metadata)
      .then(() => video);
  })   
}

export function findAllReadyVideos(models: Models): Promise<Video[]> {
  return models.videos.findAll({
      include: [
          {
              model: models.videosMetadata,
              as: "videoMetadata",
              where: {
                latestStatus: "ready"
              },
              required: true
          },
          {
              model: models.comments,
              as: "comments"
          },
          {
            model: models.payIns,
            where: {
              paid: true
            },
            as: "payIns",
            required: false
          }
      ]
  });
}

export function findVideo(primaryKey: number, models: Models): Promise<Video> {
  return models.videos.findByPk(primaryKey, {
    include: [
      {
        model: models.videosMetadata,
        as: "videoMetadata"
      },
      {
        model: models.comments,
        as: "comments"
      },
      {
        model: models.payIns,
        where: {
          paid: true
        },
        as: "payIns",
        required: false,
      }
    ]
  });
}

export function toServingVideos(allVideos: VideoAttrs[], BTCToUSD: number): ServingVideos {
  return {
      videos: allVideos.map(video => toServingVideoThumbnail(video, BTCToUSD))
  };
}

export function exchangeRateBTC(): Promise<number> {
  return Promise.resolve(fetch("https://blockchain.info/ticker")
  .then(res => res.json())
  .then(json => json.USD.last));
}

export function toServingVideoThumbnail(video: VideoAttrs, BTCToUSD: number): ServingVideoThumbnail {
  const totalAmountSatoshi = video.payIns.reduce((acc, current) => (acc + current.amountSatoshi), 0);
  const valueBTC = totalAmountSatoshi/100000000;
  const valueUSD = valueBTC * BTCToUSD;
  return {
      video_id: video.id,
      title: video.title,
      user: video.user,
      views: video.views,
      thumbnail_url: video.videoMetadata.thumbnailUrl,
      gif_url: video.videoMetadata.gifUrl,
      created_at: video.createdAt,
      amount: valueUSD,
  }
}

export function toServingVideo(video: VideoAttrs, BTCToUSD: number): ServingVideo {
  const totalAmountSatoshi = video.payIns.reduce((acc, current) => (acc + current.amountSatoshi), 0);
  const valueBTC = totalAmountSatoshi/100000000;
  const valueUSD = valueBTC * BTCToUSD;
  return {
      video_id: video.id,
      title: video.title,
      description: video.description,
      user: video.user,
      views: video.views,
      price_usd: video.priceUSD,
      thumbnail_url: video.videoMetadata.thumbnailUrl,
      amount: valueUSD,
      comments: video.comments.map(comment => toServingComment(comment)),
      created_at: video.createdAt,
  }
}

export function toServingComment(comment: CommentAttrs): ServingComment {
  return {
      content: comment.comment,
      user: comment.user,
      created_at: comment.createdAt
  }
}

export function verifyCorrectUnlockCode(videoId: number, code: string, models: Models): Promise<boolean> {
  return models.videos.findById(videoId)
  .then(video => (!video.get().unlockCode || video.get().unlockCode === code))
}

export function persistInvoice(videoId: number, invoice: OpenNodeInvoice, models: Models): Promise<PayIn> {
  const values: PayInAttrs = {
    chargeId: invoice.data.id,
    videoId: videoId,
    amountSatoshi: invoice.data.amount,
    payreq: invoice.data.lightning_invoice.payreq,
    paid: false,
  }
  return models.payIns.create(values);
}