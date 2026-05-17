## DLQ Failure Test

Temporary Lambda code used to intentionally trigger failures and test DLQ behavior.

```python
def lambda_handler(event, context):
    print("Intentional failure test for DLQ alarm")
    raise Exception("Testing DLQ alarm")
