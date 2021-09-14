import { SNSEvent } from "aws-lambda";
import { S3 } from "aws-sdk";
import { EmailClient } from "../clients/emailClient";
import { pendingRequestsKey, s3Bucket } from "../models/const";
import { CronEvent } from "../models/cronEvent";
import { EmailRequest } from "../models/emailRequest";

export class EmailService {
  s3: S3
  emailClient: EmailClient
  constructor(s3: S3, emailClient: EmailClient) {
    this.s3 = s3
    this.emailClient = emailClient
  }

  async handleCronEvent(event: CronEvent): Promise<void> {
    console.log('EmailService.handleCronEvent')
    const pendingRequests = await this.getPendingRequests()
    console.log(
      `pendingRequests.length=${pendingRequests.length}`
    )
    const nextPendingRequests = await this.processRequests(pendingRequests)
    console.log(
      `nextPendingRequests.length=${nextPendingRequests.length}`
    )
    await this.putPendingRequests(nextPendingRequests)
  }
  async handleSnsEvent(event: SNSEvent): Promise<void> {
    console.log('EmailService.handleSnsEvent')
    const messageRequests: EmailRequest[] = []
    for (let i = 0; i < event.Records.length; i ++) {
      const record = event.Records[i]
      console.log(
        'snsRecord n.' + i,
        record.Sns.Message
      )
      const req = JSON.parse(record.Sns.Message) as EmailRequest
      messageRequests.push(req)
    }
    const unsentRequests = await this.processRequests(messageRequests)
    console.log(
      `unsentRequests.length=${unsentRequests.length}`
    )
    if (unsentRequests.length > 0) {
      const currentPendingRequests = await this.getPendingRequests()
      const nextPendingRequests = [...currentPendingRequests, ...unsentRequests]
      console.log(
        `nextPendingRequests.length=${nextPendingRequests.length}`
      )
      await this.putPendingRequests(nextPendingRequests)
    }
  }

  async processRequests (requests: EmailRequest[]): Promise<EmailRequest[]> {
    const unsetRequests: EmailRequest[] = []
    for (const req of requests) {
      const request = new EmailRequest(req)
      if (!request.isValid) {
        continue
      }
      if (request.shouldSend) {
        await this.emailClient.scheduleEmail(request.sendGridRequest)
      } else {
        unsetRequests.push(request)
      }
    }
    return unsetRequests
  }
  async getPendingRequests (): Promise<EmailRequest[]> {
    const obj = await this.s3.getObject({
      Bucket: s3Bucket,
      Key: pendingRequestsKey
    }).promise()
    return JSON.parse(obj.Body.toString()) as EmailRequest[]
  }
  async putPendingRequests (requests: EmailRequest[]): Promise<void> {
    await this.s3.putObject({
      Bucket: s3Bucket,
      Key: pendingRequestsKey,
      Body: JSON.stringify(requests)
    }).promise()
  }
}