"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sequelize = require("sequelize");
var bluebird_1 = require("bluebird");
function pagesHighestViews(model) {
    return model.findAll({
        attributes: ['url', [sequelize.fn('COUNT', sequelize.col('impression_token')), 'total_count']],
        group: ['url'],
        order: [[sequelize.fn('COUNT', sequelize.col('impression_token')), 'DESC']]
    });
}
function pagesMostTime(model) {
    return model.findAll({
        attributes: ['url', [sequelize.fn('AVG', sequelize.col('elapsed_time')), 'avg_time']],
        group: ['url'],
        order: [[sequelize.fn('AVG', sequelize.col('elapsed_time')), 'DESC']]
    });
}
function pagesMostConversion(model) {
    return model.findAll({
        attributes: ['url', [sequelize.literal('(SUM(`converted`)*1.0)/COUNT(*)'), 'cvr_rate']],
        group: ['url'],
        order: [sequelize.literal('(SUM(`converted`)*1.0)/COUNT(*) DESC')]
    });
}
function getPageStats(model) {
    return bluebird_1.Promise.all([pagesHighestViews(model), pagesMostTime(model), pagesMostConversion(model)])
        .spread(function (highest_views, most_time, most_conversion) {
        var pageViewCount = highest_views.map(function (res) { return res.dataValues; }).slice(0, 10);
        var pageAverageTime = most_time.map(function (res) { return res.dataValues; }).slice(0, 10);
        var pageConversionRate = most_conversion
            .map(function (res) { return res.dataValues; }).slice(0, 10).map(function (_a) {
            var url = _a.url, cvr_rate = _a.cvr_rate;
            return {
                url: url,
                cvr_rate: parseFloat(cvr_rate.toFixed(4))
            };
        });
        return {
            highest_views: pageViewCount,
            most_time: pageAverageTime,
            highest_conversion: pageConversionRate
        };
    });
}
exports.getPageStats = getPageStats;
function visitorAverageTimePerPage(model) {
    return model.findAll({
        attributes: [[sequelize.fn('AVG', sequelize.col('elapsed_time')), 'average_time_per_page']],
    });
}
function visitorAveragePagesPerSession(model) {
    return model.findAll({
        attributes: [[sequelize.fn('COUNT', sequelize.col('impression_token')), 'pages_per_session']],
        group: ['session_token']
    });
}
function visitorAverageTimePerSession(model) {
    return model.findAll({
        attributes: [[sequelize.fn('SUM', sequelize.col('elapsed_time')), 'time_per_session']],
        group: ['session_token']
    });
}
function getVisitorStats(model) {
    return bluebird_1.Promise.all([visitorAverageTimePerPage(model), visitorAveragePagesPerSession(model), visitorAverageTimePerSession(model)])
        .spread(function (impressions1, impressions2, impressions3) {
        var result1 = Math.floor(impressions1.map(function (x) { return x.dataValues.average_time_per_page; })[0]);
        var len = impressions2.length;
        var sum_pages = impressions2.map(function (x) { return x.dataValues.pages_per_session; })
            .reduce(function (sum, current) { return sum + current; });
        var result2 = Math.floor(sum_pages / len);
        var sum_time = impressions3.map(function (x) { return x.dataValues.time_per_session; })
            .reduce(function (sum, current) { return sum + current; });
        var result3 = Math.floor(sum_time / len);
        return {
            average_time_per_page: result1,
            average_pages_per_session: result2,
            average_time_per_session: result3
        };
    });
}
exports.getVisitorStats = getVisitorStats;
