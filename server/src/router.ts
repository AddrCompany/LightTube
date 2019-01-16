import * as express from "express";
import { UploadedFile } from "express-fileupload";
import * as uuidv4 from 'uuid/v4';

import { Models } from "./model";

const SUPPORTED_EXTENSION = ["mp4", "mpg", "m4v", "m2ts", "mov"];

export interface ServerRequest extends express.Request {
    models?: Models,
    body: any
}
export interface ServerResponse extends express.Response {}

const router = express.Router();

router.post('/', function(req: ServerRequest, res: ServerResponse) {
});

router.get('/', function(req: ServerRequest, res: ServerResponse) {
    res.send("WeWorks");
});

router.post('/upload', function(req: ServerRequest, res: ServerResponse) {
    const videoFile: UploadedFile = req.files.file as UploadedFile;
    const videoFileExtension = videoFile.name.split('.').pop();
    if (SUPPORTED_EXTENSION.indexOf(videoFileExtension) == -1) {
        res.status(500).send({error: "Unsupported extension"});
    }
    const videoFileName: string = uuidv4();
    videoFile.mv(
        `${process.cwd()}/uploads/${videoFileName}.${videoFileExtension}`,
        function (err) {
            if (err) {
                return res.status(500).send(err)
            }
            res.json({
                fileName: videoFileName,
            })
        },
    );
});

export const mainRouter = router;