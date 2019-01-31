import * as Promise from "bluebird";
import * as uuidv4 from 'uuid/v4';
import { UploadedFile } from "express-fileupload";

import { ServingVideos, ServingVideoThumbnail, ServingVideo, ServingComment } from "./iServing";

import { VideoAttrs, Video, VideoMetadataAttrs, CommentAttrs, Models } from "../model";
import { UploadRequestBody } from "./iRequest";

export function storeVideoFileLocally(videoFile: UploadedFile, uploadRequest: UploadRequestBody, models: Models): Promise<number> {
  return new Promise((resolve, reject) => {
    const videoFileName: string = uuidv4();
    const videoFileExtension = videoFile.name.split('.').pop();
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
          user: uploadRequest.user
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
          }
      ]
  });
}

export function toServingVideos(allVideos: VideoAttrs[]): ServingVideos {
  return {
      videos: allVideos.map(video => toServingVideoThumbnail(video))
  };
}

export function toServingVideoThumbnail(video: VideoAttrs): ServingVideoThumbnail {
  return {
      video_id: video.id,
      title: video.title,
      user: video.user,
      views: video.views,
      thumbnail_url: video.videoMetadata.thumbnailUrl,
      gif_url: video.videoMetadata.gifUrl,
      created_at: video.createdAt
  }
}

export function toServingVideo(video: VideoAttrs): ServingVideo {
  return {
      video_id: video.id,
      title: video.title,
      description: video.description,
      user: video.user,
      views: video.views,
      payment_request: "", // coming from opennode
      price_usd: video.priceUSD,
      thumbnail_url: video.videoMetadata.thumbnailUrl,
      comments: video.comments.map(comment => toServingComment(comment)),
      created_at: video.createdAt,
      video_url: video.videoMetadata.hlsUrl // temporary
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
  .then(video => video.get().unlockCode === code)
}