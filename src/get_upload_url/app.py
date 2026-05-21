import json
import uuid
import boto3
import os
from datetime import datetime, timezone

s3 = boto3.client("s3")

dynamodb = boto3.resource("dynamodb")

BUCKET_NAME = os.environ["BUCKET_NAME"]
TABLE_NAME = os.environ["TABLE_NAME"]
table = dynamodb.Table(TABLE_NAME)

def lambda_handler(event, context):

    user_id = event["requestContext"]["authorizer"]["claims"]["sub"]

    image_id = str(uuid.uuid4())

    object_key = f"uploads/{user_id}/{image_id}.jpg"

    table.put_item(
        Item={
            "user_id": user_id,
            "image_id": image_id,
            "status": "UPLOAD_URL_CREATED",
            "object_key": object_key,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
    )

    upload_url = s3.generate_presigned_url(
        "put_object",
        Params={
            "Bucket": BUCKET_NAME,
            "Key": object_key,
            "ContentType": "image/jpeg"
        },
        ExpiresIn=300
    )

    return {
        "statusCode": 200,
        "headers": {
            "Content-Type": "application/json"
        },
        "body": json.dumps({
            "upload_url": upload_url,
            "image_id": image_id,
            "object_key": object_key
        })
    }
