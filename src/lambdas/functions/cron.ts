import { S3 } from 'aws-sdk'
import { EmailClient } from '../clients/emailClient'
import { pendingRequestsKey, s3Bucket } from '../models/const'
import { EmailRequest } from '../models/emailRequest'

const s3 = new S3({
  region: 'ap-southeast-2'
})
const emailClient = new EmailClient()

export const handler = async (): Promise<void> => {
  try {
    console.log('-------------')
    console.log('--- start cron ---')

    const obj = await s3.getObject({
      Bucket: s3Bucket,
      Key: pendingRequestsKey,
    }).promise()
    const requests: EmailRequest[] = JSON.parse(obj.Body.toString())
    const unsent: EmailRequest[] = []
    for (const r of requests) {
      if (r.shouldSend) {
        await emailClient.scheduleEmail(r.sendGridRequest)
      } else {
        unsent.push(r)
      }
    }
    await s3.putObject({
      Bucket: s3Bucket,
      Key: pendingRequestsKey,
      Body: JSON.stringify(unsent)
    })
    console.log('sqs-s3.handler success')
  } catch (e) {
    console.error(e)
    console.error('sqs-s3.handler failed')
  }
}