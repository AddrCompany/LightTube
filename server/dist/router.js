"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var uuidv4 = require("uuid/v4");
var SUPPORTED_EXTENSION = ["mp4", "mpg", "m4v", "m2ts", "mov"];
var router = express.Router();
router.post('/', function (req, res) {
});
router.get('/', function (req, res) {
    res.send("WeWorks");
});
router.post('/upload', function (req, res) {
    var videoFile = req.files.file;
    var videoFileExtension = videoFile.name.split('.').pop();
    if (SUPPORTED_EXTENSION.indexOf(videoFileExtension) == -1) {
        res.status(500).send({ error: "Unsupported extension" });
    }
    var videoFileName = uuidv4();
    videoFile.mv(process.cwd() + "/uploads/" + videoFileName + "." + videoFileExtension, function (err) {
        if (err) {
            return res.status(500).send(err);
        }
        res.json({
            fileName: videoFileName,
        });
    });
});
exports.mainRouter = router;
