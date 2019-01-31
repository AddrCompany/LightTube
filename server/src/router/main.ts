import * as express from "express";
import { UploadedFile } from "express-fileupload";

import { ServerResponse } from './iServing';
import { ServerRequest, CommentPostRequest, UploadRequest, UnlockCodeRequest } from "./iRequest";
import { findAllReadyVideos, toServingVideos, findVideo, toServingVideo, toServingComment, persistNewVideo, storeVideoFileLocally, verifyCorrectUnlockCode } from "./helpers";

import { CommentAttrs, instantiateModels } from "../model";

const SUPPORTED_EXTENSIONS = ["mp4", "mpg", "m4v", "m2ts", "mov"];

const router = express.Router();

router.get('/', function(req: ServerRequest, res: ServerResponse) {
    res.send("Welcome to LightTube control center");
});

router.get('/videos', function(req: ServerRequest, res: ServerResponse) {
    findAllReadyVideos(req.models)
    .then(videos => videos.map(video => video.get()))
    .then(videosAttrs => toServingVideos(videosAttrs))
    .then(servableVideos => res.json(servableVideos))
    .catch(err => res.status(500).send(err))
});

router.get('/video/:id', function(req: ServerRequest, res: ServerResponse) {
    const videoId = parseInt(req.params.id);
    findVideo(videoId, req.models)
    .then(video => toServingVideo(video.get()))
    .then(servableVideo => res.json(servableVideo))
    .catch(err => res.status(500).send(err))
});

router.get('/video/:id/verify', function(req: UnlockCodeRequest, res: ServerResponse) {
    const videoId = parseInt(req.params.id);
    verifyCorrectUnlockCode(videoId, req.body.code, req.models)
    .then(correct => {
        if (correct) {
            findVideo(videoId, req.models)
            .then(video => res.json({url: video.get().videoMetadata.hlsUrl}))
        } else {
            res.status(403).json({error: "Wrong code entered"})
        }
    })
});

router.post('/video/:id/comment', function(req: CommentPostRequest, res: ServerResponse) {
    const videoId = parseInt(req.params.id);
    const content = req.body.comment;
    const user = req.body.user;
    const commentParams: CommentAttrs = {
        videoId: videoId,
        comment: content,
        user: user
    };
    req.models.comments.create(commentParams)
    .then(comment => toServingComment(comment.get()))
    .then(servableComment => res.json(servableComment))
    .catch(err => res.status(500).send(err))
});

router.post('/upload', function(req: UploadRequest, res: ServerResponse) {
    const videoFile: UploadedFile = req.files.file as UploadedFile;
    const videoFileExtension = videoFile.name.split('.').pop();
    if (SUPPORTED_EXTENSIONS.indexOf(videoFileExtension) === -1) {
        res.status(500).send({error: "Unsupported extension"});
    }
    storeVideoFileLocally(videoFile, req.body, req.models)
    .then(videoId => res.status(200).json(videoId))
    .catch(e => res.status(500).send({error: "Unable to save file on server"}));
});

/* NOT ACTIVATED AT THE MOMENT

router.post('/video/:id/like', function(req: ServerRequest, res: ServerResponse) {
    const videoId = parseInt(req.params.id);
    findVideo(videoId, req.models)
    .then(video => video.increment("likes"))
    .then(updatedVideo => updatedVideo.get())
    .then(videoAttrs => toServingVideo(videoAttrs))
    .then(servableVideo => res.json(servableVideo))
    .catch(err => res.status(500).send(err))
});

router.post('/video/:id/dislike', function(req: ServerRequest, res: ServerResponse) {
    const videoId = parseInt(req.params.id);
    findVideo(videoId, req.models)
    .then(video => video.increment("dislikes"))
    .then(updatedVideo => updatedVideo.get())
    .then(videoAttrs => toServingVideo(videoAttrs))
    .then(servableVideo => res.json(servableVideo))
    .catch(err => res.status(500).send(err))
});

*/

export const mainRouter = router;