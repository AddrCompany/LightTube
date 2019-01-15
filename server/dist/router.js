"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var analytics_1 = require("./analytics");
function parseImpression(request) {
    return {
        impression_token: request.payload.impression_token,
        session_token: request.payload.session_token,
        visitor_token: request.visitor_token,
        url: request.payload.url,
        elapsed_time: request.payload.elapsed_time_in_ms
    };
}
function convertImpression(impression_token, model) {
    return model.findById(impression_token).then(function (instance) { return instance.update({ converted: true }); });
}
var router = express.Router();
router.post('/track', function (req, res) {
    var impressions = req.model;
    switch (req.body.event_type) {
        case 'page_view':
            var attr = parseImpression(req.body);
            var instance = impressions.build(attr);
            instance.save()
                .then(function () {
                res.sendStatus(200);
            })
                .catch(function (e) { return res.sendStatus(500); });
            break;
        case 'user_event':
            var impression_token = req.body.payload.impression_token;
            convertImpression(impression_token, impressions)
                .then(function () {
                res.sendStatus(200);
            })
                .catch(function (e) { return res.sendStatus(500); });
            break;
        default:
            res.sendStatus(404);
    }
});
router.get('/reports/pages', function (req, res) {
    var impressions = req.model;
    analytics_1.getPageStats(impressions)
        .then(function (pageStats) {
        res.status(200).json({ pages: pageStats });
    })
        .catch(function (e) { return res.sendStatus(500); });
});
router.get('/reports/visitors', function (req, res) {
    var impressions = req.model;
    analytics_1.getVisitorStats(impressions)
        .then(function (vistorStats) {
        res.status(200).json({ visitors: vistorStats });
    })
        .catch(function (e) { return res.sendStatus(500); });
});
exports.mainRouter = router;
