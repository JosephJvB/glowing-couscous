require('dotenv').config({
  path: __dirname + '/../SendEmail/.env'
})
const axios = require('axios')

/*
curl -s --user 'api:YOUR_API_KEY' \
    https://api.mailgun.net/v3/YOUR_DOMAIN_NAME/messages \
    -F from='Excited User <mailgun@YOUR_DOMAIN_NAME>' \
    -F to=YOU@YOUR_DOMAIN_NAME \
    -F to=bar@example.com \
    -F subject='Hello' \
    -F text='Testing some Mailgun awesomeness!'
*/

console.log('mailgun_apikey', process.env.mailgun_apikey)
const auth = 'Basic ' + Buffer.from(`api:${process.env.mailgun_apikey}`).toString('base64')
console.log('auth', auth)
const url = `https://api.mailgun.net/v3/${process.env.mailgun_domain}/messages`
console.log('url=', url)

const min = 1000 * 60 
const n = Date.now()
// 'Thu, 13 Oct 2011 18:02:00 GMT'
// const deliverAt = new Date(n + (min * 10)).toUTCString()
const deliverAt = 'Sun, 12 Sep 2021 05:20:03 GMT'
console.log(deliverAt)

const html = [ // html works!
  '<html>',
  '<body>',
  '<h1>Hi Im joe</h1>',
  '<br>',
  '<p>ok thats all nice</p>',
  '</body>',
  '</html>',
].join('\n')

const params = {
  from: 'joevb <joe@test.com>',
  to: 'joevanbo@gmail.com',
  subject: 'test',
  text: 'success + deliver at ' + deliverAt + ' sent at ' + new Date().toUTCString(),
  // html,
  'o:deliverytime': deliverAt
}
console.log('params', params)

void async function() {
  try {
    const r = await axios({
      method: 'post',
      url,
      params,
      headers: {
        Authorization: auth
      }
    })
    console.log(r.data)
    console.log('success')
  } catch (e) {
    console.error(e)
    console.error('failed')
  }
}()