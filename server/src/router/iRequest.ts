import * as express from "express";

import { Models } from "../model";

export interface ServerRequest extends express.Request {
  models?: Models
}

export interface UploadRequestBody {
  title: string,
  description: string,
  user: string,
  unlock_code: string
}

export interface UploadRequest extends ServerRequest {
  body: UploadRequestBody
}

export interface CommentPostRequest extends ServerRequest {
  body: {
      comment: string,
      user: string
  }
}

export interface UnlockCodeRequest extends ServerRequest {
  body: {
    code: string
  }
}