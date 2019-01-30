import * as express from "express";
import { UploadedFile } from "express-fileupload";
import * as uuidv4 from 'uuid/v4';
import * as Promise from 'bluebird';

import { Models, VideoAttrs, Video, VideoMetadataAttrs, instantiateModels, CommentAttrs } from "./model";

const SUPPORTED_EXTENSIONS = ["mp4", "mpg", "m4v", "m2ts", "mov"];

export interface ServerRequest extends express.Request {
    models?: Models
}
export interface ServerResponse extends express.Response {}

interface UploadRequest extends ServerRequest {
    body: {
        title: string,
        description: string,
        user: string
    }
}

interface CommentPostRequest extends ServerRequest {
    body: {
        comment: string,
        user: string
    }
}

interface ServingComment {
    content: string,
    user: string
}

interface ServingVideo {
    video_id: number,
    title: string,
    description: string,
    user: string,
    likes: number,
    dislikes: number,
    views: number,
    thumbnail_url: string,
    video_url: string,
    comments: ServingComment[]
}

interface ServingVideoThumbnail {
    video_id: number,
    title: string,
    user: string,
    views: number,
    thumbnail_url: string,
}

interface ServingVideos {
    videos: ServingVideoThumbnail[]
}

const router = express.Router();

router.get('/', function(req: ServerRequest, res: ServerResponse) {
    res.send("WeWorks");
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
    .then(video => video.increment("views"))
    .then(updatedVideo => updatedVideo.get())
    .then(videoAttrs => toServingVideo(videoAttrs))
    .then(servableVideo => res.json(servableVideo))
    .catch(err => res.status(500).send(err))
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

router.post('/upload', function(req: UploadRequest, res: ServerResponse) {
    const videoFile: UploadedFile = req.files.file as UploadedFile;
    const videoFileExtension = videoFile.name.split('.').pop();
    if (SUPPORTED_EXTENSIONS.indexOf(videoFileExtension) === -1) {
        res.status(500).send({error: "Unsupported extension"});
    }
    const videoFileName: string = uuidv4();
    const fullVideoFileName: string = videoFileName + '.' + videoFileExtension;
    videoFile.mv(
        `${process.cwd()}/uploads/${fullVideoFileName}`,
        function (err) {
            if (err) {
                return res.status(500).send(err)
            }
            const videoParams: VideoAttrs = {
                title: req.body.title,
                description: req.body.description,
                user: req.body.user
            };
            persistNewVideo(videoParams, req.models, fullVideoFileName)
            .then(video =>
                res.json({
                    title: video.get().title,
                    description: video.get().description,
                    user: video.get().user
                })
            );
        },
    );
});

function persistNewVideo(
    videoParams: VideoAttrs, models: Models, fileName: string
): Promise<Video> {
    return models.videos.create(videoParams)
    .then(video => {
        const metadata: VideoMetadataAttrs = {
            videoId: video.get().id,
            localFileName: fileName
        }
        return models.videosMetadata.create(metadata)
        .then(() => video);
    })   
}

function findAllReadyVideos(models: Models): Promise<Video[]> {
    return models.videos.findAll({
        where: {
            ready: true
        },
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

function findVideo(primaryKey: number, models: Models): Promise<Video> {
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

function toServingVideos(allVideos: VideoAttrs[]): ServingVideos {
    return {
        videos: allVideos.map(video => toServingVideoThumbnail(video))
    };
}

function toServingVideoThumbnail(video: VideoAttrs): ServingVideoThumbnail {
    return {
        video_id: video.id,
        title: video.title,
        user: video.user,
        views: video.views,
        thumbnail_url: (video.videoMetadata ? video.videoMetadata.imgUrl : "http://defaultnothumbnail"),
    }
}

function toServingVideo(video: VideoAttrs): ServingVideo {
    return {
        video_id: video.id,
        title: video.title,
        description: video.description,
        user: video.user,
        likes: video.likes,
        dislikes: video.dislikes,
        views: video.views,
        thumbnail_url: (video.videoMetadata ? video.videoMetadata.imgUrl : "http://defaultnothumbnail"),
        video_url: (video.videoMetadata ? video.videoMetadata.cloudfrontDashUrl : "http://videonotavailable"),
        comments: video.comments.map(comment => toServingComment(comment)),
    }
}

function toServingComment(comment: CommentAttrs): ServingComment {
    return {
        content: comment.comment,
        user: comment.user
    }
}

export const mainRouter = router;