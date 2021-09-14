import { S3 } from 'aws-sdk'

const s3 = new S3({
  region: 'ap-southeast-2'
})

export const handler = async event => {
  console.log('-------------')
  console.log('--- event ---')
  console.log(JSON.stringify(event))
  console.log('--- body ---')
  console.log(JSON.stringify(event.body))
}