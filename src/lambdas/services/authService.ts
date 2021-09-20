import { AuthClient } from "../clients/authClient"
import { DocClient } from "../clients/docClient"
import { IAuthRequest } from "../models/authRequest"
import { HttpFailure, HttpResponse, HttpSuccess } from "../models/httpResponse"
import { IUser } from "../models/user"

export class AuthService {
  auth: AuthClient
  doc: DocClient
  constructor(auth: AuthClient, doc: DocClient) {
    this.auth = auth
    this.doc = doc
  }

  async login(request: IAuthRequest): Promise<HttpResponse> {
    const existingUser = await this.doc.getUser(request.email)
    if (!existingUser) {
      const msg = 'Failed to find user with email ' + request.email
      console.warn(msg)
      return new HttpFailure(msg)
    }
    const passwordMatch = await this.auth.compare(
      request.password,
      existingUser.hash
    )
    if (!passwordMatch) {
      return new HttpFailure('Invalid password')
    } else {
      return new HttpSuccess('Login success')
    }
  }

  async register(request: IAuthRequest): Promise<HttpResponse> {
    const existingUser = await this.doc.getUser(request.email)
    if (existingUser) {
      const msg = 'User already exists with email ' + request.email
      console.warn(msg)
      return new HttpFailure(msg)
    }

    const newUser: IUser = {
      email: request.email,
      password: request.password,
    }
    newUser.salt = await this.auth.salt()
    newUser.hash = await this.auth.hash(newUser.password, newUser.salt)

    // need sns to send email to verify registration, ooh, do this from ddb stream!
    await this.doc.putUser(newUser)
    return new HttpSuccess('Register success')
  }
}