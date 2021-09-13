# Backend

Each lambda has it's own SAM template, which deploys lambda code only & handles roles / permissions
Create manually:
  - ApiGateway
  - SnsTopic
  - S3 Bucket
  - S3 files used in lambdas

1. Http lambda
  - Trigger by ApiGateway
  - Use as proxy, so I can write the response headers in code (CORS
  - Send to SNS
2. SendEmail lambda
  - Trigger by SNS
  - If SendAt within 3 days -> send and exit
  - If not, lookup pending.json, add email to array, resave pending.json
3. Record lambda
  - Trigger by SNS
  - Lookup all.json S3
  - add item to array
  - Save all.json
4. Cron lambda
  - Trigger by cron, once every 2 days @ midnight
  - look up pending.json S3, for each item
  - If SendAt within 3 days -> send email -> remove from array
  - Resave pending.json, removing all sent items

https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-property-function-api.html