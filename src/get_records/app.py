import json
import os
from decimal import Decimal

import boto3

dynamodb = boto3.resource("dynamodb")
table_name = os.environ["TABLE_NAME"]
table = dynamodb.Table(table_name)

def decimal_default(value):
    if isinstance(value, Decimal):
        return int(value)
    raise TypeError

def lambda_handler(event, context):
    result = table.scan()

    return {
        "statusCode": 200,
        "headers": {
            "Content-Type": "application/json"
        },
        "body": json.dumps({
            "records": result.get("Items", [])
        }, default=decimal_default)
    }
