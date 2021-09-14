export interface EmailRequest {
  templateId: string
  email: string
  sendAt: number
  subject: string
  bodyText: string
}