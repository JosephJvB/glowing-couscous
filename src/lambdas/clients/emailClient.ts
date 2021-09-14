import axios from 'axios'
import { sendMailUrl } from '../models/const';
import { ISendGridRequest } from '../models/emailRequest';

export class EmailClient {
  constructor() {}

  async scheduleEmail(request: ISendGridRequest): Promise<void> {
    console.log(
      'EmailClient.scheduleEmail',
      JSON.stringify(request)
    )

    await axios({
      method: 'post',
      url: sendMailUrl,
      data: request,
      headers: {
        Authorization: this.auth
      }
    })
  }

  get auth(): string {
    return 'Bearer ' + process.env.sendgrid_apikey
  }
}