import * as AWS from 'aws-sdk';
import * as Promise from 'bluebird';
import { Models, VideoMetadata } from './model';

AWS.config.update({region: 'us-east-1'});

const TABLE_NAME = "LightTube-DefaultSolution";

type DynamoString = {
  S: string
}
type WorkflowStatus = "Complete" | "Ingest";
interface DynamoItem {
  cloudFront:	DynamoString,
  dashUrl: DynamoString,
  destBucket:	DynamoString,
  EndTime: DynamoString,
  guid:	DynamoString,
  workflowStatus:	{
    S: WorkflowStatus
  }
}

interface TranscoderItem {
  cloudFront: string,
  dashUrl: string,
  destBucket: string,
  EndTime: string,
  guid: string,
  workflowStatus: WorkflowStatus
}

function getItemByGuid(guid: string): Promise<DynamoItem> {
  return new Promise((resolve, reject) => {
    const ddb = new AWS.DynamoDB({apiVersion: '2012-10-08'});
    const params: AWS.DynamoDB.GetItemInput = {
      TableName: TABLE_NAME,
      Key: {
        'guid' : {S: guid},
      }
    };
    ddb.getItem(params, function(err, data) {
      if (err) {
        reject(err);
      } else {
        resolve((data.Item as unknown) as DynamoItem);
      }
    });
  });
}

function toTranscoderItem(obj: DynamoItem): TranscoderItem {
  return {
    guid: obj.guid.S,
    cloudFront: obj.cloudFront.S,
    dashUrl: obj.dashUrl.S,
    destBucket: obj.destBucket.S,
    EndTime: obj.EndTime.S,
    workflowStatus: obj.workflowStatus.S
  };
}

export function completeUpdate(metadata: VideoMetadata): Promise<VideoMetadata> {
  return getItemByGuid(metadata.get().transcoder_guid)
  .then(toTranscoderItem)
  .then(item => {
    if (item.workflowStatus === "Complete") {
      return metadata.set("cloudfront_dash_url", item.cloudFront).save();
    }
    return null;
  })
}

export function ingestUpdate(
  metadata: VideoMetadata, guid: string
): Promise<VideoMetadata> {
  return metadata.set("transcoder_guid", guid).save();
}