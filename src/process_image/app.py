import json
import boto3
import uuid
from datetime import datetime, timezone

s3_client = boto3.client("s3")
dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table("dave-image-processing-sam-records")

def lambda_handler(event, context):
    print("Lambda was triggered")

    for record in event["Records"]:
        message_body = json.loads(record["body"])

        for s3_record in message_body["Records"]:
            bucket = s3_record["s3"]["bucket"]["name"]
            key = s3_record["s3"]["object"]["key"]
            size = s3_record["s3"]["object"]["size"]
            event_name = s3_record["eventName"]

            response = s3_client.get_object(
                Bucket=bucket,
                Key=key
            )

            content_type = response.get("ContentType", "unknown")

            item = {
                "image_id": str(uuid.uuid4()),
                "bucket": bucket,
                "object_key": key,
                "size": size,
                "content_type": content_type,
                "event_name": event_name,
                "processed_at": datetime.now(timezone.utc).isoformat()
            }

            table.put_item(Item=item)

            print("Image record saved")
            print(json.dumps(item))

    return {
        "statusCode": 200,
        "body": "Processed image upload"
    }
    
