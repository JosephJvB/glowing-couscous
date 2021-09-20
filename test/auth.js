const data = {

}

// local using milk creds cant access joevanbo@gmail.com dynamodb
// local()
// lambda()
function lambda() {
  const axios = require('axios')
  const url = 'https://krr0kjmhs8.execute-api.ap-southeast-2.amazonaws.com/v1/login'
  axios({
    method: 'post',
    url,
    data
  })
  .then(r => {
    console.log(r.data)
    console.log('status', r.status)
  })
  .catch(e => {
    console.error(e)
    console.error(e.response.data)
    console.error('status', e.response.status)
  })
}
function local() {
  const fn = require('../src/.aws-sam/AuthFunction/functions/auth')
  fn.handler({
    httpMethod: 'post',
    body: JSON.stringify(data),
    path: '/login'
  })
  .then(r => {
    console.log(r)
    console.log('success')
  })
  .catch(e => {
    console.error(e)
    console.error('failed')
  })
}