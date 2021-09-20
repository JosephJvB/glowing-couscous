import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { SQS } from 'aws-sdk'
import { EmailClient } from '../clients/emailClient'
import { EmailRequest } from '../models/emailRequest'
import { HttpFailure, HttpSuccess } from '../models/httpResponse'

const sqs = new SQS({
  region: 'ap-southeast-2'
})
const emailClient = new EmailClient()


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

    const promises: Promise<any>[] = []
    if (emailRequest.shouldSend) {
      promises.push(emailClient.scheduleEmail(
        emailRequest.sendGridRequest
      ))
      emailRequest.sent = true
    }
    promises.push(sqs.sendMessage({
      QueueUrl: process.env.sqs_url,
      MessageBody: JSON.stringify(emailRequest)
    }).promise())
    await Promise.all(promises)
  
    return new HttpSuccess(JSON.stringify({
      message: 'success',
      ts: emailRequest._ts,
      status: emailRequest.sent ? 'sent' : 'scheduled'
    }))
  } catch (e) {
    console.error(e)
    console.error('http-sqs.handler failed')
    return new HttpFailure(e)
  }
}