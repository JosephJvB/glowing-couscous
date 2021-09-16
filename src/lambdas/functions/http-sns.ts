import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { SNS } from 'aws-sdk'
import { EmailRequest } from '../models/emailRequest'
import { HttpFailure, HttpSuccess } from '../models/httpResponse'

const sns = new SNS({
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

    console.log(
      'sns.publish()',
      `TopicArn=${process.env.sns_arn}`
    )
    await sns.publish({
      Subject: 'LennieSNSEmailRequest',
      Message: event.body,
      TopicArn: process.env.sns_arn
    }).promise()
    console.log('sns.publish: success')
  
    return new HttpSuccess(JSON.stringify({
      message: 'success',
      ts: emailRequest._ts
    }))
  } catch (e) {
    console.error(e)
    console.error('http-sns.handler failed')
    return new HttpFailure(e)
  }
}