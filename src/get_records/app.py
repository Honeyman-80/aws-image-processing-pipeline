import json
import os
from decimal import Decimal

import boto3
from boto3.dynamodb.conditions import Key

dynamodb = boto3.resource("dynamodb")
table_name = os.environ["TABLE_NAME"]
table = dynamodb.Table(table_name)

def decimal_default(value):
    if isinstance(value, Decimal):
        return int(value)
    raise TypeError

def lambda_handler(event, context):
    user_id = event["requestContext"]["authorizer"]["claims"]["sub"]

    result = table.query(
        KeyConditionExpression=Key("user_id").eq(user_id)
    )

    records = result.get("Items", [])

    records.sort(
        key=lambda record: record.get("created_at", ""),
        reverse=True
    )

    return {
        "statusCode": 200,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "https://dchdkjcdj76c0.cloudfront.net",
            "Access-Control-Allow-Headers": "Content-Type,Authorization",
            "Access-Control-Allow-Methods": "GET,OPTIONS"
        },
        "body": json.dumps({
            "records": records
        }, default=decimal_default)
    }
