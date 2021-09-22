import AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { IUser } from '../models/user'

export class DocClient {
  client: DocumentClient
  constructor() {
    AWS.config.update({ region: 'ap-southeast-2' })
    this.client = new AWS.DynamoDB.DocumentClient()
  }

  async getUser(email: string): Promise<IUser> {
    const r = await this.client.get({
      TableName: 'User',
      Key: { email }
    }).promise()
    return r && r.Item as IUser
  }
  putUser(user: IUser): Promise<any> {
    return this.client.put({
      TableName: 'User',
      Item: user
    }).promise()
  }
}