import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { SNS } from 'aws-sdk'
import { HttpFailure, HttpSuccess } from '../models/httpResponse'

const sns = new SNS({
  region: 'ap-southeast-2'
})


export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    console.log('-------------')
    console.log('--- event ---')
    console.log(JSON.stringify(event))
    console.log('--- body ---')
    console.log(event.body)

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
  
    return new HttpSuccess(
      JSON.stringify({ test: 'success!' })
    )
  } catch (e) {
    console.error(e)
    console.error('http-sns.handler failed')
    return new HttpFailure(
      JSON.stringify({
        test: 'failure!',
        error: e
      })
    )
  }
}