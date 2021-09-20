import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { AuthClient } from '../clients/authClient'
import { DocClient } from '../clients/docClient'
import { AuthPaths, IAuthRequest } from '../models/authRequest'
import { HttpFailure, HttpSuccess } from '../models/httpResponse'
import { AuthService } from '../services/authService'

const authClient = new AuthClient()
const docClient = new DocClient()
const authService = new AuthService(
  authClient,
  docClient
)

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    console.log(
      `method: ${event.httpMethod}`,
      `path: ${event.path}`,
    )
    if (event.httpMethod.toLowerCase() == 'options') {
      return new HttpSuccess()
    }
    console.log('--- event ---')
    console.log(JSON.stringify(event))
    console.log('--- body ---')
    console.log(event.body)

    const request = JSON.parse(event.body) as IAuthRequest
    let response: APIGatewayProxyResult = null
    switch (event.path) {
      case AuthPaths.register:
        response = await authService.register(request)
        break
      case AuthPaths.login:
        response = await authService.login(request)
        break
      default:
        response = new HttpFailure('Request path not recognized ' + event.path)
        response.statusCode = 404
        break
    }

    console.log('--- response ---')
    console.log(JSON.stringify(response))
    return response
  } catch (e) {
    console.error(e)
    console.error('http-auth.handler failed')
    return new HttpFailure(e)
  }
}