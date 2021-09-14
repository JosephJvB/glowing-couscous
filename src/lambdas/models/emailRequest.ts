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
}