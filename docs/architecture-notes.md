# Image Processing Pipeline Architecture

## High Level Flow

User uploads image
↓
S3 bucket receives image
↓
S3 event notification
↓
SQS queue receives message
↓
Lambda processes image metadata
↓
DynamoDB stores processing result
↓
CloudWatch logs and monitoring

## Goals

Learn event-driven serverless architecture.

Learn:
- S3 event notifications
- SQS decoupling
- Lambda event processing
- DynamoDB writes
- IAM permissions
- Failure handling
- DLQs
- CloudWatch monitoring

# Image Processing Pipeline Architecture

## High-Level Flow

User uploads image
↓
S3 bucket receives image
↓
S3 event notification sends message
↓
SQS queue buffers message
↓
Lambda polls SQS
↓
Lambda reads image object from S3
↓
Lambda writes metadata to DynamoDB
↓
CloudWatch stores logs

## Services

### S3

Stores uploaded image files.

Bucket:

- dave-image-processing-2026

Upload prefix:

- uploads/

### SQS

Buffers S3 event messages.

Main queue:

- dave-image-processing-queue

SQS decouples S3 from Lambda so messages can wait safely if processing fails.

### Lambda

Processes upload events.

Function:

- dave-image-processing-function

Lambda receives the SQS event, parses the S3 event inside the message body, extracts metadata, reads the S3 object, and writes a processing record.

### DynamoDB

Stores image processing records.

Table:

- dave-image-processing-records

Partition key:

- image_id

Stored fields include:

- image_id
- bucket
- object_key
- size
- content_type
- event_name
- processed_at

### DLQ

Stores messages that fail processing too many times.

Dead-letter queue:

- dave-image-processing-dlq

Main queue maximum receives:

- 3 for testing

## Important Mental Models

S3 folders are not real folders. They are object key prefixes.

Example:

uploads/coffee.jpg

SQS messages remain in the queue until a consumer successfully processes and deletes them.

Lambda does not receive the image directly from SQS. It receives a message containing the S3 bucket and object key.

SQS tells Lambda where the image is.

s3:GetObject allows Lambda to actually read the image.

The Lambda event has two layers:

SQS event
↓
S3 event inside record["body"]

DLQ flow:

Lambda fails
↓
SQS retries message
↓
message exceeds maximum receives
↓
message moves to DLQ

Recovery flow:

Fix Lambda code
↓
redrive DLQ message to source queue
↓
Lambda processes successfully
