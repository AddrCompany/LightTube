import * as express from "express";
import { UploadedFile } from "express-fileupload";
import * as uuidv4 from 'uuid/v4';
import * as Promise from 'bluebird';

import { Models, VideoAttrs, Video, VideoMetadataAttrs } from "./model";

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

const router = express.Router();

router.get('/', function(req: ServerRequest, res: ServerResponse) {
    res.send("WeWorks");
});

router.get('/all', function(req: ServerRequest, res: ServerResponse) {
    // database call and return
});

router.post('/upload', function(req: UploadRequest, res: ServerResponse) {
    const videoFile: UploadedFile = req.files.file as UploadedFile;
    const videoFileExtension = videoFile.name.split('.').pop();
    if (SUPPORTED_EXTENSIONS.indexOf(videoFileExtension) === -1) {
        res.status(500).send({error: "Unsupported extension"});
    }
    const videoFileName: string = uuidv4();
    videoFile.mv(
        `${process.cwd()}/uploads/${videoFileName}.${videoFileExtension}`,
        function (err) {
            if (err) {
                return res.status(500).send(err)
            }
            const videoParams: VideoAttrs = {
                title: req.body.title,
                description: req.body.description,
                user: req.body.user
            };
            persistNewVideo(videoParams, req.models, videoFileName)
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
            video_id: video.get().id,
            local_file_name: fileName
        }
        return models.videosMetadata.create(metadata)
        .then(() => video);
    })   
}

export const mainRouter = router;