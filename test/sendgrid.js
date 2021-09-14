require('dotenv').config({
  path: __dirname + '/../src/lambdas/.env'
})
const templateId = 'd-c9fb10c0dd984cd49da8e209cd032b94'
// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
// https://docs.sendgrid.com/api-reference/mail-send/mail-send

// prefer to use sendGrid sdk. It does scheduling.
// Only swap to http requests if sdk can't handle templating

const nowSecs = Date.now() / 1000
const minsOffset = 60 * 2
const sendAt = Math.round(nowSecs + minsOffset)

sendGridApi()
// http()

function http() {
  const axios = require('axios')
  const msg = {
    // send_at: sendAt,
    template_id: templateId,
    personalizations: [{
      // from: {
      //   email: 'joevanbo@gmail.com',
      //   name: 'joevb',
      // },
      to: [{
        email: 'joevanbo@gmail.com',
        name: 'joevb to name',
      }],
      dynamic_template_data: {
        firstName: 'joeee',
        someothervar: 'eeee'
      }
    }],
    from: {
      email: 'joevanbo@gmail.com',
      name: 'joe',
    },
    reply_to: {
      email: 'joevanbo@gmail.com',
      name: 'joevb',
    },
    subject: 'Sending with SendGrid is Fun',
    content: [
      {
        type: 'text/plain',
        value: `and easy to do anywhere, even with Node.js sent at ${new Date().toLocaleString()} to deliver at ${new Date(sendAt * 1000).toLocaleString()} from http`,
      },
      // {
      //   type: 'text/html',
      //   value: '<strong>and easy to do anywhere, even with Node.js</strong>',
      // }
    ]
  }
  axios({
    method: 'post',
    url: 'https://api.sendgrid.com/v3/mail/send',
    headers: {
      Authorization: 'Bearer ' + process.env.sendgrid_apikey
    },
    data: msg
  })
  .then(r => {
    console.log(r)
    console.log('success')
  })
  .catch(e => {
    console.error(e.response.data)
    console.error('failed')
  })
}
function sendGridApi () {
  const msg = {
    // send_at: sendAt
    template_id: templateId,
    to: 'joevanbo@gmail.com',
    from: 'joevanbo@gmail.com',
    subject: 'Sending with SendGrid is Fun',
    text: `and easy to do anywhere, even with Node.js sent at ${new Date().toLocaleString()} to deliver at ${new Date(sendAt * 1000).toLocaleString()}`,
    // html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    personalizations: [{
      to: [{
        email: 'joevanbo@gmail.com',
        name: 'joevb to name',
      }],
      dynamic_template_data: {
        firstName: 'joeee',
        someothervar: 'eeee'
      }
    }]
  }
  msg.text + ' from sendGridApi'
  const sgMail = require('@sendgrid/mail')
  sgMail.setApiKey(process.env.sendgrid_apikey)

  sgMail
  .send(msg)
  .then(r => {
    console.log('Email sent', r)
  })
  .catch((error) => {
    console.error(error)
    console.error(JSON.stringify(error.response.body))
  })
}
