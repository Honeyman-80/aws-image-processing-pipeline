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
