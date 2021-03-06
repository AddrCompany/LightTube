import * as express from "express";

export interface ServerResponse extends express.Response {}

export interface ServingComment {
  content: string,
  user: string,
  created_at: Date
}

export interface ServingVideo {
  video_id: number,
  title: string,
  description: string,
  user: string,
  views: number,
  price_usd: number,
  thumbnail_url: string,
  comments: ServingComment[],
  created_at: Date,
  amount: number,
}

export interface ServingVideoThumbnail {
  video_id: number,
  title: string,
  user: string,
  views: number,
  thumbnail_url: string,
  gif_url: string,
  created_at: Date,
  amount: number,
}

export interface ServingVideos {
  videos: ServingVideoThumbnail[]
}
