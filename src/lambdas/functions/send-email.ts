import { SNSEvent } from 'aws-lambda'
import { S3 } from 'aws-sdk'
import { EmailClient } from '../clients/emailClient'
import { CronEvent } from '../models/cronEvent'
import { EmailService } from '../services/emailService'

const s3 = new S3({
  region: 'ap-southeast-2'
})
const emailClient = new EmailClient()
const emailService = new EmailService(s3, emailClient)

export const handler = async (event: SNSEvent | CronEvent): Promise<void> => {
  console.log('-------------')
  console.log('--- event ---')
  console.log(JSON.stringify(event))
  if ((event as CronEvent).CloudWatchEvent) {
    await emailService.handleCronEvent(event as CronEvent)
  } else {
    await emailService.handleSnsEvent(event as SNSEvent)
  }
}