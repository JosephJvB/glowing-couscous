import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { SQS } from 'aws-sdk'
import { EmailRequest } from '../models/emailRequest'
import { HttpFailure, HttpSuccess } from '../models/httpResponse'

const sqs = new SQS({
  region: 'ap-southeast-2'
})

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    console.log('-------------')
    console.log('--- event ---')
    console.log(JSON.stringify(event))
    console.log('--- method ---')
    console.log(event.httpMethod)
    console.log('--- body ---')
    console.log(event.body)
    if (event.httpMethod.toLowerCase() == 'options') {
      return new HttpSuccess()
    }

    const emailRequest = new EmailRequest(JSON.parse(event.body))
    emailRequest._ts = Date.now()
    if (!emailRequest.isValid) {
      return new HttpFailure(JSON.stringify({
        message: 'Invalid email request',
        data: emailRequest
      }))
    }

    await sqs.sendMessage({
      QueueUrl: process.env.sqs_url,
      MessageBody: JSON.stringify(emailRequest)
    }).promise()
  
    return new HttpSuccess(JSON.stringify({
      message: 'Success, email queued',
      ts: emailRequest._ts,
    }))
  } catch (e) {
    console.error(e)
    console.error('http-sqs.handler failed')
    return new HttpFailure(e)
  }
}