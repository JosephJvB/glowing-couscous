require('dotenv').config({
  path: __dirname + '/../src/lambdas/.env'
})
const { EmailClient } = require('../src/.aws-sam/SendEmailFunction/clients/emailClient')
const { EmailRequest } = require('../src/.aws-sam/SendEmailFunction/models/emailRequest')

const e = new EmailClient()
console.log(e, process.env.sendgrid_apikey)
const d = {
  // templateId: string
  email: 'joevanbo@gmail.com',
  // sendAt: number
  subject: 'yooo',
  bodyText: 'yoooo, like yooooo'
}
const r = new EmailRequest(d)
// console.log(d instanceof EmailRequest)
// console.log(r instanceof EmailRequest)
// return
e.scheduleEmail(r.sendGridRequest)
.then(r => {
  console.log(r)
  console.log('done')
})
.catch(e => {
  // console.error(Object.keys(e.response.request))
  // console.error(e.response.request._header)
  // console.error(Object.keys(e.response))
  console.error(e.response.data)
  console.error('failed')
})