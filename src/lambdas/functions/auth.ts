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
    console.log('-------------')
    console.log('--- event ---')
    console.log(JSON.stringify(event))
    console.log('--- method ---')
    console.log(event.httpMethod)
    console.log('--- body ---')
    console.log(event.body)
    if (event.httpMethod.toLowerCase() == 'options') {
      return new HttpSuccess()
    }

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
        response = new HttpFailure()
        response.statusCode = 404
        break
    }

    return response
  } catch (e) {
    console.error(e)
    console.error('auth.handler failed')
    return new HttpFailure(e)
  }
}