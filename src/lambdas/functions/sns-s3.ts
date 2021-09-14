import { SNSEvent } from 'aws-lambda'
import { S3 } from 'aws-sdk'
import { EmailRequest } from '../models/emailRequest'

const s3 = new S3({
  region: 'ap-southeast-2'
})

const bucket = 'jvb-code'
const key = 'email-data/all.json'

export const handler = async (event: SNSEvent): Promise<void> => {
  try {
    console.log('-------------')
    console.log('--- event ---')
    console.log(JSON.stringify(event))
    console.log(
      `records.length=${event.Records.length}`
    )

    const incomingRecords: EmailRequest[] = []
    for(let i = 0; i < event.Records.length; i++) {
      const record = event.Records[i]
      console.log(
        'record n.' + i,
        record.Sns.Message
      )
      const data: EmailRequest = JSON.parse(record.Sns.Message)
      const request = new EmailRequest(data)
      if (request.isValid) {
        incomingRecords.push(data)
      }
    }

    let currentRecords: EmailRequest[] = []
    try {
      console.log(
        's3.getObject',
        `bucket=${bucket}`,
        `key=${key}`
      )
      const obj = await s3.getObject({
        Bucket: bucket,
        Key: key
      }).promise()
      currentRecords = JSON.parse(obj.Body.toString()) as EmailRequest[]
    } catch {
      console.error('failed to load current records from json file')
      console.error(
        `bucket=${bucket}`,
        `key=${key}`
      )
    }
    console.log(
      `currentRecords.length=${currentRecords.length}`
    )
    const allRecords = [...currentRecords, ...incomingRecords]
    console.log(
      `allRecords.length=${allRecords.length}`
    )
    console.log(
      's3.putObject',
      `bucket=${bucket}`,
      `key=${key}`
    )
    await s3.putObject({
      Bucket: bucket,
      Key: key,
      Body: JSON.stringify(allRecords),
      ContentType: 'application/json'
    }).promise()
    console.log('sns-s3.handler success')
  } catch (e) {
    console.error(e)
    console.error('sns-s3.handler failed')
  }
}