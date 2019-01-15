"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sequelize = require("sequelize");
var express = require("express");
var bodyParser = require("body-parser");
var model_1 = require("./model");
var router_1 = require("./router");
var PORT = 8001;
var connection = new sequelize('schema', 'root', 'password', {
    dialect: 'sqlite',
    storage: 'db/database.sqlite'
});
var impressions = connection.define('impressions', model_1.impressionsDatatypes);
connection.sync({
    force: true,
    logging: console.log
})
    .then(function () {
    var app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(function (req, _res, next) {
        req.model = impressions;
        next();
    });
    app.use("/", router_1.mainRouter);
    app.listen(PORT, function () {
        console.log("Server is now listening on " + PORT);
    });
})
    .catch(function (err) { return console.error(err); });
