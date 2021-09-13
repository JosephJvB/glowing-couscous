const { SNS } = require('aws-sdk')

const sns = new SNS({
  region: 'ap-southeast-2'
})

exports.handler = async event => {
  console.log('-------------')
  console.log('--- event ---')
  console.log(JSON.stringify(event))
  console.log('--- body ---')
  console.log(JSON.stringify(event.body))

  return {
    statusCode: 200,
    body: JSON.stringify({ test: 'success!' }),
    headers: {
      "Content-Type" : "application/json",
      "Allow" : "*",
      "Access-Control-Allow-Headers" : "*",
      "Access-Control-Allow-Methods" : "*",
      "Access-Control-Allow-Origin" : "*",
    }
  }
}