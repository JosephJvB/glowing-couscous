const axios = require('axios')

const url = 'https://krr0kjmhs8.execute-api.ap-southeast-2.amazonaws.com/v1/email'

axios({
  method: 'post',
  url,
  data: {
    test: true
  }
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