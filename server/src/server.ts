/**
 * Load environment variables
 */
import * as path from 'path';
require('dotenv').config({ path: path.resolve(process.cwd(), '.env') })

import * as sequelize from 'sequelize';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as logger from 'morgan';
import * as cookieParser from 'cookie-parser';
import * as fileUpload from 'express-fileupload';

import { instantiateModels } from './model';
import { setupMainRouter } from './router/main';
import { ServerResponse } from './router/iServing';
import { ServerRequest } from './router/iRequest';

const PORT = process.env.SERVER_PORT || 8001;

class ServerError extends Error {
    status: number;
}

const sequelizeInstance = new sequelize(
    process.env.DATABASE_NAME,process.env.DATABASE_USER, process.env.DATABASE_PASSWORD,
    {
        host: process.env.DATABASE_HOST,
        dialect: 'postgres',
    }
);

const models = instantiateModels(sequelizeInstance);

sequelizeInstance.sync({
    force: false,
    logging: console.log
})
.then(() => {
    const app = express();
    
    const mainRouter = setupMainRouter();

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cors());
    app.use(logger('dev'));
    app.use(cookieParser());
    app.use(fileUpload());
    app.use(function (req: ServerRequest, _res: ServerResponse, next: express.NextFunction) {
        req.models = models;
        next();
    });
    
    app.use("/", mainRouter);

    app.use(function(req, res, next) {
        const err = new ServerError('Not Found');
        err.status = 404;
        next(err);
    });
    
    app.use(function(err, req, res, next) {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};
      
        // render the error page
        res.status(err.status || 500);
        res.json(err);
      });
      
      app.listen(PORT, () => {
        console.log(`Server is now listening on ${PORT}`)
    });
})
.catch(err => console.error(err));
