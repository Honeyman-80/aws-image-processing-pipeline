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

    return {
        "statusCode": 200,
        "headers": {
            "Content-Type": "application/json"
        },
        "body": json.dumps({
            "records": result.get("Items", [])
        }, default=decimal_default)
    }
