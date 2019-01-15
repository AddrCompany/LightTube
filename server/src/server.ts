import * as sequelize from 'sequelize';
import * as express from 'express';
import * as bodyParser from 'body-parser';

import { instantiateModels } from './model';
import { ServerRequest, ServerResponse, mainRouter } from './router';

const PORT = 8001;

const sequelizeInstance = new sequelize('schema','root','password', {
    dialect: 'sqlite',
    storage: 'db/database.sqlite'
});

const models = instantiateModels(sequelizeInstance);

sequelizeInstance.sync({
    force: true, // should not be used in production
    logging: console.log
})
.then(() => {
    const app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(function (req: ServerRequest, _res: ServerResponse, next: express.NextFunction) {
        req.models = models;
        next();
    });
    app.use("/", mainRouter)
    app.listen(PORT, () => {
        console.log(`Server is now listening on ${PORT}`)
    });
})
.catch(err => console.error(err));