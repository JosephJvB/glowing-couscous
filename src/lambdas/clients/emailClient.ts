import axios from 'axios'
import { sendMailUrl } from '../models/const';
import { EmailRequest } from '../models/emailRequest';

const url = 'https://api.sendgrid.com/v3/mail/send'

export class EmailClient {
  constructor() {}

  async scheduleEmail(request: EmailRequest): Promise<void> {
    console.log(
      'EmailClient.scheduleEmail',
      JSON.stringify(request)
    )
    console.error('no email sent: havent mapped to sendgrid request data yet')
    await new Promise(r => setTimeout(r, 1000))
    // await axios({
    //   method: 'post',
    //   url: sendMailUrl,
    //   data: request.sendGridRequest
    // })
  }

  get auth(): string {
    return 'Bearer ' + process.env.sendgrid_apikey
  }
}