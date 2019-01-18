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

export function completeUpdate(
  guid: string, models: Models
): Promise<VideoMetadata> {
  return getItemByGuid(guid)
  .then(toTranscoderItem)
  .then(item =>
    models.videosMetadata.findOne({
      where: {
        transcoder_guid: guid
      }
    })
    .then(metadata => {
      if (metadata) {
        return metadata.set("cloudfront_dash_url", item.cloudFront).save()
      }
      return null;
    })
  );
}

export function ingestUpdate(
  filename: string, guid: string, models: Models
): Promise<VideoMetadata> {
  return models.videosMetadata.findOne({
    where: {
      local_file_name: filename
    }
  })
  .then(metadata => {
    if (metadata) {
      return metadata.set("transcoder_guid", guid).save()
    }
    return null;
  });
}