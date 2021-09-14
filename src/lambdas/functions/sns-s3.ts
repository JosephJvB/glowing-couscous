import { SNSEvent } from 'aws-lambda'
import { S3 } from 'aws-sdk'
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

    for(let i = 0; i < event.Records.length; i++) {
      const record = event.Records[i]
      console.log(
        'record n.' + i,
        record.Sns.Message
      )
      const data: EmailRequest = JSON.parse(record.Sns.Message)
    }
  } catch (e) {
    console.error(e)
    console.error('sns-s3.handler failed')
  }
}