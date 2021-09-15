const axios = require('axios')

const error = 'The from address does not match a verified Sender Identity. Mail cannot be sent until this error is resolved. Visit https://sendgrid.com/docs/for-developers/sending-email/sender-identity/ to see the Sender Identity requirements'

axios({
  method: 'post',
  "url": "https://api.sendgrid.com/v3/mail/send",
  "method": "post",
  "data": JSON.parse("{\"personalizations\":[{\"to\":[{\"email\":\"joevanbo+6@gmail.com\"}]}],\"subject\":\"adada\",\"from\":{\"email\":\"joevanbo+6@gmail.com\"},\"reply_to\":{\"email\":\"joevanbo+6@gmail.com\"},\"send_at\":1630886400,\"content\":[{\"type\":\"text/plain\",\"value\":\"adada\"}]}"),
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