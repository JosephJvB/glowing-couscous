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
  get sendGridRequest() {
    throw new Error('EmailRequest.sendGridRequest not ready!')
    return {}
  }
}