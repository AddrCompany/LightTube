import * as express from "express";
import { UploadedFile } from "express-fileupload";

import { ServerResponse } from './iServing';
import { ServerRequest, CommentPostRequest, UploadRequest, UnlockCodeRequest } from "./iRequest";
import { findAllReadyVideos, toServingVideos, findVideo, toServingVideo, toServingComment, persistNewVideo, storeVideoFileLocally, verifyCorrectUnlockCode, persistInvoice } from "./helpers";

import { CommentAttrs } from "../model";
import { generateInvoiceUSD, findCharge, isChargePaid, setChargePaid } from "./payments";

const SUPPORTED_EXTENSIONS = ["mp4", "mpg", "m4v", "m2ts", "mov"];

export const setupMainRouter: () => express.Router = function() {
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
    
    router.post('/video/:id/verify', function(req: UnlockCodeRequest, res: ServerResponse) {
        const videoId = parseInt(req.params.id);
        verifyCorrectUnlockCode(videoId, req.body.code, req.models)
        .then(correct => {
            if (correct) {
                findVideo(videoId, req.models)
                .then(video => video.increment("views"))
                .then(updatedVideo => res.json({url: updatedVideo.get().videoMetadata.hlsUrl}))
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

    router.get('/video/:id/geninvoice', function(req: ServerRequest, res: ServerResponse) {
        const videoId = parseInt(req.params.id);
        const amount = 0.01 // fixed for now
        generateInvoiceUSD(amount)
        .then(invoice => persistInvoice(videoId, invoice, req.models))
        .then(payIn => res.send({ payreq: payIn.get().payreq }));
    })

    router.get('/paid/:payreq', function(req: ServerRequest, res: ServerResponse) {
        const payreq = req.params.payreq;
        findCharge(payreq, req.models)
        .then(payIn => {
            isChargePaid(payIn.get().chargeId)
            .then(paid => {
                if (paid) {
                    const chargeId = payIn.get().chargeId
                    const videoId = payIn.get().videoId;
                    setChargePaid(chargeId, req.models)
                    .then(() => findVideo(videoId, req.models))
                    .then(video => video.increment("views"))
                    .then(updatedVideo => res.json({url: updatedVideo.get().videoMetadata.hlsUrl}))
                } else {
                    res.status(402).send({ error: "Not paid yet" });
                }
            })            
        });
        // TODO invoice expired
        // res.status(408).send({error: "Invoice expired"})
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
    
   return router;
}