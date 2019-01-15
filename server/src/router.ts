import * as express from "express";

import { Models } from "./model";

export interface ServerRequest extends express.Request {
    models?: Models,
    body: any
}
export interface ServerResponse extends express.Response {}

const router = express.Router();

router.post('/', function(req: ServerRequest, res: ServerResponse) {
});

router.get('/', function(req: ServerRequest, res: ServerResponse) {
});

export const mainRouter = router;