import { SQSEvent } from 'aws-lambda'
import { S3 } from 'aws-sdk'
import { allRequestsKey, pendingRequestsKey, s3Bucket } from '../models/const'
import { EmailRequest } from '../models/emailRequest'

const s3 = new S3({
  region: 'ap-southeast-2'
})
async function saveRequests(requests: EmailRequest[], s3Key: string) {
  console.log(
    `saveRequests=${requests.length}`,
    `s3Key=${s3Key}`
  )
  if (requests.length == 0) {
    return
  }
  const obj = await s3.getObject({
    Bucket: s3Bucket,
    Key: s3Key
  }).promise()
  const currentRecords: EmailRequest[] = JSON.parse(obj.Body.toString())
  currentRecords.push(...requests)
  await s3.putObject({
    Bucket: s3Bucket,
    Key: s3Key,
    Body: JSON.stringify(currentRecords)
  }).promise()
}
export const handler = async (event: SQSEvent): Promise<void> => {
  try {
    console.log('-------------')
    console.log('--- event ---')
    console.log(JSON.stringify(event))
    console.log(
      `records.length=${event.Records.length}`
    )

    const unique: { // try avoid potential duplicates from sqs queue
      [key: string]: boolean
    } = {}
    const incomingRequests: EmailRequest[] = []
    const incomingPending: EmailRequest[] = []
    for (let i = 0; i < event.Records.length; i++) {
      const record = event.Records[i]
      console.log(
        'record n.' + i,
        record.body
      )
      const data: EmailRequest = JSON.parse(record.body)
      const request = new EmailRequest(data)
      if (!request.isValid || unique[request.uuid]) {
        continue
      }
      unique[request.uuid] = true
      if (!request.sent) {
        incomingPending.push(request)
      }
      incomingRequests.push(request)
    }
    console.log(
      `incomingRequests.length=${incomingRequests.length}`,
      `incomingPending.length=${incomingPending.length}`,
    )

    await Promise.all([
      saveRequests(incomingRequests, allRequestsKey),
      saveRequests(incomingPending, pendingRequestsKey),
    ])
    console.log('sqs-s3.handler success')
  } catch (e) {
    console.error(e)
    console.error('sqs-s3.handler failed')
  }
}