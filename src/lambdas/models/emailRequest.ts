import { sendGridSender } from "./const"

const daySec = 60 * 60 * 24
const maxScheduletime = daySec * 3

export interface IEmailRequest {
  templateId: string
  email: string
  sendAt: number
  subject: string
  bodyText: string
  sent: boolean
  _ts: number
}
export class EmailRequest implements IEmailRequest {
  templateId: string
  email: string
  sendAt: number
  subject: string
  bodyText: string
  sent: boolean
  _ts: number
  constructor(data: IEmailRequest) {
    this.templateId = data.templateId
    this.email = data.email
    this.sendAt = data.sendAt
    this.subject = data.subject
    this.bodyText = data.bodyText
    this.sent = !!data.sent
    this._ts = data._ts
  }

  get isValid(): boolean {
    return !!this.email
  }
  get shouldSend(): boolean {
    if (!this.isValid) {
      return false
    }
    if (!this.sendAt || this.sendAt == 0) {
      return true
    }
    const sendAtSec = new Date(this.sendAt).getTime() / 1000
    const nowSec = new Date().getTime() / 1000
    const diff = sendAtSec - nowSec
    return diff < maxScheduletime
  }
  get sendGridRequest(): ISendGridRequest {
    const sgr = {} as ISendGridRequest
    sgr.personalizations = []
    sgr.subject = this.subject

    // sender must be sendgrid verified
    const sender: ISGRUser = {
      email: sendGridSender
      // name: todo
    }
    sgr.from = sender
    sgr.reply_to = sender
    const psn: IPersonalization = {
      to: [{ email: this.email }]
    }

    // schedule at time, or send right away (max 3 days)
    if (this.sendAt) {
      sgr.send_at = new Date(this.sendAt).getTime() / 1000
    }

    // set content
    if (this.templateId) {
      sgr.template_id = this.templateId
      psn.dynamic_template_data = {
        bodyText: this.bodyText,
        subject: this.subject
      }
    } else {
      sgr.content = [{
        type: 'text/plain',
        value: this.bodyText
      }]
    }
    sgr.personalizations.push(psn)
    return sgr
  }
}

// https://docs.sendgrid.com/api-reference/mail-send/mail-send
export interface ISGRUser {
  email: string
  name?: string
}
export interface ISGRContent {
  type: string
  value: string
}
export interface ISGRTemplateData {
  [key: string]: string
}
export interface IPersonalization {
  to: ISGRUser[]
  dynamic_template_data?: {
    bodyText: string
    subject: string
  }
}
export interface ISendGridRequest {
    subject: string
    send_at?: number
    template_id?: string
    from: ISGRUser
    reply_to: ISGRUser
    personalizations: IPersonalization[]
    content?: ISGRContent[]
}