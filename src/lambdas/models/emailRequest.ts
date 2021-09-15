import { sendGridSender } from "./const"

const daySec = 60 * 60 * 24
const maxScheduletime = daySec * 3

export class EmailRequest {
  templateId: string
  email: string
  sendAt: number
  subject: string
  bodyText: string
  constructor(data: EmailRequest) {
    this.templateId = data.templateId
    this.email = data.email
    this.sendAt = data.sendAt
    this.subject = data.subject
    this.bodyText = data.bodyText
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
    const sender: SGRUser = {
      email: sendGridSender
      // name: todo
    }
    sgr.from = sender
    sgr.reply_to = sender
    const psn: Personalization = {
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
        bodyText: this.bodyText
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
export interface SGRUser {
  email: string
  name?: string
}
export interface SGRContent {
  type: string
  value: string
}
export interface SGRTemplateData {
  [key: string]: string
}
export interface Personalization {
  to: SGRUser[]
  dynamic_template_data?: {
    bodyText: string
  }
}
export interface ISendGridRequest {
    subject: string
    send_at?: number
    template_id?: string
    from: SGRUser
    reply_to: SGRUser
    personalizations: Personalization[]
    content?: SGRContent[]
}