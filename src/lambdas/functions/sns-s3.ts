import { SNSEvent } from 'aws-lambda'
import { S3 } from 'aws-sdk'
import { allRequestsKey, s3Bucket } from '../models/const'
import { EmailRequest } from '../models/emailRequest'

const s3 = new S3({
  region: 'ap-southeast-2'
})

export const handler = async (event: SNSEvent): Promise<void> => {
  try {
    console.log('-------------')
    console.log('--- event ---')
    console.log(JSON.stringify(event))
    console.log(
      `records.length=${event.Records.length}`
    )

    const incomingRequests: EmailRequest[] = []
    for (let i = 0; i < event.Records.length; i++) {
      const record = event.Records[i]
      console.log(
        'record n.' + i,
        record.Sns.Message
      )
      const data: EmailRequest = JSON.parse(record.Sns.Message)
      const request = new EmailRequest(data)
      if (request.isValid) {
        incomingRequests.push(request)
      }
    }
    console.log(
      `incomingRequests.length=${incomingRequests.length}`
    )

    if(incomingRequests.length == 0) {
      return console.warn('sns-s3.handler exiting, no valid incoming records')
    }

    console.log(
      's3.getObject',
      `bucket=${s3Bucket}`,
      `key=${allRequestsKey}`
    )
    const obj = await s3.getObject({
      Bucket: s3Bucket,
      Key: allRequestsKey
    }).promise()
    const currentAllRequests = JSON.parse(obj.Body.toString()) as EmailRequest[]
    console.log(
      `currentAllRequests.length=${currentAllRequests.length}`
    )

    const allRecords = [...currentAllRequests, ...incomingRequests]
    console.log(
      `allRecords.length=${allRecords.length}`
    )

    console.log(
      's3.putObject',
      `bucket=${s3Bucket}`,
      `key=${allRequestsKey}`
    )
    await s3.putObject({
      Bucket: s3Bucket,
      Key: allRequestsKey,
      Body: JSON.stringify(allRecords),
      ContentType: 'application/json'
    }).promise()
    console.log('sns-s3.handler success')
  } catch (e) {
    console.error(e)
    console.error('sns-s3.handler failed')
  }
}