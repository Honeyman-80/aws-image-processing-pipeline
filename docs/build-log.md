# Build Log

## 2026-05-16

Started the Image Processing Pipeline build.

Created GitHub repository:

- aws-image-processing-pipeline

Created project structure:

- infrastructure/
- src/process_image/
- docs/
- README.md

Learned that GitHub/Git does not store empty folders directly. Folders appear when files exist inside paths.

## AWS Resources Created

Created S3 bucket:

- dave-image-processing-2026

Created SQS main queue:

- dave-image-processing-queue

Created Lambda function:

- dave-image-processing-function

Created DynamoDB table:

- dave-image-processing-records

Created SQS dead-letter queue:

- dave-image-processing-dlq

## Architecture Built

Built event-driven flow:

S3 upload
→ SQS message
→ Lambda trigger
→ Lambda reads S3 object
→ Lambda writes metadata to DynamoDB
→ CloudWatch logs processing

## Permissions Added

Allowed S3 to send messages to SQS.

Allowed Lambda to:

- Receive messages from SQS
- Delete processed messages from SQS
- Get queue attributes
- Read uploaded objects from S3 using s3:GetObject
- Write records to DynamoDB using dynamodb:PutItem

## Tests Completed

Confirmed S3 upload created SQS message.

Confirmed Lambda was triggered by SQS.

Confirmed Lambda extracted:

- bucket
- object key
- file size
- event name

Confirmed Lambda successfully read the S3 object.

Confirmed content type:

- image/jpeg

Confirmed Lambda saved processing record to DynamoDB.

## Failure Handling

Created and configured DLQ:

- dave-image-processing-dlq

Tested intentional Lambda failure.

Confirmed failed message retried and then moved to DLQ.

Restored working Lambda code.

Redrove failed message from DLQ back to source queue.

Confirmed Lambda successfully reprocessed the message and saved a DynamoDB record.

## Current Status

Working pipeline:

S3 → SQS → Lambda → S3 GetObject → DynamoDB

DLQ failure and recovery flow tested successfully.

## SAM Conversion

Converted manual image-processing pipeline into AWS SAM.

SAM now deploys:

- S3 bucket
- SQS main queue
- SQS DLQ
- Lambda function
- DynamoDB table
- IAM policies
- SQS event source mapping

Tested SAM deployment successfully.

## Bug Fixed

Initial SAM test failed because Lambda code still referenced the old manual DynamoDB table:

dave-image-processing-records

SAM IAM permissions were for:

dave-image-processing-sam-records

Fixed app.py to write to the SAM-created table.

Lesson learned:

When moving from manual resources to IaC resources, code must point to the new IaC-created resource names.
