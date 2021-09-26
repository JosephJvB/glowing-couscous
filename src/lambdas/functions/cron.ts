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
    console.log(
      `pendingRequests.length=${requests.length}`
    )
    const unsent: EmailRequest[] = []
    for (const r of requests) {
      if (r.shouldSend) {
        await emailClient.scheduleEmail(r.sendGridRequest)
      } else {
        unsent.push(r)
      }
    }
    console.log(
      `next: pendingRequests.length=${unsent.length}`
    )
    await s3.putObject({
      Bucket: s3Bucket,
      Key: pendingRequestsKey,
      Body: JSON.stringify(unsent)
    })
    console.log('cronfn.handler success')
  } catch (e) {
    console.error(e)
    console.error('cronfn.handler failed')
  }
}