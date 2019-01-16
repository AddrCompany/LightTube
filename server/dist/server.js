"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var sequelize = require("sequelize");
var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var fileUpload = require("express-fileupload");
var model_1 = require("./model");
var router_1 = require("./router");
var PORT = 8001;
var ServerError = /** @class */ (function (_super) {
    __extends(ServerError, _super);
    function ServerError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ServerError;
}(Error));
var sequelizeInstance = new sequelize('demo', 'postgres', 'Seattle2018', {
    host: 'localhost',
    dialect: 'postgres',
});
var models = model_1.instantiateModels(sequelizeInstance);
sequelizeInstance.sync({
    force: true,
    logging: console.log
})
    .then(function () {
    var app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cors());
    app.use(logger('dev'));
    app.use(cookieParser());
    app.use(fileUpload());
    app.use(function (req, _res, next) {
        req.models = models;
        next();
    });
    // all routes
    app.use("/", router_1.mainRouter);
    app.use(function (req, res, next) {
        var err = new ServerError('Not Found');
        err.status = 404;
        next(err);
    });
    app.use(function (err, req, res, next) {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};
        // render the error page
        res.status(err.status || 500);
        res.json(err);
    });
    app.listen(PORT, function () {
        console.log("Server is now listening on " + PORT);
    });
})
    .catch(function (err) { return console.error(err); });
