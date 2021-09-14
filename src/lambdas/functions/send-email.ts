import { SNSEvent } from 'aws-lambda'
import { S3 } from 'aws-sdk'
import { EmailClient } from '../clients/emailClient'

const s3 = new S3({
  region: 'ap-southeast-2'
})
const emailClient = new EmailClient()

interface CronEvent {
  CloudWatchEvent: boolean
}

export const handler = async (event: SNSEvent | CronEvent): Promise<void> => {
  console.log('-------------')
  console.log('--- event ---')
  console.log(JSON.stringify(event))
  if ((event as CronEvent).CloudWatchEvent) {
    console.log('CloudWatchEvent')
  } else {
    console.log('SNSEvent')
  }
}