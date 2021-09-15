const axios = require('axios')

const error = 'The from address does not match a verified Sender Identity. Mail cannot be sent until this error is resolved. Visit https://sendgrid.com/docs/for-developers/sending-email/sender-identity/ to see the Sender Identity requirements'
const e2 = 'The to array is required for all personalization objects, and must have at least one email object with a valid email address.'

axios({
  method: 'post',
  "url": "https://api.sendgrid.com/v3/mail/send",
  "method": "post",
  "data": JSON.parse("{\"personalizations\":[{\"to\":[{\"email\":\"joevanbo@gmail.com\"}]},{\"dynamic_template_data\":{\"bodyText\":\"ayoooooooooooo\"}}],\"subject\":\"gerry reckons hundo\",\"from\":{\"email\":\"joevanbo@gmail.com\"},\"reply_to\":{\"email\":\"joevanbo@gmail.com\"},\"send_at\":1630454400,\"template_id\":\"d-c9fb10c0dd984cd49da8e209cd032b94\"}"),
  headers: {
    Authorization: ''
  }
})
.then(r => {
  console.log(r.data)
  console.log('status', r.status)
})
.catch(e => {
  // console.error(e)
  console.error(e.response.data)
  console.error('status', e.response.status)
})