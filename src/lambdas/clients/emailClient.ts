import axios from 'axios'
import { EmailRequest } from '../models/emailRequest';

const method = 'post'
const url = 'https://api.sendgrid.com/v3/mail/send'

export class EmailClient {
  constructor() {}

  async scheduleEmail(data: EmailRequest): Promise<void> {
    await axios({
      method,
      url,
      data: new SendGridRequest(data).json
    })
  }

  get auth(): string {
    return 'Bearer ' + process.env.sendgrid_apikey
  }
}
class SendGridRequest {
  data: EmailRequest
  constructor(data: EmailRequest) {
    this.data = data
  }
  get json() {
    const j: any = {}
    j.send_at = Math.round(new Date(this.data.sendAt).getUTCSeconds() / 1000)
    j.template_id = this.data.templateId
    return j
  }
}