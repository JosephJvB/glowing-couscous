import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { SQS } from 'aws-sdk'
import { EmailRequest } from '../models/emailRequest'
import { HttpFailure, HttpSuccess } from '../models/httpResponse'

const sqs = new SQS({
  region: 'ap-southeast-2'
})

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    console.log(
      `method: ${event.httpMethod}`,
      `path: ${event.path}`,
    )
    if (event.httpMethod.toLowerCase() == 'options') {
      return new HttpSuccess()
    }
    console.log('--- event ---')
    console.log(JSON.stringify(event))
    console.log('--- body ---')
    console.log(event.body)

    const emailRequest = new EmailRequest(JSON.parse(event.body))
    emailRequest.created = Date.now()
    if (!emailRequest.isValid) {
      console.warn('Invalid email request', JSON.stringify(emailRequest))
      return new HttpFailure(JSON.stringify({
        message: 'Invalid email request',
        data: emailRequest
      }))
    }

    await sqs.sendMessage({
      QueueUrl: process.env.sqs_url,
      MessageBody: JSON.stringify(emailRequest)
    }).promise()
  
    const response = new HttpSuccess(JSON.stringify({
      message: 'Success, email queued',
      createdTimestamp: emailRequest.created,
    }))
    console.log('--- response ---')
    console.log(JSON.stringify(response))
    return response
  } catch (e) {
    console.error(e)
    console.error('http-sqs.handler failed')
    return new HttpFailure(e)
  }
}