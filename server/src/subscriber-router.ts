import * as express from "express";
import * as Promise from 'bluebird';

import { Models } from "./model";
import { completeUpdate, ingestUpdate } from "./update-status";

export interface ServerRequest extends express.Request {
    models?: Models
}

type WorkflowStatus = "Complete" | "Ingest"
interface SNSRequest extends ServerRequest {
    body: {
        workflowStatus: WorkflowStatus,
        guid: string,
        srcVideo: string
    }
}

const router = express.Router();

router.get('/', function(req: SNSRequest, _res: any) {
    const workflowStatus = req.body.workflowStatus;
    const fileName = req.body.srcVideo;
    const guid = req.body.guid;
    // This is loose check and can fail
    req.models.videosMetadata.findOne({
      where: {
        local_file_name: fileName
      }
    }).then(videoMetadata => {
      if (workflowStatus === "Ingest") {
        ingestUpdate(videoMetadata, guid)
      } else if (workflowStatus === "Complete") {
        completeUpdate(videoMetadata)
      } else {
        console.error("Unknown message")
      }
    });
});

export const subscriberRouter = router;